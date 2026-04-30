import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Globe, 
  Smartphone, 
  ShoppingCart, 
  Settings,
  TrendingUp,
  MessageCircle,
  Star,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Client {
  id: number;
  name: string;
  logo: string;
  originalLogo: string;
  review: string;
  rating: number;
  author: string;
  website?: string;
}

const Home: React.FC = () => {

  // ============================================
  // PRODUCTS SECTION VISIBILITY CONTROL
  // To enable the products section: change false to true
  // To disable the products section: change true to false
  // ============================================
  const showProductsSection = false;
  
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const products = [
    {
      name: "Echo Solutions",
      image: "/Images/echo.png",
      description: "Echo business solutions platform",
      color: "#f59e0b"
    },
    {
      name: "Catering App",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center",
      description: "Complete catering management solution",
      color: "#3b82f6"
    },
    {
      name: "E-Commerce Platform",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&crop=center",
      description: "Complete online store solution",
      color: "#10b981"
    },
    {
      name: "Mobile Banking App",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop&crop=center",
      description: "Secure mobile banking solution",
      color: "#8b5cf6"
    },
    {
      name: "AI Analytics Dashboard",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center",
      description: "AI-powered business analytics",
      color: "#ef4444"
    }
  ];

  const services = [
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Web Development",
      description: "Custom web solutions with cutting-edge technologies.",
      color: "green",
      borderColor: "border-green-500",
      link: "/services/web-development"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "App Development", 
      description: "Native and cross-platform mobile applications.",
      color: "red",
      borderColor: "border-red-500",
      link: "/services/app-development"
    },
    {
      icon: <ShoppingCart className="h-8 w-8" />,
      title: "E-Commerce",
      description: "Complete online store solutions and management.",
      color: "yellow",
      borderColor: "border-yellow-500",
      link: "/services/ecommerce"
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "System Software",
      description: "Custom system software development and integration.",
      color: "green",
      borderColor: "border-green-500",
      link: "/services/system-software"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "SEO / Digital Marketing",
      description: "Comprehensive digital marketing strategies.",
      color: "red",
      borderColor: "border-red-500",
      link: "/services/seo-digital-marketing"
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "AI Chatbot Development",
      description: "Intelligent chatbot solutions powered by AI.",
      color: "yellow",
      borderColor: "border-yellow-500",
      link: "/services/ai-chatbot-development"
    }
  ];

  const clientLogos: Client[] = [
    {
      id: 1,
      name: "MALI ENTERPRISES",
      logo: "/Images/mali.png",
      originalLogo: "/Images/mali.png",
      review: "TCG ECH transformed our Farming Equipment business into National Digital Market with their innovative web development soution. Now we are Getting more sales from all over India",
      rating: 5,
      author: "MD, MALI ENTERPRISES",
      website: "https://malienterprises.in"
    },
    {
      id: 2,
      name: "MANJUNATH ENTERPRISES",
      logo: "/Images/manjunath.png",
      originalLogo: "/Images/manjunath.png",
      review: "Through their Advanced Web solutions they provide and drastic Increase of sales through online for Our Farming products",
      rating: 5,
      author: "FOUNDER, MANJUNATH ENTERPRISES",
      website: "https://manjunathenterprises.in"
    },
    {
      id: 3,
      name: "அதிரசம்",
      logo: "/Images/adhirasam.png",
      originalLogo: "/Images/adhirasam.png",
      review: "Tcg Tech developed an website for my Homemade traditional sweets which beautifully showcases our products and has helped us reach customers across Tamil Nadu and other states too",
      rating: 5,
      author: "MD, அதிரசம்",
      website: "https://adhirasam.in"
    },
    {
      id: 4,
      name: "METRO FIRE SAFETY SOLUTIONS",
      logo: "/Images/metrosafe.png",
      originalLogo: "/Images/metrosafe.png",
      review: "TCG Technology's custom software solutions for the Fire safety products and Equipments which helped us to easily Grow in the market",
      rating: 5,
      author: "Safety Director, Metro Fire Safe",
      website: "https://metrosafe.in"
    },
    {
      id: 5,
      name: "KAUMARA DENTAL CLINIC",
      logo: "/Images/kaumara.jpeg",
      originalLogo: "/Images/kaumara.jpeg",
      review: "Their web development team delivered an outstanding website that perfectly represents our brand. The user experience is exceptional.",
      rating: 5,
      author: "DR.Niddhish Krishna (Pediatric Dentist), KAUMARA DENTAL CLINIC",
      website: "https://kaumaradental.com"
    },
    {
      id: 6,
      name: "TREK INDIA",
      logo: "/Images/trekindia.png",
      originalLogo: "/Images/trekindia.png",
      review: "Their Technical Team Guided Us in the Digital Marketing Path way to Gain More Trekkers and Travelers from All Over India",
      rating: 5,
      author: "Founder,TREK INDIA",
      website: "https://trekindia.co"
    },
    {
      id: 7,
      name: "KNITINFO",
      logo: "/Images/knitinfo.png",
      originalLogo: "/Images/knitinfo.png",
      review: "TCG TECH technical Team is very Good with full of Young Blood's and Their Dedication is Huge , They Build me an Hybrid Web App that is Awesome",
      rating: 5,
      author: "MD, KNITINFO",
      website: "https://knitinfo.in"
    },
    {
      id: 8,
      name: "PUGAZH OVERSEAS",
      logo: "/Images/pugazh.png",
      originalLogo: "/Images/pugazh.png",
      review: "We are satisfied with the TCG team's Work they have Delivered Our Requirements and Fullfilled it",
      rating: 5,
      author: "PUGAZH OVERSEAS",
      website: "https://pugazhoverseas.in"
    }
  ];

  const [selectedStory, setSelectedStory] = useState<Client | null>(null);
  const [lastTap, setLastTap] = useState(0);

  const nextProduct = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentProductIndex((prev) => (prev + 1) % products.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, products.length]);

  const prevProduct = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentProductIndex((prev) => (prev - 1 + products.length) % products.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, products.length]);


  const getIconColor = (color: string) => {
    switch(color) {
      case 'green': return 'text-green-500';
      case 'red': return 'text-red-500';
      case 'yellow': return 'text-yellow-500';
      default: return 'text-blue-500';
    }
  };

  const handleClientClick = (client: Client) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 400; // ms
    
    if (now - lastTap < DOUBLE_TAP_DELAY && client.website) {
      // Double tap detected and client has a website
      window.open(client.website, '_blank', 'noopener,noreferrer');
      setLastTap(0); // Reset to prevent triple tap issues
    } else {
      // Single tap - show review
      setLastTap(now);
      setTimeout(() => {
        if (Date.now() - now >= DOUBLE_TAP_DELAY) {
          setSelectedStory(client);
          document.getElementById('customer-stories')?.scrollIntoView({ behavior: 'smooth' });
        }
      }, DOUBLE_TAP_DELAY);
    }
  };

  const handleCloseReview = () => {
    setSelectedStory(null);
    // Scroll back to clients section
    document.getElementById('our-clients')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextProduct();
    }
    if (isRightSwipe) {
      prevProduct();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevProduct();
      if (e.key === 'ArrowRight') nextProduct();
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextProduct, prevProduct]);

  return (
    <div className="min-h-screen relative">
      <style>{`
        @keyframes slideHorizontal {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(40px);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .hero-title {
          animation: fadeInUp 1.5s ease-out forwards;
          opacity: 0;
        }
        
        .hero-subtitle {
          animation: fadeInUp 1.5s ease-out 0.5s forwards;
          opacity: 0;
        }
      `}</style>
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Earth from space"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="hero-title text-xl md:text-3xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            Innovation. Integration. Evolution.
          </h1>
          <p className="hero-subtitle text-xs md:text-base lg:text-xl max-w-3xl mx-auto text-gray-200">
            Leading the digital transformation with cutting-edge technology solutions for businesses worldwide.
          </p>
        </div>
      </section>

      {/* Our Products Section - Controlled by showProductsSection variable */}
      {showProductsSection && (
      <section className="py-2 md:py-6 lg:py-8 bg-gradient-to-br from-gray-800 via-blue-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-base md:text-xl lg:text-3xl font-bold text-center text-white mb-6">
            OUR PRODUCTS
          </h2>
          
          <div className="relative h-[200px] md:h-[300px] lg:h-[400px] max-w-4xl mx-auto flex items-center justify-center overflow-hidden bg-gray-900/50 rounded-2xl p-2 md:p-4 lg:p-6 shadow-2xl border border-gray-700/50">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2429')] opacity-10 bg-cover"></div>
            {/* Navigation Buttons */}
            <div className="hidden md:block z-10">
              <button
                onClick={prevProduct}
                className="absolute left-8 z-50 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                disabled={isTransitioning}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                onClick={nextProduct}
                className="absolute right-8 z-50 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                disabled={isTransitioning}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Product Cards Stack - Deck Style */}
            <div 
              className="relative w-full h-full flex items-center justify-center transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {products.map((product, index) => {
                const position = index - currentProductIndex;
                const isCenter = position === 0;
                const isLeft = position === -1 || position === products.length - 1;
                const isRight = position === 1 || position === -(products.length - 1);
                
                // Always show center, left, and right cards
                if (!isCenter && !isLeft && !isRight) return null;
                
                return (
                  <div
                    key={index}
                    className={`absolute transition-all duration-500 ease-in-out cursor-pointer transform-gpu ${
                      isCenter 
                        ? 'opacity-100 z+60'
                        : isLeft
                        ? 'opacity-60 z+60'
                        : isRight
                        ? 'opacity-60 z+60'
                        : 'opacity-0'
                    }`}
                    style={{
                      transform: isCenter
                        ? 'translateX(0px) translateZ(0px) rotateY(0deg) scale(1)'
                        : isLeft
                        ? 'translateX(-50%) translateZ(-120px) rotateY(30deg) scale(0.85)'
                        : isRight
                        ? 'translateX(50%) translateZ(-120px) rotateY(-30deg) scale(0.85)'
                        : 'translateX(0px) translateZ(-200px) rotateY(0deg) scale(0.7)',
                      zIndex: isCenter ? 30 : 20
                    }}
                    onClick={() => {
                      if (!isCenter && !isTransitioning) {
                        if (position > 0) nextProduct();
                        if (position < 0) prevProduct();
                      }
                    }}
                  >
                    <div className={`${product.name === 'Echo Solutions' ? 'bg-gray-100/70 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'} rounded-2xl shadow-2xl overflow-hidden w-40 md:w-60 lg:w-[320px] h-[120px] md:h-[170px] lg:h-[250px] transition-all duration-300 ${
                      isCenter ? 'hover:scale-105 shadow-3xl' : 'shadow-lg'
                    }`}>
                      {product.name === 'Echo Solutions' ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-1/2 h-1/2 object-contain"
                          />
                          <h3 className="text-xs md:text-lg lg:text-2xl font-bold text-green-500 mt-2">echo</h3>
                        </div>
                      ) : (
                        <div className="relative h-full overflow-hidden rounded-2xl">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-2xl"
                          />
                          <div 
                            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                            style={{ backgroundColor: `${product.color}10` }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-1 md:p-3 lg:p-6 text-white bg-gradient-to-t from-black/80 to-transparent">
                            <h3 className="text-xs md:text-sm lg:text-xl font-bold">{product.name}</h3>
                            <p className="text-xs md:text-xs text-white/80 mt-1 hidden md:block">{product.description}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setCurrentProductIndex(index);
                    setTimeout(() => setIsTransitioning(false), 300);
                  }
                }}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentProductIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Our Services Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-4 relative inline-block">
              <span className="relative z-10">OUR SERVICES</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 blur-xl"></div>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">Transform your business with cutting-edge solutions tailored to your needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className={`group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-t-4 ${service.borderColor} overflow-hidden cursor-pointer`}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon container */}
                <div className={`relative z-10 mb-6 transform transition-transform duration-300 group-hover:scale-110`}>
                  <div className={`${getIconColor(service.color)} p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    {service.icon}
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-300">
                    {service.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
                
                {/* Decorative corner accent */}
                <div className={`absolute top-0 right-0 w-16 h-16 ${service.borderColor.replace('border-', 'bg-')} opacity-10 rounded-bl-full transform rotate-45 translate-x-8 -translate-y-8`}></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Clients Section */}
      <section id="our-clients" className="py-16 bg-gradient-to-b from-yellow-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            OUR CLIENTS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {clientLogos.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-3xl shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 filter grayscale hover:grayscale-0 relative"
                onClick={() => handleClientClick(client)}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Double Tap to Visit
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-xs text-gray-700 mb-2 text-center bg-blue-100 px-3 py-1 rounded-full">Double Tap to Visit</p>
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="w-full h-20 object-contain mb-4"
                  />
                  <h3 className="text-xs md:text-base font-semibold text-gray-700 text-center">
                    {client.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Stories Section */}
      {selectedStory && (
        <section id="customer-stories" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
              <div className="flex items-start space-x-4">
                <img
                  src={selectedStory.originalLogo}
                  alt={selectedStory.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedStory.name}</h3>
                  <div className="flex mb-3">
                    {[...Array(selectedStory.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic text-base leading-relaxed mb-3">
                    "{selectedStory.review}"
                  </p>
                  <p className="text-gray-600 font-medium text-sm">
                    — {selectedStory.author}
                  </p>
                </div>
                <button 
                  onClick={handleCloseReview}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}


      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Let's discuss how we can help you achieve your digital transformation goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
            >
              Start Your Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/careers"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 text-sm"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;