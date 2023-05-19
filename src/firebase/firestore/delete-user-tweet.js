import { deleteField, doc, runTransaction, updateDoc, } from "firebase/firestore"
import { auth } from "../auth"
import { deleteTweetImages } from "../storage/delete-image"
import { db } from "./firestore"
import PubSub from "pubsub-js"


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

export const deleteTweet = async (tweetId, followers, userId = auth.currentUser.uid) => {
  try {
    if (auth.currentUser.isAnonymous) {
      const userDocRef = doc(db, 'guestUsers', auth.currentUser.uid)
      const tweetPath = `tweets.${tweetId}`
      await updateDoc(userDocRef, {
        [tweetPath]: deleteField()
      })
    } else {
      await runTransaction(db, async (transaction) => {
        const tweetDocRef = doc(db, 'tweets', tweetId)
        const tweetReferencesDocRef = doc(db, 'tweetReferences', userId)
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
    }
    await deleteTweetImages(tweetId)
    PubSub.publish('decrease tweet count')
  } catch (error) {
    console.error("Failure to delete user tweet:", error)
  }
}