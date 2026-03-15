import React, { useState, useEffect, useRef } from 'react';
import { Check, Star, Zap, Crown, Sparkles, Rocket, Code, Palette, Globe, Shield, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Package {
  id: string;
  name: string;
  tagline: string;
  price: string;
  color: string;
  gradient: string;
  icon: React.ReactNode;
  features: Array<{ text: string; tooltip: string }>;
  popular?: boolean;
  elite?: boolean;
}

export default function Landing() {
  const [hoveredPackage, setHoveredPackage] = useState<string | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [visiblePackages, setVisiblePackages] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [clickedFeature, setClickedFeature] = useState<string | null>(null);
  const packageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return; // Only apply scroll observer on mobile

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const packageId = entry.target.getAttribute('data-package-id');
            if (packageId) {
              setVisiblePackages((prev) => new Set(prev).add(packageId));
            }
          } else {
            // Remove from visible when scrolled away
            const packageId = entry.target.getAttribute('data-package-id');
            if (packageId) {
              setVisiblePackages((prev) => {
                const newSet = new Set(prev);
                newSet.delete(packageId);
                return newSet;
              });
            }
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the package is visible
        rootMargin: '0px'
      }
    );

    Object.values(packageRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [isMobile]);

  const handlePackageHover = (packageId: string) => {
    if (!isMobile) { // Only trigger on hover for desktop
      setHoveredPackage(packageId);
    }
  };

  const handleContactClick = () => {
    navigate('/contact');
    // Scroll to form section after navigation
    setTimeout(() => {
      const formSection = document.getElementById('contact-form');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const packages: Package[] = [
    {
      id: 'starter',
      name: 'BASIC STARTER',
      tagline: 'Perfect for Small Businesses',
      price: '₹5,999',
      color: 'from-gray-400 to-gray-500',
      gradient: 'bg-gradient-to-br from-gray-100 to-gray-200',
      icon: <Rocket className="h-10 w-10" />,
      features: [
        { text: '1–4 Pages Website (Home, Product / service, About, Contact)', tooltip: 'Get a simple website with up to 4 essential pages to showcase your business online' },
        { text: 'Mobile Responsive Design', tooltip: 'Your website will look great on all devices - phones, tablets, and computers' },
        { text: 'Static site only', tooltip: 'A basic website with fixed content, perfect for displaying information' },
        { text: 'NO SEO', tooltip: 'Basic package without search engine optimization features' },
        { text: '1 Revision', tooltip: 'One round of changes included after initial design' }
      ]
    },
    {
      id: 'standard',
      name: 'STANDARD BUSINESS',
      tagline: 'Ideal for Growing Businesses',
      price: '₹9,999',
      color: 'from-teal-400 to-teal-600',
      gradient: 'bg-gradient-to-br from-teal-50 to-teal-100',
      icon: <Globe className="h-10 w-10" />,
      features: [
        { text: 'Up to 6 Pages', tooltip: 'More pages to showcase your products, services, and company information' },
        { text: 'Modern UI Design', tooltip: 'Contemporary and professional design that looks attractive and trustworthy' },
        { text: '.in Domain for 1 year', tooltip: 'Free Indian domain name (yourcompany.in) included for the first year' },
        { text: 'Google Map Integration', tooltip: 'Show your business location on Google Maps so customers can find you easily' },
        { text: 'Basic SEO for the site', tooltip: 'Basic optimization to help your website appear in Google search results' },
        { text: '2 Revisions', tooltip: 'Two rounds of changes to perfect your website design' }
      ]
    },
    {
      id: 'professional',
      name: 'PROFESSIONAL',
      tagline: 'Most Popular Choice',
      price: '₹14,999',
      color: 'from-indigo-600 via-blue-600 to-cyan-500',
      gradient: 'bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50',
      icon: <Code className="h-10 w-10" />,
      popular: true,
      features: [
        { text: 'Up to 8 Pages Website', tooltip: 'Expand your online presence with more pages for detailed content' },
        { text: 'Google Map Integration', tooltip: 'Interactive map showing your business location for easy navigation' },
        { text: '.in Domain for 2 year', tooltip: 'Free domain name included for 2 years - no renewal cost for 2 years' },
        { text: 'Standard SEO', tooltip: 'Better search engine optimization to rank higher on Google' },
        { text: 'Custom Contact Forms', tooltip: 'Personalized forms for customers to reach you directly from your website' },
        { text: 'Social Media Integration', tooltip: 'Connect your Facebook, Instagram, and other social media accounts' },
        { text: '3 Revisions', tooltip: 'Three rounds of changes to ensure everything is perfect' }
      ]
    },
    {
      id: 'premium',
      name: 'PREMIUM BUSINESS',
      tagline: 'Advanced Features & Design',
      price: '₹17,999',
      color: 'from-fuchsia-600 via-pink-600 to-rose-600',
      gradient: 'bg-gradient-to-br from-fuchsia-50 via-pink-50 to-rose-50',
      icon: <Palette className="h-10 w-10" />,
      features: [
        { text: 'Up to 12 Pages Website', tooltip: 'Large website with plenty of space for all your content and services' },
        { text: 'Small Dynamic pages', tooltip: 'Interactive pages that can update content automatically' },
        { text: 'SEO Friendly pages', tooltip: 'All pages optimized to rank well on search engines like Google' },
        { text: 'All Features in the Previous packages', tooltip: 'Includes everything from Basic, Standard, and Professional packages' },
        { text: 'Custom Sections in pages', tooltip: 'Unique sections designed specifically for your business needs' },
        { text: 'Admin panel will be provided', tooltip: 'Easy-to-use dashboard to manage your website content yourself' },
        { text: '.in Domain for 3 years', tooltip: 'Free domain for 3 years - save money on renewals' },
        { text: '4 Revisions', tooltip: 'Four rounds of changes to get everything exactly as you want' }
      ]
    },
    {
      id: 'elite',
      name: 'ELITE BUSINESS (BEST VALUE)',
      tagline: 'Ultimate Premium Experience',
      price: '₹21,999',
      color: 'from-orange-500 via-amber-500 to-yellow-400',
      gradient: 'bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100',
      icon: <Crown className="h-10 w-10" />,
      elite: true,
      features: [
        { text: 'Unlimited Pages', tooltip: 'No limit on pages - add as many as your business needs' },
        { text: 'Fully Custom Design (No Templates)', tooltip: 'Unique design created from scratch, tailored only for your brand' },
        { text: 'All Features in the Previous packages', tooltip: 'Everything from all other packages included' },
        { text: 'Google Ranking SEO', tooltip: 'Advanced SEO to help you rank on first page of Google search' },
        { text: 'Branding-Friendly UI (Colors, Fonts, Layout)', tooltip: 'Design matches your brand identity perfectly with your colors and style' },
        { text: 'AI-Powered Lead Collection Chatbot 🤖', tooltip: 'Smart AI chatbot that engages visitors 24/7, captures leads automatically, and converts conversations into customers' },
        { text: '.in , .com, .org Domain for 3 years', tooltip: 'Get 3 different domain extensions free for 3 years' },
        { text: '24/7 Customer support', tooltip: 'Round-the-clock support - we are always available to help you' },
        { text: 'Free 1 Year Maintenance', tooltip: 'Free updates, fixes, and support for one full year' },
        { text: 'Unlimited Revisions (During Project)', tooltip: 'Make as many changes as you want until you are 100% satisfied' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-20 px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-3">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mx-3">
              Web Development Packages
            </h1>
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-lg text-gray-300 mt-3">
            Choose the perfect package for your business needs
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Globe className="h-4 w-4 text-blue-400" />
            <p className="text-sm text-gray-400">Trusted by 100+ businesses worldwide</p>
          </div>
        </div>

        {/* Packages Grid - Desktop Only */}
        <div className={`${isMobile ? 'hidden' : 'grid'} grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8`}>
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`relative transform transition-all duration-500 ${
                hoveredPackage === pkg.id ? 'scale-105 z-20' : 'scale-100'
              } ${pkg.elite ? 'lg:col-span-2' : ''} ${pkg.popular || pkg.elite || pkg.id === 'premium' ? 'pt-8' : ''}`}
              onMouseEnter={() => handlePackageHover(pkg.id)}
              onMouseLeave={() => setHoveredPackage(null)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2 animate-bounce-slow">
                    <Star className="h-4 w-4 fill-current animate-spin-slow" />
                    MOST POPULAR
                    <Star className="h-4 w-4 fill-current animate-spin-slow" />
                  </div>
                </div>
              )}

              {/* Elite Badge */}
              {pkg.elite && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-gray-900 px-8 py-3 rounded-full text-base font-bold shadow-2xl flex items-center gap-2 animate-pulse-glow">
                    <Crown className="h-4 w-4 fill-current animate-bounce" />
                    ELITE PACKAGE
                    <Crown className="h-4 w-4 fill-current animate-bounce" />
                  </div>
                </div>
              )}

              {/* Premium Badge */}
              {pkg.id === 'premium' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2 animate-bounce-slow">
                    <Sparkles className="h-4 w-4 fill-current animate-pulse" />
                    PREMIUM CHOICE
                    <Sparkles className="h-4 w-4 fill-current animate-pulse" />
                  </div>
                </div>
              )}

              {/* Card */}
              <div
                className={`${pkg.gradient} rounded-3xl shadow-2xl overflow-hidden h-full border-4 relative ${
                  pkg.elite
                    ? 'border-orange-400 shadow-orange-500/50'
                    : pkg.popular
                    ? 'border-indigo-400 shadow-indigo-500/50'
                    : pkg.id === 'premium'
                    ? 'border-fuchsia-400 shadow-fuchsia-500/50'
                    : 'border-gray-300'
                } ${hoveredPackage === pkg.id ? 'shadow-3xl' : ''} ${
                  isMobile && visiblePackages.has(pkg.id) ? 'animate-pop-in' : ''
                } transition-all duration-500 hover:shadow-3xl`}
              >
                {/* Background Pattern */}
                {pkg.popular && (
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500"></div>
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
                                       radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                                       radial-gradient(circle at 40% 20%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)`
                    }}></div>
                  </div>
                )}
                
                {pkg.id === 'premium' && (
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500"></div>
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 30% 40%, rgba(232, 121, 249, 0.4) 0%, transparent 50%),
                                       radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.4) 0%, transparent 50%),
                                       radial-gradient(circle at 50% 10%, rgba(244, 63, 94, 0.4) 0%, transparent 50%)`
                    }}></div>
                  </div>
                )}
                
                {pkg.elite && (
                  <div className="absolute inset-0 opacity-60 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400"></div>
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 25% 35%, rgba(251, 146, 60, 0.6) 0%, transparent 50%),
                                       radial-gradient(circle at 75% 65%, rgba(251, 191, 36, 0.6) 0%, transparent 50%),
                                       radial-gradient(circle at 50% 90%, rgba(234, 179, 8, 0.6) 0%, transparent 50%),
                                       radial-gradient(circle at 10% 80%, rgba(249, 115, 22, 0.5) 0%, transparent 40%)`
                    }}></div>
                  </div>
                )}
                {/* Header */}
                <div className={`bg-gradient-to-r ${pkg.color} p-6 text-white relative overflow-hidden z-10`}>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-3">
                      <div className={`p-3 bg-white/20 rounded-2xl backdrop-blur-sm ${hoveredPackage === pkg.id ? 'animate-bounce' : ''}`}>
                        {pkg.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-center mb-2">{pkg.name}</h3>
                    <p className="text-center text-white/90 text-xs mb-3">{pkg.tagline}</p>
                    <div className="text-center">
                      <div className="text-3xl font-bold">{pkg.price}</div>
                      <div className="text-xs opacity-80 mt-1">One-time payment</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className={`p-6 relative z-10 ${pkg.elite ? 'lg:columns-2 lg:gap-6' : ''} pb-20`}>
                  <ul className="space-y-4">
                    {pkg.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-2 group break-inside-avoid ${
                          (isMobile && visiblePackages.has(pkg.id)) || (!isMobile && hoveredPackage === pkg.id)
                            ? 'opacity-0 animate-slide-in'
                            : isMobile
                            ? 'opacity-0'
                            : 'opacity-100'
                        }`}
                        style={{ 
                          animationDelay: (isMobile && visiblePackages.has(pkg.id)) || (!isMobile && hoveredPackage === pkg.id) 
                            ? `${idx * 0.5}s` 
                            : '0s',
                          animationFillMode: 'forwards',
                          position: 'relative',
                          zIndex: hoveredFeature === `${pkg.id}-${idx}` ? 200 : 'auto'
                        }}
                        onMouseEnter={() => setHoveredFeature(`${pkg.id}-${idx}`)}
                        onMouseLeave={() => setHoveredFeature(null)}
                      >
                        <div className={`flex-shrink-0 mt-0.5 ${hoveredPackage === pkg.id ? 'animate-pulse' : ''}`}>
                          <div className={`bg-gradient-to-r ${pkg.color} p-0.5 rounded-full shadow-lg`}>
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors cursor-help font-medium flex-1">
                          {feature.text}
                        </span>
                        
                        {/* Tooltip - Desktop only */}
                        {!isMobile && hoveredFeature === `${pkg.id}-${idx}` && (
                          <div className="absolute left-0 top-full mt-2 z-[200] w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-2xl border border-gray-700" style={{ backgroundColor: '#111827' }}>
                            <div className="absolute -top-2 left-4 w-4 h-4 border-l border-t border-gray-700 transform rotate-45" style={{ backgroundColor: '#111827' }}></div>
                            <div className="relative z-10 bg-gray-900 rounded p-1" style={{ backgroundColor: '#111827' }}>{feature.tooltip}</div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="p-6 pt-0 relative z-[50]">
                  <button
                    onClick={handleContactClick}
                    className={`w-full bg-gradient-to-r ${pkg.color} text-white py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group`}
                  >
                    {pkg.elite ? (
                      <>
                        <Crown className="h-4 w-4 group-hover:animate-bounce" />
                        Choose Elite Package
                        <Crown className="h-4 w-4 group-hover:animate-bounce" />
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 group-hover:animate-pulse" />
                        Choose {pkg.name}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View - Full Page Scroll */}
        {isMobile && (
          <div className="md:hidden">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                ref={(el) => (packageRefs.current[pkg.id] = el)}
                data-package-id={pkg.id}
                className="min-h-screen flex items-center justify-center px-4 py-20"
              >
                <div className={`w-full max-w-md ${visiblePackages.has(pkg.id) ? 'animate-pop-in' : 'opacity-0'}`}>
                  <div className="relative pt-8">
                    {/* Popular Badge */}
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2 animate-bounce-slow">
                          <Star className="h-4 w-4 fill-current animate-spin-slow" />
                          MOST POPULAR
                          <Star className="h-4 w-4 fill-current animate-spin-slow" />
                        </div>
                      </div>
                    )}

                    {/* Elite Badge */}
                    {pkg.elite && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-gray-900 px-8 py-3 rounded-full text-base font-bold shadow-2xl flex items-center gap-2 animate-pulse-glow">
                          <Crown className="h-4 w-4 fill-current animate-bounce" />
                          ELITE PACKAGE
                          <Crown className="h-4 w-4 fill-current animate-bounce" />
                        </div>
                      </div>
                    )}

                    {/* Premium Badge */}
                    {pkg.id === 'premium' && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2 animate-bounce-slow">
                          <Sparkles className="h-4 w-4 fill-current animate-pulse" />
                          PREMIUM CHOICE
                          <Sparkles className="h-4 w-4 fill-current animate-pulse" />
                        </div>
                      </div>
                    )}

                    {/* Card */}
                    <div
                      className={`${pkg.gradient} rounded-3xl shadow-2xl overflow-hidden border-4 relative ${
                        pkg.elite
                          ? 'border-orange-400 shadow-orange-500/50'
                          : pkg.popular
                          ? 'border-indigo-400 shadow-indigo-500/50'
                          : pkg.id === 'premium'
                          ? 'border-fuchsia-400 shadow-fuchsia-500/50'
                          : 'border-gray-300'
                      }`}
                    >
                      {/* Background Pattern */}
                      {pkg.popular && (
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500"></div>
                          <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
                                             radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                                             radial-gradient(circle at 40% 20%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)`
                          }}></div>
                        </div>
                      )}
                      
                      {pkg.id === 'premium' && (
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500"></div>
                          <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 30% 40%, rgba(232, 121, 249, 0.4) 0%, transparent 50%),
                                             radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.4) 0%, transparent 50%),
                                             radial-gradient(circle at 50% 10%, rgba(244, 63, 94, 0.4) 0%, transparent 50%)`
                          }}></div>
                        </div>
                      )}
                      
                      {pkg.elite && (
                        <div className="absolute inset-0 opacity-60 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400"></div>
                          <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 25% 35%, rgba(251, 146, 60, 0.6) 0%, transparent 50%),
                                             radial-gradient(circle at 75% 65%, rgba(251, 191, 36, 0.6) 0%, transparent 50%),
                                             radial-gradient(circle at 50% 90%, rgba(234, 179, 8, 0.6) 0%, transparent 50%),
                                             radial-gradient(circle at 10% 80%, rgba(249, 115, 22, 0.5) 0%, transparent 40%)`
                          }}></div>
                        </div>
                      )}

                      {/* Header */}
                      <div className={`bg-gradient-to-r ${pkg.color} p-6 text-white relative overflow-hidden z-10`}>
                        <div className="relative z-10">
                          <div className="flex items-center justify-center mb-3">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                              {pkg.icon}
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-center mb-2">{pkg.name}</h3>
                          <p className="text-center text-white/90 text-xs mb-3">{pkg.tagline}</p>
                          <div className="text-center">
                            <div className="text-3xl font-bold">{pkg.price}</div>
                            <div className="text-xs opacity-80 mt-1">One-time payment</div>
                          </div>
                        </div>
                      </div>

                      {/* Features - Mobile */}
                      <div className="p-6 relative z-10">
                        <ul className="space-y-3">
                          {pkg.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className={`flex flex-col gap-1 ${
                                visiblePackages.has(pkg.id)
                                  ? 'opacity-0 animate-slide-in'
                                  : 'opacity-0'
                              }`}
                              style={{ 
                                animationDelay: visiblePackages.has(pkg.id) ? `${idx * 0.5}s` : '0s',
                                animationFillMode: 'forwards'
                              }}
                              onClick={() => setClickedFeature(clickedFeature === `${pkg.id}-${idx}` ? null : `${pkg.id}-${idx}`)}
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-shrink-0 mt-0.5">
                                  <div className={`bg-gradient-to-r ${pkg.color} p-0.5 rounded-full shadow-lg`}>
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                </div>
                                <span className="text-sm text-gray-700 font-medium flex-1">
                                  {feature.text}
                                </span>
                              </div>
                              {/* Tooltip for Mobile - Show on click */}
                              {clickedFeature === `${pkg.id}-${idx}` && (
                                <div className="ml-6 mt-1 p-2 text-white text-xs rounded-lg animate-fade-in border border-gray-700" style={{ backgroundColor: '#111827' }}>
                                  {feature.tooltip}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA Button */}
                      <div className="p-6 pt-0 relative z-10">
                        <button
                          onClick={handleContactClick}
                          className={`w-full bg-gradient-to-r ${pkg.color} text-white py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group`}
                        >
                          {pkg.elite ? (
                            <>
                              <Crown className="h-4 w-4 group-hover:animate-bounce" />
                              Choose Elite Package
                              <Crown className="h-4 w-4 group-hover:animate-bounce" />
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 group-hover:animate-pulse" />
                              Choose {pkg.name}
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="text-center mt-6 text-gray-300 text-sm">
                      <p className="animate-bounce">↓ Scroll for more packages ↓</p>
                      <p className="text-xs mt-1">Package {index + 1} of {packages.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-300 text-sm mb-8">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span>5-Star Rated</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-400" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-400" />
              <span>Global Support</span>
            </div>
          </div>
          
          {/* Contact Button */}
          <button
            onClick={handleContactClick}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mx-auto group"
          >
            <Mail className="h-6 w-6 group-hover:animate-bounce" />
            Contact Us for Custom Package
            <Mail className="h-6 w-6 group-hover:animate-bounce" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateX(-20px);
          }
          to { 
            opacity: 1; 
            transform: translateX(0);
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.6s ease-out;
        }
        
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-pop-in {
          animation: popIn 0.5s ease-out forwards;
        }
        
        @keyframes bounceS low {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-bounce-slow {
          animation: bounceSlow 2s infinite;
        }
        
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spinSlow 3s linear infinite;
        }
        
        @keyframes pulseGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 40px rgba(251, 191, 36, 0.8);
            transform: scale(1.05);
          }
        }
        
        .animate-pulse-glow {
          animation: pulseGlow 2s infinite;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
