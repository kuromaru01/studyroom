import { LogOut } from 'lucide-react';

export default function Dashboard({ onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">Study Room</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-700">ようこそ、ゲストさん</span>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
