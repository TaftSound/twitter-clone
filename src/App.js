import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from "./components/HomePage/HomePage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/user-profile" element={<HomePage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
