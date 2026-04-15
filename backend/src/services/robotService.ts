import { RobotState } from '../types';

// เก็บ State หุ่นยนต์ไว้ที่นี่
let robots: RobotState[] = [
  { id: "R1-NongMook", status: "idle", battery: 100, position: { x: 0, y: 0 } },
  { id: "R2-NongPloy", status: "idle", battery: 80, position: { x: 10, y: 10 } },
  { id: "R3-NongPetch", status: "idle", battery: 50, position: { x: -10, y: -10 } }
];

export const robotService = {
  // ฟังก์ชันขอข้อมูลหุ่นยนต์ล่าสุด
  getRobots(): RobotState[] {
    return robots;
  },

  // ฟังก์ชันคำนวณการเดิน (เรียกทุกๆ 2 วินาที)
  calculateNextMove(): RobotState[] {
    robots = robots.map(robot => {
      let newBattery = Math.max(0, robot.battery - Math.random() * 0.5);
      let newX = robot.position.x + (Math.random() - 0.5) * 5;
      let newY = robot.position.y + (Math.random() - 0.5) * 5;
      let newStatus: "idle" | "moving" = newBattery < 20 ? "idle" : "moving";

      return {
        ...robot,
        battery: newBattery,
        position: { x: newX, y: newY },
        status: newStatus
      };
    });

    return robots;
  }
};