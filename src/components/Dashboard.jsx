import { useState } from 'react';
import { LogOut, RefreshCcw, Trash2 } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard({ onLogout, nickname = 'ゲスト', members = [], room }) {
  const [isBreak, setIsBreak] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskMemo, setTaskMemo] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);

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
    setShowTaskForm(false);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="dashboard-container">
      {/* ヘッダー（デザイン優先） */}
      <header className="dashboard-header">
        <div className="header-title-box">
          <h1 className="title-logo">{room?.name || 'Study Room'}</h1>
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
                <span className={isBreak ? 'flash-text out' : 'flash-text in'}>学習中</span>
                <span className={isBreak ? 'flash-text in' : 'flash-text out'}>休憩中</span>
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
            {tasks.length === 0 ? (
              <div className="status-text">タスクはまだありません</div>
            ) : (
              <div style={{ width: '100%' }}>
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      marginBottom: '12px',
                      padding: '12px',
                      border: '2px solid #0b5dff',
                      borderRadius: '8px',
                      backgroundColor: '#f0f5ff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', color: '#222', flex: 1 }}>{task.text}</span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        style={{
                          marginLeft: '8px',
                          padding: '4px 8px',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          color: '#dc2626',
                        }}
                        title="削除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {task.deadline && (
                      <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                        期限: <span style={{ color: '#dc2626', fontWeight: '600' }}>{task.deadline}</span>
                      </div>
                    )}
                    {task.memo && (
                      <div style={{
                        marginTop: '8px',
                        padding: '8px',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                        fontSize: '14px',
                        color: '#444',
                        whiteSpace: 'pre-wrap',
                      }}>
                        {task.memo}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {!showTaskForm && (
              <button
                className="add-task-btn"
                onClick={() => setShowTaskForm(true)}
              >
                add task
              </button>
            )}
          </div>
        </div>
        {showTaskForm && (
          <div style={{ marginLeft: '60px', marginTop: '20px', maxWidth: '500px' }}>
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="タスク名"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #a7b7ff',
                borderRadius: '4px',
                marginBottom: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            <input
              type="date"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #a7b7ff',
                borderRadius: '4px',
                marginBottom: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            <textarea
              value={taskMemo}
              onChange={(e) => setTaskMemo(e.target.value)}
              placeholder="メモ・詳細"
              rows="3"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #a7b7ff',
                borderRadius: '4px',
                marginBottom: '8px',
                fontSize: '14px',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={addTask}
                className="add-task-btn"
                style={{ flex: 1 }}
              >
                追加
              </button>
              <button
                onClick={() => {
                  setShowTaskForm(false);
                  setTaskInput('');
                  setTaskDeadline('');
                  setTaskMemo('');
                }}
                style={{
                  padding: '8px 18px',
                  border: '1px solid #a7b7ff',
                  background: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#0b5dff',
                  fontWeight: '600',
                }}
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 在室メンバー */}
      {members && members.length > 0 && (
        <div className="dashboard-section">
          <div className="skew-title-box">
            <h2 className="skew-title-text">在室メンバー</h2>
          </div>
          <div className="blue-underline"></div>

          <div className="bracket-container">
            <div className="content-area">
              <div className="status-text">
                {members.map((member, index) => (
                  <div key={index} style={{ marginBottom: '8px' }}>
                    {member}
                  </div>
                ))}
              </div>
              <div className="status-text" style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
                在室人数: {members.length}人
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
