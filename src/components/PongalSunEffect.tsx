import React, { useState, useEffect } from 'react';

interface PongalSunEffectProps {
  sunOpacity?: number;
  lightOpacity?: number;
  moonOpacity?: number;
}

const PongalSunEffect: React.FC<PongalSunEffectProps> = ({ 
  sunOpacity = 1, 
  lightOpacity = 1,
  moonOpacity = 1
}) => {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'sunset' | 'night'>('morning');
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Determine time of day with more specific ranges
      if (hour >= 6 && hour < 12) {
        setTimeOfDay('morning'); // 6 AM - 11:59 AM
      } else if (hour >= 12 && hour < 16) {
        setTimeOfDay('afternoon'); // 12 PM - 3:59 PM
      } else if (hour >= 16 && hour < 19) {
        setTimeOfDay('evening'); // 4 PM - 6:59 PM
      } else if (hour >= 19 && hour < 20) {
        setTimeOfDay('sunset'); // 7 PM - 7:59 PM
      } else {
        setTimeOfDay('night'); // 8 PM - 5:59 AM
      }
    };

    // Update immediately
    updateTime();
    
    // Update every minute
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollY / (maxScroll * 0.3), 1); // Fade moon at 30% scroll
      
      setScrollOpacity(1 - scrollProgress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Render different content based on time of day
  const renderTimeBasedContent = () => {
    switch (timeOfDay) {
      case 'morning':
        return (
          <>
            {/* Morning Sun - Rises at 6 AM */}
            <div className="sunrise-container">
              <div className="sun" style={{ 
                opacity: sunOpacity, 
                transition: 'opacity 0.3s ease-out',
                transform: 'translateY(0px) scale(1)',
                background: 'radial-gradient(circle, #FFD700, #FFA500, #FF8C00)'
              }}>
                <div className="sun-rays" style={{ 
                  opacity: lightOpacity,
                  transition: 'opacity 0.3s ease-out' 
                }}></div>
              </div>
            </div>
            
            {/* Morning Light Effects */}
            <div className="light-beams" style={{ 
              opacity: lightOpacity * 0.3,
              transition: 'opacity 0.3s ease-out' 
            }}></div>
            <div className="light-overlay" style={{ 
              opacity: lightOpacity * 0.2,
              transition: 'opacity 0.3s ease-out' 
            }}></div>
          </>
        );
        
      case 'afternoon':
        return (
          <>
            {/* Bright Afternoon Sun */}
            <div className="sunrise-container">
              <div className="sun" style={{ 
                opacity: sunOpacity, 
                transition: 'opacity 0.3s ease-out',
                transform: 'translateY(-20px) scale(1.1)',
                background: 'radial-gradient(circle, #FFD700, #FFA500, #FF8C00)'
              }}>
                <div className="sun-rays" style={{ 
                  opacity: lightOpacity,
                  transition: 'opacity 0.3s ease-out' 
                }}></div>
              </div>
            </div>
            
            {/* Strong Afternoon Light */}
            <div className="light-beams" style={{ 
              opacity: lightOpacity * 0.6,
              transition: 'opacity 0.3s ease-out' 
            }}></div>
            <div className="light-overlay" style={{ 
              opacity: lightOpacity * 0.4,
              transition: 'opacity 0.3s ease-out' 
            }}></div>
          </>
        );
        
      case 'evening':
        return (
          <>
            {/* Setting Sun - Orange/Yellow from 4-6 PM */}
            <div className="sunrise-container">
              <div className="sun" style={{ 
                opacity: sunOpacity * 0.5, // Half light
                transition: 'opacity 0.3s ease-out',
                transform: 'translateY(30px) scale(0.9)',
                background: 'radial-gradient(circle, #FF8C00, #FF6347, #FF4500)' // Orange/Yellow colors
              }}>
                <div className="sun-rays" style={{ 
                  opacity: lightOpacity * 0.3,
                  transition: 'opacity 0.3s ease-out' 
                }}></div>
              </div>
            </div>
            
            {/* Evening Light */}
            <div className="light-beams" style={{ 
              opacity: lightOpacity * 0.2,
              transition: 'opacity 0.3s ease-out' 
            }}></div>
            <div className="light-overlay" style={{ 
              opacity: lightOpacity * 0.1,
              transition: 'opacity 0.3s ease-out' 
            }}></div>
          </>
        );
        
      case 'sunset':
        return (
          <>
            {/* Only Moon at 7 PM - No sun at all */}
            <div className="moon-container">
              <div 
                className="moon" 
                style={{ 
                  opacity: moonOpacity * scrollOpacity * 0.9, // Moon fully visible
                  transition: 'opacity 0.3s ease-out',
                  filter: 'brightness(1.2) contrast(1.2)'
                }}
              ></div>
            </div>
            
            {/* Stars start appearing at sunset */}
            <div className="stars-container">
              <div className="stars star-1" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-2 stars-delay-1" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-3 stars-delay-2" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-4 stars-delay-3" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-5 stars-delay-4" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-6 stars-delay-5" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-7 stars-delay-6" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-8 stars-delay-7" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-9 stars-delay-8" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-10 stars-delay-9" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-11 stars-delay-10" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-12 stars-delay-11" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
            </div>
            

          </>
        );
        
      case 'night':
        const now = new Date();
        const hour = now.getHours();
        const isLateNight = hour >= 20; // 8 PM and later
        
        return (
          <>
            {/* Moon with reduced glow after 4 PM */}
            <div className="moon-container">
              <div 
                className="moon" 
                style={{ 
                  opacity: moonOpacity * scrollOpacity * (hour >= 16 ? 0.5 : 1), // Reduced glow after 4 PM
                  transition: 'opacity 0.3s ease-out',
                  filter: isLateNight ? 'brightness(1.3) contrast(1.2)' : 'brightness(1) contrast(1)'
                }}
              ></div>
            </div>
            
            {/* Enhanced Stars */}
            <div className="stars-container">
              <div className="stars star-1" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-2 stars-delay-1" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-3 stars-delay-2" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-4 stars-delay-3" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-5 stars-delay-4" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-6 stars-delay-5" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-7 stars-delay-6" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-8 stars-delay-7" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-9 stars-delay-8" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-10 stars-delay-9" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-11 stars-delay-10" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
              <div className="stars star-12 stars-delay-11" style={{ opacity: Math.max(0, scrollOpacity - 0.3) }}>⭐</div>
            </div>
            

          </>
        );
        
      default:
        return null;
    }
  };
  return (
    <>
      <style>{`
        @keyframes sunrise-to-header {
          0% {
            transform: translateY(100vh) translateX(-50%) scale(0.2);
            opacity: 0;
          }
          20% {
            transform: translateY(50vh) translateX(-50%) scale(0.4);
            opacity: 0.6;
          }
          40% {
            transform: translateY(20vh) translateX(-50%) scale(0.6);
            opacity: 0.9;
          }
          60% {
            transform: translateY(10vh) translateX(-50%) scale(0.8);
            opacity: 1;
          }
          80% {
            transform: translateY(5vh) translateX(-50%) scale(0.9);
            opacity: 1;
          }
          100% {
            transform: translateY(32px) translateX(-50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes sun-shine-pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          25% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.9;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
          }
          75% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.9;
          }
        }

        @keyframes sun-rays-rotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes ambient-light-pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes page-section-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
          }
          50% {
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.2);
          }
        }

        .sunrise-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 60;
          overflow: visible;
        }

        .sun {
          position: fixed;
          top: -80px;
          left: 80px;
          width: 60px;
          height: -60px;
          background: radial-gradient(circle, #FFD700, #FFA500, #FF8C00);
          border-radius: 50%;
          box-shadow: 0 0 60px #FFD700, 0 0 100px #FFA500, 0 0 150px #FF8C00, 0 0 200px rgba(255, 215, 0, 0.5);
          z-index: 55;
        }

        .sun.static {
          animation: none;
          top: 8px;
          left: 20px;
        }

        .sun-rays {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 300px;
          height: 300px;
          background: radial-gradient(
            circle at center,
            rgba(255, 215, 0, 0.8) 0%,
            rgba(255, 215, 0, 0.6) 10%,
            rgba(255, 200, 0, 0.4) 20%,
            rgba(255, 190, 0, 0.3) 30%,
            rgba(255, 180, 0, 0.2) 40%,
            rgba(255, 170, 0, 0.15) 50%,
            rgba(255, 160, 0, 0.1) 60%,
            transparent 70%
          );
          animation: sun-shine-pulse 8s ease-in-out infinite;
          filter: blur(2px);
          z-index: 50;
        }

        /* Mobile-specific sun rays */
        @media (max-width: 768px) {
          .sun-rays {
            width: 200px !important;
            height: 200px !important;
          }
        }

        .light-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            ellipse at 50px 38px,
            rgba(255, 215, 0, 0.6) 0%,
            rgba(255, 215, 0, 0.5) 5%,
            rgba(255, 165, 0, 0.4) 10%,
            rgba(255, 140, 0, 0.35) 15%,
            rgba(255, 165, 0, 0.3) 20%,
            rgba(255, 215, 0, 0.25) 25%,
            rgba(255, 165, 0, 0.2) 30%,
            rgba(255, 215, 0, 0.15) 35%,
            rgba(255, 165, 0, 0.12) 40%,
            rgba(255, 215, 0, 0.1) 45%,
            rgba(255, 165, 0, 0.08) 50%,
            rgba(255, 165, 0, 0.05) 60%,
            transparent 100%
          );
          pointer-events: none;
          z-index: 2;
          animation: ambient-light-pulse 4s ease-in-out infinite;
        }

        .light-beams {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            linear-gradient(135deg, rgba(255, 215, 0, 0.35) 0%, transparent 40%),
            linear-gradient(120deg, rgba(255, 165, 0, 0.3) 0%, transparent 45%),
            linear-gradient(150deg, rgba(255, 140, 0, 0.25) 0%, transparent 50%),
            linear-gradient(105deg, rgba(255, 215, 0, 0.2) 0%, transparent 55%),
            linear-gradient(165deg, rgba(255, 165, 0, 0.15) 0%, transparent 60%),
            linear-gradient(130deg, rgba(255, 140, 0, 0.12) 0%, transparent 65%),
            linear-gradient(145deg, rgba(255, 215, 0, 0.1) 0%, transparent 70%),
            linear-gradient(115deg, rgba(255, 165, 0, 0.08) 0%, transparent 75%),
            linear-gradient(160deg, rgba(255, 140, 0, 0.05) 0%, transparent 80%);
          pointer-events: none;
          z-index: 1;
          animation: ambient-light-pulse 6s ease-in-out infinite;
        }

        /* Moon Styles */
        .moon-container {
          position: fixed;
          top: 20px;
          left: 80px;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 40;
          overflow: visible;
        }

        .moon {
          position: absolute;
          top: 20px;
          left: 80px;
          width: 50px;
          height: 50px;
          background: radial-gradient(circle, #f0f0f0 0%, #e0e0e0 50%, #d0d0d0 100%);
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3), 0 0 30px rgba(200, 200, 200, 0.2);
          animation: moon-glow 4s ease-in-out infinite;
        }

        @keyframes moon-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3), 0 0 30px rgba(200, 200, 200, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.5), 0 0 40px rgba(200, 200, 200, 0.3);
          }
        }

        /* Enhanced Stars Styles */
        .stars-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          pointer-events: none;
          z-index: 30;
          overflow: visible;
        }

        .stars {
          position: fixed;
          font-size: 10px;
          color: white;
          text-shadow: 0 0 4px rgba(255, 255, 255, 0.8), 0 0 6px rgba(240, 248, 255, 0.6);
          animation: emoji-twinkle 2s ease-in-out infinite;
          transition: opacity 0.2s ease-out;
        }

        .star-1 { top: 5%; left: 10%; animation-delay: 0s; }
        .star-2 { top: 15%; left: 25%; animation-delay: 0.3s; }
        .star-3 { top: 8%; left: 40%; animation-delay: 0.6s; }
        .star-4 { top: 25%; left: 60%; animation-delay: 0.9s; }
        .star-5 { top: 12%; left: 80%; animation-delay: 1.2s; }
        .star-6 { top: 35%; left: 15%; animation-delay: 1.5s; }
        .star-7 { top: 18%; left: 90%; animation-delay: 1.8s; }
        .star-8 { top: 45%; left: 70%; animation-delay: 2.1s; }
        .star-9 { top: 28%; left: 5%; animation-delay: 2.4s; }
        .star-10 { top: 55%; left: 85%; animation-delay: 2.7s; }
        .star-11 { top: 38%; left: 45%; animation-delay: 3s; }
        .star-12 { top: 65%; left: 25%; animation-delay: 3.3s; }

        .stars-delay-1 { animation-delay: 0.5s; }
        .stars-delay-2 { animation-delay: 1s; }
        .stars-delay-3 { animation-delay: 1.5s; }
        .stars-delay-4 { animation-delay: 2s; }
        .stars-delay-5 { animation-delay: 2.5s; }
        .stars-delay-6 { animation-delay: 3s; }
        .stars-delay-7 { animation-delay: 3.5s; }
        .stars-delay-8 { animation-delay: 4s; }
        .stars-delay-9 { animation-delay: 4.5s; }
        .stars-delay-10 { animation-delay: 5s; }
        .stars-delay-11 { animation-delay: 5.5s; }

        @keyframes emoji-twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
            text-shadow: 0 0 4px rgba(255, 255, 255, 0.6), 0 0 6px rgba(240, 248, 255, 0.4);
          }
          25% {
            opacity: 0.8;
            transform: scale(1.1);
            text-shadow: 0 0 10px rgba(255, 255, 255, 1), 0 0 15px rgba(240, 248, 255, 0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
            text-shadow: 0 0 15px rgba(255, 255, 255, 1), 0 0 20px rgba(240, 248, 255, 0.9);
          }
          75% {
            opacity: 0.6;
            transform: scale(1.0);
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(240, 248, 255, 0.6);
          }
        }



        .page-section {
          animation: page-section-glow 8s ease-in-out infinite;
        }
      `}</style>
      
      {renderTimeBasedContent()}
    </>
  );
};

export default PongalSunEffect;
