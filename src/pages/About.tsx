import { useEffect, useRef } from 'react';
import { Target, Award } from 'lucide-react';

export default function About() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="pt-16 relative">
      <style>{`
        @keyframes slideHorizontal {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(40px);
          }
        }
        .ox-slide {
          animation: slideHorizontal 3s ease-in-out infinite;
        }
        
        /* Hero Section Animations */
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Vision & Mission Animations */
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotate(-180deg) scale(0.5);
          }
          to {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }
        
        /* Journey Section Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInRotate {
          from {
            opacity: 0;
            transform: translateX(-50px) rotate(-10deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(0deg);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-50px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes flipIn {
          from {
            opacity: 0;
            transform: perspective(400px) rotateY(90deg);
          }
          to {
            opacity: 1;
            transform: perspective(400px) rotateY(0deg);
          }
        }
        
        /* Apply animations - start visible, animate when scrolled into view */
        .animate-on-scroll {
          opacity: 1;
        }
        
        .animate-on-scroll.animate-fadeInDown {
          opacity: 0;
        }
        
        .animate-on-scroll.animate-fadeInScale {
          opacity: 0;
        }
        
        .animate-on-scroll.animate-slideInFromLeft {
          opacity: 0;
        }
        
        .animate-on-scroll.animate-slideInFromRight {
          opacity: 0;
        }
        
        .animate-on-scroll.animate-rotateIn {
          opacity: 0;
        }
        
        .animate-on-scroll.animate-fadeInUp {
          opacity: 0;
        }
        
        .animate-on-scroll.animate-zoomIn {
          opacity: 0;
        }
        
        .animate-on-scroll.animate-slideInRotate {
          opacity: 0;
        }
        
        .animate-on-scroll.animate-bounceIn {
          opacity: 0;
        }
        
        .animate-on-scroll.animate-flipIn {
          opacity: 0;
        }
        
        .animate-on-scroll.animate-visible.animate-fadeInDown {
          animation: fadeInDown 1.2s ease-out forwards;
        }
        
        .animate-on-scroll.animate-visible.animate-fadeInScale {
          animation: fadeInScale 1.4s ease-out forwards;
        }
        
        .animate-on-scroll.animate-visible.animate-slideInFromLeft {
          animation: slideInFromLeft 1.2s ease-out forwards;
        }
        
        .animate-on-scroll.animate-visible.animate-slideInFromRight {
          animation: slideInFromRight 1.2s ease-out forwards;
        }
        
        .animate-on-scroll.animate-visible.animate-rotateIn {
          animation: rotateIn 1s ease-out forwards;
        }
        
        .animate-on-scroll.animate-visible.animate-fadeInUp {
          animation: fadeInUp 1.2s ease-out forwards;
        }
        
        .animate-on-scroll.animate-visible.animate-zoomIn {
          animation: zoomIn 1s ease-out forwards;
        }
        
        .animate-on-scroll.animate-visible.animate-slideInRotate {
          animation: slideInRotate 1.2s ease-out forwards;
        }
        
        .animate-on-scroll.animate-visible.animate-bounceIn {
          animation: bounceIn 1.4s ease-out forwards;
        }
        
        .animate-on-scroll.animate-visible.animate-flipIn {
          animation: flipIn 1.2s ease-out forwards;
        }
        
        /* Delay classes */
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        .delay-900 { animation-delay: 0.9s; }
        .delay-1000 { animation-delay: 1s; }
        .delay-1200 { animation-delay: 1.2s; }
        .delay-1300 { animation-delay: 1.3s; }
        .delay-1400 { animation-delay: 1.4s; }
        .delay-1500 { animation-delay: 1.5s; }
        .delay-1600 { animation-delay: 1.6s; }
        .delay-1700 { animation-delay: 1.7s; }
        .delay-1800 { animation-delay: 1.8s; }
        .delay-1900 { animation-delay: 1.9s; }
        .delay-2000 { animation-delay: 2s; }
      `}</style>
      
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-8 animate-on-scroll animate-fadeInDown">About TCG Technology</h1>
          <p className="text-base md:text-xl text-gray-600 text-center max-w-3xl mx-auto animate-on-scroll animate-fadeInScale delay-400">
            We are a leading technology company dedicated to helping businesses thrive in the digital age through innovative solutions and expert consulting.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg animate-on-scroll animate-slideInFromLeft">
              <Target className="h-12 w-12 text-blue-600 mb-4 animate-on-scroll animate-rotateIn delay-400" />
              <h2 className="text-lg md:text-2xl font-bold mb-4 animate-on-scroll animate-fadeInUp delay-500">Our Vision</h2>
              <p className="text-gray-600 animate-on-scroll animate-fadeInUp delay-700">
                To be the global leader in digital transformation, empowering businesses to achieve their full potential through technology.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg animate-on-scroll animate-slideInFromRight delay-300">
              <Award className="h-12 w-12 text-blue-600 mb-4 animate-on-scroll animate-rotateIn delay-700" />
              <h2 className="text-lg md:text-2xl font-bold mb-4 animate-on-scroll animate-fadeInUp delay-800">Our Mission</h2>
              <p className="text-gray-600 animate-on-scroll animate-fadeInUp delay-1000">
                To deliver innovative, scalable, and secure technology solutions that drive business growth and create lasting value for our clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Work Culture Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 relative overflow-hidden">
        <style>{`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes scaleInCard {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes glow {
            0%, 100% {
              box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            }
            50% {
              box-shadow: 0 4px 30px rgba(59, 130, 246, 0.6);
            }
          }
          
          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          .culture-card {
            animation: slideInUp 0.6s ease-out forwards;
          }
          
          .culture-card:nth-child(1) {
            animation-delay: 0.1s;
          }
          
          .culture-card:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          .culture-card:nth-child(3) {
            animation-delay: 0.3s;
          }
          
          .culture-card:nth-child(4) {
            animation-delay: 0.4s;
          }
          
          .culture-card:hover {
            animation: glow 0.6s ease-in-out;
            transform: translateY(-12px);
          }
          
          .culture-emoji {
            font-size: 3rem;
            animation: bounce 2s ease-in-out infinite;
          }
          
          .culture-card:hover .culture-emoji {
            animation: rotate 0.6s ease-in-out;
          }
          
          .culture-background {
            position: absolute;
            opacity: 0.1;
            pointer-events: none;
          }
        `}</style>
        
        {/* Decorative background elements */}
        <div className="culture-background absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="culture-background absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 text-gray-800 animate-on-scroll animate-zoomIn">Our Work Culture</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto animate-on-scroll animate-fadeInScale delay-400">
            We believe in creating an environment where talent thrives, innovation flourishes, and team members feel valued.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="culture-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500 bg-gradient-to-br from-white to-blue-50">
              <div className="culture-emoji mb-4">⏰</div>
              <h3 className="text-base md:text-xl font-semibold mb-3 text-gray-800">Free working Hours</h3>
              <p className="text-gray-600 leading-relaxed">Enjoy flexible working hours that fit your lifestyle and boost productivity.</p>
            </div>
            <div className="culture-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-500 bg-gradient-to-br from-white to-green-50">
              <div className="culture-emoji mb-4">💰</div>
              <h3 className="text-base md:text-xl font-semibold mb-3 text-gray-800">Industry leading Earning</h3>
              <p className="text-gray-600 leading-relaxed">Earn competitive compensation based on your project contributions and impact.</p>
            </div>
            <div className="culture-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-yellow-500 bg-gradient-to-br from-white to-yellow-50">
              <div className="culture-emoji mb-4">🚀</div>
              <h3 className="text-base md:text-xl font-semibold mb-3 text-gray-800">Learning Technologies</h3>
              <p className="text-gray-600 leading-relaxed">Stay ahead with continuous learning and access to cutting-edge technologies.</p>
            </div>
            <div className="culture-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-purple-500 bg-gradient-to-br from-white to-purple-50">
              <div className="culture-emoji mb-4">🎯</div>
              <h3 className="text-base md:text-xl font-semibold mb-3 text-gray-800">Multi-Role Experience</h3>
              <p className="text-gray-600 leading-relaxed">Expand your skill set and career prospects by engaging in diverse roles and projects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-16 text-gray-800 animate-on-scroll animate-bounceIn">Our Story</h2>

          <div className="relative">
            {/* Timeline connector line - visible on all screens */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-red-400 via-yellow-400 to-blue-400"></div>

            <div className="space-y-12">
              {/* 2021 - The Spark Begins */}
              <div className="relative animate-on-scroll">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-5/12 md:text-right">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-red-300 ml-16 md:ml-0 animate-on-scroll animate-slideInFromLeft delay-400">
                      <h3 className="text-xl md:text-3xl font-bold mb-3 text-red-600 animate-on-scroll animate-fadeInUp delay-600">2021 ✨</h3>
                      <h4 className="text-lg md:text-2xl font-semibold mb-3 text-red-700 animate-on-scroll animate-fadeInUp delay-800">The Spark Begins</h4>
                      <p className="text-gray-700 leading-relaxed animate-on-scroll animate-fadeInUp delay-1000">
                        TCG TECH was born as a technology-focused YouTube channel, created to share knowledge, explore innovation, and simplify technology for everyone. What started as curiosity quickly turned into purpose.
                      </p>
                    </div>
                  </div>
                  <div className="flex md:w-2/12 justify-center absolute left-0 md:static">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10 animate-on-scroll animate-zoomIn delay-500">
                      <span className="text-3xl">✨</span>
                    </div>
                  </div>
                  <div className="md:w-5/12"></div>
                </div>
              </div>

              {/* 2022 - Momentum Takes Shape */}
              <div className="relative animate-on-scroll">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-5/12"></div>
                  <div className="flex md:w-2/12 justify-center absolute left-0 md:static">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10 animate-on-scroll animate-bounceIn delay-700">
                      <span className="text-xl md:text-3xl">📈</span>
                    </div>
                  </div>
                  <div className="md:w-5/12 md:text-left">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-orange-300 ml-16 md:ml-0 animate-on-scroll animate-slideInFromRight delay-800">
                      <h3 className="text-xl md:text-3xl font-bold mb-3 text-orange-600 animate-on-scroll animate-fadeInUp delay-1000">2022 📈</h3>
                      <h4 className="text-lg md:text-2xl font-semibold mb-3 text-orange-700 animate-on-scroll animate-fadeInUp delay-1200">Momentum Takes Shape</h4>
                      <p className="text-gray-700 leading-relaxed animate-on-scroll animate-fadeInUp delay-1400">
                        Consistency met community. Our content began reaching wider audiences, earning growing subscribers and high viewership. This year proved that value-driven technology content can build trust and influence.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2023 - From Learning to Building */}
              <div className="relative animate-on-scroll">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-5/12 md:text-right">
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-yellow-300 ml-16 md:ml-0 animate-on-scroll animate-flipIn delay-900">
                      <h3 className="text-xl md:text-3xl font-bold mb-3 text-yellow-600 animate-on-scroll animate-fadeInUp delay-1200">2023 🛠️</h3>
                      <h4 className="text-lg md:text-2xl font-semibold mb-3 text-yellow-700 animate-on-scroll animate-fadeInUp delay-1400">From Learning to Building</h4>
                      <p className="text-gray-700 leading-relaxed animate-on-scroll animate-fadeInUp delay-1600">
                        A defining transformation year. We stepped into freelance software development, converting expertise into real-world solutions. At the same time, our channel proudly crossed 1,000+ subscribers, marking our first major milestone.
                      </p>
                    </div>
                  </div>
                  <div className="flex md:w-2/12 justify-center absolute left-0 md:static">
                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10 animate-on-scroll animate-rotateIn delay-1000">
                      <span className="text-3xl">🛠️</span>
                    </div>
                  </div>
                  <div className="md:w-5/12"></div>
                </div>
              </div>

              {/* 2024 - Vision Finds Direction */}
              <div className="relative animate-on-scroll">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-5/12"></div>
                  <div className="flex md:w-2/12 justify-center absolute left-0 md:static">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10 animate-on-scroll animate-zoomIn delay-1200">
                      <span className="text-3xl">🎯</span>
                    </div>
                  </div>
                  <div className="md:w-5/12 md:text-left">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-green-300 ml-16 md:ml-0 animate-on-scroll animate-slideInRotate delay-1300">
                      <h3 className="text-3xl font-bold mb-3 text-green-600 animate-on-scroll animate-fadeInUp delay-1500">2024 🎯</h3>
                      <h4 className="text-2xl font-semibold mb-3 text-green-700 animate-on-scroll animate-fadeInUp delay-1700">Vision Finds Direction</h4>
                      <p className="text-gray-700 leading-relaxed animate-on-scroll animate-fadeInUp delay-1900">
                        With clarity came collaboration. TCG TECH expanded into a two-member core team and laid the groundwork for becoming a product-based IT startup. The focus shifted from short-term projects to long-term impact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2025 - Ideas Meet Execution */}
              <div className="relative animate-on-scroll">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-5/12 md:text-right">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-300 ml-16 md:ml-0 animate-on-scroll animate-slideInFromLeft delay-1600">
                      <h3 className="text-3xl font-bold mb-3 text-blue-600 animate-on-scroll animate-fadeInUp delay-1800">2025 🚀</h3>
                      <h4 className="text-2xl font-semibold mb-3 text-blue-700 animate-on-scroll animate-fadeInUp delay-2000">Ideas Meet Execution</h4>
                      <p className="text-gray-700 leading-relaxed animate-on-scroll animate-fadeInUp delay-2000">
                        Growth powered by delivery. We successfully served 20+ freelance clients, strengthening our industry presence. Parallelly, we began in-house product development, transforming concepts into scalable digital platforms.
                      </p>
                    </div>
                  </div>
                  <div className="flex md:w-2/12 justify-center absolute left-0 md:static">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10 animate-on-scroll animate-zoomIn delay-1700">
                      <span className="text-3xl">🚀</span>
                    </div>
                  </div>
                  <div className="md:w-5/12"></div>
                </div>
              </div>

              {/* 2026 - Innovation Becomes Identity */}
              <div className="relative animate-on-scroll">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-5/12"></div>
                  <div className="flex md:w-2/12 justify-center absolute left-0 md:static">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10 animate-on-scroll animate-bounceIn delay-2000">
                      <span className="text-3xl">🏢</span>
                    </div>
                  </div>
                  <div className="md:w-5/12 md:text-left">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-300 ml-16 md:ml-0 animate-on-scroll animate-slideInFromRight delay-2000">
                      <h3 className="text-3xl font-bold mb-3 text-purple-600 animate-on-scroll animate-fadeInUp delay-2000">2026 🏢</h3>
                      <h4 className="text-2xl font-semibold mb-3 text-purple-700 animate-on-scroll animate-fadeInUp delay-2000">Innovation Becomes Identity</h4>
                      <p className="text-gray-700 leading-relaxed animate-on-scroll animate-fadeInUp delay-2000">
                        A new chapter officially began. TCG TECH was registered as a product-based IT startup, now powered by a five-member team dedicated to building meaningful, future-ready solutions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coming Soon - Combined Block */}
              <div className="relative animate-on-scroll">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-5/12 md:text-right">
                    <div className="bg-gradient-to-br from-indigo-50 via-pink-50 to-red-100 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-dashed border-indigo-400 ml-16 md:ml-0 animate-on-scroll animate-flipIn delay-2000">
                      <h3 className="text-3xl font-bold mb-6 text-indigo-600 animate-on-scroll animate-zoomIn delay-2000">Coming Soon 🚀</h3>
                      
                      <div className="mb-6 pb-6 border-b-2 border-indigo-200 animate-on-scroll animate-fadeInScale delay-2000">
                        <div className="flex justify-center mb-4">
                          <img
                            src="/Images/echo.png"
                            alt="Echo Application"
                            className="w-24 h-24 object-contain"
                          />
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          A privacy-focused chat application built to redefine secure communication, combining simplicity with trust.
                        </p>
                      </div>
                      
                      <div className="animate-on-scroll animate-fadeInScale delay-2000">
                        <h4 className="text-2xl font-semibold mb-3 text-pink-700 flex items-center gap-2">
                          <span>🛵</span> On-Demand Delivery Platform
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          A scalable app inspired by Swiggy, designed to connect users with local services efficiently.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex md:w-2/12 justify-center absolute left-0 md:static">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10 animate-on-scroll animate-rotateIn delay-2000">
                      <span className="text-3xl">✨</span>
                    </div>
                  </div>
                  <div className="md:w-5/12"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}