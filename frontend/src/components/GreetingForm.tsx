import { useState } from 'react';

interface GreetingFormProps {
  // รับฟังก์ชัน onSend มาจากหน้าจอหลัก เพื่อเอาไว้ส่งข้อความกลับไป
  onSend: (message: string) => void;
}

export default function GreetingForm({ onSend }: GreetingFormProps) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรชตอนกด Enter
    if (inputText.trim() === "") return;
    
    onSend(inputText); // ส่งข้อความออกไปให้หน้าจอหลักจัดการต่อ
    setInputText("");  // เคลียร์ช่องพิมพ์
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mt-6">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="พิมพ์คำอวยพรให้บ่าวสาวที่นี่..."
        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-sm"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm"
      >
        ส่งข้อความ 💌
      </button>
    </form>
  );
}