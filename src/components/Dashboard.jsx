import { useState } from 'react';
import { LogOut, RefreshCcw } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard({ onLogout, nickname = 'ゲスト', members = [] }) {
  const [isBreak, setIsBreak] = useState(false);

  return (
    <div className="dashboard-container">
      {/* ヘッダー（デザイン優先） */}
      <header className="dashboard-header">
        <div className="header-title-box">
          <h1 className="title-logo">Study Room</h1>
        </div>

        <div className="user-info">
          <span>ようこそ、{nickname}さん</span>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={16} />
            <span>退室</span>
          </button>
        </div>
      </header>

      {/* 現在のステータス */}
      <div className="dashboard-section">
        <div className="skew-title-box">
          <h2 className="skew-title-text">現在のステータス</h2>
        </div>
        <div className="blue-underline"></div>

        <div className="bracket-container">
          <div className="content-area">
            <div className="status-inner">
              <div className="flash-card" aria-live="polite">
                <span className={isBreak ? 'flash-text out' : 'flash-text in'}>学習に集中中です</span>
                <span className={isBreak ? 'flash-text in' : 'flash-text out'}>今は休憩中です</span>
              </div>
              <button className="swap-btn round" aria-label="切り替え" onClick={() => setIsBreak(prev => !prev)}>
                <RefreshCcw size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 今日のタスク */}
      <div className="dashboard-section">
        <div className="skew-title-box">
          <h2 className="skew-title-text">今日のタスク</h2>
        </div>
        <div className="blue-underline"></div>

        <div className="bracket-container">
          <div className="content-area">
            <div className="status-text">タスクはまだありません</div>
            <button className="add-task-btn">add task</button>
          </div>
        </div>
      </div>

    </div>
  );
}