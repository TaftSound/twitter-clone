import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { db } from "./firestore";
import { auth } from "../auth";
import PubSub from "pubsub-js";


let tweetReferences = {}
let sortedKeys = []

const storeTweetReferences = async () => {
  const docRef = doc(db, 'tweetReferences', auth.currentUser.uid)
  const docSnap = await getDoc(docRef)
  tweetReferences = docSnap.data()
}

const mergeTweetReferences = (tweetReferences) => {
  return {
    ...tweetReferences.userFeed,
    ...tweetReferences.userTweets
  }
}

const convertToSortedArray = (tweetReferences) => {
  const entries = Object.entries(tweetReferences).sort((a, b) => a[1] - b[1])
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
      ...userData[index],
      tweetId: tweetKeys[index],
    }
  })
}

const getFeedChunk = async (keysList, loadCount) => {
  const startIndex = loadCount * 5
  const tweetKeys = keysList.slice(startIndex, startIndex + 5)
  
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
  return getFeedChunk(sortedKeys, loadCount)
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

export const getLikedTweets = async (userId, loadCount) => {
  if (loadCount === 0) {
    nextQuery = query(collection(db, 'tweets'), where(`likes.${userId}`, ">", 0), orderBy(`likes.${userId}`, "desc"), limit(5))
  }

  const docSnaps = await getDocs(nextQuery)
  const lastLoaded = docSnaps.docs[docSnaps.docs.length - 1]
  if (!lastLoaded) { return [] }
  nextQuery = query(collection(db, 'tweets'), where(`likes.${userId}`, ">", 0), orderBy(`likes.${userId}`, "desc"), limit(5), startAfter(lastLoaded))

  const tweetData = await getFeedChunkFromSnaps(docSnaps.docs)
  
  return tweetData
}
