export interface RobotState {
  id: string;
  status: "idle" | "moving" | "serving";
  battery: number;
  position: { x: number; y: number };
}

// ใน Prisma เราไม่ต้องสร้าง Type ให้ Greeting ก็ได้ครับ 
// เพราะ Prisma สร้าง Type รอไว้ให้เราแล้ว (จะใช้ตอนเขียน Service)