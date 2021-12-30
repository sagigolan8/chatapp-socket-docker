import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from './Components/Chat';
import Header from './Components/Header';
import Login from './Components/Login';

export default function App() {
  return (
    <div>
        <Header/>
        <Router>
          <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/chat" element={<Chat/>} />
          </Routes>
        </Router>
    </div>
  )
}
