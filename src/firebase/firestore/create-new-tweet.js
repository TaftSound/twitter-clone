import { doc, collection, writeBatch, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firestore";

import { createFakeUser } from "./user-functions";
import { storeTweetImages } from "../storage/store-image";
import { auth } from "../auth";

export const createNewTweet = async (newTweetText, imageFilesArray, userObject, followers) => {
  try {
    const tweetDataObject = prepareTweetData(userObject, newTweetText);
    if (imageFilesArray[0]) {
      const imageUrls = await storeTweetImages(imageFilesArray, tweetDataObject.tweetId)
      tweetDataObject.tweet.data.imageUrls = imageUrls
    }
    
    userObject.guest
    ? await writeGuestTweet(tweetDataObject)
    : await batchWriteTweet(tweetDataObject, followers);

    return {
      ...tweetDataObject.tweet.data,
      tweetId: tweetDataObject.tweetId,
    }
  } catch (error) {
    console.error("Failure to store new tweet in database", error);
  }
};

const writeGuestTweet = async (data) => {
  const userDocRef = doc(db, 'guestUsers', auth.currentUser.uid)
  const dotNotationPath = `tweets.${data.tweetId}`
  updateDoc(userDocRef, { [dotNotationPath]: data.tweet.data })
}

const batchWriteTweet = async (data, followers) => {
  const tweetLedgerRef = doc(db, 'tweets', 'tweetLedger');
  
  const batch = writeBatch(db);
  batch.set(data.tweet.docRef, data.tweet.data);
  batch.set(data.reference.docRef, { userTweets: data.reference.data }, { merge: true });
  batch.set(tweetLedgerRef, { tweetReferenceMap: {
    [data.tweetId]: {
      timestamp: data.timestamp,
      userId: data.userId
    }
  } }, { merge: true });

  followers.forEach((followerId) => {
    const docRef = doc(db, `tweetReferences/${followerId}`);
    batch.set(docRef, { userFeed: data.reference.data }, { merge: true });
  });

  await batch.commit();
};

const prepareTweetData = (userObject, newTweetText) => {
  const tweetDocRef = doc(collection(db, "tweets"));
  const tweetReferenceDocRef = doc(db, `tweetReferences/${userObject.userId}`);
  const timestamp = Date.now();

  return {
    tweet: {
      docRef: tweetDocRef,
      data: {
        userId: userObject.userId,
        text: newTweetText,
        timestamp: timestamp
      }
    },
    reference: {
      docRef: tweetReferenceDocRef,
      data: { [tweetDocRef.id]: timestamp },
    },
    tweetId: tweetDocRef.id,
    userId: userObject.userId,
    timestamp: timestamp
  };
};



// const fakeUserObject = { userId: 'MarkTwain' }
// const fakeTweetText = "It is better to keep your mouth closed and let people think you are a fool than to open it and remove all doubt"

// createFakeUser('NeildeGrasseTyson', 'Neil deGrasse Tyson')
// createNewTweet(fakeTweetText, fakeUserObject, []) 
