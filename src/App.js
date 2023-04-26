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
export const AuthContext = createContext()

const ContextProvider = (props) => {
  const [value, setValue] = useState(null)
  const tempValue = useRef(null)

  const updateFollowingData = (newUserId) => {
    const contextData = tempValue.current
    contextData.following.push(newUserId)
    setValue(contextData)
  }

  useEffect(() => {
    const unsubToken = PubSub.subscribe('update follow list', async () => {
      const contextData = tempValue.current
      const followData = await getFollowerList()
      const followers = followData.followers ? followData.followers : []
      const following = followData.following ? followData.following : []
      contextData.followers = followers
      contextData.following = following
      setValue(contextData)
      tempValue.current = contextData
    })
    
    return () => {
      PubSub.unsubscribe(unsubToken)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserData(user)
        const followData = await getFollowerList()
        const followers = followData.followers ? followData.followers : []
        const following = followData.following ? followData.following : []
        const contextData = { userData, followers, following, updateFollowingData }
        setValue(contextData)
        tempValue.current = contextData
      } else {
        setValue(null)
        tempValue.current = null
      }
    })

    return unsubscribe
  }, [])

  return (
    <UserContext.Provider value={value}>
      {props.children}
    </UserContext.Provider>
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
