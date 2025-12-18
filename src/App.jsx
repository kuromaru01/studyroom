import LoginScreen from './components/LoginScreen'
import RoomList from './components/RoomList'
import Dashboard from './components/Dashboard'
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import './App.css'

function App() {
  const [view, setView] = useState('login') // 'login' | 'roomList' | 'dashboard'
  const [currentNickname, setCurrentNickname] = useState('')
  const [currentRoom, setCurrentRoom] = useState(null)
  const [members, setMembers] = useState([])
  const [memberStatuses, setMemberStatuses] = useState({})
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

    // メンバーのステータス更新を受信（全量）
    newSocket.on('memberStatusesUpdate', (statuses) => {
      setMemberStatuses(statuses || {})
    })

    // クリーンアップ
    return () => {
      newSocket.close()
    }
  }, [])

  // ニックネーム入力後の処理
  const handleLogin = (nickname) => {
    setCurrentNickname(nickname)
    setView('roomList')
  }

  // ルーム入室処理
  const handleJoinRoom = (roomId) => {
    if (!socket) {
      console.error('Socket is not available');
      return;
    }

    console.log('ルーム入室処理開始:', roomId, 'ニックネーム:', currentNickname);
    setJoinError(null)

    // ルーム入室エラーハンドラー
    const errorHandler = (errorMessage) => {
      console.error('ルーム入室エラー:', errorMessage);
      setJoinError(errorMessage)
      socket.off('roomJoined', successHandler)
    }
    socket.once('joinRoomError', errorHandler)

    // ルーム入室成功ハンドラー
    const successHandler = (data) => {
      console.log('ルーム入室成功:', data);
      setCurrentRoom(data.room)
      setMembers(data.members)
      setMemberStatuses(data.memberStatuses || {})
      setView('dashboard')
      socket.off('joinRoomError', errorHandler)
    }
    socket.once('roomJoined', successHandler)

    // サーバーにルーム入室を通知
    console.log('サーバーにルーム入室を送信:', { roomId, nickname: currentNickname });
    socket.emit('joinRoom', {
      roomId,
      nickname: currentNickname
    })
  }

  // ルーム退室処理
  const handleLogout = () => {
    if (!socket) return

    // サーバーにルーム退室を通知
    socket.emit('leaveRoom')
    
    setCurrentRoom(null)
    setMembers([])
    setView('roomList')
  }

  return (
    <>
      {view === 'login' && (
        <LoginScreen onLogin={handleLogin} error={joinError} />
      )}
      {view === 'roomList' && socket && (
        <RoomList 
          socket={socket}
          nickname={currentNickname}
          onJoinRoom={handleJoinRoom}
        />
      )}
      {view === 'dashboard' && currentRoom && (
        <Dashboard 
          onLogout={handleLogout} 
          nickname={currentNickname}
          members={members}
          room={currentRoom}
          socket={socket}
          memberStatuses={memberStatuses}
        />
      )}
    </>
  )
}

export default App
