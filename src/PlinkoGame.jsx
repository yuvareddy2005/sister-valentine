import React, { useState, useEffect, useRef } from 'react';
import { X, PieChart, ArrowDownCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import Matter from 'matter-js';

const PlinkoGame = ({ onClose }) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const [coinsLeft, setCoinsLeft] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [isDropping, setIsDropping] = useState(false);

  useEffect(() => {
    if (gameOver || !sceneRef.current) return;

    // 1. Setup Matter.js Engine
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    engine.world.gravity.y = 0.8; 

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 350,
        height: 500,
        wireframes: false,
        background: 'transparent'
      }
    });

    const staticBodies = [];
    
    // 2. Draw the Pegs (Fixed Wall-Wedging & Added Ice Friction)
    for (let row = 1; row < 8; row++) {
      const isEven = row % 2 === 0;
      // Alternate between 8 and 7 pegs so they never touch the edges
      const pegsInRow = isEven ? 7 : 8; 
      
      for (let col = 0; col < pegsInRow; col++) {
        // Perfect half-step offset for the 7-peg rows
        const offset = isEven ? 22.5 : 0; 
        staticBodies.push(
          Matter.Bodies.circle(col * 45 + 17.5 + offset, row * 40 + 30, 4, {
            isStatic: true,
            restitution: 0.8, // Bouncier
            friction: 0,      // Slippery! Prevents sticking
            render: { fillStyle: '#4ade80' }
          })
        );
      }
    }

    // 3. Draw Floor and Outer Walls
    staticBodies.push(Matter.Bodies.rectangle(175, 510, 350, 20, { isStatic: true })); 
    staticBodies.push(Matter.Bodies.rectangle(-10, 250, 20, 500, { isStatic: true, friction: 0 })); 
    staticBodies.push(Matter.Bodies.rectangle(360, 250, 20, 500, { isStatic: true, friction: 0 })); 

    // 4. Draw Bucket Dividers
    staticBodies.push(Matter.Bodies.rectangle(87.5, 460, 4, 80, { isStatic: true, render: { fillStyle: '#374151' } }));
    staticBodies.push(Matter.Bodies.rectangle(175, 460, 4, 80, { isStatic: true, render: { fillStyle: '#374151' } }));
    staticBodies.push(Matter.Bodies.rectangle(262.5, 460, 4, 80, { isStatic: true, render: { fillStyle: '#374151' } }));

    // ---------------------------------------------------------
    // 5. THE FUNNEL ZONE
    // ---------------------------------------------------------
    
    // Left Ramp
    staticBodies.push(
      Matter.Bodies.rectangle(85, 390, 220, 20, {
        isStatic: true,
        angle: 0.25, 
        friction: 0, // Zero friction guarantees a smooth slide into the bucket
        render: { fillStyle: 'transparent', strokeStyle: 'transparent' } 
      })
    );

    // Right Ramp
    staticBodies.push(
      Matter.Bodies.rectangle(315, 390, 130, 20, {
        isStatic: true,
        angle: -0.25, 
        friction: 0, 
        render: { fillStyle: 'transparent', strokeStyle: 'transparent' } 
      })
    );

    Matter.World.add(engine.world, staticBodies);

    // Run the Engine
    Matter.Runner.run(Matter.Runner.create(), engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, [gameOver]);

  // --- THE DROP LOGIC ---
  const handleDrop = (e) => {
    if (isDropping || coinsLeft <= 0 || gameOver) return;
    setIsDropping(true);

    const rect = sceneRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    
    const ball = Matter.Bodies.circle(startX, 10, 10, {
      restitution: 0.8, // Bouncier!
      friction: 0,      // Ice physics so it never stops rolling
      density: 0.04,
      render: { fillStyle: '#fbbf24', strokeStyle: '#d97706', lineWidth: 2 }
    });
    
    Matter.World.add(engineRef.current.world, ball);

    const checkLanding = () => {
      // Anti-Stuck Nudge: If the ball somehow perfectly balances, give it a microscopic poke
      if (Math.abs(ball.velocity.x) < 0.05 && Math.abs(ball.velocity.y) < 0.05 && ball.position.y < 400) {
        Matter.Body.applyForce(ball, ball.position, {
          x: (Math.random() - 0.5) * 0.0005,
          y: -0.0005
        });
      }

      if (ball.position.y > 480) {
        Matter.Events.off(engineRef.current, 'beforeUpdate', checkLanding);
        Matter.World.remove(engineRef.current.world, ball);
        
        setIsDropping(false);
        const newCoins = coinsLeft - 1;
        setCoinsLeft(newCoins);
        
        if (newCoins === 0) {
          setTimeout(() => {
            setGameOver(true);
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          }, 800);
        }
      }
    };

    Matter.Events.on(engineRef.current, 'beforeUpdate', checkLanding);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-900 p-6 rounded-2xl border-2 border-green-500 max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-red-400 z-50"><X /></button>
        
        <h2 className="text-2xl font-bold text-green-400 mb-2 text-center">Financial Allocator Pro</h2>
        
        {!gameOver ? (
          <>
            <p className="text-gray-400 text-sm text-center mb-4">
              Tap anywhere near the top to drop your paycheck!<br/>
              <span className="text-yellow-400 font-bold">Paychecks Remaining: {coinsLeft}</span>
            </p>
            
            <div className="relative mx-auto w-[350px] h-[500px] bg-gray-800 rounded-lg border border-gray-700 overflow-hidden cursor-crosshair">
              {/* Drop Zone Indicator */}
              <div className="absolute top-0 left-0 w-full h-8 flex justify-center items-center text-green-500/30 animate-pulse pointer-events-none z-10">
                <ArrowDownCircle className="w-5 h-5" />
                <span className="ml-2 text-xs uppercase tracking-widest">Drop Zone</span>
                <ArrowDownCircle className="w-5 h-5 ml-2" />
              </div>

              {/* Bucket Labels Overlay */}
              <div className="absolute bottom-2 left-0 w-full flex text-center text-[10px] font-bold z-10 pointer-events-none">
                <div className="w-1/4 text-gray-500">Rent</div>
                <div className="w-1/4 text-gray-500">Groceries</div>
                <div className="w-1/4 text-red-400 leading-tight bg-red-900/20 py-1 rounded">Brother's<br/>Fund</div>
                <div className="w-1/4 text-gray-500">Vacations</div>
              </div>

              {/* Matter.js Canvas */}
              <div ref={sceneRef} onClick={handleDrop} className={`absolute inset-0 z-20 ${isDropping ? 'pointer-events-none' : ''}`} />
            </div>
          </>
        ) : (
          <div className="h-[500px] flex flex-col items-center justify-center bg-gray-800 rounded-lg animate-fade-in text-center p-6 border border-gray-700">
            <PieChart className="w-24 h-24 text-red-500 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Monthly Budget Analysis</h3>
            
            <div className="w-full space-y-4 text-left bg-gray-900 p-4 rounded-lg font-mono text-sm">
              <div className="flex justify-between text-gray-500"><span>🏠 Rent / Mortgage</span><span>0.00%</span></div>
              <div className="flex justify-between text-gray-500"><span>🛒 Groceries</span><span>0.00%</span></div>
              <div className="flex justify-between text-gray-500"><span>✈️ Vacations</span><span>0.00%</span></div>
              <div className="h-px w-full bg-gray-700 my-2"></div>
              <div className="flex justify-between items-center text-red-400 font-bold text-lg">
                <span>🧑‍💻 Brother's Fund</span><span>100.00%</span>
              </div>
            </div>

            <p className="mt-8 text-sm text-gray-300 italic">
              {`"The physics don't lie. Thanks for the investments! Happy Valentine's Day!"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlinkoGame;