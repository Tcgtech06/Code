import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, CreditCard, Package, TrendingUp, Shield, Headphones, Wrench, Zap } from 'lucide-react';

export default function ECommerce() {
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
      <section className="bg-gradient-to-br from-yellow-600 to-yellow-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-yellow-200 mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center mb-6 animate-fadeInUp">
            <ShoppingCart className="h-16 w-16 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">E-Commerce Solutions</h1>
          </div>
          <p className="text-xl text-yellow-100 max-w-3xl animate-fadeInUp animation-delay-200">
            Complete online store solutions with payment integration and inventory management
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInLeft">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Grow Your Online Business</h2>
              <p className="text-gray-600 mb-4">
                We build powerful e-commerce platforms that help you sell products online efficiently. 
                From product catalogs to secure checkout, we handle it all.
              </p>
              <p className="text-gray-600 mb-6">
                Our solutions are scalable, secure, and optimized for conversions.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-8 animate-slideInRight">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Features</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CreditCard className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Payment Integration</h4>
                    <p className="text-sm text-gray-600">Multiple payment gateways support</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Package className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">WhatsApp Receiving Orders</h4>
                    <p className="text-sm text-gray-600">Receive orders directly via WhatsApp</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Analytics & Reports</h4>
                    <p className="text-sm text-gray-600">Insights into sales and customer behavior</p>
                  </div>
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Setup</h3>
              <p className="text-gray-600">
                Quick deployment and launch of your online store
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Headphones className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock technical support and assistance
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Security</h3>
              <p className="text-gray-600">
                Secure payment processing and data protection
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Wrench className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Maintenance</h3>
              <p className="text-gray-600">
                Regular updates and platform maintenance
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-yellow-600 to-yellow-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Online Store?</h2>
          <p className="text-xl text-yellow-100 mb-8">
            Let's build an e-commerce platform that drives sales
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-yellow-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
}
