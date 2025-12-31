
import React, { useState, useEffect, useCallback } from 'react';

interface CoinAnimationProps {
  active: boolean;
  frozen: boolean;
}

const CoinAnimation: React.FC<CoinAnimationProps> = ({ active, frozen }) => {
  const [particles, setParticles] = useState<{ id: number; x: number; size: number; emoji: string; delay: number }[]>([]);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; size: number; delay: number; emoji: string }[]>([]);

  // Working state: "Value Creation" symbols - focused on corporate/work items as requested, no coins.
  const workIcons = ['📈', '💰'];
  // Slacking state: Relaxing background elements including "Fish" (摸鱼) and Bubbles
  const slackEmojis = ['🐟', '🧻', '💤', '☁️'];

  const spawnParticle = useCallback(() => {
    if (!active || frozen) return;
    const id = Math.random();
    const x = Math.random() * 100;
    const size = Math.random() * (40 - 20) + 25;
    const emoji = workIcons[Math.floor(Math.random() * workIcons.length)];
    const delay = Math.random() * 0.5;
    
    setParticles(prev => [...prev, { id, x, size, emoji, delay }]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 3000);
  }, [active, frozen]);

  const spawnBubble = useCallback(() => {
    if (!frozen) return;
    const id = Math.random();
    const x = Math.random() * 100;
    const size = Math.random() * (30 - 15) + 15;
    const delay = Math.random() * 2;
    const emoji = slackEmojis[Math.floor(Math.random() * slackEmojis.length)];
    
    setBubbles(prev => [...prev, { id, x, size, delay, emoji }]);
    
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== id));
    }, 5000);
  }, [frozen]);

  useEffect(() => {
    let interval: number;
    if (active && !frozen) {
      // Slower, more "orderly" rate for productivity items
      interval = window.setInterval(spawnParticle, 400);
    }
    return () => clearInterval(interval);
  }, [active, frozen, spawnParticle]);

  useEffect(() => {
    let interval: number;
    if (frozen) {
      interval = window.setInterval(spawnBubble, 500);
    }
    return () => clearInterval(interval);
  }, [frozen, spawnBubble]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Working Productivity Icons */}
      {!frozen && particles.map(p => (
        <div
          key={p.id}
          className="coin-particle"
          style={{ 
            left: `${p.x}%`, 
            top: '-10vh',
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            opacity: 0.6
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Slacking Background Animation (Fish Slacking Vibe) */}
      {frozen && (
        <>
          <div className="absolute inset-0 bg-blue-500/5 transition-opacity duration-1000"></div>
          {bubbles.map(b => (
            <div
              key={b.id}
              className="absolute"
              style={{
                left: `${b.x}%`,
                bottom: '-50px',
                fontSize: `${b.size}px`,
                animation: `float-up 5s ease-in forwards`,
                animationDelay: `${b.delay}s`,
                opacity: 0.4
              }}
            >
              {b.emoji}
            </div>
          ))}
          <style>{`
            @keyframes float-up {
              0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
              20% { opacity: 0.5; transform: translateX(10px) rotate(10deg); }
              50% { transform: translateX(-10px) rotate(-10deg); }
              80% { opacity: 0.5; }
              100% { transform: translateY(-110vh) translateX(0) rotate(0deg); opacity: 0; }
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default CoinAnimation;
