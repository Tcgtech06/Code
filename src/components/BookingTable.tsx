import { Check, X, Clock, Users, Building2, Calendar } from 'lucide-react';
import type { Booking } from '../lib/supabase';

interface BookingWithHall extends Booking {
  meeting_halls?: {
    name: string;
  };
  remarks?: string; // Add remarks to the interface
}

interface BookingTableProps {
  bookings: BookingWithHall[];
  onAccept: (bookingId: string) => void;
  onCancel: (bookingId: string) => void;
  loading: boolean;
}

export function BookingTable({ bookings, onAccept, onCancel, loading }: BookingTableProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isCompleted = (booking: BookingWithHall) => {
    const now = new Date();
    const bookingEnd = new Date(booking.end_time);
    return now > bookingEnd;
  };

  const getStatusBadge = (booking: BookingWithHall) => {
    if (isCompleted(booking)) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-800 border-gray-200">
          Completed
        </span>
      );
    }

    const styles = {
      review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[booking.status as keyof typeof styles]}`}>
        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
      </span>
    );
  };

  const canBeCancelled = (booking: BookingWithHall) => {
    return booking.status !== 'cancelled' && !isCompleted(booking);
  };

  const canBeAccepted = (booking: BookingWithHall) => {
    return booking.status === 'review' && !isCompleted(booking);
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-base sm:text-lg">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full text-sm sm:text-base">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Hall</th>
            <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm hidden md:table-cell">User</th>
            <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Team</th>
            <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Mbrs</th>
            <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Date</th>
            <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Time Slot</th>
            <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Remarks</th>
            <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Status</th>
            <th className="text-center py-3 sm:py-4 px-3 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-3 sm:py-4 px-3 sm:px-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Building2 className="w-3 sm:w-4 h-3 sm:h-4 text-green-600 flex-shrink-0" />
                  <span className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                    {booking.meeting_halls?.name || 'N/A'}
                  </span>
                </div>
              </td>
              <td className="py-3 sm:py-4 px-3 sm:px-4 text-gray-700 hidden md:table-cell text-xs sm:text-sm">{booking.user_name}</td>
              <td className="py-3 sm:py-4 px-3 sm:px-4 text-gray-700 text-xs sm:text-sm truncate">{booking.team_name}</td>
              <td className="py-3 sm:py-4 px-3 sm:px-4">
                <div className="flex items-center gap-1 text-gray-700 text-xs sm:text-sm">
                  <Users className="w-3 sm:w-4 h-3 sm:h-4" />
                  {booking.members_count}
                </div>
              </td>
              <td className="py-3 sm:py-4 px-3 sm:px-4">
                <div className="flex items-center gap-1 text-gray-700 text-xs">
                  <Calendar className="w-3 h-3" />
                  {formatDate(booking.start_time)}
                </div>
              </td>
              <td className="py-3 sm:py-4 px-3 sm:px-4">
                <div className="flex items-center gap-1 text-gray-700 text-xs">
                  <Clock className="w-3 h-3" />
                  {`${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`}
                </div>
              </td>
              <td className="py-3 sm:py-4 px-3 sm:px-4 text-gray-700 text-xs sm:text-sm break-words max-w-[150px]">{booking.remarks || 'N/A'}</td>
              <td className="py-3 sm:py-4 px-3 sm:px-4">
                {getStatusBadge(booking)}
              </td>
              <td className="py-3 sm:py-4 px-3 sm:px-4">
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  {canBeAccepted(booking) && (
                    <button
                      onClick={() => onAccept(booking.id)}
                      disabled={loading}
                      className="p-1.5 sm:p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Accept"
                    >
                      <Check className="w-3 sm:w-4 h-3 sm:h-4" />
                    </button>
                  )}
                  {canBeCancelled(booking) && (
                    <button
                      onClick={() => onCancel(booking.id)}
                      disabled={loading}
                      className="p-1.5 sm:p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Cancel"
                    >
                      <X className="w-3 sm:w-4 h-3 sm:h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
