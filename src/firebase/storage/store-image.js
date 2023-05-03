import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const storageRef = ref(storage)

// need to make refs for and upload all images
// need to return the urls for all images in an array

export const storeTweetImages = async (imageFiles, tweetId) => {
  try {
    const tweetImagesRef = ref(storageRef, `tweets/${tweetId}/images`)
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