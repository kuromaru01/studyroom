import LoginScreen from './components/LoginScreen'
import Dashboard from './components/Dashboard'
import { useState } from 'react'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {isLoggedIn ? <Dashboard /> : <LoginScreen onLogin={handleLogin} />}
    </div>
  )
}

export default App
