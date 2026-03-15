import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import diwaliBombAnimation from '../../diwali-bomb.json';
import fireworksAnimation from '../../Fireworks.json';

const DiwaliAnimation: React.FC = () => {
  const [showAnimation, setShowAnimation] = useState<boolean>(false);

  useEffect(() => {
    const checkDiwaliSeason = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth(); // 0-indexed
      const date = now.getDate();
      
      // TEMPORARY: Show from Feb 6 to Feb 8, 2026 for testing
      if (year === 2026 && month === 1 && date >= 6 && date <= 8) {
        setShowAnimation(true);
        return;
      }
      
      // Original Diwali dates: October 15-21
      // Diwali 2025 is on October 20
      // Show animation from 5 days before (Oct 15) to 1 day after (Oct 21)
      const startDate = new Date(year, 9, 15); // October 15
      const endDate = new Date(year, 9, 21); // October 21
      
      // Check if current date is within the range
      if (now >= startDate && now <= endDate) {
        setShowAnimation(true);
      } else {
        setShowAnimation(false);
      }
    };

    checkDiwaliSeason();
    
    // Check every hour in case the date changes
    const interval = setInterval(checkDiwaliSeason, 3600000);
    
    return () => clearInterval(interval);
  }, []);

  if (!showAnimation) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes fireworks-fade {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.2);
          }
        }
        
        @keyframes cracker-pop {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: scale(1.2) rotate(10deg);
          }
          50% {
            transform: scale(0.8) rotate(-10deg);
          }
          75% {
            transform: scale(1.3) rotate(5deg);
          }
        }
        
        @keyframes diwali-glow {
          0%, 100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.25;
          }
        }
        
        @keyframes diwali-pulse {
          0%, 100% {
            box-shadow: 0 0 40px rgba(255,165,0,0.3), 0 0 80px rgba(255,215,0,0.2);
          }
          50% {
            box-shadow: 0 0 60px rgba(255,165,0,0.5), 0 0 120px rgba(255,215,0,0.3);
          }
        }
      `}</style>
      
      {/* Strip Background Image for Navbar - Only during Diwali */}
      <div 
        className="fixed top-0 left-0 right-0 h-16 pointer-events-none z-[45]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.25)), url(/strip.webp)',
          backgroundSize: '50% auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat-x',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Diwali Orange-Yellow Theme Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[35]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,165,0,0.12) 0%, rgba(255,215,0,0.08) 30%, rgba(255,140,0,0.05) 60%, transparent 100%)',
          animation: 'diwali-glow 4s ease-in-out infinite',
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Diwali Border Glow Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-[35]"
        style={{
          border: '3px solid transparent',
          borderImage: 'linear-gradient(45deg, rgba(255,165,0,0.4), rgba(255,215,0,0.4), rgba(255,140,0,0.4), rgba(255,165,0,0.4)) 1',
          animation: 'diwali-pulse 3s ease-in-out infinite'
        }}
      />
      
      {/* Corner Diya Lights */}
      <div className="fixed top-4 left-4 w-12 h-12 rounded-full z-[36] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,165,0,0.6) 0%, rgba(255,215,0,0.3) 50%, transparent 100%)',
          boxShadow: '0 0 30px rgba(255,165,0,0.8), 0 0 60px rgba(255,215,0,0.5)',
          animation: 'diwali-glow 2s ease-in-out infinite'
        }}
      />
      <div className="fixed top-4 right-4 w-12 h-12 rounded-full z-[36] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, rgba(255,165,0,0.3) 50%, transparent 100%)',
          boxShadow: '0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,165,0,0.5)',
          animation: 'diwali-glow 2.5s ease-in-out infinite 0.5s'
        }}
      />
      <div className="fixed bottom-4 left-4 w-12 h-12 rounded-full z-[36] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,140,0,0.6) 0%, rgba(255,165,0,0.3) 50%, transparent 100%)',
          boxShadow: '0 0 30px rgba(255,140,0,0.8), 0 0 60px rgba(255,165,0,0.5)',
          animation: 'diwali-glow 2.2s ease-in-out infinite 1s'
        }}
      />
      <div className="fixed bottom-4 right-4 w-12 h-12 rounded-full z-[36] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,165,0,0.6) 0%, rgba(255,140,0,0.3) 50%, transparent 100%)',
          boxShadow: '0 0 30px rgba(255,165,0,0.8), 0 0 60px rgba(255,140,0,0.5)',
          animation: 'diwali-glow 2.8s ease-in-out infinite 1.5s'
        }}
      />
      
      {/* Diwali Bomb Crackers - Multiple positions with orange-yellow theme */}
      <div 
        className="fixed bottom-20 left-4 z-40" 
        style={{ animation: 'cracker-pop 2s ease-in-out infinite' }}
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
          <Lottie 
            animationData={diwaliBombAnimation} 
            loop={true}
            style={{
              width: '100%',
              height: '100%',
              filter: 'brightness(1.3) contrast(1.3) saturate(1.5) drop-shadow(0 0 10px rgba(255,165,0,0.8))'
            }}
          />
        </div>
      </div>

      {/* Additional Cracker - Bottom Right */}
      <div 
        className="fixed bottom-32 right-12 z-40" 
        style={{ animation: 'cracker-pop 2.3s ease-in-out infinite 0.5s' }}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
          <Lottie 
            animationData={diwaliBombAnimation} 
            loop={true}
            style={{
              width: '100%',
              height: '100%',
              filter: 'brightness(1.4) contrast(1.3) saturate(1.6) hue-rotate(20deg) drop-shadow(0 0 10px rgba(255,215,0,0.8))'
            }}
          />
        </div>
      </div>

      {/* Additional Cracker - Middle Left */}
      <div 
        className="fixed top-1/2 left-8 z-40" 
        style={{ animation: 'cracker-pop 2.5s ease-in-out infinite 1s' }}
      >
        <div className="w-18 h-18 sm:w-22 sm:h-22 md:w-26 md:h-26">
          <Lottie 
            animationData={diwaliBombAnimation} 
            loop={true}
            style={{
              width: '100%',
              height: '100%',
              filter: 'brightness(1.35) contrast(1.25) saturate(1.55) hue-rotate(-10deg) drop-shadow(0 0 10px rgba(255,140,0,0.8))'
            }}
          />
        </div>
      </div>

      {/* Fireworks Animation - Top Left with Orange Theme */}
      <div 
        className="fixed top-24 left-4 z-40 pointer-events-none" 
        style={{ animation: 'fireworks-fade 4s ease-in-out infinite' }}
      >
        <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80">
          <Lottie 
            animationData={fireworksAnimation} 
            loop={true}
            style={{
              width: '100%',
              height: '100%',
              filter: 'brightness(1.4) contrast(1.3) saturate(1.6) drop-shadow(0 0 20px rgba(255,165,0,0.9))'
            }}
          />
        </div>
      </div>

      {/* Fireworks Animation - Bottom Right with Yellow Theme */}
      <div 
        className="fixed bottom-24 right-8 z-40 pointer-events-none" 
        style={{ animation: 'fireworks-fade 5s ease-in-out infinite 1s' }}
      >
        <div className="w-52 h-52 sm:w-60 sm:h-60 md:w-68 md:h-68 lg:w-76 lg:h-76">
          <Lottie 
            animationData={fireworksAnimation} 
            loop={true}
            style={{
              width: '100%',
              height: '100%',
              filter: 'brightness(1.45) contrast(1.25) saturate(1.65) drop-shadow(0 0 20px rgba(255,215,0,0.9))',
              opacity: 0.9
            }}
          />
        </div>
      </div>

      {/* Fireworks Animation - Center Top with Orange-Red Theme */}
      <div 
        className="fixed top-32 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none" 
        style={{ animation: 'fireworks-fade 6s ease-in-out infinite 2s' }}
      >
        <div className="w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
          <Lottie 
            animationData={fireworksAnimation} 
            loop={true}
            style={{
              width: '100%',
              height: '100%',
              filter: 'brightness(1.5) contrast(1.3) saturate(1.7) drop-shadow(0 0 25px rgba(255,140,0,1))',
              opacity: 0.85
            }}
          />
        </div>
      </div>

      {/* Additional Fireworks - Top Right with Yellow Theme */}
      <div 
        className="fixed top-40 right-16 z-40 pointer-events-none" 
        style={{ animation: 'fireworks-fade 5.5s ease-in-out infinite 1.5s' }}
      >
        <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72">
          <Lottie 
            animationData={fireworksAnimation} 
            loop={true}
            style={{
              width: '100%',
              height: '100%',
              filter: 'brightness(1.42) contrast(1.28) saturate(1.62) drop-shadow(0 0 20px rgba(255,223,0,0.95))',
              opacity: 0.88
            }}
          />
        </div>
      </div>

      {/* Additional Fireworks - Middle Right with Orange Theme */}
      <div 
        className="fixed top-1/2 right-4 z-40 pointer-events-none" 
        style={{ animation: 'fireworks-fade 4.5s ease-in-out infinite 0.8s' }}
      >
        <div className="w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 lg:w-68 lg:h-68">
          <Lottie 
            animationData={fireworksAnimation} 
            loop={true}
            style={{
              width: '100%',
              height: '100%',
              filter: 'brightness(1.38) contrast(1.22) saturate(1.58) drop-shadow(0 0 18px rgba(255,150,0,0.92))',
              opacity: 0.87
            }}
          />
        </div>
      </div>
    </>
  );
};

export default DiwaliAnimation;
