import { doc, setDoc, getDoc, writeBatch, arrayUnion } from "firebase/firestore";
import { auth } from "../auth";
import { db } from "./firestore";


export const confirmExistingUser = async (uid) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists();
  } catch (error) {
    console.error("Failure to confirm existing user:", error);
  }
};

export const createNewUser = async (user, userName) => {
  try {
    const batch = writeBatch(db)

    const userDocRef = doc(db, 'users', user.uid);
    const userNameListRef = doc(db, 'users', 'userNameList');
    const followerListRef = doc(db, 'followData', user.uid);
    const tweetReferencesRef = doc(db, 'tweetReferences', user.uid)
    const firstFollowerRef = doc(db, 'followData', 'a16Or57x2gTriztGc1p9ZMp1BCw2')
    
    batch.set(userNameListRef, { [userName]: true }, { merge: true });
    batch.set(userDocRef, {
      displayName: user.displayName,
      email: user.email,
      userName: userName,
      userId: user.uid
    });
    batch.set(followerListRef, {
      following: [],
      followers: ['a16Or57x2gTriztGc1p9ZMp1BCw2']
    });
    batch.set(tweetReferencesRef, {
      userFeed: {},
      userTweets: {}
    });
    batch.update(firstFollowerRef, {
      following: arrayUnion(user.uid)
    })

    await batch.commit()
  } catch (error) {
    auth.signOut()
    console.error("Failure to create new user account:", error);
  }
};

export const createGuestUser = async (user, userName) => {
  try {
    const userDocRef = doc(db, 'guestUsers', user.uid);
    await setDoc(userDocRef, {
      displayName: "Guest",
      userName: userName
    });
  } catch (error) {
    console.error("Failure to create new guest user account:", error);
  }
};

export const checkUserNameAvailability = async (userName) => {
  try {
    const docRef = doc(db, 'users', 'userNameList');
    const nameListDoc = await getDoc(docRef);
    return !nameListDoc.data()[userName];
  } catch (error) {
    console.error("Failure to check if user name is available:", error);
  }
};