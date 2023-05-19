import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import PubSub from 'pubsub-js';

import AppPage from "./components/AppPage/AppPage"
import LoginPage from "./components/LoginPage/LoginPage"
import LogoutPage from './components/LogoutPage/LogoutPage';

import { auth } from './firebase/auth';
import { getUserData } from "./firebase/firestore/current-user-data";
import { getFollowerList, listenForFollowerData, unsubscribeFromFollowerData } from './firebase/firestore/follower-list-functions';
import checkIfAdmin from './firebase/firestore/check-admin';
import { useContext } from 'react';
import { useRef } from 'react';
import { deepEqual } from './deep-equal'


export const UserContext = createContext()
export const FollowContext = createContext()

// getAuth().signOut()

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
      if (data.likes) { userDataCopy.likes = data.likes }
      setUserData({ ...userDataCopy })
    })
    return () => { PubSub.unsubscribe(unsubToken) }
  }, [userData])

  useEffect(() => {
    
    const unsubToken = PubSub.subscribe('update guest data', async (msg, data) => {
      if (deepEqual(data, userData)) return
      setUserData(data)
    })

    return () => { PubSub.unsubscribe(unsubToken) }
  }, [userData])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const currentUserData = await getUserData(user)
          if (!currentUserData) { return }
          const currentFollowData = currentUserData.guest
          ? currentUserData.followData : await getFollowerList()
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
      } catch (error) {
        console.error("Failure to retrieve user data:", error)
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
  const location = useLocation()

  const lastLocationRef = useRef(location.pathname)
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { navigate('/') }
    })

    return unsubscribe
  }, [navigate])

  useEffect(() => {
    const triggerGuestDataUpdate = async () => {
      const currentUserData = await getUserData(auth.currentUser)
      if (!currentUserData) { return }
      PubSub.publish('update guest data', currentUserData)
      lastLocationRef.current = location.pathname
    }

    const unsubToken = PubSub.subscribe('trigger guest update', () => {
      if (auth.currentUser) {
        if (auth.currentUser.isAnonymous) {
          triggerGuestDataUpdate()
        }
      }
    })

    if (auth.currentUser) {
      if (auth.currentUser.isAnonymous) {
        if (location.pathname === '/') { return () => { PubSub.unsubscribe(unsubToken) } }
        if (location.pathname === lastLocationRef.current) { return () => { PubSub.unsubscribe(unsubToken) } }
        triggerGuestDataUpdate()
      }
    }

    return () => { PubSub.unsubscribe(unsubToken) }
  }, [location])

  return (
    <Routes>
      <Route path="/" element={<LoginPage />}/>
      <Route path="/home/*" element={<AppPage current={'home'} />}/>
      <Route path="/user-profile/*" element={<AppPage current={'profile'} />}/>
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
