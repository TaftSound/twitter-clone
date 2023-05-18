import { doc, updateDoc, deleteField } from "firebase/firestore";
import { auth } from "../auth";
import { db } from "./firestore";

// Get doc reference for tweet
// use update method to add field to the map title "likes"
// user the current userId as the field name
// use 'true' as the value

export const storeTweetLike = async (tweetId, userId) => {
  try {
    if (auth.currentUser.isAnonymous) {
      const guestUserDocRef = doc(db, 'guestUsers', auth.currentUser.uid)
      const timestamp = Date.now()

      const dotNotationPath = `likes.${tweetId}`
      await updateDoc(guestUserDocRef, { [dotNotationPath]: timestamp })
      return timestamp
    }

    const tweetDocRef = doc(db, 'tweets', `${tweetId}`)
    const timestamp = Date.now()

    await updateDoc(tweetDocRef, {
      [`likes.${userId}`]: timestamp,
    })
  } catch (error) {
    console.error("Failure to remove tweet like:", error)
  }
}

export const removeTweetLike = async (tweetId, userId) => {
  try {
    if (auth.currentUser.isAnonymous) {
      const guestUserDocRef = doc(db, 'guestUsers', auth.currentUser.uid)
      
      const dotNotationPath = `likes.${tweetId}`
      await updateDoc(guestUserDocRef, { [dotNotationPath]: deleteField() })
      return
    }

    const tweetDocRef = doc(db, 'tweets', `${tweetId}`)

    await updateDoc(tweetDocRef, {
      [`likes.${userId}`]: deleteField(),
    })
  } catch (error) {
    console.error("Failure to remove tweet like:", error)
  }
}