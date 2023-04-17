import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"

import firebaseApp from "./firebase";

const db = getFirestore(firebaseApp)

export const confirmExistingUser = async (uid) => {
  try {
    const userDocRef = doc(db, 'users', uid)
    const userDoc = await getDoc(userDocRef)
    return userDoc.exists()
  } catch (error) {
    console.error("Failure to confirm existing user:", error)
  }
}

export const createNewUser = async (user, userName) => {
  try {
    // check if existing user
    const userDocRef = doc(db, 'users', user.uid)
    const userNameListRef = doc(db, 'users', 'userNameList')
    setDoc(userNameListRef, { [userName]: true }, { merge: true })
    return await setDoc(userDocRef, {
      displayName: user.displayName,
      email: user.email,
      userName: userName
    })
  } catch (error) {
    console.error("Failure to create new user account:", error)
  }
}

export const createGuestUser = async (user, userName) => {
  try {
    const userDocRef = doc(db, 'guestUsers', user.uid)
    return await setDoc(userDocRef, {
      displayName: "Guest",
      userName: userName
    })
  } catch (error) {
    console.error("Failure to create new guest user account:", error)
  }
}

export const checkUserNameAvailability = async (userName) => {
  try {
    const docRef = doc(db, 'users', 'userNameList')
    const nameListDoc = await getDoc(docRef)
    return !nameListDoc.data()[userName]
  } catch (error) {
    console.error("Failure to check if user name is available:", error)
  }
}

export const getUserData = async (user) => {
  try {
    if (user && !user.displayName) {
      const userDocRef = doc(db, 'guestUsers', user.uid)
      const userDocSnap = await getDoc(userDocRef)
      return userDocSnap.data()
    } else if (user) {
      const userDocRef = doc(db, 'users', user.uid)
      const userDocSnap = await getDoc(userDocRef)
      return userDocSnap.data()
    }
    
  } catch (error) {
    console.error("Failure to retrieve user data", error)
  }
}

try {
  
} catch (error) {
  console.error("", error)
}