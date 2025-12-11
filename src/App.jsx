import LoginScreen from './components/LoginScreen'
import Dashboard from './components/Dashboard'
import { useState } from 'react'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentNickname, setCurrentNickname] = useState('')
  const [members, setMembers] = useState([])

  const handleLogin = (nickname) => {
    setCurrentNickname(nickname)
    setMembers([...members, nickname])
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setMembers(members.filter(member => member !== currentNickname))
    setCurrentNickname('')
    setIsLoggedIn(false)
  }

  return (
    <>
      {isLoggedIn ? (
        <Dashboard 
          onLogout={handleLogout} 
          nickname={currentNickname}
          members={members}
        />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </>
  )
}

export default App
