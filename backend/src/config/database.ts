import { PrismaClient } from '@prisma/client';

// สร้าง instance แค่ตัวเดียว แล้วให้ไฟล์อื่นดึงไปใช้
const prisma = new PrismaClient();

export default prisma;