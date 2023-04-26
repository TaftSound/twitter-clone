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
let userDataList = []

export const getUsersToFollow = async(loadCount) => {
  try {
    if (!userIdList[0]) {
      const docRef = doc(db, 'users', 'userIdList')
      const userIdListSnap = await getDoc(docRef)
      const userIdListData = userIdListSnap.data()
      userIdList = Object.keys(userIdListData)
      // need to filter out self
      // need to filter out users you already follow
    }
    // get the userId's for the chunk
    // get the data for each user
    // return the data for both users togeth in one object

    const startKey = loadCount * 2
    const userIdOne = userIdList[startKey]
    const userIdTwo = userIdList[startKey + 1]

    const docRefOne = doc(db, 'users', userIdOne)
    const docRefTwo = doc(db, 'users', userIdTwo)

    const docSnapOne = await getDoc(docRefOne)
    const docSnapTwo = await getDoc(docRefTwo)

    const userOneData = docSnapOne.data()
    const userTwoData = docSnapTwo.data()

    return [ userOneData, userTwoData ]
  } catch (error) {
    console.error("Failure to get users to follow:", error)
  }
}