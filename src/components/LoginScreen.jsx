export default function LoginScreen() {
  return (
    <div className="login-container">
      {/* 背景のドット柄パターン */}
      <div className="background-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      {/* ログインカード */}
      <div className="login-card">
        {/* ロゴ */}
        <div className="logo-section">
          <h1 className="logo-title">Study Room</h1>
        </div>

        {/* 説明文 */}
        <p className="subtitle">
          日々の学習を記録し、仲間と共有しよう
        </p>

        {/* フォームコンテナ */}
        <div>
          {/* ニックネーム入力欄 */}
          <div className="input-group">
            <label htmlFor="nickname" className="input-label">
              ニックネーム
            </label>
            <input
              id="nickname"
              type="text"
              placeholder="あなたのニックネームを入力"
              className="input-field"
            />
          </div>

          {/* 入室するボタン */}
          <button 
            className="submit-button"
          >
            入室する
          </button>
        </div>

        {/* フッター */}
        <p className="footer-text">
          アカウントがなくても、ニックネームで参加できます
        </p>
      </div>
    </div>
  );
}
