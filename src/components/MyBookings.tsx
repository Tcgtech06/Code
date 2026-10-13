import { useEffect, useState } from 'react';
import { Calendar, Clock, Users, Building2 } from 'lucide-react';
import { supabase, type Booking } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from './LoginForm';

interface BookingWithHall extends Booking {
  meeting_halls?: {
    name: string;
  };
}

export function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingWithHall[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleCancel = async (bookingId: string, startTime: string) => {
    // Check if within 5 mins of start time
    const bookingDate = new Date(startTime);
    const now = new Date();
    const timeDiffMinutes = (bookingDate.getTime() - now.getTime()) / (1000 * 60);

    if (timeDiffMinutes <= 5) {
      alert("You cannot cancel this time slot, it was already late.");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setActionLoading(bookingId);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
      await loadBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    loadBookings();

    const channel = supabase
      .channel('my-bookings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          loadBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.email]);

  const loadBookings = async () => {
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          meeting_halls (
            name
          )
        `)
        .order('start_time', { ascending: true });
        
      if (user?.email) {
        query = query.eq('user_email', user.email);
      } else {
        // If no user is logged in, return empty
        setBookings([]);
        setLoading(false);
        return;
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 max-w-md mx-auto">
        <p className="text-gray-600 mb-6 text-center">Please login to view and manage your bookings.</p>
        <LoginForm />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-base sm:text-lg">No bookings yet</p>
        <p className="text-gray-400 text-xs sm:text-sm mt-2">Book a meeting hall to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" />
                <h3 className="font-bold text-gray-900 truncate text-sm sm:text-base">
                  {booking.meeting_halls?.name || 'N/A'}
                </h3>
              </div>
              {getStatusBadge(booking.status)}
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>{booking.team_name} ({booking.members_count})</span>
              </div>

              <div className="flex items-start gap-2 text-gray-600">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="text-xs sm:text-sm">
                  <div>Start: {formatDateTime(booking.start_time)}</div>
                  <div>End: {formatDateTime(booking.end_time)}</div>
                </div>
              </div>
            </div>

            {booking.status !== 'cancelled' ? (
              (() => {
                const timeDiffMinutes = (new Date(booking.start_time).getTime() - new Date().getTime()) / (1000 * 60);
                const isTooLate = timeDiffMinutes <= 5;

                return (
                  <button
                    onClick={() => {
                      if (isTooLate) {
                        alert("You cannot cancel this time slot, it was already late.");
                        return;
                      }
                      handleCancel(booking.id, booking.start_time);
                    }}
                    disabled={actionLoading === booking.id}
                    className={`mt-4 w-full py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2
                      ${actionLoading === booking.id || isTooLate ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                  >
                    {actionLoading === booking.id ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Cancel Booking'
                    )}
                  </button>
                );
              })()
            ) : (
              <div className="mt-4 text-xs text-gray-500 text-center bg-gray-50 py-2 rounded">
                This booking is cancelled
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
