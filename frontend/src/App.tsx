import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// 1. กำหนด Interface (หน้าตาข้อมูลให้ตรงกับที่ Backend ส่งมา)
interface RobotState {
  id: string;
  status: "idle" | "moving" | "serving";
  battery: number;
  position: { x: number; y: number };
}

// 2. เชื่อมต่อไปยัง Backend (WebSockets)
const socket = io('http://localhost:3001');

function App() {
  // 3. ใช้ useState แบบ Generic <T> เพื่อบอกว่าตัวแปรนี้คือข้อมูลหุ่นยนต์
  // ตอนเริ่มต้นให้เป็น null ไปก่อน เพราะรอเน็ตเวิร์คเชื่อมต่อ
  const [robot, setRobot] = useState<RobotState | null>(null);
  
  // Array State สำหรับเก็บคำอวยพร
  const [greetings, setGreetings] = useState<string[]>([]);
  
  // State ธรรมดาสำหรับเก็บข้อความในช่องพิมพ์
  const [inputText, setInputText] = useState<string>("");

  // 4. useEffect: โค้ดในนี้จะทำงาน "ครั้งแรกครั้งเดียว" ตอนเปิดหน้าเว็บ
  useEffect(() => {
    // ดักฟังหัวข้อ 'robotUpdate' จาก Backend
    socket.on('robotUpdate', (data: RobotState) => {
      // เอาข้อมูลใหม่มาทับ State เดิม (หน้าจอจะอัปเดตอัตโนมัติ)
      setRobot(data); 
    });

    // คืนค่า (Cleanup) ยกเลิกการฟังเมื่อปิดหน้าเว็บ
    return () => {
      socket.off('robotUpdate');
    };
  }, []); // วงเล็บเหลี่ยมว่างๆ [] ตรงนี้บอก React ว่าให้รัน useEffect แค่ตอนโหลดหน้าเว็บครั้งแรก

  // 5. ฟังก์ชันทำงานเมื่อกดปุ่ม "ส่งคำอวยพร"
  const sendGreeting = () => {
    if (inputText.trim() === "") return; // ถ้าไม่ได้พิมพ์อะไรมา ไม่ต้องทำอะไร

    // ส่งข้อความไปหา Backend
    socket.emit('sendGreeting', inputText);

    // ✨ ตรงนี้คือการใช้ Spread Operator (...) กับ Array State ที่เราคุยกันครับ!
    // เอาคำอวยพรเก่ามากางออก แล้วต่อท้ายด้วยคำอวยพรใหม่
    setGreetings([...greetings, inputText]);
    
    setInputText(""); // เคลียร์ช่องพิมพ์ให้ว่าง
  };

  // 6. ส่วนแสดงผล UI (เขียนด้วย JSX - คือ HTML ที่แทรก JavaScript ได้)
  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🤖 Kiosk อวยพรงานแต่ง (จำลอง)</h2>

      {/* เงื่อนไข: ถ้า robot ยังเป็น null (ยังไม่ได้รับข้อมูล) ให้โชว์คำว่ากำลังเชื่อมต่อ */}
      {!robot ? (
        <p>กำลังเชื่อมต่อสัญญาณกับหุ่นยนต์...</p>
      ) : (
        // ถ้ามีข้อมูลแล้ว ให้แสดงหน้าต่างข้อมูล
        <div style={{ border: '2px solid #2196f3', padding: '20px', borderRadius: '10px', backgroundColor: '#e3f2fd' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>รหัสประจำตัว: {robot.id}</h3>
          
          {/* ใช้ Type Guard อัตโนมัติ: TS รู้ว่า battery เป็นตัวเลข เลยยอมให้เรียกใช้ .toFixed() ได้ */}
          <p>🔋 แบตเตอรี่: <b>{robot.battery.toFixed(1)} %</b></p>
          <p>🚥 สถานะ: <b>{robot.status === 'moving' ? 'กำลังเคลื่อนที่ 🚶‍♂️' : 'สแตนด์บาย 🛑'}</b></p>
          <p>📍 พิกัด GPS จำลอง: X: {robot.position.x.toFixed(0)} | Y: {robot.position.y.toFixed(0)}</p>
        </div>
      )}

      <hr style={{ margin: '30px 0' }}/>

      <h3>💌 ฝากข้อความถึงบ่าวสาว</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)} // อัปเดต state เมื่อมีการพิมพ์
          placeholder="พิมพ์คำอวยพรตรงนี้..."
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
        <h4>ข้อความบนหน้าจอหุ่นยนต์ ({greetings.length} ข้อความ):</h4>
        <ul style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', listStyleType: 'none' }}>
          {/* การวนลูป Array ใน React (คล้าย foreach ใน PHP) */}
          {greetings.length === 0 ? <p style={{ color: '#888' }}>ยังไม่มีข้อความ</p> : null}
          
          {greetings.map((text, index) => (
            <li key={index} style={{ padding: '8px 0', borderBottom: '1px solid #ddd' }}>
              💬 "{text}"
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default App;