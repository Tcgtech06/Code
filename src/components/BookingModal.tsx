import { useEffect, useState } from 'react';
import { X, Clock, Users, Building2 } from 'lucide-react';
import { supabase, type MeetingHall } from '../lib/supabase';
import { sendBookingRequestEmail } from '../lib/email';
import { useAuth } from '../contexts/AuthContext';

interface BookingModalProps {
  hall: MeetingHall | null;
  selectedDate: string;
  selectedTimeSlots: string[]; // Changed to an array
  displayTimeSlots: string[]; // New prop: available slots to display
  onClose: () => void;
  onSuccess: () => void;
  onDateChange: (date: string) => void; // New prop for date change
}

export function BookingModal({ hall, selectedDate, selectedTimeSlots, displayTimeSlots, onClose, onSuccess, onDateChange }: BookingModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    userName: '',
    teamName: '',
    membersCount: '',
    selectedTimeSlots: selectedTimeSlots, // Use selectedTimeSlots from props
    remarks: '', // New remarks field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData((prev) => ({ ...prev, selectedTimeSlots: selectedTimeSlots }));
  }, [selectedTimeSlots]);

  if (!hall) return null;

  const handleTimeSlotToggle = (slot: string) => {
    setFormData((prev) => {
      const currentSlots = prev.selectedTimeSlots;
      if (currentSlots.includes(slot)) {
        return { ...prev, selectedTimeSlots: currentSlots.filter((s) => s !== slot) };
      } else {
        return { ...prev, selectedTimeSlots: [...currentSlots, slot].sort() }; // Sort for consistent order
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
      setError('You must be logged in to book a hall.');
      setLoading(false);
      return;
    }

    if (formData.selectedTimeSlots.length === 0) {
      setError('Please select at least one time slot.');
      setLoading(false);
      return;
    }

    const membersCount = parseInt(formData.membersCount);

    if (membersCount < hall.minimum_capacity) {
      setError(`Minimum ${hall.minimum_capacity} members should attend the Meeting to Book this Hall`);
      setLoading(false);
      return;
    }

    if (membersCount > hall.capacity) {
      setError(`Hall Capacity is maximum ${hall.capacity} members`);
      setLoading(false);
      return;
    }

    if (formData.remarks.split(' ').filter(word => word !== '').length > 50) {
      setError('Remarks cannot exceed 50 words.');
      setLoading(false);
      return;
    }

    try {
      const bookingsToInsert = formData.selectedTimeSlots.map((slot) => {
        const [startTimeStr, endTimeStr] = slot.split(' - ');
        
        const parseTime = (timeString: string, date: Date) => {
          const [time, ampm] = timeString.split(' ');
          const [hour, minute] = time.split(':').map(Number);
          let militaryHour = hour;
          if (ampm === 'PM' && hour !== 12) {
            militaryHour += 12;
          } else if (ampm === 'AM' && hour === 12) {
            militaryHour = 0;
          }
          const newDate = new Date(date);
          newDate.setHours(militaryHour, minute, 0, 0);
          return newDate;
        };

        const startDate = parseTime(startTimeStr, new Date(selectedDate));
        const endDate = parseTime(endTimeStr, new Date(selectedDate));

        if (startDate < new Date()) {
          setError('Some selected time slots are in the past.');
          throw new Error('Past time slot selected');
        }

        return {
          hall_id: hall.id,
          user_name: formData.userName,
          user_email: user?.email || '',
          team_name: formData.teamName,
          members_count: membersCount,
          start_time: startDate.toISOString(),
          end_time: endDate.toISOString(),
          status: 'review',
          remarks: formData.remarks, // Include remarks
        };
      });

      const { error: insertError } = await supabase
        .from('bookings')
        .insert(bookingsToInsert);

      if (insertError) throw insertError;

      // Send email notification to admin
      try {
        for (const booking of bookingsToInsert) {
          await sendBookingRequestEmail({
            user_name: booking.user_name,
            team_name: booking.team_name,
            members_count: booking.members_count,
            start_time: booking.start_time,
            end_time: booking.end_time,
            remarks: booking.remarks,
          });
        }
      } catch (emailErr) {
        console.error('Failed to send admin notification email:', emailErr);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Book {hall.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-2 flex-shrink-0"
          >
            <X className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              required
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Team Name
              </div>
            </label>
            <input
              type="text"
              required
              value={formData.teamName}
              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
              placeholder="Enter team name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Number of Members (Min: {hall.minimum_capacity}, Max: {hall.capacity})
              </div>
            </label>
            <input
              type="number"
              required
              min={hall.minimum_capacity}
              max={hall.capacity}
              value={formData.membersCount}
              onChange={(e) => setFormData({ ...formData, membersCount: e.target.value })}
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
              placeholder={`Enter number of members (${hall.minimum_capacity}-${hall.capacity})`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Selected Date
              </div>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)} // Call onDateChange prop
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Select Time Slots
              </div>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
              {displayTimeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => handleTimeSlotToggle(slot)}
                  className={`px-3 py-2 border rounded-lg text-sm transition-colors
                    ${formData.selectedTimeSlots.includes(slot)
                      ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            {formData.selectedTimeSlots.length > 0 && (
              <div className="mt-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-sm font-semibold text-gray-700 mb-2">Selected Time Slots for {selectedDate}:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.selectedTimeSlots.map((slot) => (
                    <span
                      key={slot}
                      className="flex items-center bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full border border-green-200"
                    >
                      {slot}
                      <button
                        type="button"
                        onClick={() => handleTimeSlotToggle(slot)}
                        className="ml-1 -mr-1.5 p-0.5 rounded-full hover:bg-green-200 text-green-700"
                        aria-label={`Remove ${slot}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Remarks <span className="text-red-500">*</span> <span className="text-gray-500 font-normal">(under 50 words)</span>
            </label>
            <textarea
              required
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              rows={3}
              maxLength={50 * 6} // Approx. 6 chars per word for basic limit
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
              placeholder="Purpose of booking, e.g., team meeting, client presentation..."
            />
            <p className="text-xs text-gray-500 mt-1">Word count: {formData.remarks.split(' ').filter(word => word !== '').length}/50</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-green-800">
              Your booking will be in review status until approved by an admin. You can cancel your booking up to 1 hour before the start time.
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3 pt-4 flex-col-reverse sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? 'Submitting...' : 'Submit Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
