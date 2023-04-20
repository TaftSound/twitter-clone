import { doc, getDoc } from "firebase/firestore";
import { db } from "./firestore";
import { auth } from "../auth";

// What do I need to retrieve?
    // need to first retrieve user's "tweetReferences" document
    // integrate "userFeed" array with "userTweets" array
    // sort combined array by timestamp
    // retrieve the first ten in chronological order
    // separate into render chunks of ten items, store the loadedCount in state
    // put a sentinal obsever between number 8 and 9
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
  const entries = Object.entries(tweetReferences)
  console.log(entries)
}

export const getMainFeed = async () => {
  const tweetReferences = await getTweetReferences()
  const mergedReferences = mergeTweetReferences(tweetReferences)
  const sortedKeys = convertToSortedArray(mergedReferences)
}
