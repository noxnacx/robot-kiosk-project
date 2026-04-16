import type { RobotState } from '../types';

interface RobotCardProps {
  robot: RobotState;
}

export default function RobotCard({ robot }: RobotCardProps) {
  // เช็คแบตเตอรี่เพื่อเปลี่ยนสีการ์ด
  const isLowBattery = robot.battery < 20;

  return (
    <div className={`p-5 rounded-2xl border-2 transition-all duration-300 shadow-sm ${
      isLowBattery 
        ? 'bg-red-50 border-red-200' 
        : 'bg-white border-blue-100 hover:border-blue-300 hover:shadow-md'
    }`}>
      
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-slate-700">{robot.id}</h4>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          robot.status === 'moving' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
        }`}>
          {robot.status === 'moving' ? '🚶‍♂️ กำลังเดิน' : '🛑 แบตหมด'}
        </span>
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>🔋 แบตเตอรี่:</span>
          <span className={`font-bold ${isLowBattery ? 'text-red-500' : 'text-slate-700'}`}>
            {robot.battery.toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span>📍 พิกัด GPS:</span>
          <span className="font-mono bg-slate-100 px-2 rounded">
            X: {robot.position.x.toFixed(0)} | Y: {robot.position.y.toFixed(0)}
          </span>
        </div>
      </div>
      
    </div>
  );
}