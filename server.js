import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// 在室メンバーを管理する配列
const members = [];

// 開発環境用のルートハンドラー
app.get('/', (req, res) => {
  res.json({ 
    message: 'Study Room API Server',
    status: 'running',
    members: members.length
  });
});

// 静的ファイルの配信（本番環境用）
app.use(express.static(join(__dirname, 'dist')));

// Socket.io接続処理
io.on('connection', (socket) => {
  console.log('ユーザーが接続しました:', socket.id);

  // 入室処理
  socket.on('join', (nickname) => {
    if (!nickname || members.includes(nickname)) {
      socket.emit('joinError', 'このニックネームは既に使用されています');
      return;
    }

    // メンバーリストに追加
    members.push(nickname);
    socket.nickname = nickname;

    // 接続中の全クライアントに通知
    io.emit('memberJoined', nickname);
    io.emit('membersUpdate', members);

    console.log(`${nickname}が入室しました。現在の在室人数: ${members.length}`);
  });

  // 退室処理
  socket.on('leave', () => {
    if (socket.nickname) {
      const index = members.indexOf(socket.nickname);
      if (index > -1) {
        const nickname = socket.nickname;
        members.splice(index, 1);

        // 接続中の全クライアントに通知
        io.emit('memberLeft', nickname);
        io.emit('membersUpdate', members);

        console.log(`${nickname}が退室しました。現在の在室人数: ${members.length}`);
      }
    }
  });

  // 切断処理
  socket.on('disconnect', () => {
    if (socket.nickname) {
      const index = members.indexOf(socket.nickname);
      if (index > -1) {
        const nickname = socket.nickname;
        members.splice(index, 1);

        // 接続中の全クライアントに通知
        io.emit('memberLeft', nickname);
        io.emit('membersUpdate', members);

        console.log(`${nickname}が切断しました。現在の在室人数: ${members.length}`);
      }
    }
    console.log('ユーザーが切断しました:', socket.id);
  });

  // 現在のメンバーリストを取得
  socket.on('getMembers', () => {
    socket.emit('membersUpdate', members);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});

