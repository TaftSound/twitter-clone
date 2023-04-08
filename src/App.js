import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from "./components/home-page/home-page"

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
