import { doc, getDoc } from "firebase/firestore"
import { auth } from "../auth"
import { db } from "./firestore"

const checkIfAdmin = async () => {
  try {
    const adminDocRef = doc(db, 'users', 'adminList')
    const docSnap = await getDoc(adminDocRef)
    if (docSnap.data()[auth.currentUser.uid]) {
      return true
    }
    
  } catch (error) {
    console.log('no admin rights')
    return false
  }
}

export default checkIfAdmin