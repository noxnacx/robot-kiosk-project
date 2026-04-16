import { io } from 'socket.io-client';

// สร้างการเชื่อมต่อแค่ 1 ครั้ง (Singleton)
const socket = io('http://localhost:3001');

export default socket;