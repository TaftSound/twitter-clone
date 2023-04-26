import { arrayUnion, doc, getDoc, runTransaction, writeBatch } from "firebase/firestore";
import { auth } from "../auth";
import { db } from "./firestore";

export const getFollowerList = async (userId = auth.currentUser.uid) => {
  try {
    const followerDocRef = doc(db, 'followData', userId);
    const followListSnap = await getDoc(followerDocRef);
    return (followListSnap.data());
  } catch (error) {
    console.error("Failure to check username availability:", error)
  }
};

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
      

      // add to 'userFeed' object of current user with the merge option
      Object.entries(userToFollow.userTweetsData).forEach(([key, value]) => {
        const fieldNameArray = ['userFeed', key]
        const dotNotationPath = fieldNameArray.join('.')
        transaction.update(currentUser.tweetReferencesRef, {
          [dotNotationPath]: value
        })
      })

      // write userIdToFollow into the 'following' array with array.union
      transaction.update(currentUser.followDataRef, { following: arrayUnion(userIdToFollow) })
      // write current user's id into the userToFollow 'followers' array with array.union
      transaction.update(userToFollow.followDataRef, { followers: arrayUnion(auth.currentUser.uid) })
      
    })
  } catch (error) {
    console.error("Failure to follow new user:", error)
  }
}

export const unfollowUser = async(userIdToUnfollow) => {
  
}

let userIdList = []

export const getUsersToFollow = async(loadCount, chunkSize = 2) => {
  try {
    if (!userIdList[0]) {
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