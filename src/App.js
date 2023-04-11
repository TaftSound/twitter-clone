import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from "./components/HomePage/HomePage"
import LoginPage from "./components/LoginPage/LoginPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}/>
        <Route path="/home" element={<HomePage />}/>
        <Route path="/user-profile" element={<HomePage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
