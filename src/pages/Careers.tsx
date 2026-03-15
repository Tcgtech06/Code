import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Briefcase } from 'lucide-react';
import { fetchJobPostings } from '../lib/supabase';
import type { Database } from '../types/supabase';

type JobPosting = Database['public']['Tables']['job_postings']['Row'];

export default function Careers() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await fetchJobPostings();
      
      if (error) {
        throw error;
      }
      
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Unable to load job postings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
      `}</style>
      
      <section className="relative h-[400px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Careers hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl max-w-2xl">Build your career with TCG Technology and help shape the future of digital innovation.</p>
          <Link 
            to="/careers/opportunities"
            className="inline-block mt-6 bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed opacity-50"
            onClick={(e) => e.preventDefault()}
          >
            View All Opportunities (Coming Soon)
          </Link>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12">Current Openings</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => fetchJobs()}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No positions are currently open.</p>
              <p className="text-gray-500 mt-2">Please check back later for new opportunities!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-lg shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-xl font-semibold mb-4">{job.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-5 w-5 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Clock className="h-5 w-5 mr-2" />
                    {job.type}
                  </div>
                  <p className="text-gray-600 mb-6">{job.description}</p>
                  <Link
                    to="/careers/apply"
                    className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Why Join Us?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              Experience the freedom and flexibility of modern work culture with competitive rewards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Free Work Hours */}
            <div className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up animation-delay-400">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-10 w-10 text-white animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Free Work Hours</h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Enjoy complete flexibility in your work schedule. Work when you're most productive and maintain perfect work-life balance.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="text-3xl animate-bounce">⏰</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Get Paid For Your Contribution */}
            <div className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up animation-delay-600">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-10 w-10 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Get Paid For Your Contribution</h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Fair compensation based on your actual contributions and impact. Your efforts are recognized and rewarded appropriately.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="text-3xl animate-bounce animation-delay-200">💰</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Work From Anywhere */}
            <div className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up animation-delay-800">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-10 w-10 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Work From Anywhere</h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Location independence at its finest. Work from home, a café, or anywhere in the world. Your office is wherever you are.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="text-3xl animate-bounce animation-delay-400">🌍</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Custom CSS for animations */}
          <style>{`
            @keyframes blob {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
              100% { transform: translate(0px, 0px) scale(1); }
            }
            
            @keyframes fade-in-up {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .animate-blob {
              animation: blob 7s infinite;
            }
            
            .animate-fade-in-up {
              animation: fade-in-up 0.8s ease-out forwards;
              opacity: 0;
            }
            
            .animation-delay-100 {
              animation-delay: 0.1s;
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
            
            .animation-delay-800 {
              animation-delay: 0.8s;
            }
            
            .animation-delay-1000 {
              animation-delay: 1s;
            }
            
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            
            .animation-delay-4000 {
              animation-delay: 4s;
            }
          `}</style>
        </div>
      </section>
    </div>
  );
}