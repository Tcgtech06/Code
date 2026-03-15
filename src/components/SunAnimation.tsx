import React, { useState, useEffect } from 'react';
import PongalSunEffect from './PongalSunEffect';
import useSnowEffect from '../hooks/useSnowEffect';

const SunAnimation: React.FC = () => {
  const [isDay, setIsDay] = useState(true);
  const { showSeason, seasonType } = useSnowEffect();

  useEffect(() => {
    const checkTimeOfDay = () => {
      const now = new Date();
      const hour = now.getHours();
      // Day: 6 AM to 6 PM (6-18), Night: 6 PM to 6 AM (18-6)
      setIsDay(hour >= 6 && hour < 18);
    };

    checkTimeOfDay();
    // Check every minute
    const interval = setInterval(checkTimeOfDay, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Only show during Pongal season (Jan 10-18)
  if (!showSeason || seasonType !== 'pongal') {
    return null;
  }

  return (
    <div className="sun-animation-container">
      {isDay ? (
        // Show SUN during day (6 AM - 6 PM)
        <PongalSunEffect />
      ) : (
        // Show MOON, STARS, COMET during night (6 PM - 6 AM)
        <>
          <style>{`
            @keyframes twinkle {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 1; }
            }
            
            @keyframes comet {
              0% {
                transform: translate(100vw, -100px) rotate(-45deg);
                opacity: 0;
              }
              10% {
                opacity: 1;
              }
              90% {
                opacity: 1;
              }
              100% {
                transform: translate(-100px, 100vh) rotate(-45deg);
                opacity: 0;
              }
            }
            
            .star {
              position: fixed;
              background: white;
              border-radius: 50%;
              animation: twinkle 3s ease-in-out infinite;
              pointer-events: none;
              z-index: 5;
            }
            
            .moon {
              position: fixed;
              top: 50px;
              right: 100px;
              width: 80px;
              height: 80px;
              border-radius: 50%;
              background: #f4f4f4;
              box-shadow: 0 0 60px #fff, 0 0 100px #fff, 0 0 140px #fff;
              pointer-events: none;
              z-index: 5;
            }
            
            .moon::before {
              content: '';
              position: absolute;
              top: 10px;
              left: 20px;
              width: 50px;
              height: 50px;
              border-radius: 50%;
              background: #e0e0e0;
              opacity: 0.3;
            }
            
            .comet {
              position: fixed;
              width: 4px;
              height: 4px;
              background: white;
              border-radius: 50%;
              box-shadow: 0 0 10px 2px white;
              animation: comet 8s linear infinite;
              pointer-events: none;
              z-index: 5;
            }
            
            .comet::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100px;
              height: 2px;
              background: linear-gradient(90deg, white, transparent);
              transform-origin: left center;
            }
          `}</style>
          
          {/* Moon */}
          <div className="moon"></div>
          
          {/* Stars */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`
              }}
            />
          ))}
          
          {/* Comets */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="comet"
              style={{
                animationDelay: `${i * 3}s`,
                animationDuration: `${8 + i * 2}s`
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default SunAnimation;
