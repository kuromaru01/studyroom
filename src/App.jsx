import LoginScreen from './components/LoginScreen'
import Dashboard from './components/Dashboard'
import { useState } from 'react'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <>
      {isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <LoginScreen onLogin={handleLogin} />}
    </>
  )
}

export default App
