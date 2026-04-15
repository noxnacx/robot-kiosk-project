import { Server, Socket } from 'socket.io';
import { robotService } from '../services/robotService';
import { greetingService } from '../services/greetingService';

// สร้างฟังก์ชันหลักรับ Parameter เป็น io
export function setupSockets(io: Server) {
  
  // 1. เมื่อมีคนเปิดหน้าเว็บ
  io.on('connection', async (socket: Socket) => {
    console.log(`[+] หน้าเว็บเชื่อมต่อ: ${socket.id}`);

    // ไปเรียก Service ขอข้อมูลหุ่นยนต์ แล้วส่งกลับไป
    socket.emit('robotsUpdate', robotService.getRobots());

    // ไปเรียก Service ดึงประวัติคำอวยพร แล้วส่งกลับไป
    const pastGreetings = await greetingService.getAllGreetings();
    socket.emit('greetingHistory', pastGreetings);

    // 2. เมื่อได้รับคำอวยพรใหม่จากหน้าเว็บ
    socket.on('sendGreeting', async (text: string) => {
      console.log(`[💌] ได้รับคำอวยพรใหม่: ${text}`);
      
      // ให้ Service เอาไปเซฟลง Database
      const newGreeting = await greetingService.saveGreeting(text);
      
      // ส่งคำอวยพรที่เซฟเสร็จแล้ว ไปให้ทุกคนที่เปิดหน้าเว็บอยู่
      io.emit('newGreeting', newGreeting);
    });

    socket.on('disconnect', () => {
      console.log(`[-] หน้าเว็บตัดการเชื่อมต่อ: ${socket.id}`);
    });
  });

  // 3. จำลองการเดินของหุ่นยนต์ (ย้ายมาไว้ที่นี่ เพราะต้องคอย emit บอกหน้าเว็บ)
  setInterval(() => {
    // ให้ Service คำนวณตำแหน่งใหม่
    const updatedRobots = robotService.calculateNextMove();
    
    // ประกาศบอกทุกหน้าเว็บ
    io.emit('robotsUpdate', updatedRobots);
  }, 2000);
}