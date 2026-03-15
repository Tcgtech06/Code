import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Brain, Zap, Users, Shield, Headphones, Wrench, Share2, Globe, Mic, Sparkles } from 'lucide-react';

export default function AIChatbotDevelopment() {
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
        .animate-on-scroll {
          opacity: 0;
        }
        .animate-on-scroll.animate-visible.animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-on-scroll.animate-visible.animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-on-scroll.animate-visible.animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        .animate-on-scroll.animate-visible.animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
      <section className="bg-gradient-to-br from-yellow-600 to-yellow-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-yellow-200 mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center mb-6 animate-on-scroll animate-fadeInUp">
            <MessageCircle className="h-16 w-16 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">AI Chatbot Development</h1>
          </div>
          <p className="text-xl text-yellow-100 max-w-3xl animate-on-scroll animate-fadeInUp animation-delay-200">
            Intelligent chatbot solutions powered by artificial intelligence
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll animate-slideInLeft">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Smart Conversational AI</h2>
              <p className="text-gray-600 mb-4">
                We develop intelligent chatbots that understand natural language and provide 
                human-like interactions to enhance customer experience.
              </p>
              <p className="text-gray-600 mb-6">
                Our AI-powered chatbots can handle customer queries 24/7, automate support, 
                and improve engagement.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-8 animate-on-scroll animate-slideInRight">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Capabilities</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Brain className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Natural Language Processing</h4>
                    <p className="text-sm text-gray-600">Understands user intent accurately</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Zap className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Instant Responses</h4>
                    <p className="text-sm text-gray-600">24/7 automated customer support</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Multi-Platform Integration</h4>
                    <p className="text-sm text-gray-600">Website, WhatsApp, Facebook, and more</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Share2 className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Lead Collection and Sharing</h4>
                    <p className="text-sm text-gray-600">Capture and share leads automatically</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Globe className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Multilanguage Support</h4>
                    <p className="text-sm text-gray-600">Communicate in multiple languages</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mic className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Voice Based Assistant</h4>
                    <p className="text-sm text-gray-600">Voice-enabled conversational AI</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Sparkles className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Custom AI Solutions</h4>
                    <p className="text-sm text-gray-600">Tailored AI models for your needs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 animate-on-scroll animate-fadeInUp">Use Cases</h2>
          <div className="grid md:grid-cols-3 gap-8 animate-on-scroll animate-fadeIn animation-delay-200">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customer Support</h3>
              <p className="text-gray-600">
                Automate responses to common queries and provide instant support
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lead Generation</h3>
              <p className="text-gray-600">
                Qualify leads and collect customer information automatically
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">E-Commerce Assistant</h3>
              <p className="text-gray-600">
                Help customers find products and complete purchases
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 animate-on-scroll animate-fadeInUp">What We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 animate-on-scroll animate-fadeIn animation-delay-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Brain className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered</h3>
              <p className="text-gray-600">
                Advanced AI technology for intelligent conversations
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Headphones className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock chatbot monitoring and support
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Security</h3>
              <p className="text-gray-600">
                Secure data handling and privacy protection
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Wrench className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Maintenance</h3>
              <p className="text-gray-600">
                Regular updates and performance optimization
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-yellow-600 to-yellow-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Deploy Your AI Chatbot?</h2>
          <p className="text-xl text-yellow-100 mb-8">
            Let's build an intelligent assistant for your business
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
