import { collection, doc, getDoc, query, getDocs, limit } from "firebase/firestore";
import { db } from "./firestore";
import { auth } from "../auth";

// What do I need to retrieve?
    // need to first retrieve user's "tweetReferences" document - done
    // integrate "userFeed" array with "userTweets" array - done
    // sort combined array by timestamp - done
    // retrieve first five followed tweet:
      // Retrieve tweet data
      // retrieve tweet user info
    // retrieve first five unfollowed tweet
      // get first five follow data where you are not in their follower list
        // ordered by their userId
      // store their userId
      // get their most recent tweet
      // get their user data
    // render WhoToFollow component
      // who to follow component goes in threes, should use a counter
    // put a sentinal obsever right before who to follow
    // when sentinal enters view, load the next batch
    // TweetDisplay needs to sense when it is within view, and needs to write a view

const getTweetReferences = async () => {
  const docRef = doc(db, 'tweetReferences', auth.currentUser.uid)
  const docSnap = await getDoc(docRef)
  return docSnap.data()
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

export const getMainFeed = async (loadCount) => {
  const tweetReferences = await getTweetReferences()
  const mergedReferences = mergeTweetReferences(tweetReferences)
  const sortedKeys = convertToSortedArray(mergedReferences)
  return getFeedChunk(sortedKeys, loadCount)
}

let randomizedTweetKeys = []

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const storeRandomizedTweetLedger = async () => {
  const tweetLedgerDocRef = doc(db, 'tweets', 'tweetLedger')
  const tweetLedgerSnap = await getDoc(tweetLedgerDocRef)
  randomizedTweetKeys = Object.keys(tweetLedgerSnap.data().tweetReferenceArray)
  shuffleArray(randomizedTweetKeys)
}

export const getForYouFeed = async (loadCount) => {
  if (loadCount === 0) { await storeRandomizedTweetLedger() }
  const tweetData = await getFeedChunk(randomizedTweetKeys, loadCount)
  return tweetData
}
