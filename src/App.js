import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import PubSub from 'pubsub-js';

import AppPage from "./components/AppPage/AppPage"
import LoginPage from "./components/LoginPage/LoginPage"
import LogoutPage from './components/LogoutPage/LogoutPage';

import { auth } from './firebase/auth';
import { getUserData } from "./firebase/firestore/current-user-data";
import { getFollowerList, listenForFollowerData, unsubscribeFromFollowerData } from './firebase/firestore/follower-list-functions';

export const UserContext = createContext()
export const FollowContext = createContext()
export const VisitContext = createContext()
export const VisitFollowContext = createContext()

const ContextProvider = (props) => {
  const [userData, setUserData] = useState(null)
  const [followData, setFollowData] = useState(null)
  const [visitData, setVisitData] = useState(null)
  const [visitFollowData, setVisitFollowData] = useState(null)

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
  useEffect(() => {
    const unsubToken = PubSub.subscribe('visit user profile', async (msg, data) => {
      const userFollowData = await getFollowerList(data.userId)
      setVisitData(data)
      setVisitFollowData(userFollowData)
    })
    
    return () => {
      PubSub.unsubscribe(unsubToken)
    }
  }, [])

  useEffect(() => {
    const unsubToken = PubSub.subscribe('clear visited profile', async (msg, data) => {
      setVisitData(null)
      setVisitFollowData(null)
    })
    
    return () => {
      PubSub.unsubscribe(unsubToken)
    }
  }, [])

  return (
    <FollowContext.Provider value={followData}>
      <UserContext.Provider value={userData}>
        <VisitContext.Provider value={visitData}>
          <VisitFollowContext.Provider value={visitFollowData}>
            {props.children}
          </VisitFollowContext.Provider>
        </VisitContext.Provider>
      </UserContext.Provider>
    </FollowContext.Provider>
  )
}

const PageRoutes = (props) => {

  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { navigate('/') }
    })

    return unsubscribe
  }, [navigate])

  useEffect(() => {
    if (location.pathname !== '/visit-profile') {
      PubSub.publish('clear visited profile')
    }
    if (location.pathname === '/visit-profile') {
      PubSub.publish('visit user profile', location.state)
    }
  }, [location])


  useEffect(() => {
    console.log(location.state)
  }, [location])

  return (
    <Routes>
      <Route path="/" element={<LoginPage />}/>
      <Route path="/home" element={<AppPage current={'home'} />}/>
      <Route path="/user-profile" element={<AppPage current={'profile'} />}/>
      <Route path="/visit-profile" element={<AppPage current={'visit-profile'} />}/>
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
