import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupSockets } from './sockets/socketHandler'; // Import ตัวจัดการ Socket เข้ามา

// 1. ตั้งค่าพื้นฐาน
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// 2. ประกอบร่าง! โยน io เข้าไปให้ socketHandler จัดการต่อ
setupSockets(io);

// 3. สตาร์ทเซิร์ฟเวอร์
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 เซิร์ฟเวอร์ทำงานแล้วที่พอร์ต ${PORT} (แบบ Clean Architecture ✨)`);
});