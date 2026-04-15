import prisma from '../config/database';

export const greetingService = {
  // ฟังก์ชันดึงประวัติทั้งหมด
  async getAllGreetings() {
    return await prisma.greeting.findMany({
      orderBy: { createdAt: 'asc' },
    });
  },

  // ฟังก์ชันบันทึกข้อความใหม่
  async saveGreeting(message: string) {
    return await prisma.greeting.create({
      data: { message },
    });
  }
};