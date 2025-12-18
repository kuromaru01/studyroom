import { useState, useEffect } from 'react';
import { Plus, Search, Users, ArrowRight } from 'lucide-react';

export default function RoomList({ socket, nickname, onJoinRoom }) {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [error, setError] = useState(null);
  const [joinError, setJoinError] = useState(null);

  // ルーム一覧を取得
  useEffect(() => {
    if (!socket) return;

    const handleRoomsList = (roomsList) => {
      setRooms(roomsList);
    };

    socket.on('roomsList', handleRoomsList);
    socket.emit('getRooms');

    return () => {
      socket.off('roomsList', handleRoomsList);
    };
  }, [socket]);

  // ルーム検索
  useEffect(() => {
    if (!socket) return;

    if (searchTerm.trim() === '') {
      socket.emit('getRooms');
    } else {
      socket.emit('searchRooms', searchTerm);
    }
  }, [searchTerm, socket]);

  // ルーム作成
  const handleCreateRoom = () => {
    if (!socket) return;

    setError(null);

    socket.emit('createRoom', {
      name: roomName,
      description: roomDescription
    });

    socket.once('roomCreated', (room) => {
      setRoomName('');
      setRoomDescription('');
      setShowCreateForm(false);
      // 作成したルームに入室
      handleJoinRoom(room.id);
    });

    socket.once('createRoomError', (errorMessage) => {
      setError(errorMessage);
    });
  };

  // ルーム入室
  const handleJoinRoom = (roomId) => {
    if (!socket) return;
    setJoinError(null);
    
    // エラーハンドラーを設定
    const errorHandler = (errorMessage) => {
      setJoinError(errorMessage);
      socket.off('joinRoomError', errorHandler);
    };
    socket.once('joinRoomError', errorHandler);
    
    onJoinRoom(roomId);
  };

  return (
    <div className="login-container">
      {/* 背景のドット柄パターン */}
      <div className="background-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10 min-h-screen flex flex-col items-center">
        {/* ヘッダー */}
        <div className="mb-6 sm:mb-8 text-center w-full">
          <h1 style={{ 
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: '800',
            color: '#ffffff',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 0, 0, 0.3)',
            marginBottom: '12px',
            letterSpacing: '-0.5px'
          }}>Study Room</h1>
          <p style={{ 
            color: '#ffffff',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 0, 0, 0.3)',
            fontWeight: '600',
            fontSize: 'clamp(14px, 2vw, 18px)'
          }}>ようこそ、{nickname}さん</p>
        </div>

        {/* 検索バーと作成ボタン */}
        <div className="room-card mb-4 sm:mb-6">
          <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="ルーム名や説明で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                autoFocus={false}
              />
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={`submit-button flex items-center justify-center gap-2 ${showCreateForm ? 'opacity-70' : ''}`}
            >
              <Plus size={20} />
              <span className="hidden sm:inline">ルームを作成</span>
              <span className="sm:hidden">作成</span>
            </button>
          </div>
        </div>

        {/* ルーム作成フォーム */}
        {showCreateForm && (
          <div className="room-card mb-4 sm:mb-6 animate-slideIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold" style={{ color: '#374151' }}>新しいルームを作成</h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setRoomName('');
                  setRoomDescription('');
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div className="input-group">
                <label className="input-label">
                  ルーム名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="例: プログラミング勉強会"
                  className="input-field"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && roomName.trim()) {
                      handleCreateRoom();
                    }
                  }}
                />
              </div>
              <div className="input-group">
                <label className="input-label">
                  説明（任意）
                </label>
                <textarea
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  placeholder="ルームの説明を入力..."
                  rows={3}
                  className="input-field"
                  style={{ resize: 'vertical', minHeight: '80px' }}
                />
              </div>
              <div className="flex gap-3 flex-col sm:flex-row">
                <button
                  onClick={handleCreateRoom}
                  disabled={!roomName.trim()}
                  className={`submit-button flex-1 ${!roomName.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  作成して入室
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setRoomName('');
                    setRoomDescription('');
                    setError(null);
                  }}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-semibold sm:w-auto w-full"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ルーム入室エラー表示 */}
        {joinError && (
          <div className="mb-4 sm:mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 room-card animate-slideIn">
            <div className="flex items-center justify-between">
              <span>{joinError}</span>
              <button
                onClick={() => setJoinError(null)}
                className="text-red-400 hover:text-red-600 transition-colors ml-4"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* ルーム一覧 */}
        <div className="room-card">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl font-semibold" style={{ color: '#374151' }}>
              {searchTerm ? `検索結果 (${rooms.length}件)` : `ルーム一覧 (${rooms.length}件)`}
            </h2>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                クリア
              </button>
            )}
          </div>
          {rooms.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="mb-4">
                <Users size={48} className="mx-auto text-gray-300" />
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">
                {searchTerm ? '検索結果が見つかりませんでした' : 'ルームがありません'}
              </p>
              <p className="text-gray-400 text-sm">
                {!searchTerm && (
                  <>
                    最初のルームを作成してみましょう！
                    <br />
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="mt-3 text-purple-600 hover:text-purple-700 font-semibold underline"
                    >
                      ルームを作成する
                    </button>
                  </>
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {rooms.map((room, index) => (
                <div
                  key={room.id}
                  className="border-2 border-gray-200 rounded-xl p-5 sm:p-6 hover:shadow-xl transition-all duration-300 hover:border-purple-400 hover:-translate-y-1 bg-white/60 backdrop-blur-sm cursor-pointer"
                  style={{ 
                    animation: `slideInUp 0.5s ease ${index * 0.1}s both`
                  }}
                  onClick={() => handleJoinRoom(room.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex-1 pr-2" style={{ color: '#1f2937' }}>
                      {room.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
                      <Users size={14} />
                      <span>{room.memberCount}</span>
                    </div>
                  </div>
                  {room.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[3.75rem]">
                      {room.description}
                    </p>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinRoom(room.id);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>入室する</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

