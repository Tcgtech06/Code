import React from 'react';

const OxPloughAnimation: React.FC = () => {
  return (
    <div className="ox-plough-animation">
      <style>{`
        @keyframes ox-walk {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(30px);
          }
        }

        @keyframes plough-move {
          0%, 100% {
            transform: translateX(0px) rotate(-2deg);
          }
          50% {
            transform: translateX(30px) rotate(2deg);
          }
        }

        @keyframes earth-move {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .ox-plough-container {
          position: relative;
          width: 200px;
          height: 120px;
          overflow: hidden;
        }

        .ox-body {
          position: absolute;
          left: 20px;
          top: 40px;
          width: 60px;
          height: 40px;
          background: linear-gradient(135deg, #4a4a4a 0%, #2c2c2c 50%, #1a1a1a 100%);
          border-radius: 20px 15px 15px 20px;
          animation: ox-walk 3s ease-in-out infinite;
        }

        .ox-head {
          position: absolute;
          left: 10px;
          top: 45px;
          width: 25px;
          height: 20px;
          background: linear-gradient(135deg, #3a3a3a 0%, #1c1c1c 100%);
          border-radius: 50% 40% 40% 50%;
          animation: ox-walk 3s ease-in-out infinite;
        }

        .ox-horn {
          position: absolute;
          width: 8px;
          height: 3px;
          background: #f4e4c1;
          border-radius: 2px;
        }

        .ox-horn.left {
          left: 8px;
          top: 42px;
          transform: rotate(-20deg);
          animation: ox-walk 3s ease-in-out infinite;
        }

        .ox-horn.right {
          left: 8px;
          top: 48px;
          transform: rotate(20deg);
          animation: ox-walk 3s ease-in-out infinite;
        }

        .ox-leg {
          position: absolute;
          width: 6px;
          height: 15px;
          background: linear-gradient(180deg, #2c2c2c 0%, #1a1a1a 100%);
          border-radius: 3px;
        }

        .ox-leg.front-left {
          left: 25px;
          top: 75px;
          animation: ox-walk 3s ease-in-out infinite;
        }

        .ox-leg.front-right {
          left: 35px;
          top: 75px;
          animation: ox-walk 3s ease-in-out infinite 0.15s;
        }

        .ox-leg.back-left {
          left: 55px;
          top: 75px;
          animation: ox-walk 3s ease-in-out infinite 0.3s;
        }

        .ox-leg.back-right {
          left: 65px;
          top: 75px;
          animation: ox-walk 3s ease-in-out infinite 0.45s;
        }

        .ox-tail {
          position: absolute;
          left: 75px;
          top: 50px;
          width: 15px;
          height: 3px;
          background: #2c2c2c;
          border-radius: 2px;
          transform: rotate(-10deg);
          animation: ox-walk 3s ease-in-out infinite;
        }

        .yoke {
          position: absolute;
          left: 70px;
          top: 48px;
          width: 30px;
          height: 8px;
          background: linear-gradient(180deg, #8b4513 0%, #654321 100%);
          border-radius: 4px;
          animation: ox-walk 3s ease-in-out infinite;
        }

        .plough-beam {
          position: absolute;
          left: 95px;
          top: 52px;
          width: 40px;
          height: 4px;
          background: linear-gradient(180deg, #654321 0%, #4a3018 100%);
          animation: plough-move 3s ease-in-out infinite;
        }

        .plough-blade {
          position: absolute;
          left: 130px;
          top: 45px;
          width: 0;
          height: 0;
          border-left: 15px solid transparent;
          border-right: 5px solid transparent;
          border-top: 20px solid #4a3018;
          transform: rotate(45deg);
          animation: plough-move 3s ease-in-out infinite;
        }

        .plough-handle {
          position: absolute;
          left: 100px;
          top: 35px;
          width: 25px;
          height: 3px;
          background: #654321;
          transform: rotate(-30deg);
          animation: plough-move 3s ease-in-out infinite;
        }

        .earth {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 20px;
          background: linear-gradient(180deg, #8b6f47 0%, #6b5637 100%);
          overflow: hidden;
        }

        .furrow {
          position: absolute;
          bottom: 10px;
          left: -100%;
          width: 150%;
          height: 2px;
          background: rgba(0, 0, 0, 0.2);
          animation: earth-move 4s linear infinite;
        }

        .furrow:nth-child(2) {
          bottom: 6px;
          animation-delay: 1s;
        }

        .furrow:nth-child(3) {
          bottom: 14px;
          animation-delay: 2s;
        }

        .furrow:nth-child(4) {
          bottom: 2px;
          animation-delay: 3s;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .ox-plough-container {
            width: 150px;
            height: 90px;
          }

          .ox-body {
            width: 45px;
            height: 30px;
            left: 15px;
            top: 30px;
          }

          .ox-head {
            width: 20px;
            height: 15px;
            left: 8px;
            top: 33px;
          }

          .ox-leg {
            width: 4px;
            height: 12px;
          }

          .ox-leg.front-left { left: 20px; top: 55px; }
          .ox-leg.front-right { left: 27px; top: 55px; }
          .ox-leg.back-left { left: 42px; top: 55px; }
          .ox-leg.back-right { left: 49px; top: 55px; }

          .yoke {
            width: 25px;
            height: 6px;
            left: 55px;
            top: 36px;
          }

          .plough-beam {
            width: 30px;
            height: 3px;
            left: 75px;
            top: 39px;
          }

          .plough-blade {
            left: 100px;
            top: 33px;
            border-left-width: 12px;
            border-right-width: 4px;
            border-top-width: 16px;
          }

          .plough-handle {
            width: 20px;
            height: 2px;
            left: 78px;
            top: 26px;
          }
        }
      `}</style>

      <div className="ox-plough-container">
        {/* Ox */}
        <div className="ox-body"></div>
        <div className="ox-head"></div>
        <div className="ox-horn left"></div>
        <div className="ox-horn right"></div>
        <div className="ox-leg front-left"></div>
        <div className="ox-leg front-right"></div>
        <div className="ox-leg back-left"></div>
        <div className="ox-leg back-right"></div>
        <div className="ox-tail"></div>
        
        {/* Yoke */}
        <div className="yoke"></div>
        
        {/* Plough */}
        <div className="plough-beam"></div>
        <div className="plough-blade"></div>
        <div className="plough-handle"></div>
        
        {/* Earth with furrows */}
        <div className="earth">
          <div className="furrow"></div>
          <div className="furrow"></div>
          <div className="furrow"></div>
          <div className="furrow"></div>
        </div>
      </div>
    </div>
  );
};

export default OxPloughAnimation;
