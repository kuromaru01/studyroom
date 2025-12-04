import LoginScreen from './components/LoginScreen'
import Dashboard from './components/Dashboard'
import './App.css'

// この変数を true/false に書き換えて画面を確認します
const isDebugLogin = false

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {isDebugLogin ? <Dashboard /> : <LoginScreen />}
    </div>
  )
}

export default App
