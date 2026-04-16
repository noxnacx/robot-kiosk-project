import { useState, useEffect } from 'react';
import RobotCard from '../components/RobotCard';
import type { RobotState } from '../types';
import socket from '../services/socket'; // 1. Import ท่อส่งข้อมูล

export default function AdminDashboard() {
  const [robots, setRobots] = useState<RobotState[]>([]);

  useEffect(() => {
    // 2. ดักฟังข้อมูลหุ่นยนต์ที่ Backend ยิงมาให้ทุกๆ 2 วินาที
    socket.on('robotsUpdate', (data: RobotState[]) => {
      setRobots(data);
    });

    // Cleanup ถอดปลั๊กเมื่อย้ายหน้า
    return () => {
      socket.off('robotsUpdate');
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">ศูนย์ควบคุมหุ่นยนต์ 🤖</h1>
          <p className="text-slate-500 mt-2">สถานะการทำงานแบบ Real-time</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
          <span className="text-sm font-semibold text-slate-600">สถานะเซิร์ฟเวอร์: </span>
          {/* เช็คว่ามีหุ่นยนต์ไหม ถ้าไม่มีแปลว่ากำลังเชื่อมต่อหรือ Backend ปิดอยู่ */}
          <span className={`text-lg font-bold ${robots.length > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {robots.length > 0 ? '🟢 เชื่อมต่อแล้ว' : '🔴 รอสัญญาณ...'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {robots.length === 0 ? (
          <p className="text-slate-500 col-span-full text-center py-10">กำลังค้นหาสัญญาณหุ่นยนต์...</p>
        ) : (
          robots.map(robot => (
            <RobotCard key={robot.id} robot={robot} />
          ))
        )}
      </div>
    </div>
  );
}