export default function LoginScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative overflow-hidden">
      {/* 背景のドット柄パターン */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-blue-400 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 border border-blue-400 rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 border border-blue-300 rounded-full"></div>
      </div>

      {/* ログインカード */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full mx-4">
        {/* ロゴ */}
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Study Room</h1>
        </div>

        {/* 説明文 */}
        <p className="text-center text-gray-600 text-lg mb-8">
          日々の学習を記録し、仲間と共有しよう
        </p>

        {/* フォームコンテナ */}
        <div className="flex flex-col items-center">
          {/* ニックネーム入力欄 */}
          <div className="mb-6" style={{ width: '280px', maxWidth: '280px' }}>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              ニックネーム
            </label>
            <input
              id="nickname"
              type="text"
              placeholder="あなたのニックネームを入力"
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-gray-900 placeholder-gray-400"
              style={{ width: '280px', maxWidth: '280px', boxSizing: 'border-box' }}
            />
          </div>

          {/* 入室するボタン */}
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            style={{ width: '280px', maxWidth: '280px', boxSizing: 'border-box' }}
          >
            入室する
          </button>
        </div>

        {/* フッター */}
        <p className="text-center text-gray-500 text-sm mt-8">
          アカウントがなくても、ニックネームで参加できます
        </p>
      </div>
    </div>
  );
}
