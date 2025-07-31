// Final/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NewFeed from './pages/NewFeed';
import MyPage from './pages/MyPage';
import MyInfo from './pages/MyInfo';
import RoadmapDetail from './pages/RoadmapDetail';
import SignUp2 from './pages/SignUp2';
import MyinfoUpdate from './pages/MyinfoUpdate';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/newfeed" element={<NewFeed/>}/>
        <Route path="/mypage" element={<MyPage/>}/>
        <Route path="/myinfo" element={<MyInfo/>}/>
        <Route path="/RoadmapDetail" element={<RoadmapDetail/>}/>
       <Route path="/signup2" element={<SignUp2 />} />
         <Route path="/infoupdate" element={<MyinfoUpdate />} />

       </Routes>
    </BrowserRouter>
  );
}

export default App;
