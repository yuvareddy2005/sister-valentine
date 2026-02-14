import React, { useState, useEffect } from 'react';
import { X, Sparkles, Moon, ArrowLeft } from 'lucide-react';

const MEMORIES = [
  "Even 8,400 miles away, you're still my favorite person to talk to at 2 AM.",
  "Missing our random roaming sessions in Chennai...",
  "I still haven't found a burger or sandwich as good as the ones you used to make.",
  "Thank you for always being my emergency fund. I promise that 25 LPA package is coming soon to pay you back! 😉",
  "It's been a year since you left for the US, but it still feels weird not having you around.",
  "Remembering all the times we just sat and talked about everything and nothing.",
  "Open this jar whenever you miss home. I'm always just a text away."
];

const MemoryJar = ({ onClose }) => {
  const [fireflies, setFireflies] = useState([]);
  const [openedMemory, setOpenedMemory] = useState(null);
  const [typedText, setTypedText] = useState("");

  // 1. Generate random fireflies on load
  useEffect(() => {
    const flies = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 2}s`
    }));
    setFireflies(flies);
  }, []);

  // 2. The Typewriter Effect Logic
  useEffect(() => {
    if (!openedMemory) {
      setTypedText("");
      return;
    }

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < openedMemory.length) {
        setTypedText(openedMemory.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 45); // Speed of the typing (45ms per character)

    return () => clearInterval(typingInterval);
  }, [openedMemory]);

  const catchMemory = () => {
    if (openedMemory) return; // Prevent clicking if a memory is already open
    
    // Pick a random memory
    const newMemory = MEMORIES[Math.floor(Math.random() * MEMORIES.length)];
    setOpenedMemory(newMemory);
  };

  const putMemoryBack = (e) => {
    e.stopPropagation();
    setOpenedMemory(null);
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 overflow-hidden perspective-1000">
      
      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
        }
        @keyframes floatCard {
          0% { transform: translateY(40px) scale(0.9); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .firefly {
          position: absolute;
          width: 4px;
          height: 4px;
          background-color: #fef08a;
          border-radius: 50%;
          box-shadow: 0 0 10px 2px #fef08a, 0 0 20px #eab308;
          animation: float infinite ease-in-out;
        }
        .memory-card {
          animation: floatCard 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>

      {/* Top Close Button */}
      <button 
        onClick={onClose} 
        className={`absolute top-6 right-6 transition duration-500 z-[60] ${openedMemory ? 'text-gray-700 opacity-0 pointer-events-none' : 'text-gray-500 hover:text-white opacity-100'}`}
      >
        <X className="w-8 h-8" />
      </button>

      {/* Header Text (Fades out when a memory is open) */}
      <div className={`text-center mb-12 flex flex-col items-center transition-all duration-700 ${openedMemory ? 'opacity-0 translate-y-[-20px]' : 'opacity-100 translate-y-0'}`}>
        <Moon className="w-8 h-8 text-indigo-400 mb-4" />
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300 tracking-wider">
          The 2 AM Jar
        </h2>
        <p className="text-indigo-200/50 mt-2 text-sm">For when you can't sleep in the US.</p>
      </div>

      {/* The Jar Container */}
      <div className="relative">
        {/* The Glowing Jar */}
        <div 
          onClick={catchMemory}
          className={`relative w-64 h-80 rounded-[40px] border-2 border-indigo-500/30 bg-gradient-to-b from-indigo-900/20 to-indigo-500/10 backdrop-blur-md cursor-pointer transition-all duration-700 overflow-hidden group 
            ${openedMemory ? 'scale-75 opacity-20 blur-sm pointer-events-none' : 'scale-100 opacity-100 hover:scale-105 shadow-[0_0_50px_rgba(79,70,229,0.15)] hover:shadow-[0_0_80px_rgba(79,70,229,0.3)] hover:border-indigo-400/50'}`}
        >
          {/* Jar Lid */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-indigo-950/80 border-b border-indigo-500/50 rounded-b-xl z-20"></div>

          {/* Fireflies inside the jar */}
          <div className="absolute inset-0 z-0">
            {fireflies.map((fly) => (
              <div 
                key={fly.id} 
                className="firefly"
                style={{ left: fly.left, top: fly.top, animationDuration: fly.animationDuration, animationDelay: fly.animationDelay }}
              />
            ))}
          </div>
          
          <Sparkles className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-yellow-200/50 transition-all duration-500 z-20 ${openedMemory ? 'opacity-0' : 'group-hover:text-yellow-200 group-hover:scale-110'}`} />
        </div>

        {/* --- THE SPECIAL REVEAL: FLOATING MEMORY CARD --- */}
        {openedMemory && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] memory-card z-100">
            <div className="bg-[#0f1225]/80 backdrop-blur-xl border border-indigo-400/30 p-8 rounded-3xl shadow-[0_0_60px_rgba(99,102,241,0.2)]">
              <Sparkles className="w-6 h-6 text-yellow-300 mx-auto mb-6 animate-pulse" />
              
              <div className="min-h-[140px] flex items-center justify-center">
                <p className="text-lg text-indigo-50 font-medium leading-relaxed text-center">
                  "{typedText}"
                  <span className="animate-pulse text-indigo-400 ml-1">|</span>
                </p>
              </div>

              <button 
                onClick={putMemoryBack} 
                className="mt-6 w-full py-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-200 hover:text-white transition-all flex items-center justify-center gap-2 text-sm tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" /> Put Memory Back
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default MemoryJar;