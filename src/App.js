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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserData(user)
        const currentFollowData = await getFollowerList()
        const followers = currentFollowData.followers ? currentFollowData.followers : []
        const following = currentFollowData.following ? currentFollowData.following : []

        setUserData(userData)
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
