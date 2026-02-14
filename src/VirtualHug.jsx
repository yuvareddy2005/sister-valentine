import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

const VirtualHug = ({ onClose }) => {
  const [charge, setCharge] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef(null);

  const startCharging = () => {
    if (isComplete) return;
    setIsCharging(true);
    timerRef.current = setInterval(() => {
      setCharge((prev) => {
        if (prev >= 100) {
          clearInterval(timerRef.current);
          handleSuccess();
          return 100;
        }
        return prev + 2; 
      });
    }, 40); // Slightly faster charging for better feel
  };

  const stopCharging = () => {
    setIsCharging(false);
    clearInterval(timerRef.current);
    if (!isComplete) {
      setCharge(0); 
    }
  };

  const handleSuccess = () => {
    setIsComplete(true);
    setIsCharging(false);
    
    // 1. Fire Side Cannons
    const count = 200;
    const defaults = { origin: { y: 0.8 }, colors: ['#ec4899', '#f472b6', '#ffffff'] };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, origin: { x: 0 } }); // Left cannon
    fire(0.25, { spread: 26, startVelocity: 55, origin: { x: 1 } }); // Right cannon
    fire(0.2, { spread: 60, origin: { x: 0.5 } }); // Center burst
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-1000 ${isComplete ? 'bg-pink-950/40' : 'bg-black/95'}`}>
      
      {/* Background Floating Hearts CSS */}
      {isComplete && (
        <style>{`
          @keyframes heartFloat {
            0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translateY(-20vh) scale(1.2); opacity: 0; }
          }
          .floating-heart {
            position: absolute;
            bottom: -50px;
            animation: heartFloat linear infinite;
            color: #f472b6;
            pointer-events: none;
          }
        `}</style>
      )}

      {/* Close Button */}
      <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition z-[100]">
        <X className="w-8 h-8" />
      </button>

      {!isComplete ? (
        <div className="text-center animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-pink-300 mb-2">The Long-Distance Hug</h2>
          <p className="text-pink-200/50 text-sm mb-12 px-8">
            Hold the heart to charge up a hug and send it 8,400 miles away...
          </p>

          <div className="relative flex items-center justify-center scale-90 sm:scale-100">
            {/* The Charging Ring */}
            <svg className="w-64 h-64 -rotate-90 drop-shadow-[0_0_15px_rgba(236,72,153,0.2)]">
              <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
              <circle
                cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent"
                strokeDasharray={754} strokeDashoffset={754 - (754 * charge) / 100}
                className="text-pink-500 transition-all duration-100 ease-linear"
              />
            </svg>

            {/* The Interactive Heart */}
            <button
              onMouseDown={startCharging} onMouseUp={stopCharging} onMouseLeave={stopCharging}
              onTouchStart={startCharging} onTouchEnd={stopCharging}
              className={`absolute w-44 h-44 rounded-full flex flex-col items-center justify-center transition-all duration-300 active:scale-95
                ${isCharging ? 'bg-pink-500/20 shadow-[0_0_60px_rgba(236,72,153,0.5)]' : 'bg-white/5'}
              `}
            >
              <Heart className={`w-16 h-16 transition-all duration-300 ${isCharging ? 'text-pink-400 fill-pink-400 scale-110' : 'text-pink-500'}`} />
              <span className="text-[10px] uppercase tracking-widest text-pink-300/60 mt-2">{isCharging ? 'Sending...' : 'Hold Me'}</span>
            </button>
          </div>
          
          <div className="mt-12 text-pink-400/80 font-mono text-lg tabular-nums">
            {charge}% Transferred
          </div>
        </div>
      ) : (
        /* --- THE UPGRADED SUCCESS POPUP --- */
        <div className="relative z-50 w-full max-w-sm animate-in zoom-in fade-in duration-700">
          {/* Decorative Elements */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="floating-heart" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 3}s`,
                animationDelay: `${Math.random() * 5}s`,
                fontSize: `${Math.random() * 20 + 10}px`
              }}
            >
              ❤️
            </div>
          ))}

          <div className="bg-[#1a1c2e]/90 backdrop-blur-2xl border border-pink-500/30 p-10 rounded-[40px] shadow-[0_0_100px_rgba(236,72,153,0.3)] text-center relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-pink-500 p-4 rounded-full shadow-lg shadow-pink-500/50">
              <Send className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-3xl font-bold text-white mt-4 mb-4">HUG RECEIVED!</h3>
            
            <div className="space-y-4">
              <p className="text-pink-100/90 leading-relaxed italic">
                "An 8,400-mile hug just landed right where you are."
              </p>
              <div className="h-px w-12 bg-pink-500/50 mx-auto"></div>
              <p className="text-pink-200/70 text-sm">
                I might be thousands of miles away, but I'm always cheering for you. Happy Valentine's Day to the best sister! 
              </p>
            </div>

            <button 
              onClick={onClose}
              className="mt-10 w-full py-4 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-pink-900/40 active:scale-95"
            >
              Close with Love
            </button>
          </div>
          
          <p className="text-center text-pink-400/40 text-xs mt-8 uppercase tracking-widest animate-pulse">
            Distance is just a number
          </p>
        </div>
      )}
    </div>
  );
};

export default VirtualHug;