import React, { useState, useEffect } from 'react';
import Lottie from './SafeLottie';
import diwaliBombAnimation from '../../diwali-bomb.json';
import fireworksAnimation from '../../Fireworks.json';
import { isDiwaliSeason } from '../utils/festivalUtils';

const DiwaliAnimation: React.FC = () => {
  const [showAnimation, setShowAnimation] = useState<boolean>(() => isDiwaliSeason());

  useEffect(() => {
    const checkDiwaliSeason = () => {
      setShowAnimation(isDiwaliSeason());
    };

    checkDiwaliSeason();
    const interval = setInterval(checkDiwaliSeason, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!showAnimation) {
    return null;
  }

  return (
    <div className="diwali-layer pointer-events-none select-none">
      <style>{`
        .diwali-gpu {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          will-change: transform, opacity;
          contain: layout paint;
        }

        @keyframes fireworks-fade-1 {
          0%, 100% { opacity: 0; transform: translate3d(0, 0, 0) scale(0.6); }
          20% { opacity: 0.95; transform: translate3d(0, 0, 0) scale(1.05); }
          45% { opacity: 0; transform: translate3d(0, 0, 0) scale(1.15); }
        }

        @keyframes fireworks-fade-2 {
          0%, 40% { opacity: 0; transform: translate3d(0, 0, 0) scale(0.6); }
          60% { opacity: 0.95; transform: translate3d(0, 0, 0) scale(1.05); }
          85% { opacity: 0; transform: translate3d(0, 0, 0) scale(1.15); }
          100% { opacity: 0; }
        }

        @keyframes cracker-pop {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); opacity: 0.9; }
          25% { transform: translate3d(0, 0, 0) scale(1.1) rotate(6deg); }
          50% { transform: translate3d(0, 0, 0) scale(0.9) rotate(-6deg); }
          75% { transform: translate3d(0, 0, 0) scale(1.15) rotate(3deg); }
        }

        @keyframes diwali-soft-glow {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.16; }
        }
      `}</style>

      {/* Decorative Festive Top Ribbon */}
      <div 
        className="fixed top-0 left-0 right-0 h-14 pointer-events-none z-[45] diwali-gpu opacity-80"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.2)), url(/strip.webp)',
          backgroundSize: '400px auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat-x'
        }}
      />

      {/* Lightweight GPU-friendly Warm Festival Glow (No mixBlendMode repaint) */}
      <div 
        className="fixed inset-0 pointer-events-none z-[35] diwali-gpu"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(255,165,0,0.1) 0%, rgba(255,215,0,0.05) 50%, transparent 80%)',
          animation: 'diwali-soft-glow 5s ease-in-out infinite'
        }}
      />

      {/* Soft Festive Border Accent */}
      <div 
        className="fixed inset-0 pointer-events-none z-[35] diwali-gpu"
        style={{
          boxShadow: 'inset 0 0 40px rgba(255, 170, 0, 0.15)'
        }}
      />

      {/* Top Left Diya Glow */}
      <div 
        className="fixed top-4 left-4 w-10 h-10 rounded-full z-[36] pointer-events-none diwali-gpu"
        style={{
          background: 'radial-gradient(circle, rgba(255,165,0,0.5) 0%, transparent 70%)'
        }}
      />
      {/* Top Right Diya Glow */}
      <div 
        className="fixed top-4 right-4 w-10 h-10 rounded-full z-[36] pointer-events-none diwali-gpu"
        style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.5) 0%, transparent 70%)'
        }}
      />

      {/* Fireworks 1 - Top Left (Hardware Accelerated, Staggered) */}
      <div 
        className="fixed top-20 left-2 sm:left-6 z-40 pointer-events-none diwali-gpu" 
        style={{ animation: 'fireworks-fade-1 5s ease-in-out infinite' }}
      >
        <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
          <Lottie 
            animationData={fireworksAnimation} 
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      {/* Fireworks 2 - Top Right (Hardware Accelerated, Staggered) */}
      <div 
        className="fixed top-24 right-2 sm:right-8 z-40 pointer-events-none diwali-gpu" 
        style={{ animation: 'fireworks-fade-2 5s ease-in-out infinite' }}
      >
        <div className="w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60">
          <Lottie 
            animationData={fireworksAnimation} 
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      {/* Cracker Bomb 1 - Bottom Left */}
      <div 
        className="fixed bottom-12 left-4 z-40 pointer-events-none diwali-gpu" 
        style={{ animation: 'cracker-pop 2.5s ease-in-out infinite' }}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20">
          <Lottie 
            animationData={diwaliBombAnimation} 
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      {/* Cracker Bomb 2 - Bottom Right */}
      <div 
        className="fixed bottom-16 right-6 z-40 pointer-events-none diwali-gpu" 
        style={{ animation: 'cracker-pop 2.8s ease-in-out infinite 0.6s' }}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20">
          <Lottie 
            animationData={diwaliBombAnimation} 
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default DiwaliAnimation;
