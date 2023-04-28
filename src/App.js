import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { auth } from './auth';
import { getUserData } from "./firestore/current-user-data";
import PubSub from 'pubsub-js';

import HomePage from "./components/HomePage/HomePage"
import LoginPage from "./components/LoginPage/LoginPage"
import LogoutPage from './components/LogoutPage/LogoutPage';
import { getFollowerList } from './firestore/follower-list-functions';

export const UserContext = createContext()
export const FollowContext = createContext()

const ContextProvider = (props) => {
  const [userData, setUserData] = useState(null)
  const [followData, setFollowData] = useState(null)
  // const tempUserData = useRef(null)
  // const tempFollowData = useRef(null)

  // const updateFollowingData = (newUserId) => {
  //   const contextData = tempFollowData.current
  //   contextData.following.push(newUserId)
  //   setUserData(contextData)
  // }

  useEffect(() => {
    const unsubToken = PubSub.subscribe('update follow list', async () => {
      // const contextData = tempFollowData.current
      const newFollowData = await getFollowerList()
      const followers = newFollowData.followers ? newFollowData.followers : []
      const following = newFollowData.following ? newFollowData.following : []
      // contextData.followers = followers
      // contextData.following = following
      // setUserData({ ...contextData })
      // tempFollowData.current = contextData
      setFollowData({ followers, following })
    })
    
    return () => {
      PubSub.unsubscribe(unsubToken)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserData(user)
        const currentFollowData = await getFollowerList()
        const followers = currentFollowData.followers ? currentFollowData.followers : []
        const following = currentFollowData.following ? currentFollowData.following : []
        // const contextData = { userData, followers, following, updateFollowingData }
        setUserData(userData)
        setFollowData({ followers, following })
        // tempFollowData.current = { followers, following }
      } else {
        setUserData(null)
        // tempFollowData.current = null
      }
    })

    return unsubscribe
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
      <Route path="/home" element={<HomePage />}/>
      <Route path="/user-profile" element={<HomePage/>}/>
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
