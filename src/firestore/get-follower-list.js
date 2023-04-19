import { doc, getDoc } from "firebase/firestore";
import { db } from "./firestore";

export const getFollowerList = async (userObject) => {
  const followerDocRef = doc(db, 'followData', userObject.userId);
  const followListSnap = await getDoc(followerDocRef);
  return followListSnap.data().followers;
};
