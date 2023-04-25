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
