
import PageLayout from './components/page-layout/page-layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageLayout/>}/>
        <Route path="/user-profile" element={<PageLayout/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
