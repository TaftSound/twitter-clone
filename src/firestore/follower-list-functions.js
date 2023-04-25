import { doc, getDoc } from "firebase/firestore";
import { auth } from "../auth";
import { db } from "./firestore";

export const getFollowerList = async (userId = auth.currentUser.uid) => {
  const followerDocRef = doc(db, 'followData', userId);
  const followListSnap = await getDoc(followerDocRef);
  return (followListSnap.data());
};
