import { getFirestore } from "firebase/firestore"

import firebaseApp from "../firebase";
export const db = getFirestore(firebaseApp)

try {
  
} catch (error) {
  console.error("", error)
}

// PUSH TO FOLLOWERS OPERATION:

// Get user's followers - 1 read
// Iterate through user's followers and for each:
  // Push { [tweetRef.id]: timestamp } to "tweetReferences/userId"
  // Using arrayMerge to merge into "userFeed" field

