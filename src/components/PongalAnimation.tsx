import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import oxAnimation from '../../ox.json';

const PongalAnimation: React.FC = () => {
  const [currentDay, setCurrentDay] = useState<number>(13);

  useEffect(() => {
    const now = new Date();
    const date = now.getDate();
    setCurrentDay(date);
  }, []);

  const getAnimationForDay = () => {
    // Show ox animation only on Mattu Pongal (January 16th)
    if (currentDay === 16) {
      return (
        <>
          <div className="fixed top-20 right-4 z-40" style={{ animation: 'ox-gentle-float 4s ease-in-out infinite' }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
              <Lottie 
                animationData={oxAnimation} 
                loop={true}
                style={{
                  width: '100%',
                  height: '100%',
                  filter: 'brightness(0.85) contrast(1.1)'
                }}
              />
            </div>
          </div>
        </>
      );
    }
    
    // Remove all animations after January 18th
    if (currentDay > 18) {
      return null;
    }
    
    // No animations on other days during Pongal season (Jan 14-17)
    return null;
  };

  return (
    <>
      <style>{`
        @keyframes ox-gentle-float {
          0%, 100% {
            transform: translateX(0px) translateY(0px) scale(1);
          }
          25% {
            transform: translateX(10px) translateY(-2px) scale(1.02);
          }
          50% {
            transform: translateX(20px) translateY(0px) scale(1.03);
          }
          75% {
            transform: translateX(10px) translateY(2px) scale(1.02);
          }
        }
        
        @keyframes pongal-fly {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(calc(100vw + 100%));
          }
        }
        
        @keyframes pongal-fly-right {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(calc(-100vw - 100%));
          }
        }
      `}</style>
      {getAnimationForDay()}
    </>
  );
};

export default PongalAnimation;
