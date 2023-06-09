import { doc, getDoc } from "firebase/firestore";
import { db } from "./firestore";

export const getUserData = async (user) => {
  try {
    if (user && user.isAnonymous) {
      const userDocRef = doc(db, 'guestUsers', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      return userDocSnap.data();
    } else if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      return userDocSnap.data();
    }

  } catch (error) {
    console.error("Failure to retrieve user data", error);
  }
};

export const getUserDataById = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.data();
  } catch (error) {
    console.error("Failure to retrieve user data", error);
  }
};

