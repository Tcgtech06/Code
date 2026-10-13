import { useEffect, useState } from 'react';
import { LogOut, Home, Filter, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from 'docx';
import { supabase, type Booking } from '../lib/supabase';
import { sendBookingStatusEmail } from '../lib/email';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/LoginForm';
import { BookingTable } from '../components/BookingTable';
import { AdminHallsTab } from '../components/AdminHallsTab';
import { useNavigate } from 'react-router-dom';

interface BookingWithHall extends Booking {
  meeting_halls?: {
    name: string;
  };
  remarks?: string; // Add remarks to the interface
}

export function AdminPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [bookings, setBookings] = useState<BookingWithHall[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'review' | 'accepted' | 'cancelled'>('all');
  const [activeTab, setActiveTab] = useState<'bookings' | 'halls'>('bookings');
  
  // State for Admin Notes Modal
  const [selectedAction, setSelectedAction] = useState<{ type: 'accept' | 'reject', bookingId: string } | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadBookings();

      const channel = supabase
        .channel('bookings-changes')
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
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          meeting_halls (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Filter out bookings for Pranah Hall completely - use regex to catch all variations
      setBookings((data || []).filter(booking => {
        if (!booking.meeting_halls) return true;
        const hallName = booking.meeting_halls.name.toLowerCase().trim();
        return !(/pran[a-z]*h?/i.test(hallName));
      }));
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;

    setActionLoading(true);
    const { type, bookingId } = selectedAction;
    const newStatus = type === 'accept' ? 'accepted' : 'cancelled';

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus, 
          admin_notes: adminNotes,
          updated_at: new Date().toISOString() 
        })
        .eq('id', bookingId);

      if (error) throw error;
      
      // Get booking details to send email
      const targetBooking = bookings.find(b => b.id === bookingId);
      if (targetBooking) {
        try {
          // Assuming user_name is unique enough or we have their email.
          // Retrieve the user's actual email stored during booking
          // If it's an old booking without user_email, we skip sending or log a warning
          const emailToSend = targetBooking.user_email;

          if (!emailToSend) {
            console.warn("No user email found for this booking, skipping intimation email.");
          } else {
            // Fire and forget email so it doesn't block UI if SMTP hangs
            sendBookingStatusEmail(
              emailToSend,
              targetBooking.user_name,
              newStatus,
              adminNotes,
              targetBooking.meeting_halls?.name || 'Hall',
              targetBooking.start_time
            ).catch(emailErr => console.error("Failed to send status email:", emailErr));
          }
        } catch (emailErr) {
          console.error("Failed to send status email:", emailErr);
        }
      }

      await loadBookings();
      setSelectedAction(null);
    } catch (error) {
      console.error(`Error ${type}ing booking:`, error);
    } finally {
      setActionLoading(false);
    }
  };

  const initiateAction = (type: 'accept' | 'reject', bookingId: string) => {
    setSelectedAction({ type, bookingId });
    setAdminNotes('');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const exportExcel = () => {
    const data = filteredBookings.map(b => ({
      Hall: b.meeting_halls?.name || 'N/A',
      User: b.user_name,
      Team: b.team_name,
      Members: b.members_count,
      Status: b.status,
      Remarks: b.remarks || '',
      Date: new Date(b.start_time).toLocaleDateString(),
      'Start Time': new Date(b.start_time).toLocaleTimeString(),
      'End Time': new Date(b.end_time).toLocaleTimeString(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, "bookings.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Bookings Report", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Hall', 'User', 'Team', 'Status', 'Date', 'Time']],
      body: filteredBookings.map(b => [
        b.meeting_halls?.name || 'N/A',
        b.user_name,
        b.team_name,
        b.status,
        new Date(b.start_time).toLocaleDateString(),
        `${new Date(b.start_time).toLocaleTimeString()} - ${new Date(b.end_time).toLocaleTimeString()}`
      ])
    });
    doc.save("bookings.pdf");
  };

  const exportWord = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: "Bookings Report", bold: true, size: 24 }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Hall")] }),
                  new TableCell({ children: [new Paragraph("User")] }),
                  new TableCell({ children: [new Paragraph("Team")] }),
                  new TableCell({ children: [new Paragraph("Status")] }),
                  new TableCell({ children: [new Paragraph("Date")] }),
                  new TableCell({ children: [new Paragraph("Time")] }),
                ],
              }),
              ...filteredBookings.map(b => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(b.meeting_halls?.name || "N/A")] }),
                  new TableCell({ children: [new Paragraph(b.user_name)] }),
                  new TableCell({ children: [new Paragraph(b.team_name)] }),
                  new TableCell({ children: [new Paragraph(b.status)] }),
                  new TableCell({ children: [new Paragraph(new Date(b.start_time).toLocaleDateString())] }),
                  new TableCell({ children: [new Paragraph(`${new Date(b.start_time).toLocaleTimeString()} - ${new Date(b.end_time).toLocaleTimeString()}`)] }),
                ],
              }))
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bookings.docx';
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter);

  const stats = {
    total: bookings.length,
    review: bookings.filter(b => b.status === 'review').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="mb-8 inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
          <LoginForm />
        </div>
      </div>
    );
  }

  // Admin access check
  if (user.email !== 'vilvah@admin.com') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You do not have administrator privileges to view this page.</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/my-bookings')}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
            >
              Go to My Bookings
            </button>
            <button
              onClick={() => signOut()}
              className="w-full bg-red-100 text-red-600 py-3 rounded-xl font-bold hover:bg-red-200 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgyfshtMV3gNKaS8p864zflDIxA3SnNWStIkwrYwKGMhQ18nrbhhFom19u5oszm1o6Ye1tLDZ67pkNMm04c8g0fnEpz93NmtR8NCtQAjcOAZGEDdkyVB26EpJxalk_rmRin-OaQplT9UQ2kJnepKE-5B5sB1hcvgR7ksQHfIhaosU-pEJvSHc2igP3IqYw/s1600/vilvah.png" alt="Vilvah Logo" className="w-8 h-8" />
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600">Manage bookings</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">Admin</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
              >
                <Home className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
              >
                <LogOut className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex gap-4 mb-6 sm:mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-2 font-semibold text-sm sm:text-base transition-colors border-b-2 ${
              activeTab === 'bookings' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('halls')}
            className={`pb-3 px-2 font-semibold text-sm sm:text-base transition-colors border-b-2 ${
              activeTab === 'halls' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Manage Halls
          </button>
        </div>

        {activeTab === 'bookings' ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <h3 className="text-gray-600 text-xs sm:text-sm font-semibold mb-2">Total</h3>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <h3 className="text-gray-600 text-xs sm:text-sm font-semibold mb-2">Review</h3>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.review}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <h3 className="text-gray-600 text-xs sm:text-sm font-semibold mb-2">Accepted</h3>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <h3 className="text-gray-600 text-xs sm:text-sm font-semibold mb-2">Cancelled</h3>
                <p className="text-2xl sm:text-3xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">All Bookings</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={exportPDF}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded border border-red-200 transition-colors text-sm"
                      title="Export to PDF"
                    >
                      <Download className="w-4 h-4" /> PDF
                    </button>
                    <button
                      onClick={exportExcel}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded border border-green-200 transition-colors text-sm"
                      title="Export to Excel"
                    >
                      <Download className="w-4 h-4" /> Excel
                    </button>
                    <button
                      onClick={exportWord}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded border border-blue-200 transition-colors text-sm"
                      title="Export to Word"
                    >
                      <Download className="w-4 h-4" /> Word
                    </button>
                    <div className="h-6 w-px bg-gray-300 mx-2 hidden sm:block"></div>
                    <Filter className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as typeof filter)}
                      className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm sm:text-base"
                    >
                      <option value="all">All Status</option>
                      <option value="review">In Review</option>
                      <option value="accepted">Accepted</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  </div>
                ) : (
                  <BookingTable
                    bookings={filteredBookings}
                    onAccept={(id) => initiateAction('accept', id)}
                    onCancel={(id) => initiateAction('reject', id)}
                    loading={actionLoading}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <AdminHallsTab />
        )}
      </main>

      {/* Admin Notes Modal */}
      {selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {selectedAction.type === 'accept' ? 'Accept Booking' : 'Reject Booking'}
            </h3>
            <form onSubmit={confirmAction}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Admin Notes {selectedAction.type === 'reject' && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  required={selectedAction.type === 'reject'}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                  placeholder={selectedAction.type === 'reject' ? "Please provide a reason for rejection..." : "Optional notes to include in the email..."}
                ></textarea>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedAction(null)}
                  disabled={actionLoading}
                  className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={`px-4 py-2 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 ${
                    selectedAction.type === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {actionLoading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
