import { LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskMemo, setTaskMemo] = useState('');

  const addTask = () => {
    if (taskInput.trim() === '') return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: taskInput,
        deadline: taskDeadline,
        memo: taskMemo,
        completed: false,
      },
    ]);
    setTaskInput('');
    setTaskDeadline('');
    setTaskMemo('');
  };

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
            <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
              <LogOut size={18} />
              <span>退室</span>
            </button>
          </div>
        </div>
      </header>

      {/* メインエリア */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 現在のステータスカード */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">現在のステータス</h2>
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="inline-block bg-blue-100 text-blue-700 px-6 py-3 rounded-full font-medium text-lg">
                  集中モード
                </div>
                <p className="text-gray-600 mt-4">学習に集中中です</p>
              </div>
            </div>
          </div>

          {/* タスク入力カード */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">タスク追加</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="タスク名"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <textarea
                value={taskMemo}
                onChange={(e) => setTaskMemo(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="メモ・詳細"
                rows="3"
              />
              <button
                onClick={addTask}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                追加
              </button>
            </div>
          </div>

          {/* タスク一覧カード */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">タスク一覧</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {tasks.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">タスクはまだありません</p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="border-2 border-blue-200 bg-blue-50 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">{task.text}</span>
                    </div>
                    {task.deadline && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">期限:</span>
                        <span className="text-xs text-red-600 font-medium">{task.deadline}</span>
                      </div>
                    )}
                    {task.memo && (
                      <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                        <p className="text-xs text-gray-600 whitespace-pre-wrap">{task.memo}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
