import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth } from "../auth";

const storageRef = ref(storage)

// need to make refs for and upload all images
// need to return the urls for all images in an array

export const storeTweetImages = async (imageFiles, tweetId) => {
  try {
    const tweetImagesRef = auth.currentUser.isAnonymous
    ? ref(storageRef, `guestTweets/${tweetId}/images`)
    : ref(storageRef, `tweets/${tweetId}/images`)
    
    const uploadPromises = imageFiles.map((file, index) => {
      const imageRef = ref(tweetImagesRef, `${index}${file.name}`)
      return uploadBytes(imageRef, file)
    })

    const resultsArray = await Promise.all(uploadPromises)
    const urlPromises = resultsArray.map((result) => { return getDownloadURL(result.ref) })

    const imageUrls = await Promise.all(urlPromises)
    
    return imageUrls
  } catch (error) {
    console.error("failure to upload tweet image:", error)
  }
}

const storeSingleImage = async (ref, imageFile) => {
  try {
    const result = await uploadBytes(ref, imageFile)
    const imageUrl = await getDownloadURL(result.ref)
    
    return imageUrl
  } catch (error) {
    console.error("Failure to store image", error)
  }
}

export const storeProfileImage = async (userId, imageFile) => {
  try {
    const profileImageRef = auth.currentUser.isAnonymous
    ? ref(storageRef, `guestUsers/${userId}/images/profileImage/${imageFile.name}`)
    : ref(storageRef, `users/${userId}/images/profileImage/${imageFile.name}`)
    const imageUrl = await storeSingleImage(profileImageRef, imageFile)
    
    return imageUrl
  } catch (error) {
    console.error("Failure to store profile image", error)
  }
}

export const storeBannerImage = async (userId, imageFile) => {
  try {
    const bannerImageRef = auth.currentUser.isAnonymous
    ? ref(storageRef, `guestUsers/${userId}/images/bannerImage/${imageFile.name}`)
    : ref(storageRef, `users/${userId}/images/bannerImage/${imageFile.name}`)
    const imageUrl = await storeSingleImage(bannerImageRef, imageFile)
    
    return imageUrl
  } catch (error) {
    console.error("Failure to store profile image", error)
  }
}