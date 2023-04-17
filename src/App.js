import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import HomePage from "./components/HomePage/HomePage"
import LoginPage from "./components/LoginPage/LoginPage"
import LogoutPage from './components/LogoutPage/LogoutPage';


const PageRoutes = (props) => {

  const navigate = useNavigate()

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, async (user) => {
      if (!user) { navigate('/') }
    }, [])
  })

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
    <BrowserRouter>
      <PageRoutes></PageRoutes>
    </BrowserRouter>
  );
}

export default App;
