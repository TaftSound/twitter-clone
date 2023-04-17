import firebaseApp from "./firebase";
import PubSub from 'pubsub-js'
import { getAuth, 
        signInAnonymously,
        onAuthStateChanged,
        GoogleAuthProvider,
        signInWithPopup } from "firebase/auth";
import { createGuestUser, confirmExistingUser, createNewUser } from "./firestore";

export const auth = getAuth()

export const anonymousGuestSignin = async (userName) => {
  try {

    onAuthStateChanged(auth, async (user) => {
      if (user) { await createGuestUser(user, userName) }
    })

    await signInAnonymously(auth)

  } catch (error) {
    console.error("Failure to sign in anonymously", error)
  }
}

const provider = new GoogleAuthProvider()

export const googlePopupSignin = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    const isUser = await confirmExistingUser(user.uid)
    if (!isUser) {
      await getAuth().signOut()
      PubSub.publish('open user signup')
    }
  } catch (error) {
    console.error('Google sign in failure:', error)
  }
}

export const googlePopupSignup = async (userName) => {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    const isUser = await confirmExistingUser(user.uid)
    if (isUser) { return }
    await createNewUser(user, userName)
  } catch (error) {
    console.error('Google sign up failure:', error)
  }
}


try {

} catch (error) {
  console.error("Failure to ", error)
}