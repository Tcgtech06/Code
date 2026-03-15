import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Instagram } from 'lucide-react';

// Custom X (formerly Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function Footer() {
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="flex flex-col items-start">
            <Link to="/" onClick={handleLinkClick} className="mb-4">
              <img 
                src="/Images/Tcgtech.png" 
                alt="TCG Technology Logo" 
                className="h-12 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>
            <p className="text-gray-400 text-sm">Transforming businesses through innovative technology solutions.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/contact" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><Link to="/" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Cloud Solutions</Link></li>
              <li><Link to="/" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Software Development</Link></li>
              <li><Link to="/" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">IT Consulting</Link></li>
              <li><Link to="/" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Digital Transformation</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/18mrozizj7/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://x.com/tech_tcg06" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <XIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/tcgtechofficial?igsh=NnN0Z3h6aWtjMzgx" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()}. All Rights Reserved By <span className="text-red-500">T</span><span className="text-green-500">C</span><span className="text-yellow-500">G</span> <span className="text-blue-500">TECH</span></p>
        </div>
      </div>
    </footer>
  );
}