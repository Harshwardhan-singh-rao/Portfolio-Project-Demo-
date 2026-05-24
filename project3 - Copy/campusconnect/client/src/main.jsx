import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './pages/App.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Explore from './pages/Explore.jsx'
import TeamBuilder from './pages/TeamBuilder.jsx'
import Chat from './pages/Chat.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/explore" />} />
        <Route path="/app" element={<App />}> </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/team" element={<TeamBuilder />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
