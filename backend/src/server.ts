import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// 1. จำลองการตั้งค่า Server (เหมือนการตั้งค่า Apache/Nginx + Routing ในตัวเดียว)
const app = express();
app.use(cors()); // อนุญาตให้ Frontend ข้ามโดเมนมาดึงข้อมูลได้

const server = http.createServer(app);

// 2. ตั้งค่า Socket.io สำหรับ WebSockets
const io = new Server(server, {
  cors: {
    origin: "*", // ยอมรับการเชื่อมต่อจากทุกหน้าเว็บ (ซ้อมมือทำได้ แต่ของจริงต้องระบุโดเมน)
  }
});

// 3. กำหนด Interface (หน้าตาข้อมูลของหุ่นยนต์)
interface RobotState {
  id: string;
  status: "idle" | "moving" | "serving"; // ใช้ Literal Types ล็อคสเปค
  battery: number;
  position: { x: number; y: number };
}

// 4. สร้าง State เริ่มต้นของหุ่นยนต์จำลอง
let myRobot: RobotState = {
  id: "ROBOT-WEDDING-01",
  status: "idle",
  battery: 100,
  position: { x: 0, y: 0 }
};

// 5. เมื่อมี Frontend เชื่อมต่อเข้ามา (เปิดหน้าเว็บ)
io.on('connection', (socket) => {
  console.log(`[+] หน้าเว็บเชื่อมต่อสำเร็จ! รหัส: ${socket.id}`);

  // ส่งข้อมูลหุ่นยนต์ชุดแรกไปให้หน้าเว็บทันทีที่เชื่อมต่อ
  socket.emit('robotUpdate', myRobot);

  // สมมติว่าหน้าเว็บส่ง "คำอวยพร" เข้ามา
  socket.on('sendGreeting', (data) => {
    console.log(`[💌] ได้รับคำอวยพรใหม่:`, data);
    // ในอนาคตเราจะเอาคำอวยพรนี้ไปโชว์ที่หน้าจอหุ่นยนต์ หรือบันทึกลง Database
  });

  socket.on('disconnect', () => {
    console.log(`[-] หน้าเว็บตัดการเชื่อมต่อ: ${socket.id}`);
  });
});

// 6. วิญญาณหุ่นยนต์จำลอง (จำลองการทำงานทุกๆ 2 วินาที)
setInterval(() => {
  // สุ่มลดแบตเตอรี่ทีละนิด (ป้องกันแบตติดลบ)
  if (myRobot.battery > 0) {
    myRobot.battery = Math.max(0, myRobot.battery - Math.random() * 0.5);
  }

  // สุ่มเปลี่ยนตำแหน่ง X, Y เล็กน้อย (จำลองการเดิน)
  myRobot.position.x += (Math.random() - 0.5) * 5;
  myRobot.position.y += (Math.random() - 0.5) * 5;

  // เปลี่ยนสถานะถ้ากำลังเดิน
  myRobot.status = "moving";

  // ประกาศข้อมูลล่าสุดไปให้ "ทุกหน้าเว็บ" ที่เชื่อมต่ออยู่รู้!
  io.emit('robotUpdate', myRobot);
  
}, 2000); // 2000 มิลลิวินาที = 2 วินาที

// 7. สั่งให้ Server เริ่มทำงานที่ Port 3001
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 เซิร์ฟเวอร์เริ่มทำงานแล้วที่พอร์ต ${PORT}`);
});