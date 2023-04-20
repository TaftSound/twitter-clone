import { getFirestore } from "firebase/firestore"

import firebaseApp from "../firebase";
export const db = getFirestore(firebaseApp)

try {
  
} catch (error) {
  console.error("", error)
}
