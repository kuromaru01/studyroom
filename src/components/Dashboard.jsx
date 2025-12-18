import { LogOut, Users, User } from 'lucide-react';

export default function Dashboard({ onLogout, nickname, members, room }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">{room?.name || 'Study Room'}</h1>
            {room?.description && (
              <span className="text-sm text-gray-500 ml-2">- {room.description}</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-700">ようこそ、{nickname}さん</span>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>退室</span>
            </button>
          </div>
        </div>
      </header>

      {/* メインエリア */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 現在のステータスカード */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">現在のステータス</h2>
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <div className="inline-block bg-blue-100 text-blue-700 px-6 py-3 rounded-full font-medium text-lg">
                  集中モード
                </div>
                <p className="text-gray-600 mt-4">学習に集中中です</p>
              </div>
            </div>
          </div>

          {/* 今日のタスクカード */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">今日のタスク</h2>
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <p className="text-gray-500 text-lg">タスクはまだありません</p>
              </div>
            </div>
          </div>

          {/* 在室メンバーカード */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-gray-700" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">在室メンバー</h2>
            </div>
            <div className="space-y-2">
              {members.length === 0 ? (
                <p className="text-gray-500 text-sm">メンバーがいません</p>
              ) : (
                members.map((member, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      <User size={18} />
                    </div>
                    <span className="text-gray-700 font-medium">{member}</span>
                  </div>
                ))
              )}
              <div className="pt-2 text-sm text-gray-500">
                在室人数: {members.length}人
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}