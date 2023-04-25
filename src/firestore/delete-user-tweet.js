// need to delete actual tweet - done
// need to delete reference in current user's tweets - done
// need to delete reference in user feed of every user that follows current user - done
// need to delete reference in tweetLedger - done

import { deleteField, doc, getDoc, runTransaction, writeBatch } from "firebase/firestore"
import { auth } from "../auth"
import { db } from "./firestore"

// data needed:
  // tweetId
  // followers


const getFollowerDocRefs = (followers) => {
  return followers.map((followerId) => {
    return doc(db, 'tweetReferences', followerId)
  })
}

const getFollowerTweetData = async (transaction, docRefs) => {
  return await Promise.all(docRefs.map(async (followerDocRef) => {
    const followerTweetSnap = await transaction.get(followerDocRef)
    return followerTweetSnap.data()
  }))
}

export const deleteTweet = async (tweetId, followers) => {
  try {
    await runTransaction(db, async (transaction) => {
      const tweetDocRef = doc(db, 'tweets', tweetId)
      const tweetReferencesDocRef = doc(db, 'tweetReferences', auth.currentUser.uid)
      const tweetLedgerRef = doc(db, 'tweets', 'tweetLedger')
      const followerDocRefs = getFollowerDocRefs(followers)

      const tweetReferencesSnap = await transaction.get(tweetReferencesDocRef)
      const tweetLedgerSnap = await transaction.get(tweetLedgerRef)

      const userTweetsData = tweetReferencesSnap.data().userTweets
      const tweetReferenceMapData = tweetLedgerSnap.data().tweetReferenceMap
      const followerTweetData = await getFollowerTweetData(transaction, followerDocRefs)

      delete userTweetsData[tweetId]
      delete tweetReferenceMapData[tweetId]
      followerTweetData.forEach((follower) => { delete follower.userFeed[tweetId] })

      transaction.update(tweetReferencesDocRef, { userTweets: userTweetsData })
      transaction.update(tweetLedgerRef, { tweetReferenceMap: tweetReferenceMapData })
      followerTweetData.forEach((follower, index) => {
        transaction.update(followerDocRefs[index], { userFeed: follower.userFeed })
      })
      transaction.delete(tweetDocRef)
    })
  } catch (error) {
    console.error("Failure to delete user tweet:", error)
  }
}