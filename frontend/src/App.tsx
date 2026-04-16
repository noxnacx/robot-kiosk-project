import { Routes, Route, Link, useLocation } from 'react-router-dom';
import WeddingKiosk from './pages/WeddingKiosk';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const location = useLocation(); // เอาไว้เช็คว่าตอนนี้อยู่หน้าไหน จะได้ทำสีปุ่มให้ถูกต้อง

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Navbar สวยๆ */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-center gap-8">
          <Link 
            to="/" 
            className={`font-bold transition-colors ${location.pathname === '/' ? 'text-pink-500 border-b-2 border-pink-500 pb-1' : 'text-slate-400 hover:text-slate-600'}`}
          >
            📱 หน้า Kiosk
          </Link>
          <Link 
            to="/admin" 
            className={`font-bold transition-colors ${location.pathname === '/admin' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-slate-400 hover:text-slate-600'}`}
          >
            💻 Admin Dashboard
          </Link>
        </div>
      </nav>

      <main className="p-8">
        <Routes>
          <Route path="/" element={<WeddingKiosk />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

    </div>
  );
}

export default App;