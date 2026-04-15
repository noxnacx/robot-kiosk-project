import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// ลบ @ts-ignore และ Option ทุกอย่างทิ้งไปเลยครับ!
const prisma = new PrismaClient();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

interface RobotState {
  id: string;
  status: "idle" | "moving" | "serving";
  battery: number;
  position: { x: number; y: number };
}

// 3. เปลี่ยนจากตัวแปรเดียว เป็น Array ของหุ่นยนต์ (มีหุ่น 3 ตัว)
let robots: RobotState[] = [
  { id: "R1-NongMook", status: "idle", battery: 100, position: { x: 0, y: 0 } },
  { id: "R2-NongPloy", status: "idle", battery: 80, position: { x: 10, y: 10 } },
  { id: "R3-NongPetch", status: "idle", battery: 50, position: { x: -10, y: -10 } }
];

io.on('connection', async (socket) => {
  console.log(`[+] หน้าเว็บเชื่อมต่อ: ${socket.id}`);

  // 4. ส่งข้อมูลหุ่นยนต์ "ทั้งหมด" ไปให้หน้าเว็บ
  socket.emit('robotsUpdate', robots);

  // 5. ดึงประวัติคำอวยพรจาก Database (ใช้ async/await เพราะต้องรอฐานข้อมูล)
  // เทียบเท่ากับ: SELECT * FROM Greeting ORDER BY createdAt ASC
  const pastGreetings = await prisma.greeting.findMany({
    orderBy: { createdAt: 'asc' }
  });
  socket.emit('greetingHistory', pastGreetings);

  // 6. เมื่อมีคำอวยพรใหม่ส่งมาจากหน้าเว็บ
  socket.on('sendGreeting', async (text: string) => {
    console.log(`[💌] ได้รับคำอวยพรใหม่: ${text}`);

    // 🔥 บันทึกลง Database ทันที! (เทียบเท่ากับ INSERT INTO)
    const newGreeting = await prisma.greeting.create({
      data: { message: text }
    });

    // ส่งคำอวยพรที่เพิ่งเซฟเสร็จ ไปให้ "ทุกหน้าจอ" ที่เปิดอยู่
    io.emit('newGreeting', newGreeting);
  });

  socket.on('disconnect', () => {
    console.log(`[-] หน้าเว็บตัดการเชื่อมต่อ: ${socket.id}`);
  });
});

// 7. จำลองการเดินของหุ่นยนต์ทั้ง 3 ตัวพร้อมกัน
setInterval(() => {
  // ใช้ .map() เพื่อวนลูปสร้างข้อมูลหุ่นยนต์ตัวใหม่ขึ้นมาแทนที่ตัวเดิม
  robots = robots.map(robot => {
    // สุ่มลดแบต
    let newBattery = Math.max(0, robot.battery - Math.random() * 0.5);
    
    // สุ่มการเดิน
    let newX = robot.position.x + (Math.random() - 0.5) * 5;
    let newY = robot.position.y + (Math.random() - 0.5) * 5;

    // ถ้าแบตเหลือน้อยกว่า 20% ให้หยุดเดิน
    let newStatus: "idle" | "moving" = newBattery < 20 ? "idle" : "moving";

    // คืนค่า Object หุ่นยนต์ตัวที่อัปเดตแล้ว
    return {
      ...robot,
      battery: newBattery,
      position: { x: newX, y: newY },
      status: newStatus
    };
  });

  // ประกาศข้อมูลหุ่นยนต์ทั้งฝูง!
  io.emit('robotsUpdate', robots);
}, 2000);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 เซิร์ฟเวอร์ (Multi-Robot + Database) ทำงานแล้วที่พอร์ต ${PORT}`);
});