import { arrayRemove, arrayUnion, deleteField, doc, getDoc, onSnapshot, runTransaction } from "firebase/firestore";
import { auth } from "../auth";
import { db } from "./firestore";

import PubSub from "pubsub-js";


let followDocRef = null
let unsubFollowSnap = null

export const getFollowerList = async (userId = auth.currentUser.uid) => {
  try {
    const followerDocRef = doc(db, 'followData', userId);
    const followListSnap = await getDoc(followerDocRef);
    return (followListSnap.data());
  } catch (error) {
    console.error("Failure to check username availability:", error)
  }
};

export const listenForFollowerData = () => {
  if (!followDocRef) {
      followDocRef = doc(db, 'followData', auth.currentUser.uid);
      unsubFollowSnap = onSnapshot(
        followDocRef, 
        (snapshot) => {
          console.log(snapshot.data())
          PubSub.publish('update follow list', snapshot.data())
        },
        (error) => {
          console.error("Failure to listen for changes to follower data", error)
        })
    }
}
export const unsubscribeFromFollowerData = () => {
  if (unsubFollowSnap) { unsubFollowSnap() }
}

export const followUser = async (userIdToFollow) => {
  // do this whole write with a transaction write
  try {
    await runTransaction(db, async (transaction) => {
      const currentUser = {}
      const userToFollow = {}
      // get current user followData docRef
      currentUser.followDataRef = doc(db, 'followData', auth.currentUser.uid)
      // get the userToFollow followData docRef
      userToFollow.followDataRef = doc(db, 'followData', userIdToFollow)

      // get all of that users tweets and add them to your userFeed
      // get tweetReferences file for current user
      currentUser.tweetReferencesRef = doc(db, 'tweetReferences', auth.currentUser.uid)
       
      // get tweetReferences file for user that you have followed
      userToFollow.tweetReferencesRef = doc(db, 'tweetReferences', userIdToFollow)
      userToFollow.tweetReferencesSnap = await transaction.get(userToFollow.tweetReferencesRef)
      // store 'userTweets' object from userToFollow
      userToFollow.userTweetsData = userToFollow.tweetReferencesSnap.data().userTweets
      

      // add to 'userFeed' object of current user with dot notation
      Object.entries(userToFollow.userTweetsData).forEach(([key, value]) => {
        const fieldNameArray = ['userFeed', key]
        const dotNotationPath = fieldNameArray.join('.')
        transaction.update(currentUser.tweetReferencesRef, {
          [dotNotationPath]: value
        })
      })

      // write userIdToFollow into the 'following' array with arrayUnion
      transaction.update(currentUser.followDataRef, { following: arrayUnion(userIdToFollow) })
      // write current user's id into the userToFollow 'followers' array with arrayUnion
      transaction.update(userToFollow.followDataRef, { followers: arrayUnion(auth.currentUser.uid) })
      
    })
  } catch (error) {
    console.error("Failure to follow new user:", error)
    return Promise.reject(error)
  }
}

export const unfollowUser = async(userIdToUnfollow) => {
  try {
    await runTransaction(db, async (transaction) => {
      const currentUser = {}
      const userToUnfollow = {}
      // get current user followData docRef
      currentUser.followDataRef = doc(db, 'followData', auth.currentUser.uid)
      // get the userToUnfollow followData docRef
      userToUnfollow.followDataRef = doc(db, 'followData', userIdToUnfollow)

      // get all of that users tweets and remove them from your userFeed
      // get tweetReferences file for current user
      currentUser.tweetReferencesRef = doc(db, 'tweetReferences', auth.currentUser.uid)
       
      // get tweetReferences file for user that you are unfollowing
      userToUnfollow.tweetReferencesRef = doc(db, 'tweetReferences', userIdToUnfollow)
      userToUnfollow.tweetReferencesSnap = await transaction.get(userToUnfollow.tweetReferencesRef)
      // store 'userTweets' object from userToFollow
      userToUnfollow.userTweetsData = userToUnfollow.tweetReferencesSnap.data().userTweets
      

      // Remove 'userTweets' from 'userFeed' object of current user with dot notation
      Object.entries(userToUnfollow.userTweetsData).forEach(([key, value]) => {
        const fieldNameArray = ['userFeed', key]
        const dotNotationPath = fieldNameArray.join('.')
        transaction.update(currentUser.tweetReferencesRef, {
          [dotNotationPath]: deleteField()
        })
      })

      // write userIdToFollow into the 'following' array with arrayRemove
      transaction.update(currentUser.followDataRef, { following: arrayRemove(userIdToUnfollow) })
      // write current user's id into the userToFollow 'followers' array with arrayRemove
      transaction.update(userToUnfollow.followDataRef, { followers: arrayRemove(auth.currentUser.uid) })
      
    })
  } catch (error) {
    console.error("Failure to unfollow new user:", error)
    return Promise.reject(error)
  }
}

let userIdList = []

export const getUsersToFollow = async(loadCount, chunkSize = 2) => {
  try {
    if (loadCount === 0) {
      const idListDocRef = doc(db, 'users', 'userIdList')
      const followDataDocRef = doc(db, 'followData', auth.currentUser.uid)

      const userIdListSnap = await getDoc(idListDocRef)
      const followDataSnap = await getDoc(followDataDocRef)

      const userIdListData = userIdListSnap.data()
      const followData = followDataSnap.data()
      const usersToFilter = [...followData.following, auth.currentUser.uid]

      const unfilteredIdList = Object.keys(userIdListData)
      userIdList = unfilteredIdList.filter((userId) => {
        return !usersToFilter.includes(userId)
      })
    }

    const startKey = loadCount * chunkSize
    const userDataArray = []

    for (let i = 0; i < chunkSize; i++) {
      const userId = userIdList[startKey + i]
      if (userId) {
        const docRef = doc(db, 'users', userId)
        const docSnap = await getDoc(docRef)
        const userData = docSnap.data()
        userDataArray.push(userData)
      }
    }

    return userDataArray
  } catch (error) {
    console.error("Failure to get users to follow:", error)
  }
}