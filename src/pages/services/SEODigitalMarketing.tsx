import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Search, Target, BarChart, Shield, Headphones, Wrench, Zap, Megaphone, Users, Share2 } from 'lucide-react';

export default function SEODigitalMarketing() {
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
            <TrendingUp className="h-16 w-16 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">SEO & Digital Marketing</h1>
          </div>
          <p className="text-xl text-red-100 max-w-3xl animate-fadeInUp animation-delay-200">
            Comprehensive digital marketing strategies to grow your online presence
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInLeft">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Grow Your Digital Presence</h2>
              <p className="text-gray-600 mb-4">
                We help businesses increase their online visibility and reach their target audience 
                through strategic SEO and digital marketing campaigns.
              </p>
              <p className="text-gray-600 mb-6">
                From search engine optimization to social media marketing, we cover all aspects of digital growth.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-8 animate-slideInRight">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Search className="h-6 w-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Search Engine Optimization (SEO)</h4>
                    <p className="text-sm text-gray-600">Improve your organic search rankings</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="h-6 w-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Organic & Inorganic Marketing</h4>
                    <p className="text-sm text-gray-600">Both paid and organic growth strategies</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Megaphone className="h-6 w-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">AD Campaigning</h4>
                    <p className="text-sm text-gray-600">Google Ads, Facebook Ads, and more</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-6 w-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Lead Generation</h4>
                    <p className="text-sm text-gray-600">Generate quality leads for your business</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Share2 className="h-6 w-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">All Types of Social Media Handling</h4>
                    <p className="text-sm text-gray-600">Facebook, Instagram, LinkedIn, Twitter, YouTube & more</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="h-6 w-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Social Media Marketing</h4>
                    <p className="text-sm text-gray-600">Engage and grow your audience</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BarChart className="h-6 w-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Analytics & Reporting</h4>
                    <p className="text-sm text-gray-600">Track and measure campaign success</p>
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Zap className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Results-Driven</h3>
              <p className="text-gray-600">
                Data-driven strategies that deliver measurable results
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Headphones className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock campaign monitoring and support
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Security</h3>
              <p className="text-gray-600">
                Secure handling of your business data and analytics
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Wrench className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Maintenance</h3>
              <p className="text-gray-600">
                Continuous optimization and campaign updates
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Online Presence?</h2>
          <p className="text-xl text-red-100 mb-8">
            Let's create a digital marketing strategy that delivers results
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
