import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useSnowEffect from '../hooks/useSnowEffect';
import SunAnimation from './SunAnimation';
import Lottie from 'lottie-react';
import diwaliAnimation from '../../Happy diwali animated graphic.json';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);
  const { showSeason, seasonType } = useSnowEffect();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [prevScrollPos]);

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/careers', label: 'Careers' },
    { path: '/contact', label: 'Contact Us' }
  ];

  return (
    <>
    <nav 
      ref={navRef}
      className={`bg-white shadow-lg fixed w-full z-50 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="md:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="hotdog-button"
                aria-label="Toggle menu"
              >
                <span className={`hotdog-line ${isOpen ? 'open' : ''}`}></span>
                <span className={`hotdog-line ${isOpen ? 'open' : ''}`}></span>
                <span className={`hotdog-line ${isOpen ? 'open' : ''}`}></span>
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center flex-1 justify-center">
            {/* Pongal GIF in center - Only during Pongal season (Jan 10-18) */}
            {showSeason && seasonType === 'pongal' && (
              <img 
                src="/Images/Happy Pongal.gif" 
                alt="Happy Pongal"
                className="h-14 w-auto"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            
            {/* Happy Diwali Animation in center - Only during Diwali season */}
            {showSeason && seasonType === 'diwali' && (
              <div className="h-16 w-auto flex items-center animate-pulse">
                <Lottie 
                  animationData={diwaliAnimation} 
                  loop={true}
                  style={{
                    height: '64px',
                    width: 'auto',
                    filter: 'brightness(1.1) contrast(1.2)'
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center">
            <Link to="/" className="flex items-center relative">
              <img 
                src="/Images/Tcgtech.png"
                alt="TCG Technology Logo"
                className="h-20 w-20"
              />
              {/* Santa Hat - only shows during Christmas season */}
              {showSeason && seasonType === 'christmas' && (
                <div className="absolute top-2.5 left-1.5 transform -translate-x-0/0 -translate-y-0/0 z-0">
                  <img
                    src="/Images/hat.png"
                    alt="Santa Hat"
                    className="w-6.5 h-5 object-cover"
                  />
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile side panel navigation */}
      <div 
        className={`fixed inset-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden z-50`}
      >
        <div className="p-6 h-full mt-24">
          <div className="flex flex-col space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-4 py-4 rounded-md transition-colors text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      </nav>
      <SunAnimation />
    </>
  );
}