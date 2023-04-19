import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { auth } from './auth';

import HomePage from "./components/HomePage/HomePage"
import LoginPage from "./components/LoginPage/LoginPage"
import LogoutPage from './components/LogoutPage/LogoutPage';

import { getUserData } from "./firestore/user-functions";

export const UserContext = createContext()
export const AuthContext = createContext()

const ContextProvider = (props) => {
  const [value, setValue] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserData(user)
        setValue(userData)
      } else {
        setValue(null)
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
