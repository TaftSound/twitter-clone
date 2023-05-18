import { doc, getDoc } from "firebase/firestore"
import { auth } from "../auth"
import { db } from "./firestore"

const checkIfAdmin = async () => {
  try {
    const adminDocRef = doc(db, 'adminList', auth.currentUser.uid)
    const docSnap = await getDoc(adminDocRef)
    if (docSnap.exists()) {
      return true
    }
  } catch (error) {
    console.log('no admin rights')
    return false
  }
}

export default checkIfAdmin