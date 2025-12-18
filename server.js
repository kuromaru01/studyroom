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

// ルーム管理
const rooms = new Map(); // roomId -> { id, name, description, createdAt, members: [] }

// 開発環境用のルートハンドラー
app.get('/', (req, res) => {
  res.json({ 
    message: 'Study Room API Server',
    status: 'running',
    rooms: rooms.size
  });
});

// 静的ファイルの配信（本番環境用）
app.use(express.static(join(__dirname, 'dist')));

// Socket.io接続処理
io.on('connection', (socket) => {
  console.log('ユーザーが接続しました:', socket.id);

  // ルーム一覧を取得
  socket.on('getRooms', () => {
    const roomsList = Array.from(rooms.values()).map(room => ({
      id: room.id,
      name: room.name,
      description: room.description,
      createdAt: room.createdAt,
      memberCount: room.members.length
    }));
    socket.emit('roomsList', roomsList);
  });

  // ルーム作成
  socket.on('createRoom', (roomData) => {
    const { name, description } = roomData;
    if (!name || name.trim() === '') {
      socket.emit('createRoomError', 'ルーム名を入力してください');
      return;
    }

    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const room = {
      id: roomId,
      name: name.trim(),
      description: description ? description.trim() : '',
      createdAt: new Date().toISOString(),
      members: []
    };

    rooms.set(roomId, room);
    
    // 全クライアントにルーム一覧を更新
    const roomsList = Array.from(rooms.values()).map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      createdAt: r.createdAt,
      memberCount: r.members.length
    }));
    io.emit('roomsList', roomsList);

    socket.emit('roomCreated', room);
    console.log(`ルームが作成されました: ${room.name} (${roomId})`);
  });

  // ルーム検索
  socket.on('searchRooms', (searchTerm) => {
    const searchLower = searchTerm.toLowerCase();
    const filteredRooms = Array.from(rooms.values())
      .filter(room => 
        room.name.toLowerCase().includes(searchLower) ||
        room.description.toLowerCase().includes(searchLower)
      )
      .map(room => ({
        id: room.id,
        name: room.name,
        description: room.description,
        createdAt: room.createdAt,
        memberCount: room.members.length
      }));
    socket.emit('roomsList', filteredRooms);
  });

  // ルーム入室
  socket.on('joinRoom', (data) => {
    const { roomId, nickname } = data;
    
    if (!roomId || !nickname) {
      socket.emit('joinRoomError', 'ルームIDとニックネームが必要です');
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('joinRoomError', 'ルームが見つかりません');
      return;
    }

    // ニックネームの重複チェック
    if (room.members.includes(nickname)) {
      socket.emit('joinRoomError', 'このニックネームは既に使用されています');
      return;
    }

    // Socket.ioのルームに参加
    socket.join(roomId);
    
    // メンバーリストに追加
    room.members.push(nickname);
    socket.roomId = roomId;
    socket.nickname = nickname;

    // ルーム情報を送信
    socket.emit('roomJoined', {
      room: {
        id: room.id,
        name: room.name,
        description: room.description,
        createdAt: room.createdAt
      },
      members: room.members
    });

    // ルーム内の全クライアントに通知
    io.to(roomId).emit('memberJoined', nickname);
    io.to(roomId).emit('membersUpdate', room.members);

    // ルーム一覧を更新
    const roomsList = Array.from(rooms.values()).map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      createdAt: r.createdAt,
      memberCount: r.members.length
    }));
    io.emit('roomsList', roomsList);

    console.log(`${nickname}がルーム「${room.name}」に入室しました。現在の在室人数: ${room.members.length}`);
  });

  // ルーム退室
  socket.on('leaveRoom', () => {
    if (socket.roomId && socket.nickname) {
      const room = rooms.get(socket.roomId);
      if (room) {
        const index = room.members.indexOf(socket.nickname);
        if (index > -1) {
          const nickname = socket.nickname;
          room.members.splice(index, 1);

          // ルーム内の全クライアントに通知
          io.to(socket.roomId).emit('memberLeft', nickname);
          io.to(socket.roomId).emit('membersUpdate', room.members);

          // ルーム一覧を更新
          const roomsList = Array.from(rooms.values()).map(r => ({
            id: r.id,
            name: r.name,
            description: r.description,
            createdAt: r.createdAt,
            memberCount: r.members.length
          }));
          io.emit('roomsList', roomsList);

          console.log(`${nickname}がルーム「${room.name}」から退室しました。現在の在室人数: ${room.members.length}`);

          // メンバーが0人になったらルームを削除
          if (room.members.length === 0) {
            rooms.delete(socket.roomId);
            io.emit('roomsList', Array.from(rooms.values()).map(r => ({
              id: r.id,
              name: r.name,
              description: r.description,
              createdAt: r.createdAt,
              memberCount: r.members.length
            })));
            console.log(`ルーム「${room.name}」が削除されました（メンバー0人）`);
          }
        }
      }
    }
  });

  // 切断処理
  socket.on('disconnect', () => {
    if (socket.roomId && socket.nickname) {
      const room = rooms.get(socket.roomId);
      if (room) {
        const index = room.members.indexOf(socket.nickname);
        if (index > -1) {
          const nickname = socket.nickname;
          room.members.splice(index, 1);

          // ルーム内の全クライアントに通知
          io.to(socket.roomId).emit('memberLeft', nickname);
          io.to(socket.roomId).emit('membersUpdate', room.members);

          // ルーム一覧を更新
          const roomsList = Array.from(rooms.values()).map(r => ({
            id: r.id,
            name: r.name,
            description: r.description,
            createdAt: r.createdAt,
            memberCount: r.members.length
          }));
          io.emit('roomsList', roomsList);

          console.log(`${nickname}が切断しました。現在の在室人数: ${room.members.length}`);

          // メンバーが0人になったらルームを削除
          if (room.members.length === 0) {
            rooms.delete(socket.roomId);
            io.emit('roomsList', Array.from(rooms.values()).map(r => ({
              id: r.id,
              name: r.name,
              description: r.description,
              createdAt: r.createdAt,
              memberCount: r.members.length
            })));
            console.log(`ルーム「${room.name}」が削除されました（メンバー0人）`);
          }
        }
      }
    }
    console.log('ユーザーが切断しました:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});

