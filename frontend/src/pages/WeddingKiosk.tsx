import { useState, useEffect } from 'react';
import GreetingForm from '../components/GreetingForm';
import type { Greeting } from '../types';
import socket from '../services/socket'; // 1. Import ท่อส่งข้อมูลเข้ามา

export default function WeddingKiosk() {
  const [greetings, setGreetings] = useState<Greeting[]>([]);

  useEffect(() => {
    // 2. ขอประวัติข้อความตอนเปิดหน้าเว็บครั้งแรก
    socket.on('greetingHistory', (data: Greeting[]) => {
      setGreetings(data);
    });

    // 3. รอรับข้อความใหม่ที่คนอื่นเพิ่งส่งมา
    socket.on('newGreeting', (newMsg: Greeting) => {
      // เอาข้อความใหม่ไปต่อท้ายข้อความเดิม
      setGreetings((prev) => [...prev, newMsg]);
    });

    // 4. Cleanup: ยกเลิกการฟังเมื่อเปลี่ยนไปหน้าอื่น (สำคัญมาก ป้องกันบั๊กข้อความเบิ้ล)
    return () => {
      socket.off('greetingHistory');
      socket.off('newGreeting');
    };
  }, []);

  const handleSendGreeting = (message: string) => {
    // 5. ส่งข้อความไปหา Backend
    socket.emit('sendGreeting', message);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-pink-500 mb-3">สมุดอวยพรดิจิทัล 💍</h1>
        <p className="text-slate-500">ฝากข้อความถึงบ่าวสาว ข้อความของคุณจะไปแสดงบนหน้าจอหุ่นยนต์</p>
      </div>

      <GreetingForm onSend={handleSendGreeting} />

      <div className="mt-12">
        <h3 className="text-xl font-bold text-slate-700 mb-6">ข้อความล่าสุด 💌</h3>
        <div className="space-y-4">
          {greetings.length === 0 ? <p className="text-slate-400 text-center">ยังไม่มีข้อความ เริ่มอวยพรเป็นคนแรกเลย!</p> : null}
          
          {/* ใช้ .slice().reverse() เพื่อให้ข้อความใหม่ล่าสุดอยู่ด้านบนสุด */}
          {greetings.slice().reverse().map((msg) => (
            <div key={msg.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-slate-700 text-lg">"{msg.message}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}