import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { db } from "./firestore";
import { auth } from "../auth";
import PubSub from "pubsub-js";


let tweetReferences = {}
let sortedKeys = []

const storeTweetReferences = async () => {
  try {
    if (auth.currentUser.isAnonymous) {
      const guestUserDocRef = doc(db, 'guestUsers', auth.currentUser.uid)
      const guestUserDocSnap = await getDoc(guestUserDocRef)
      const guestUserData = guestUserDocSnap.data()
      tweetReferences = guestUserData.userFeed
    } else {
      const docRef = doc(db, 'tweetReferences', auth.currentUser.uid)
      const docSnap = await getDoc(docRef)
      tweetReferences = docSnap.data()
    }
  } catch (error) {
    console.error("Failure to store user tweet references:", error)
  }
}

const mergeTweetReferences = (tweetReferences) => {
  if (auth.currentUser.isAnonymous) {
    return tweetReferences
  }
  return {
    ...tweetReferences.userFeed,
    ...tweetReferences.userTweets
  }
}

const convertToSortedArray = (tweetReferences) => {
  const entries = Object.entries(tweetReferences).sort((a, b) => b[1] - a[1])
  return entries.map((entry) => { return entry[0] })
}

const retrieveBatchData = async (docRefArray) => {
  const snapPromiseArray = await Promise.allSettled(
    docRefArray.map((docRef) => { return getDoc(docRef) })
  )
  return snapPromiseArray.map((snapPromise) => { return snapPromise.value.data() })
}

const mergeTweetAndUserData = (tweetKeys, tweetData, userData) => {
  return tweetData.map((tweet, index) => {
    return {
      ...tweet,
      displayName: userData[index].displayName,
      userName: userData[index].userName,
      userId: userData[index].userId,
      profileImageUrl: userData[index].profileImageUrl,
      profileImageAdjustment: userData[index].profileImageAdjustment,
      tweetId: tweetKeys[index],
    }
  })
}

const getFeedChunk = async (keysList, loadCount, chunkSize = 10) => {
  const startIndex = loadCount * chunkSize
  const tweetKeys = keysList.slice(startIndex, startIndex + chunkSize)
  
  const tweetDataDocRefs = tweetKeys.map((key) => { return doc(db, 'tweets', key) })
  const tweetDataArray = await retrieveBatchData(tweetDataDocRefs)

  const userDataDocRefs = tweetDataArray.map((tweetData) => {
    const userId = tweetData.userId
    return doc(db, 'users', userId)
  })

  const userDataArray = await retrieveBatchData(userDataDocRefs)
  const finalTweetData = mergeTweetAndUserData(tweetKeys, tweetDataArray, userDataArray)
  
  return finalTweetData
}

const getFeedChunkFromSnaps = async (tweetDocSnaps) => {
  const tweetDataArray = tweetDocSnaps.map((docSnap) => {
    return docSnap.data()
  })

  const userDataDocRefs = tweetDataArray.map((tweetData) => {
    const userId = tweetData.userId
    return doc(db, 'users', userId)
  })
  const tweetKeys = tweetDocSnaps.map((docSnap) => {
    return docSnap.id
  })

  const userDataArray = await retrieveBatchData(userDataDocRefs)
  const finalTweetData = mergeTweetAndUserData(tweetKeys, tweetDataArray, userDataArray)
  
  return finalTweetData
}


let tweetLedger = {}
let randomizedTweetKeys = []
let forYouTweetKeys = []

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const storeTweetLedger = async () => {
  const tweetLedgerDocRef = doc(db, 'tweets', 'tweetLedger')
  const tweetLedgerSnap = await getDoc(tweetLedgerDocRef)
  tweetLedger = tweetLedgerSnap.data().tweetReferenceMap
}

const storeRandomizedTweetKeys = () => {
  randomizedTweetKeys = Object.keys(tweetLedger)
  shuffleArray(randomizedTweetKeys)
}

const filterUserFromTweetKeys = (userIdToRemove) => {
  return randomizedTweetKeys.filter((value) => {
    return !(tweetLedger[value].userId === userIdToRemove)
  })
}

export const getForYouFeed = async (loadCount) => {
  if (loadCount === 0) {
    await storeTweetLedger()
    storeRandomizedTweetKeys()
    forYouTweetKeys = filterUserFromTweetKeys(auth.currentUser.uid)
  }
  const tweetData = await getFeedChunk(forYouTweetKeys, loadCount)
  return tweetData
}

export const getFollowingFeed = async (loadCount) => {
  if (loadCount === 0) {
    await storeTweetReferences()
    const mergedReferences = mergeTweetReferences(tweetReferences)
    sortedKeys = convertToSortedArray(mergedReferences)
  }
  return await getFeedChunk(sortedKeys, loadCount)
}

let currentUserId = ''
let userTweetReferences = {}
let sortedUserTweetKeys = []

const storeUserTweetReferences = async (userId) => {
  const tweetReferencesRef = doc(db, 'tweetReferences', userId)
  const docSnap = await getDoc(tweetReferencesRef)
  userTweetReferences = docSnap.data().userTweets
}

export const getUserTweets = async (userId, loadCount) => {
  // Get and store user tweet references, only the first time it's called
  if (auth.currentUser.isAnonymous && userId === auth.currentUser.uid) {
    const guestUserDocRef = doc(db, 'guestUsers', auth.currentUser.uid)
    const guestUserDocSnap = await getDoc(guestUserDocRef)
    const guestUserData = guestUserDocSnap.data()

    if (!guestUserData.tweets) { return [] }
    
    let userTweetCount = 0

    const entries = Object.entries(guestUserData.tweets)
    entries.sort((a, b) => { return b[1].timestamp - a[1].timestamp})
    const tweetData = entries.map((entry) => {
      userTweetCount++
      return {
        ...entry[1],
        displayName: guestUserData.displayName,
        userName: guestUserData.userName,
        userId: guestUserData.userId,
        tweetId: entry[0],
        profileImageUrl: guestUserData.profileImageUrl || '',
        profileImageAdjustment: guestUserData.profileImageAdjustment || {},
      }
    })

    PubSub.publish('set user tweet count', userTweetCount)

    return tweetData
  }
  
  if (currentUserId !== userId) {
    currentUserId = userId
    await storeUserTweetReferences(userId)
    sortedUserTweetKeys = convertToSortedArray(userTweetReferences)
    const userTweetCount = sortedUserTweetKeys.length
    PubSub.publish('set user tweet count', userTweetCount)
  }
  const tweetData = await getFeedChunk(sortedUserTweetKeys, loadCount)

  return tweetData
}

let nextQuery = null

let guestUserData = null
let guestLikedTweetKeys = null

export const getLikedTweets = async (userId, loadCount) => {
  try {
    if (auth.currentUser.isAnonymous && auth.currentUser.uid === userId) {
      if (loadCount === 0) {
        const userDocRef = doc(db, 'guestUsers', auth.currentUser.uid)
        const userDocSnap = await getDoc(userDocRef)
        guestUserData = userDocSnap.data()
        const likedTweets = guestUserData.likes ? guestUserData.likes : {}
        guestLikedTweetKeys = convertToSortedArray(likedTweets)
      }

      let chunkSize = 10
      const guestOwnLikedTweets = []
      guestLikedTweetKeys.forEach((key, index) => {
        if (guestUserData.tweets[key]) {
          guestOwnLikedTweets.push({
            ...guestUserData.tweets[key],
            displayName: guestUserData.displayName,
            userName: guestUserData.userName,
            userId: guestUserData.userID,
            tweetId: key,
            profileImageUrl: guestUserData.profileImageUrl || '',
            profileImageAdjustment: guestUserData.profileImageAdjustment || {},
          })
          guestLikedTweetKeys.splice(index, 1)
          chunkSize = chunkSize - 1
        }
      })

      const tweetData = await getFeedChunk(guestLikedTweetKeys, loadCount, chunkSize)
      tweetData.push(...guestOwnLikedTweets)
      tweetData.sort((a, b) => { return b.timestamp - a.timestamp })

      return tweetData
    }

    if (loadCount === 0) {
      nextQuery = query(collection(db, 'tweets'), where(`likes.${userId}`, ">", 0), orderBy(`likes.${userId}`, "desc"), limit(5))
    }

    const docSnaps = await getDocs(nextQuery)
    const lastLoaded = docSnaps.docs[docSnaps.docs.length - 1]
    if (!lastLoaded) { return [] }
    nextQuery = query(collection(db, 'tweets'), where(`likes.${userId}`, ">", 0), orderBy(`likes.${userId}`, "desc"), limit(5), startAfter(lastLoaded))

    const tweetData = await getFeedChunkFromSnaps(docSnaps.docs)
    
    return tweetData
  } catch (error) {
    console.error("Failure to get liked tweets feed:", error)
  }
}
