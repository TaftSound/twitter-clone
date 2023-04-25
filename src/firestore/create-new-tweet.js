import { doc, collection, writeBatch } from "firebase/firestore";
import { db } from "./firestore";
import { getFollowerList } from "./follower-list-functions";


export const createNewTweet = async (newTweetText, userObject, followers) => {
  try {
    const tweetDataObject = prepareTweetData(userObject, newTweetText);
    await batchWriteTweet(tweetDataObject, followers);

  } catch (error) {
    console.error("Failure to store new tweet in database", error);
  }
};

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

