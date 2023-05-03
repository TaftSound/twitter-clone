import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAZ-BcQ3Zy1yQnJWXLmD1Rpw9sdVLjGAPw",
  authDomain: "faketwitter-7207e.firebaseapp.com",
  projectId: "faketwitter-7207e",
  storageBucket: "faketwitter-7207e.appspot.com",
  messagingSenderId: "506047559653",
  appId: "1:506047559653:web:1976e8860a36232957e10c"
}

const firebaseApp = initializeApp(firebaseConfig)
export const storage = getStorage(firebaseApp)

export default firebaseApp