import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// 1. เพิ่มและปรับ Interface ให้ตรงกับโครงสร้างที่เราส่งมาจาก Backend
interface RobotState {
  id: string;
  status: "idle" | "moving" | "serving";
  battery: number;
  position: { x: number; y: number };
}

interface Greeting {
  id: number;
  message: string;
}

const socket = io('http://localhost:3001');

function App() {
  // 2. เปลี่ยน State หุ่นยนต์จาก "ตัวเดียว" เป็น "Array (ฝูงหุ่นยนต์)"
  const [robots, setRobots] = useState<RobotState[]>([]);
  
  // State คำอวยพร เปลี่ยนมารับเป็น Array of Objects แทน String ธรรมดา
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [inputText, setInputText] = useState<string>("");

  useEffect(() => {
    // ดักฟังหัวข้อใหม่ 'robotsUpdate' (รับหุ่นยนต์มาทั้งฝูง)
    socket.on('robotsUpdate', (data: RobotState[]) => {
      setRobots(data);
    });

    // โหลดประวัติคำอวยพรจาก Database ตอนเปิดหน้าเว็บครั้งแรก
    socket.on('greetingHistory', (data: Greeting[]) => {
      setGreetings(data);
    });

    // เมื่อมีคนพิมพ์อวยพรใหม่เข้ามา (จากหน้าจอไหนก็ตาม)
    socket.on('newGreeting', (newMsg: Greeting) => {
      // 🌟 ท่าพิเศษ: ใช้ Callback ใน setState 
      // เป็นการบอกว่า "เอา Array เดิมล่าสุด (prev) มาแตกออก แล้วต่อท้ายด้วยของใหม่"
      setGreetings((prevGreetings) => [...prevGreetings, newMsg]);
    });

    return () => {
      socket.off('robotsUpdate');
      socket.off('greetingHistory');
      socket.off('newGreeting');
    };
  }, []);

  const sendGreeting = () => {
    if (inputText.trim() === "") return;
    
    // ส่งข้อความไปให้ Backend จัดการเซฟลง Database
    socket.emit('sendGreeting', inputText);
    
    // 💡 ข้อสังเกต: เราไม่ต้อง setGreetings เองตรงนี้แล้ว!
    // เพราะเดี๋ยว Backend เซฟสำเร็จ มันจะยิง event 'newGreeting' กลับมาให้ทุกหน้าจอพร้อมกันเอง
    setInputText("");
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🤖 แดชบอร์ดควบคุมหุ่นยนต์งานแต่ง</h2>

      {/* 3. การแสดงผลหุ่นยนต์แบบหลายตัวโดยใช้ .map() (เหมือน foreach) */}
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        {robots.length === 0 ? <p>กำลังค้นหาหุ่นยนต์...</p> : null}
        
        {robots.map((robot) => (
          // ต้องใส่ key เสมอเวลาใช้ map ใน React เพื่อให้มันอัปเดต UI ได้เร็วขึ้น
          <div key={robot.id} style={{ 
            border: '2px solid #2196f3', 
            padding: '15px', 
            borderRadius: '10px', 
            // ถ้าแบตน้อยกว่า 20 ให้เปลี่ยนพื้นหลังเป็นสีแดงอ่อนแจ้งเตือน
            backgroundColor: robot.battery < 20 ? '#ffebee' : '#e3f2fd', 
            flex: '1 1 200px' 
          }}>
            <h4 style={{ margin: '0 0 10px 0' }}>{robot.id}</h4>
            <p>🔋 แบต: <b>{robot.battery.toFixed(1)}%</b></p>
            <p>🚥 สถานะ: <b>{robot.status === 'moving' ? 'เดิน 🚶‍♂️' : 'แบตหมด 🛑'}</b></p>
            <p>📍 X: {robot.position.x.toFixed(0)} | Y: {robot.position.y.toFixed(0)}</p>
          </div>
        ))}
      </div>

      <hr style={{ margin: '30px 0' }}/>

      <h3>💌 สมุดอวยพร (บันทึกลง Database แล้ว)</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="พิมพ์คำอวยพร..."
          style={{ padding: '10px', flex: 1, fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button
          onClick={sendGreeting}
          style={{ padding: '10px 20px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
        >
          ส่งข้อความ
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>ข้อความทั้งหมด ({greetings.length} ข้อความ):</h4>
        <ul style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', listStyleType: 'none' }}>
          {greetings.length === 0 ? <p style={{ color: '#888' }}>ยังไม่มีข้อความ</p> : null}
          
          {/* แสดงประวัติคำอวยพร */}
          {greetings.map((msg) => (
            <li key={msg.id} style={{ padding: '8px 0', borderBottom: '1px solid #ddd' }}>
              💬 "{msg.message}"
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;