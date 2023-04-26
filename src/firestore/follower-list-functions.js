import { doc, getDoc } from "firebase/firestore";
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

export const followUser = async(userIdToFollow) => {
  
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