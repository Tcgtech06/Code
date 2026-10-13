import { ArrowLeft } from 'lucide-react';
import { MyBookings } from '../components/MyBookings';
import { useNavigate } from 'react-router-dom';

export function MyBookingsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgyfshtMV3gNKaS8p864zflDIxA3SnNWStIkwrYwKGMhQ18nrbhhFom19u5oszm1o6Ye1tLDZ67pkNMm04c8g0fnEpz93NmtR8NCtQAjcOAZGEDdkyVB26EpJxalk_rmRin-OaQplT9UQ2kJnepKE-5B5sB1hcvgR7ksQHfIhaosU-pEJvSHc2igP3IqYw/s1600/vilvah.png" alt="Vilvah Logo" className="w-8 h-8" />
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Bookings</h1>
                <p className="text-xs sm:text-sm text-gray-600">View all bookings</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">Bookings</h1>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-green-800">
            View all booking statuses. Only administrators can cancel or modify bookings.
          </p>
        </div>

        <MyBookings />
      </main>
    </div>
  );
}
