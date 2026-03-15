import { useEffect, useState, useRef } from 'react';

// Logo colors array for dynamic color selection
const logoColors = [
  '#dc2626', // Red (from hotdog-line:nth-child(1))
  '#22c55e', // Green (from hotdog-line:nth-child(2))
  '#eab308', // Yellow (from hotdog-line:nth-child(3))
  '#3b82f6'  // Blue (additional logo color)
];

const SnowEffect = () => {
  const [snowflakes, setSnowflakes] = useState<Array<{id: number, left: string, animationDuration: string, opacity: number, size: number, color: string}>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Create snowflakes
    const createSnowflakes = () => {
      const newSnowflakes = [];
      const count = 75; // Number of snowflakes
      
      for (let i = 0; i < count; i++) {
        newSnowflakes.push({
          id: i,
          left: `${Math.random() * 100}%`,
          animationDuration: `${5 + Math.random() * 10}s`,
          opacity: Math.random() * 0.7 + 0.3, // Between 0.3 and 1.0
          size: Math.random() * 6 + 2, // Between 2 and 8px (reduced from 5-15px)
          color: 'white' // Always white snowflakes
        });
      }
      
      setSnowflakes(newSnowflakes);
    };

    createSnowflakes();

    // Setup canvas for collision detection
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Animation loop for collision detection
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Get all white background elements except the header
      const whiteElements = document.querySelectorAll('[class*="bg-white"]:not(nav), .bg-gray-50:not(nav)');
      
      // Check for collisions and apply theme color effect
      whiteElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const hasThemeEffect = element.getAttribute('data-snow-theme-effect');
        
        // Simple collision detection - check if any snowflake is in the area
        const snowflakeElements = document.querySelectorAll('.snowflake');
        let hasCollision = false;
        
        snowflakeElements.forEach(snowflake => {
          const snowRect = snowflake.getBoundingClientRect();
          if (
            snowRect.left < rect.right &&
            snowRect.right > rect.left &&
            snowRect.top < rect.bottom &&
            snowRect.bottom > rect.top
          ) {
            hasCollision = true;
          }
        });
        
        if (hasCollision && !hasThemeEffect) {
          // Apply random logo color effect
          const randomColor = logoColors[Math.floor(Math.random() * logoColors.length)];
          element.setAttribute('data-snow-theme-effect', 'true');
          element.setAttribute('data-snow-color', randomColor);
          const htmlElement = element as HTMLElement;
          htmlElement.style.background = randomColor;
          htmlElement.style.transition = 'background 0.5s ease';
        } else if (!hasCollision && hasThemeEffect) {
          // Remove effect after delay
          setTimeout(() => {
            element.removeAttribute('data-snow-theme-effect');
            element.removeAttribute('data-snow-color');
            const htmlElement = element as HTMLElement;
            htmlElement.style.background = '';
          }, 2000);
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />
      <div className="snowflakes" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden'
      }}>
        <style>
          {`
            @keyframes fall {
              0% {
                transform: translateY(-10px) rotate(0deg);
              }
              100% {
                transform: translateY(100vh) rotate(360deg);
              }
            }
          `}
        </style>
        {snowflakes.map((snowflake) => (
          <div
            key={snowflake.id}
            className="snowflake"
            style={{
              position: 'absolute',
              left: snowflake.left,
              top: '-20px',
              width: `${snowflake.size}px`,
              height: `${snowflake.size}px`,
              background: 'white',
              borderRadius: '50%',
              opacity: snowflake.opacity,
              animation: `fall ${snowflake.animationDuration} linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </>
  );
};

export default SnowEffect;
