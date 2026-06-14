"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send } from "lucide-react";

export default function LoginPage() {
  const [telegramId, setTelegramId] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Input ID, 2: Input OTP
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRequestOTP = async () => {
    if (!telegramId) return;
    setLoading(true);
    // Di dunia nyata, user akan membuka bot dan ketik /dashboard
    // Di sini kita simulasi atau arahkan user ke bot
    setMessage("✨ Yui sedang menyiapkan kode... Silakan buka Bot Telegram Yui dan ketik `/dashboard` untuk mendapatkan kode OTP!");
    setLoading(false);
    setStep(2);
  };

  const handleVerify = async () => {
    setLoading(true);
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, otp }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("yui_token", data.token);
      window.location.href = "/dashboard";
    } else {
      setMessage(`🥺 ${data.error}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-pink-200/50 p-8 w-full max-w-md text-center"
      >
        <div className="mb-6 relative inline-block">
          <div className="absolute inset-0 bg-pink-300 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <img src="/yui.png" alt="Yui" className="w-32 h-32 object-contain relative z-10 drop-shadow-lg" />
       3. **Halaman Dashboard: `app/dashboard/page.tsx`**
```tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const [airdrops, setAirdrops] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("yui_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    // Fetch data user dan airdrop (Nanti kita buat API ini)
    // Untuk demo, kita pakai data dummy yang mirip struktur bot kamu
    setTimeout(() => {
      setAirdrops([
        { nama: "ZKSync", deadline: "2024-12-01", status: "pending", skor: 9 },
        { nama: "LayerZero", deadline: "2024-11-15", status: "done", skor: 8 },
      ]);
      setUser({ name: "Hunter" });
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("yui_token");
    window.location.href = "/login";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-purple-600">Yui sedang menyiapkan data... 🌸</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* SIDEBAR */}
        <motion.aside 
          initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-1 bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/70 shadow-xl shadow-purple-100/50 h-fit"
        >
          <div className="text-center mb-6">
            <img src="/yui.png" alt="Yui" className="w-28 h-28 mx-auto mb-4 drop-shadow-md" />
            <h2 className="text-2xl font-bold text-purple-700">Yui 🌸</h2>
            <p className="text-sm text-gray-500 italic">"Semangat berburu airdrop, {user?.name}-kun!"</p>
            <button onClick={handleLogout} className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition text-sm font-medium">
              <LogOut size={16} /> Keluar
            </button>
            <div className="mt-6 text-left bg-purple-50 p-4 rounded-2xl border border-purple-100">
              <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-2">Statistik</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Total</span>
                <span className="font-bold text-purple-700">{airdrops.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Claimed</span>
                <span className="font-bold text-green-600">{airdrops.filter(a => a.status === 'done' || a.status === 'claim').length}</span>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* MAIN CONTENT */}
        <main className="lg:col-span-3 space-y-6">
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/70 shadow-lg"
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard Airdrop</h1>
            <p className="text-gray-500 text-sm">Kelola semua target airdrop kamu di satu tempat~ ✨</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {airdrops.map((a, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + (idx * 0.1) }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/80 shadow-md hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition">{a.nama}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar size={14} />
                      <span>{a.deadline ? new Date(a.deadline).toLocaleDateString('id-ID') : 'No Deadline'}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    a.status === 'done' ? 'bg-green-100 text-green-700' :
                    a.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {a.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-gray-500">Skor Potensi:</span>
                    <span className="text-sm font-bold text-purple-600">{a.skor}/10</span>
                  </div>
                  <button className="text-xs bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-200">
                    Lihat Detail
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}