import React, { useState, useRef } from 'react';
import { X, Heart, MapPin } from 'lucide-react';

const ConnectionPortal = ({ onClose }) => {
  const [position, setPosition] = useState(80); // Start at the right (USA side)
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [initialPos, setInitialPos] = useState(80);
  const [isMerged, setIsMerged] = useState(false);
  const containerRef = useRef(null);

  // 1. Start Dragging
  const startDrag = (e) => {
    setIsDragging(true);
    // Handle both mouse and touch starts
    const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    setDragStartX(clientX);
    setInitialPos(position);
  };

  // 2. The Relative Move Logic
  const onDrag = (e) => {
    if (!isDragging || isMerged) return;

    const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    const deltaX = clientX - dragStartX; // How far the finger moved
    const rect = containerRef.current.getBoundingClientRect();
    const deltaPercent = (deltaX / rect.width) * 100;
    
    let newPos = initialPos + deltaPercent;
    
    // 3. Constraints & Trigger
    if (newPos < 15) { // If pulled close enough to Chennai
      setIsMerged(true);
      setPosition(0);
    } else {
      // Keep it within the track (between Chennai and the start point)
      setPosition(Math.min(Math.max(newPos, 0), 80));
    }
  };

  // 4. Stop Dragging
  const endDrag = () => setIsDragging(false);

return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-6 overflow-hidden select-none">
      <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition z-[100]">
        <X className="w-8 h-8" />
      </button>

      {!isMerged ? (
        /* --- THE SLIDER VIEW --- */
        <div className="w-full max-w-md text-center">
          <h2 className="text-xl font-medium text-indigo-200 mb-20 tracking-widest uppercase">
            Close the 8,400 Mile Gap
          </h2>

          <div 
            ref={containerRef}
            onPointerMove={onDrag}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            className="relative h-24 w-full flex items-center touch-none"
          >
            {/* The Connecting Line */}
            <div className="absolute left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20"></div>

            {/* Point A: Chennai (Stationary) */}
            <div className="absolute left-[10%] flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] mb-2"></div>
              <span className="text-[10px] font-mono text-blue-400">CHENNAI</span>
            </div>

            {/* Point B: USA (Relative Draggable) */}
            <div 
              onPointerDown={startDrag}
              style={{ left: `${position}%` }}
              className={`absolute flex flex-col items-center transition-transform duration-75 cursor-grab active:cursor-grabbing ${isDragging ? 'scale-110' : ''}`}
            >
              <div className="relative">
                <MapPin className="w-8 h-8 text-pink-500 fill-pink-500/20 mb-1" />
                <div className="absolute inset-0 bg-pink-500 blur-xl opacity-20"></div>
              </div>
              <span className="text-[10px] font-mono text-pink-400 whitespace-nowrap">YOU (USA)</span>
            </div>
          </div>

          <div className="mt-20">
            <p className="text-5xl font-bold text-white font-mono tracking-tighter">
              {Math.round((position / 80) * 8400).toLocaleString()} <span className="text-sm font-normal text-gray-500 italic">miles</span>
            </p>
            <p className="text-indigo-300/40 text-xs mt-4 uppercase tracking-[0.3em] animate-pulse">
              {isDragging ? 'Pulling her home...' : 'Drag the pin toward Chennai'}
            </p>
          </div>
        </div>
      ) : (
        /* --- THE SUCCESS VIEW (Constrained Width) --- */
        <div className="w-full max-w-lg mx-auto text-center animate-in zoom-in fade-in duration-1000">
          
          <style>{`
            @keyframes heartbeat {
              0% { transform: scale(1); }
              14% { transform: scale(1.1); }
              28% { transform: scale(1); }
              42% { transform: scale(1.1); }
              70% { transform: scale(1); }
            }
            .animate-heartbeat {
              animation: heartbeat 1.5s ease-in-out infinite;
            }
          `}</style>

          <div className="relative mb-10">
            <div className="absolute inset-0 bg-pink-500 blur-3xl opacity-20 animate-pulse"></div>
            <Heart className="w-24 h-24 text-pink-500 fill-pink-500 mx-auto animate-heartbeat drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]" />
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tighter uppercase font-mono">0 Miles</h2>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-500 to-transparent mx-auto mb-8"></div>
          
          <p className="text-pink-100 text-lg leading-relaxed px-8 italic font-medium">
            "Distance can change our timezones, but it will never change the fact that I’m always in your corner. Keep shining over there, Sis—your brother is always just a heartbeat away."
          </p>

          <button 
            onClick={onClose}
            className="mt-12 px-10 py-3 border border-pink-500/30 text-pink-300 rounded-full hover:bg-pink-500/10 transition-all text-xs uppercase tracking-[0.2em]"
          >
            Stay Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectionPortal;