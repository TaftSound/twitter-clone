import firebaseApp from "./firebase";

import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { createGuestUser } from "./firestore";


export const anonymousGuestSignin = async (userName) => {
  try {
    const auth = getAuth()

    onAuthStateChanged(auth, (user) => {
      if (user) {
        createGuestUser(user, userName)
        console.log(user)
      }
    })

    await signInAnonymously(auth)

  } catch (error) {
    console.error("Failure to sign in anonymously", error)
  }
}


try {

} catch (error) {
  console.error("Failure to ", error)
}