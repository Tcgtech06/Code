import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase, type MeetingHall, type Booking } from '../lib/supabase';
import { generateTimeSlots } from '../lib/timeSlots';
import { BookingModal } from '../components/BookingModal';
import { BookingInfoPopup } from '../components/BookingInfoPopup'; // Import the new component
import { ImageSlideshow } from '../components/ImageSlideshow';
import { Users, X, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function HallDetailPage() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [hall, setHall] = useState<MeetingHall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{ date: string; slot: string; }[]>([]); // Changed to an array of objects
  const [bookedSlots, setBookedSlots] = useState<Booking[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [popupInfo, setPopupInfo] = useState<{ userName: string; teamName: string; status: Booking['status']; remarks?: string; position: { x: number; y: number }; } | null>(null); // Added remarks to popupInfo state
  const [showBookingModal, setShowBookingModal] = useState(false); // New state for modal visibility
  const navigate = useNavigate();

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (id) {
      loadHallDetails(id);
      loadBookingsForSelectedDate(id, selectedDate);
    }
  }, [id, selectedDate]);

  const loadHallDetails = async (hallId: string) => {
    try {
      const { data, error } = await supabase
        .from('meeting_halls')
        .select('*')
        .eq('id', hallId)
        .single();

      if (error) throw error;
      setHall(data);
    } catch (err) {
      console.error('Error loading hall details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load hall details');
    } finally {
      setLoading(false);
    }
  };

  // Check if the hall is Pranah Hall and disable access
  if (hall) {
    const hallName = hall.name.toLowerCase().trim();
    // Use regex to catch any variation of pranah/pransh/pransha
    if (/pran[a-z]*h?/i.test(hallName)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Hall Not Available</h1>
            <p className="text-gray-600 mb-6">This hall is temporarily unavailable.</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }
  }

  const loadBookingsForSelectedDate = async (hallId: string, date: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('start_time, end_time, status, user_name, team_name, remarks') // Select remarks
        .eq('hall_id', hallId)
        .gte('start_time', `${date}T00:00:00.000Z`)
        .lt('end_time', `${date}T23:59:59.999Z`);

      if (error) throw error;

      setBookedSlots((data as Booking[]) || []);
    } catch (err) {
      console.error('Error loading bookings for selected date:', err);
    }
  };

  interface SlotStatus {
    status: 'available' | 'review' | 'accepted' | 'ongoing' | 'past-cutoff' | 'passed';
    bookingInfo?: { userName: string; teamName: string; status: Booking['status']; remarks?: string }; // Added remarks here
  }

  const getSlotStatus = (slot: string): SlotStatus => {
    const [slotTime, slotAmPm] = slot.split(' ');
    let [slotHour, slotMinute] = slotTime.split(':').map(Number);

    if (slotAmPm === 'PM' && slotHour !== 12) {
      slotHour += 12;
    } else if (slotAmPm === 'AM' && slotHour === 12) {
      slotHour = 0;
    }

    const now = new Date();
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(slotHour, slotMinute, 0, 0);

    const currentDay = now.toISOString().split('T')[0];
    const slotDate = selectedDate;

    // Check bookings FIRST to see if there's an ongoing meeting
    for (const booking of bookedSlots) {
      const bookingStart = new Date(booking.start_time);
      const bookingEnd = new Date(booking.end_time);

      // Check for overlap considering 1-hour slots
      const slotStart = selectedDateTime.getTime();
      const slotEnd = slotStart + (60 * 60 * 1000); // 1 hour later

      const bookingStartTime = bookingStart.getTime();
      const bookingEndTime = bookingEnd.getTime();

      if ( (slotStart < bookingEndTime && slotEnd > bookingStartTime) ) {
        const bookingInfo = { userName: booking.user_name, teamName: booking.team_name, status: booking.status, remarks: booking.remarks || '' }; // Pass remarks

        if (booking.status === 'accepted') {
          // Check if the booking is currently ongoing - compare timestamps directly
          const nowTime = now.getTime();
          if (nowTime >= bookingStartTime && nowTime < bookingEndTime) {
            return { status: 'ongoing', bookingInfo };
          }
          return { status: 'accepted', bookingInfo };
        } else if (booking.status === 'review') {
          return { status: 'review', bookingInfo };
        }
      }
    }

    // Rule: If an time slot 9 to 10 is tried to book on the same day after that time is crossed means user cannot be able to book that slot on that day
    if (slotDate === currentDay && now.getTime() > selectedDateTime.getTime()) {
      return { status: 'passed' };
    }

    // Check if the slot is past the 30-minute booking cutoff for today
    const thirtyMinutesBeforeSlot = new Date(selectedDateTime.getTime());
    thirtyMinutesBeforeSlot.setMinutes(thirtyMinutesBeforeSlot.getMinutes() - 30);

    if (slotDate === currentDay && now > thirtyMinutesBeforeSlot) {
      return { status: 'past-cutoff' };
    }

    return { status: 'available' };
  };

  const handleBookingSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
    setSelectedTimeSlots([]); // Clear all selected slots after successful booking
    setPopupInfo(null); // Close popup as well
    setShowBookingModal(false); // Close the modal on successful booking
    if (id) {
      loadBookingsForSelectedDate(id, selectedDate); // Reload bookings to update available slots
    }
  };

  const handleTimeSlotClick = (slot: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const { status, bookingInfo } = getSlotStatus(slot);
    
    // Prevent default button behavior immediately for all cases that should trigger a popup or alert
    event.preventDefault(); 

    if (status === 'available') {
      setSelectedTimeSlots((prev) => {
        const isSlotSelected = prev.some(s => s.date === selectedDate && s.slot === slot);
        if (isSlotSelected) {
          return prev.filter(s => !(s.date === selectedDate && s.slot === slot));
        } else {
          return [...prev, { date: selectedDate, slot: slot }];
        }
      });
      setPopupInfo(null); // Hide popup if an available slot is clicked
    } else if (status === 'past-cutoff' || status === 'passed') {
      alert('This slot is no longer available for booking today.');
      setPopupInfo(null); // Hide popup
    } else if (status === 'ongoing' && bookingInfo) {
      const rect = event.currentTarget.getBoundingClientRect();
      setPopupInfo({
        ...bookingInfo,
        position: { x: rect.top + rect.width / 10, y: rect.top + window.scrollY - 260 }, // Position above with scroll offset
      });
    } else if (bookingInfo) {
      const rect = event.currentTarget.getBoundingClientRect();
      setPopupInfo({
        ...bookingInfo,
        position: { x: rect.right + rect.width / -2, y: rect.top + window.scrollY  - 360 }, // Position above with scroll offset
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !hall) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error || 'Hall not found'}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm sm:text-base px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </button>
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {hall.name}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {hall.description}
          </p>
        </div>

        <div className="h-96 rounded-lg shadow-md mb-8 overflow-hidden">
          <ImageSlideshow 
            images={hall.image_urls?.length ? hall.image_urls : [hall.image_url]}
            alt={hall.name}
          />
        </div>

        <div className="flex items-center justify-center gap-4 text-gray-700 mb-8">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>Capacity: {hall.minimum_capacity} - {hall.capacity}</span>
          </div>
        </div>

        {showSuccess && (
          <div className="mb-8 bg-green-50 border border-green-200 text-green-800 px-4 sm:px-6 py-4 rounded-lg animate-fade-in text-sm sm:text-base">
            Booking submitted successfully! Your request is under review.
          </div>
        )}

        <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <label htmlFor="date-picker" className="text-gray-700 font-medium">Select Date:</label>
          <input
            type="date"
            id="date-picker"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-12 relative"> {/* Added relative positioning */}
          {timeSlots.map((slot) => {
            const { status } = getSlotStatus(slot);
            let buttonClassName = 'px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ';

            switch (status) {
              case 'available':
                buttonClassName += selectedTimeSlots.some(s => s.date === selectedDate && s.slot === slot) ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-green-100 hover:text-green-700';
                break;
              case 'review':
                buttonClassName += 'bg-yellow-400 text-white cursor-not-allowed opacity-70';
                break;
              case 'accepted':
                buttonClassName += 'bg-green-400 text-white cursor-not-allowed opacity-70';
                break;
              case 'ongoing':
                buttonClassName += 'bg-red-500 text-white cursor-not-allowed opacity-70';
                break;
              case 'past-cutoff':
                buttonClassName += 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-70';
                break;
              case 'passed':
                buttonClassName += 'bg-gray-500 text-white cursor-not-allowed opacity-70';
                break;
              default:
                buttonClassName += 'bg-gray-100 text-gray-800';
            }

            return (
              <button
                key={slot}
                onClick={(event) => handleTimeSlotClick(slot, event)}
                disabled={status !== 'available' && status !== 'review' && status !== 'accepted' && status !== 'ongoing'}
                className={buttonClassName}
              >
                {slot}
              </button>
            );
          })}
        </div>

        {/* Color Palette Legend */}
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Time Slot Legend:</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            <div className="flex items-center gap-2">
              <span className="block w-4 h-4 bg-gray-100 rounded-full border border-gray-300"></span>
              <span className="text-gray-700 text-sm">Free Slot</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="block w-4 h-4 bg-yellow-400 rounded-full"></span>
              <span className="text-gray-700 text-sm">Booking Under Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="block w-4 h-4 bg-green-400 rounded-full"></span>
              <span className="text-gray-700 text-sm">Booked Slot</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="block w-4 h-4 bg-red-500 rounded-full"></span>
              <span className="text-gray-700 text-sm">Meeting Ongoing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="block w-4 h-4 bg-gray-300 rounded-full"></span>
              <span className="text-gray-700 text-sm">Past Cut-off</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="block w-4 h-4 bg-gray-500 rounded-full"></span>
              <span className="text-gray-700 text-sm">Passed</span>
            </div>
          </div>
        </div>
      </main>

      {/* Display selected slots across all days */}
      {selectedTimeSlots.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Selected Slots</h3>
            <div className="space-y-4">
              {Object.entries(selectedTimeSlots.reduce((acc, current) => {
                (acc[current.date] = acc[current.date] || []).push(current.slot);
                return acc;
              }, {} as Record<string, string[]>)).sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()).map(([date, slots]) => (
                <div key={date} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                  <p className="font-semibold text-gray-800 mb-2">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <div className="flex flex-wrap gap-2">
                    {slots.sort().map((slot) => (
                      <span
                        key={`${date}-${slot}`}
                        className="flex items-center bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full border border-green-200"
                      >
                        {slot}
                        <button
                          type="button"
                          onClick={() => handleTimeSlotClick(slot, { preventDefault: () => {} } as React.MouseEvent<HTMLButtonElement>)}
                          className="ml-1 -mr-1.5 p-0.5 rounded-full hover:bg-green-200 text-green-700"
                          aria-label={`Remove ${slot} on ${date}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedTimeSlots([])}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Clear All Selected
              </button>
              <button
                onClick={() => {
                  if (!user) {
                    alert("Please log in first to book a hall.");
                    navigate('/admin'); // Assuming /admin has the login form
                    return;
                  }
                  const currentDaySelectedSlots = selectedTimeSlots.filter(s => s.date === selectedDate);
                  if (currentDaySelectedSlots.length > 0) {
                    setShowBookingModal(true); // Open the modal
                  } else {
                    alert("Please select at least one time slot for the current day to book.");
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedTimeSlots.filter(s => s.date === selectedDate).length === 0}
              >
                Book Selected Slots
              </button>
            </div>
          </div>
        </div>
      )}

      {hall && showBookingModal && (
        <BookingModal
          hall={hall}
          selectedDate={selectedDate}
          selectedTimeSlots={selectedTimeSlots.filter(s => s.date === selectedDate).map(s => s.slot)} // Pass only selected slots for the current date
          displayTimeSlots={timeSlots.filter(slot => getSlotStatus(slot).status === 'available')} // Pass only available slots for display
          onClose={() => { setShowBookingModal(false); setSelectedTimeSlots(prev => prev.filter(s => s.date !== selectedDate)); setPopupInfo(null); }}
          onSuccess={handleBookingSuccess}
          onDateChange={(newDate) => {
            setSelectedDate(newDate);
            setSelectedTimeSlots(prev => prev.filter(s => s.date === newDate)); // Filter selected slots for the new date
            // Reload bookings for the new date to update available slots in the modal
            if (id) {
              loadBookingsForSelectedDate(id, newDate);
            }
          }}
        />
      )}

      {popupInfo && (
        <BookingInfoPopup
          userName={popupInfo.userName}
          teamName={popupInfo.teamName}
          status={popupInfo.status}
          remarks={popupInfo.remarks} // Pass remarks to popup
          position={popupInfo.position}
          onClose={() => setPopupInfo(null)}
        />
      )}
    </div>
  );
}
