import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import PubSub from 'pubsub-js'

import firebaseApp from './firebase'
import { confirmExistingUser, createNewUser } from './firestore'

const provider = new GoogleAuthProvider()
const auth = getAuth()


export const googlePopupSignin = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    const isUser = await confirmExistingUser(user.uid)
    if (!isUser) {
      PubSub.publish('open user signup')
      console.log('sign up user')
    } else {
      PubSub.publish('signin complete')
      console.log('signed in')
    }
  } catch (error) {
    console.error('Google sign in failure:', error)
  }
}

export const googlePopupSignup = async (userName) => {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    await createNewUser(user, userName)
  } catch (error) {
    console.error('Google sign in failure:', error)
  }
}