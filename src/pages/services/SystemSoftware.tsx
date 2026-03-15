import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings, Database, Server, Shield, Headphones, Wrench, Zap, FileText, Users, Clock, Receipt } from 'lucide-react';

export default function SystemSoftware() {
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
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-green-200 mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center mb-6 animate-fadeInUp">
            <Settings className="h-16 w-16 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">System Software Development</h1>
          </div>
          <p className="text-xl text-green-100 max-w-3xl animate-fadeInUp animation-delay-200">
            Custom system software solutions tailored to your business processes
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInLeft">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Enterprise Solutions</h2>
              <p className="text-gray-600 mb-4">
                We develop robust system software that streamlines your business operations. 
                From CRM systems to inventory management, we create solutions that work.
              </p>
              <p className="text-gray-600 mb-6">
                Our software is scalable, secure, and designed to grow with your business.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-8 animate-slideInRight">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What We Build</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FileText className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Invoice Generators</h4>
                    <p className="text-sm text-gray-600">Automated invoice creation and management</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Settings className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">System Applications</h4>
                    <p className="text-sm text-gray-600">Custom business applications</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">CRM Systems</h4>
                    <p className="text-sm text-gray-600">Customer relationship management solutions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Attendance Management</h4>
                    <p className="text-sm text-gray-600">Employee attendance tracking systems</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Receipt className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Billing Software</h4>
                    <p className="text-sm text-gray-600">Comprehensive billing and payment solutions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Database className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Database Management</h4>
                    <p className="text-sm text-gray-600">Efficient data storage and retrieval</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Server className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Backend Systems</h4>
                    <p className="text-sm text-gray-600">Robust server-side applications</p>
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Solutions</h3>
              <p className="text-gray-600">
                Tailored software designed for your specific needs
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Headphones className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock technical support and assistance
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Security</h3>
              <p className="text-gray-600">
                Enterprise-grade security and data protection
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Wrench className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Maintenance</h3>
              <p className="text-gray-600">
                Regular updates and system maintenance
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Custom System Software?</h2>
          <p className="text-xl text-green-100 mb-8">
            Let's build a solution that fits your unique requirements
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
}
