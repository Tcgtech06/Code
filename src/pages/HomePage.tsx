import { useEffect, useState } from 'react';
import { LogIn, Calendar, LogOut, User } from 'lucide-react';
import { supabase, type MeetingHall } from '../lib/supabase';
import { MeetingHallCard } from '../components/MeetingHallCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function HomePage() {
  const { user, signOut } = useAuth();
  const [halls, setHalls] = useState<MeetingHall[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadHalls();
  }, []);

  const loadHalls = async () => {
    try {
      const { data, error } = await supabase
        .from('meeting_halls')
        .select('*')
        .order('name');

      if (error) throw error;
      // Filter out Pranah Hall completely - using regex to catch all variations
      const filteredHalls = (data || []).filter(hall => {
        const hallName = hall.name.toLowerCase().trim();
        return !(/pran[a-z]*h?/i.test(hallName));
      });
      setHalls(filteredHalls);
    } catch (error) {
      console.error('Error loading halls:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgyfshtMV3gNKaS8p864zflDIxA3SnNWStIkwrYwKGMhQ18nrbhhFom19u5oszm1o6Ye1tLDZ67pkNMm04c8g0fnEpz93NmtR8NCtQAjcOAZGEDdkyVB26EpJxalk_rmRin-OaQplT9UQ2kJnepKE-5B5sB1hcvgR7ksQHfIhaosU-pEJvSHc2igP3IqYw/s1600/vilvah.png" alt="Vilvah Logo" className="w-10 h-10" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Vilvah Conference Halls</h1>
                <p className="text-xs sm:text-sm text-gray-600">Book your perfect space</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => navigate('/my-bookings')}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Bookings</span>
                <span className="sm:hidden">Bookings</span>
              </button>
              
              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8 px-4">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
            VILVAH CONFERENCE HALLS
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our Premium meeting spaces Designed for Productivity and Collaboration
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-0">
            {halls.map((hall) => (
              <MeetingHallCard
                key={hall.id}
                hall={hall}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
