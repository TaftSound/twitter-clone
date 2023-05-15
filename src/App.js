import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import PubSub from 'pubsub-js';

import AppPage from "./components/AppPage/AppPage"
import LoginPage from "./components/LoginPage/LoginPage"
import LogoutPage from './components/LogoutPage/LogoutPage';

import { auth } from './firebase/auth';
import { getUserData } from "./firebase/firestore/current-user-data";
import { getFollowerList, listenForFollowerData, unsubscribeFromFollowerData } from './firebase/firestore/follower-list-functions';
import checkIfAdmin from './firebase/firestore/check-admin';

export const UserContext = createContext()
export const FollowContext = createContext()

const ContextProvider = (props) => {
  const [userData, setUserData] = useState(null)
  const [followData, setFollowData] = useState(null)

  useEffect(() => {
    const unsubToken = PubSub.subscribe('update follow list', async (msg, data) => {
      const followers = data.followers ? data.followers : []
      const following = data.following ? data.following : []

      setFollowData({ followers, following })
    })
    
    return () => {
      PubSub.unsubscribe(unsubToken)
    }
  }, [])
  useEffect(() => {
    const unsubToken = PubSub.subscribe('update user data', async (msg, data) => {
      const userDataCopy = userData
      if (data.displayName) { userDataCopy.displayName = data.displayName }
      if (data.bio) { userDataCopy.bio = data.bio }
      if (data.bannerImageUrl) { userDataCopy.bannerImageUrl = data.bannerImageUrl }
      if (data.profileImageUrl) { userDataCopy.profileImageUrl = data.profileImageUrl }
      if (data.bannerImageUrl === false) { userDataCopy.bannerImageUrl = "" }
      if (data.profileImageUrl === false) { userDataCopy.profileImageUrl = "" }
      if (data.bannerImageAdjustment) { userDataCopy.bannerImageAdjustment = data.bannerImageAdjustment }
      if (data.profileImageAdjustment) { userDataCopy.profileImageAdjustment = data.profileImageAdjustment }
      setUserData({ ...userDataCopy })
    })
    return () => { PubSub.unsubscribe(unsubToken) }
  }, [userData])
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const currentUserData = await getUserData(user)
        const currentFollowData = await getFollowerList()
        const followers = currentFollowData.followers ? currentFollowData.followers : []
        const following = currentFollowData.following ? currentFollowData.following : []
        const isAdmin = await checkIfAdmin()
        if (isAdmin) {
          currentUserData.isAdmin = true
        } else {
          currentUserData.isAdmin = false
        }

        setUserData(currentUserData)
        setFollowData({ followers, following })
        listenForFollowerData()
      } else {
        setUserData(null)
      }
    })
    

    return () => {
      unsubscribeFromFollowerData()
      unsubscribe()
    }
  }, [])

  return (
    <FollowContext.Provider value={followData}>
      <UserContext.Provider value={userData}>
            {props.children}
      </UserContext.Provider>
    </FollowContext.Provider>
  )
}

const PageRoutes = (props) => {

  const navigate = useNavigate()
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { navigate('/') }
    })

    return unsubscribe
  }, [navigate])


  return (
    <Routes>
      <Route path="/" element={<LoginPage />}/>
      <Route path="/home" element={<AppPage current={'home'} />}/>
      <Route path="/user-profile" element={<AppPage current={'profile'} />}/>
      <Route path="/visit-profile/*" element={<AppPage current={'visit-profile'} />}/>
      <Route path="/logout" element={<LogoutPage/>} />
    </Routes>
  )
}

function App() {

  return (
    <ContextProvider>
      <BrowserRouter>
        <PageRoutes></PageRoutes>
      </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
