import LoginScreen from './components/LoginScreen'
import Dashboard from './components/Dashboard'
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentNickname, setCurrentNickname] = useState('')
  const [members, setMembers] = useState([])
  const [socket, setSocket] = useState(null)
  const [joinError, setJoinError] = useState(null)

  // Socket.io接続の初期化
  useEffect(() => {
    const newSocket = io('http://localhost:3000')
    setSocket(newSocket)

    // メンバーリストの更新を受信
    newSocket.on('membersUpdate', (updatedMembers) => {
      setMembers(updatedMembers)
    })

    // メンバーの入室通知を受信
    newSocket.on('memberJoined', (nickname) => {
      console.log(`${nickname}が入室しました`)
    })

    // メンバーの退室通知を受信
    newSocket.on('memberLeft', (nickname) => {
      console.log(`${nickname}が退室しました`)
    })

    // 入室エラーを受信
    newSocket.on('joinError', (errorMessage) => {
      setJoinError(errorMessage)
    })

    // 接続時に現在のメンバーリストを取得
    newSocket.on('connect', () => {
      newSocket.emit('getMembers')
    })

    // クリーンアップ
    return () => {
      newSocket.close()
    }
  }, [])

  const handleLogin = (nickname) => {
    if (!socket) return

    setJoinError(null)

    let hasError = false

    // エラーハンドラー（先に設定）
    const errorHandler = (errorMessage) => {
      hasError = true
      setJoinError(errorMessage)
      socket.off('membersUpdate', updateHandler)
    }
    socket.once('joinError', errorHandler)

    // メンバーリスト更新ハンドラー
    const updateHandler = (updatedMembers) => {
      if (!hasError) {
        setCurrentNickname(nickname)
        setMembers(updatedMembers)
        setIsLoggedIn(true)
      }
      socket.off('membersUpdate', updateHandler)
      socket.off('joinError', errorHandler)
    }
    socket.once('membersUpdate', updateHandler)

    // サーバーに入室を通知
    socket.emit('join', nickname)
  }

  const handleLogout = () => {
    if (!socket) return

    // サーバーに退室を通知
    socket.emit('leave')
    
    setCurrentNickname('')
    setMembers([])
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
        <LoginScreen onLogin={handleLogin} error={joinError} />
      )}
    </>
  )
}

export default App
