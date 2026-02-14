import React, { useState, useEffect, useRef } from 'react';
import { Heart, Plane, Utensils, Moon, Wallet, X, PieChart, ArrowDownCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import PlinkoGame from './PlinkoGame';
import MemoryJar from './MemoryJar';
import VirtualHug from './VirtualHug';
import ConnectionPortal from './ConnectionPortal';

// --- MAIN APP COMPONENT ---
function App() {
  const [showGame, setShowGame] = useState(false);
  const [showJar, setShowJar] = useState(false);
  const [showHug, setShowHug] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const triggerHug = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      // Fires from left edge
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ec4899', '#f472b6', '#e879f9'] });
      // Fires from right edge
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ec4899', '#f472b6', '#e879f9'] });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // Time Logic
  const [timeIndia, setTimeIndia] = useState(new Date());
  const [timeUS, setTimeUS] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeIndia(now);
      // Assuming US Pacific Time (adjust offset as needed, e.g., -8 for PST or -5 for EST)
      // Or just use 'en-US' locale string method
      const usDate = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" })); 
      setTimeUS(usDate);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white font-sans overflow-hidden">
      
      {/* HEADER */}
      <header className="p-6 flex justify-between items-center bg-black/20 backdrop-blur-sm">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          Happy V-Day Sis ❤️
        </h1>
        <div className="flex gap-4 text-xs font-mono text-gray-300">
          <div className="text-right">
            <p className="text-purple-300">INDIA</p>
            <p>{formatTime(timeIndia)}</p>
          </div>
          <div className="w-px bg-gray-600 h-8"></div>
          <div>
            <p className="text-pink-300">USA</p>
            <p>{formatTime(timeUS)}</p>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-md mx-auto p-6 flex flex-col gap-6">
        
        {/* HERO CARD */}
          {/* HERO CARD */}
<div 
  onClick={() => setShowPortal(true)}
  className="bg-white/10 p-6 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md text-center relative overflow-hidden cursor-pointer hover:bg-white/15 hover:scale-[1.02] transition-all duration-300"
>
          <div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-pink-500"></div>
          <Plane className="w-12 h-12 mx-auto text-blue-300 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold mb-2">8,400 Miles Apart</h2>
          <p className="text-gray-300 text-sm">
            But still the closest weirdos on the planet. <br/>
            Missing our roaming sessions and your burgers! 🍔
          </p>
        </div>

        {/* INTERACTIVE GRID */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* CARD 1: MIDNIGHT CHAT */}
<div 
  onClick={() => setShowJar(true)}
  className="bg-indigo-900/40 p-5 rounded-2xl border border-indigo-500/30 hover:bg-indigo-900/60 transition cursor-pointer group"
>
  <Moon className="w-8 h-8 text-yellow-300 mb-3 group-hover:scale-110 transition" />
  <h3 className="font-semibold text-sm mb-1">2 AM Buddy</h3>
  <p className="text-xs text-indigo-200">For when you can't sleep in US.</p>
</div>

          {/* CARD 2: VIRTUAL HUG */}
          <div 
            onClick={() => setShowHug(true)}
            className="bg-pink-900/30 p-5 rounded-2xl border border-pink-500/30 hover:bg-pink-900/50 hover:border-pink-400 transition cursor-pointer group"
          >
            <Heart className="w-8 h-8 text-pink-400 mb-3 group-hover:scale-125 group-hover:text-pink-300 transition-all duration-300" />
            <h3 className="font-semibold text-sm mb-1 text-pink-50">8,400 Mile Hug</h3>
            <p className="text-xs text-pink-200/70">Incoming long-distance attack.</p>
          </div>

          {/* CARD 3: THE BANK (GAME TRIGGER) */}
          <div 
            onClick={() => setShowGame(true)}
            className="col-span-2 bg-gradient-to-r from-green-900/50 to-emerald-900/50 p-6 rounded-2xl border border-green-500/30 hover:border-green-400 cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute right-[-20px] top-[-20px] bg-green-500 w-20 h-20 rounded-full blur-2xl opacity-20"></div>
            <div className="flex items-center gap-4">
              <div className="bg-green-500/20 p-3 rounded-full">
                <Wallet className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Sister's Bank & Trust</h3>
                <p className="text-xs text-green-200 group-hover:text-white transition">
                  Status: <span className="font-mono bg-green-900 px-1 rounded">ACTIVE INVESTOR</span>
                </p>
                <p className="text-[10px] text-gray-400 mt-1">Click to view funding status...</p>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">Made with ❤️ by your brother • Chennai 2026</p>
        </div>

      </main>

      {showGame && <PlinkoGame onClose={() => setShowGame(false)} />}
      {showJar && <MemoryJar onClose={() => setShowJar(false)} />}
      {showHug && <VirtualHug onClose={() => setShowHug(false)} />}
      {showPortal && <ConnectionPortal onClose={() => setShowPortal(false)} />}
    </div>
  );
}

export default App;