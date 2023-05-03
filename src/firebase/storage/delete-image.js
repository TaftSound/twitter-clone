import { storage } from "../firebase"
import { deleteObject, listAll, ref } from "firebase/storage"

const storageRef = ref(storage)

export const deleteTweetImages = async (tweetId) => {
  try {
    const tweetStorageRef = ref(storageRef, `tweets/${tweetId}/images`)
    const listResults = await listAll(tweetStorageRef)

    const deletionPromises = listResults.items.map((fileRef) => {
      return deleteObject(fileRef)
    })
    
    return await Promise.all(deletionPromises)
  } catch (error) {
    console.error("Failure to delete tweet images from storage:", error)
  }
}