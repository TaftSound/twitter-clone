import { storage } from "../firebase"
import { deleteObject, listAll, ref } from "firebase/storage"

const storageRef = ref(storage)

const deleteFolderImages = async (ref) => {
  try {
    const listResults = await listAll(ref)

    const deletionPromises = listResults.items.map((fileRef) => {
      return deleteObject(fileRef)
    })
    
    return await Promise.all(deletionPromises)
  } catch (error) {
    console.error("Failure to delete images from storage folder:", error)
  }
}

export const deleteTweetImages = async (tweetId) => {
  try {
    const tweetStorageRef = ref(storageRef, `tweets/${tweetId}/images`)
    return await deleteFolderImages(tweetStorageRef)
  } catch (error) {
    console.error("Failure to delete tweet images from storage:", error)
  }
}
export const deleteProfileImage = async (userId) => {
  try {
    const profileImageStorageRef = ref(storageRef, `users/${userId}/images/profileImage`)
    return await deleteFolderImages(profileImageStorageRef)
  } catch (error) {
    console.error("Failure to delete profile image from storage:", error)
  }
}
export const deleteBannerImage = async (userId) => {
  try {
    const bannerImageStorageRef = ref(storageRef, `users/${userId}/images/bannerImage`)
    return await deleteFolderImages(bannerImageStorageRef)
  } catch (error) {
    console.error("Failure to delete profile image from storage:", error)
  }
}