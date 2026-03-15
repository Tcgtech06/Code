import React, { useState, useEffect } from 'react';

const CometAnimation: React.FC = () => {
  const [collision, setCollision] = useState<{ x: number; y: number } | null>(null);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentDate, setCurrentDate] = useState(new Date());

  const isPongalSeason = () => {
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    return month === 1 && day >= 10 && day <= 18;
  };

  const isNightTime = () => currentHour >= 18 || currentHour < 6;

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentHour(now.getHours());
      setCurrentDate(now);
    };
    const timeInterval = setInterval(updateDateTime, 60000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    if (!isPongalSeason()) return;
    
    const triggerCollision = () => {
      setCollision({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      setTimeout(() => setCollision(null), 1000);
    };

    const interval = setInterval(triggerCollision, 10000);
    return () => clearInterval(interval);
  }, [currentDate]);

  if (!isPongalSeason()) return null;

  return (
    <>
      <style>{`
        @keyframes comet-left-slope {
          0% { top: -100px; left: -100px; opacity: 1; }
          100% { top: 100vh; left: 100vw; opacity: 0; }
        }
        @keyframes comet-right-slope {
          0% { top: -100px; right: -100px; opacity: 1; }
          100% { top: 100vh; right: 100vw; opacity: 0; }
        }
        @keyframes fire-flicker {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes burst {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
      `}</style>
      
      <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
        {/* Moon - only during night time */}
        {isNightTime() && (
          <div className="fixed top-10 right-10 w-20 h-20 rounded-full bg-yellow-100" style={{ filter: 'brightness(6)' }} />
        )}
        
        {/* Comets - only during night time */}
        {isNightTime() && (
          <>
            <svg data-comet className="absolute" width="80" height="80" style={{ animation: 'comet-left-slope 6s linear infinite' }}>
              <defs>
                <radialGradient id="head-glow">
                  <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                  <stop offset="50%" stopColor="#1e40af" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="fire-tail">
                  <stop offset="0%" stopColor="#ff8c00" stopOpacity="1" />
                  <stop offset="50%" stopColor="#ffa500" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ffb347" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M40 25 L15 10 Q12 8 10 12 Q15 15 20 12" fill="url(#fire-tail)" style={{ animation: 'fire-flicker 0.3s infinite' }} />
              <path d="M40 25 L18 8 Q15 6 13 10 Q18 13 23 10" fill="url(#fire-tail)" opacity="0.7" style={{ animation: 'fire-flicker 0.4s infinite' }} />
              <circle cx="40" cy="25" r="10" fill="url(#head-glow)" />
            </svg>
            
            <svg data-comet className="absolute" width="80" height="80" style={{ animation: 'comet-right-slope 6s linear 12s infinite' }}>
              <path d="M40 25 L65 10 Q68 8 70 12 Q65 15 60 12" fill="url(#fire-tail)" style={{ animation: 'fire-flicker 0.3s infinite' }} />
              <path d="M40 25 L62 8 Q65 6 67 10 Q62 13 57 10" fill="url(#fire-tail)" opacity="0.7" style={{ animation: 'fire-flicker 0.4s infinite' }} />
              <circle cx="40" cy="25" r="10" fill="url(#head-glow)" />
            </svg>

            <svg className="absolute" width="100" height="70" style={{ animation: 'comet-left-slope 4s linear 1s infinite' }}>
              <path d="M50 20 L15 8 Q12 6 10 10 Q15 12 20 10" fill="url(#fire-tail)" opacity="0.7" />
              <circle cx="50" cy="20" r="7" fill="url(#head-glow)" />
            </svg>
            
            <svg className="absolute" width="100" height="70" style={{ animation: 'comet-right-slope 5s linear 3s infinite' }}>
              <path d="M50 20 L85 8 Q88 6 90 10 Q85 12 80 10" fill="url(#fire-tail)" opacity="0.7" />
              <circle cx="50" cy="20" r="7" fill="url(#head-glow)" />
            </svg>
          </>
        )}

        {/* Collision burst */}
        {collision && (
          <div style={{ position: 'fixed', left: collision.x, top: collision.y, transform: 'translate(-50%, -50%)' }}>
            <div className="w-6 h-6 bg-red-600 rounded-full" style={{ animation: 'burst 1s ease-out' }} />
            <div className="absolute w-6 h-6 bg-green-500 rounded-full" style={{ animation: 'burst 1s ease-out', left: '20px' }} />
            <div className="absolute w-6 h-6 bg-yellow-400 rounded-full" style={{ animation: 'burst 1s ease-out', left: '-20px' }} />
          </div>
        )}
      </div>
    </>
  );
};

export default CometAnimation;