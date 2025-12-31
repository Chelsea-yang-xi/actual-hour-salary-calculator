
import React, { useState, useEffect, useCallback } from 'react';

interface CoinAnimationProps {
  active: boolean;
  frozen: boolean;
}

const CoinAnimation: React.FC<CoinAnimationProps> = ({ active, frozen }) => {
  const [particles, setParticles] = useState<{ id: number; x: number; size: number; emoji: string }[]>([]);

  const emojis = ['💰', '🪙', '💎', '💸', '✨'];

  const spawnCoin = useCallback(() => {
    if (!active || frozen) return;
    const id = Math.random();
    const x = Math.random() * 95;
    const size = Math.random() * (40 - 20) + 24;
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    setParticles(prev => [...prev, { id, x, size, emoji }]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 2500);
  }, [active, frozen]);

  useEffect(() => {
    let interval: number;
    if (active && !frozen) {
      // Create a "burst" effect by spawning faster
      interval = window.setInterval(spawnCoin, 200);
    }
    return () => clearInterval(interval);
  }, [active, frozen, spawnCoin]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="coin-particle"
          style={{ 
            left: `${p.x}%`, 
            top: '-50px',
            fontSize: `${p.size}px`
          }}
        >
          {p.emoji}
        </div>
      ))}
      {frozen && (
        <div className="absolute inset-0 bg-blue-100/20 backdrop-blur-[1px] flex items-center justify-center">
           <div className="text-9xl opacity-10 animate-pulse">❄️</div>
        </div>
      )}
    </div>
  );
};

export default CoinAnimation;
