import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Smartphone, Monitor, Shield, Headphones, Store, Wrench } from 'lucide-react';

export default function AppDevelopment() {
  useEffect(() => {
    window.scrollTo(0, 0);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
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
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <style>{`
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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }
      `}</style>
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-red-200 mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center mb-6 animate-fadeInUp">
            <Smartphone className="h-16 w-16 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">App Development</h1>
          </div>
          <p className="text-xl text-red-100 max-w-3xl animate-fadeInUp animation-delay-200">
            Hybrid App Development and Progressive Web Apps (PWA) for Android platforms
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInLeft">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Hybrid & PWA Solutions</h2>
              <p className="text-gray-600 mb-4">
                We specialize in Hybrid App Development and Progressive Web Apps (PWA) that provide 
                seamless user experiences across Android platforms with a single codebase.
              </p>
              <p className="text-gray-600 mb-6">
                From concept to deployment on Play Store, we handle every aspect of mobile app development.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-8 animate-slideInRight">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Technologies We Use</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Check className="h-6 w-6 text-red-600 mr-3" />
                  <span className="font-medium">React Native (Hybrid Apps)</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-6 w-6 text-red-600 mr-3" />
                  <span className="font-medium">Electron JS (Desktop Apps)</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-6 w-6 text-red-600 mr-3" />
                  <span className="font-medium">Kotlin (Android Native)</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-6 w-6 text-red-600 mr-3" />
                  <span className="font-medium">Progressive Web Apps (PWA)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 animate-fadeInUp">What We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fadeIn animation-delay-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Store className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Play Store Launch</h3>
              <p className="text-gray-600">
                Complete assistance in launching your app on Google Play Store
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Headphones className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock technical support and assistance
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Security</h3>
              <p className="text-gray-600">
                Robust security measures to protect your app and user data
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Wrench className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Maintenance</h3>
              <p className="text-gray-600">
                Regular updates and maintenance to keep your app running smoothly
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your App?</h2>
          <p className="text-xl text-red-100 mb-8">
            Let's create an amazing mobile experience for your users
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
}
