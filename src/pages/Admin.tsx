import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import oxAnimation from '../../ox.json';
import { 
  fetchJobPostings, 
  createJobPosting, 
  deleteJobPosting, 
  fetchPositions as getPositions, 
  createPosition as addPosition, 
  deletePosition as removePosition, 
  fetchJobApplications, 
  updateJobApplication, 
  deleteJobApplication,
  JobPosting as Job,
  Position,
  JobApplicationData as JobApplication,
  loginAdminWithEmail,
  logoutAdmin,
  onAuthStatusChange
} from '../lib/firebase';
import { User } from 'firebase/auth';
import { 
  Plus, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Eye, 
  EyeOff, 
  MessageCircle, 
  Search, 
  Trash2, 
  Lock, 
  Mail, 
  LogOut, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';
import InvoiceGenerator from '../components/InvoiceGenerator';
import LetterGenerator from '../components/LetterGenerator';
import SalarySlipGenerator from '../components/SalarySlipGenerator';
import QuotationGenerator from '../components/QuotationGenerator';

export default function Admin() {
  // Auth states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [emailInput, setEmailInput] = useState('admin@tcgtech.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Full-time');
  const [description, setDescription] = useState('');
  const [positionId, setPositionId] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [newPosition, setNewPosition] = useState('');
  const [showPositionForm, setShowPositionForm] = useState(false);
  const [showPositions, setShowPositions] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDay, setCurrentDay] = useState<number>(13);

  useEffect(() => {
    const unsubscribe = onAuthStatusChange((user) => {
      setCurrentUser(user);
      setAuthChecking(false);
      if (user) {
        fetchJobs();
        fetchPositions();
        fetchApplications();
      }
    });

    const now = new Date();
    const date = now.getDate();
    setCurrentDay(date);

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setIsLoggingIn(true);
    setAuthError('');

    const { user, error } = await loginAdminWithEmail(emailInput, passwordInput);
    setIsLoggingIn(false);

    if (error) {
      const errMsg = error.message.toLowerCase();
      if (errMsg.includes('invalid-credential') || errMsg.includes('wrong-password') || errMsg.includes('user-not-found')) {
        setAuthError('Invalid email or password. Please check your credentials.');
      } else if (errMsg.includes('too-many-requests')) {
        setAuthError('Too many failed attempts. Please try again later.');
      } else {
        setAuthError(`Login failed: ${error.message}`);
      }
    } else {
      setCurrentUser(user);
      setPasswordInput('');
    }
  };

  const handleLogout = async () => {
    const { error } = await logoutAdmin();
    if (error) {
      console.error('Logout error:', error);
    } else {
      setCurrentUser(null);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await fetchJobApplications();
      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setMessage({ text: 'Failed to fetch applications', type: 'error' });
    }
  };

  const fetchPositions = async () => {
    try {
      const { data, error } = await getPositions();
      if (error) throw error;
      setPositions(data || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
      setMessage({ text: 'Failed to fetch positions', type: 'error' });
    }
  };

  const fetchJobs = async () => {
    try {
      const { data, error } = await fetchJobPostings();
      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setMessage({ text: 'Failed to fetch jobs', type: 'error' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const selectedPos = positions.find(p => p.id === positionId);
      const { error } = await createJobPosting({
        title,
        location,
        type,
        description,
        position_id: positionId,
        position_title: selectedPos ? selectedPos.title : undefined
      });

      if (error) throw error;

      setMessage({ text: 'Job posting created successfully!', type: 'success' });
      setTitle('');
      setLocation('');
      setType('Full-time');
      setDescription('');
      setPositionId('');
      fetchJobs();
    } catch (error) {
      console.error('Error creating job posting:', error);
      setMessage({ text: 'Failed to create job posting', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;

    try {
      const { error } = await deleteJobPosting(id);
      if (error) throw error;

      setMessage({ text: 'Job posting deleted successfully!', type: 'success' });
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job posting:', error);
      setMessage({ text: 'Failed to delete job posting', type: 'error' });
    }
  };

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosition.trim()) return;

    try {
      const { error } = await addPosition(newPosition.trim());
      if (error) throw error;

      setMessage({ text: 'Position added successfully!', type: 'success' });
      setNewPosition('');
      setShowPositionForm(false);
      fetchPositions();
    } catch (error) {
      console.error('Error adding position:', error);
      setMessage({ text: 'Failed to add position', type: 'error' });
    }
  };

  const handleDeletePosition = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this position? This will affect existing job postings.')) return;

    try {
      const { error } = await removePosition(id);
      if (error) throw error;

      setMessage({ text: 'Position deleted successfully!', type: 'success' });
      fetchPositions();
    } catch (error) {
      console.error('Error deleting position:', error);
      setMessage({ text: 'Failed to delete position', type: 'error' });
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const { error } = await updateJobApplication(id, { 
        status: status as JobApplication['status'] 
      });

      if (error) throw error;

      setMessage({ text: 'Application status updated successfully!', type: 'success' });
      fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      setMessage({ text: 'Failed to update application status', type: 'error' });
    }
  };

  const deleteApplication = async (id: string, candidateName: string) => {
    if (!window.confirm(`Are you sure you want to delete the application from ${candidateName}? This action cannot be undone.`)) return;

    try {
      const appToDelete = applications.find(a => a.id === id);
      const { error } = await deleteJobApplication(id, appToDelete?.resume_url);

      if (error) throw error;

      setMessage({ text: 'Application and resume deleted successfully!', type: 'success' });
      fetchApplications();
      
      // Close modal if the deleted application was being viewed
      if (selectedApplication && selectedApplication.id === id) {
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      setMessage({ text: 'Failed to delete application', type: 'error' });
    }
  };

  const sendWhatsAppMessage = (application: JobApplication) => {
    const fullName = application.last_name ? `${application.first_name} ${application.last_name}` : application.first_name;
    
    const formatSalary = (amount: string | null) => {
      if (!amount) return 'N/A';
      const num = parseInt(amount);
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(num);
    };

    let salaryInfo = '';
    if (application.current_employer === 'Yes') {
      salaryInfo = `\n💰 Salary Info:\nCurrent: ${formatSalary(application.current_salary)}\nExpected: ${formatSalary(application.expected_salary)}`;
    }

    const message = `🎯 Job Application Details

👤 Personal:
Name: ${fullName}
Email: ${application.email}
Contact: ${application.contact}
Gender: ${application.gender}
Location: ${application.location}

💼 Professional:
Position: ${application.position}
Experience: ${application.experience} years
Graduation: ${application.graduation_year}
Currently Employed: ${application.current_employer}${salaryInfo}
Skills: ${application.skills}
Resume: ${application.resume_url ? 'Uploaded ✅' : 'Not uploaded ❌'}

📅 Applied: ${new Date(application.created_at).toLocaleString('en-IN')}`;

    const whatsappUrl = `https://wa.me/919791962802?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const downloadResume = (application: JobApplication) => {
    if (!application.resume_url) {
      setMessage({ text: 'No resume uploaded for this candidate', type: 'error' });
      return;
    }

    // Create a temporary link to download the resume
    const link = document.createElement('a');
    link.href = application.resume_url;
    link.download = `${application.first_name}_${application.last_name || ''}_Resume`.replace(/\s+/g, '_');
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadApplicationData = (application: JobApplication) => {
    const fullName = application.last_name ? `${application.first_name} ${application.last_name}` : application.first_name;
    
    const formatSalary = (amount: string | null) => {
      if (!amount) return 'N/A';
      const num = parseInt(amount);
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(num);
    };

    const data = `Job Application Details
========================

Personal Information:
- Name: ${fullName}
- Email: ${application.email}
- Contact: ${application.contact}
- Gender: ${application.gender}
- Location: ${application.location}

Professional Information:
- Position Applied: ${application.position}
- Experience: ${application.experience} years
- Graduation Year: ${application.graduation_year}
- Currently Employed: ${application.current_employer}
${application.current_employer === 'Yes' ? `- Current Salary: ${formatSalary(application.current_salary)}\n- Expected Salary: ${formatSalary(application.expected_salary)}` : ''}
- Skills: ${application.skills}

Application Details:
- Status: ${application.status}
- Applied On: ${new Date(application.created_at).toLocaleString('en-IN')}
- Application ID: ${application.id}
- Resume: ${application.resume_url ? 'Uploaded' : 'Not uploaded'}
`;

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fullName.replace(/\s+/g, '_')}_Application.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-16">
        <div className="text-center p-8 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-2xl">
          <Loader2 className="h-10 w-10 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300 font-medium tracking-wide text-sm">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 pt-20 relative overflow-hidden">
        {/* Background Glowing Circles */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/90 border border-slate-700/60 rounded-2xl shadow-2xl p-8 backdrop-blur-xl relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white mb-4 shadow-lg shadow-blue-500/30">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">TCG TECH Admin</h2>
            <p className="text-slate-400 text-sm mt-1">Sign in with your authorized credentials</p>
          </div>

          {authError && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-2">
              <span className="font-semibold mt-0.5">⚠️</span>
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@tcgtech.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition focus:outline-none"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 relative">
      {/* Conditional Ox Animation - Only on Mattu Pongal (January 16th) */}
      {currentDay === 16 && (
        <>
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
          <div className="fixed top-20 right-10 w-20 h-20 hidden lg:block z-50 ox-slide">
            <Lottie 
              animationData={oxAnimation} 
              loop={true}
              style={{
                width: '100%',
                height: '100%'
              }}
            />
          </div>
        </>
      )}
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Manage job postings, positions, and invoices</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{currentUser.email || 'Admin'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-lg font-medium transition text-sm shadow-sm"
                title="Logout from Admin"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
          
          {/* Desktop Tabs */}
          <div className="hidden md:flex space-x-4">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'jobs' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Job Postings
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'applications' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('quotations')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'quotations' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Quotation Generator
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'invoices' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Invoice Generator
            </button>
            <button
              onClick={() => setActiveTab('letters')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'letters' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Letter Generation
            </button>
            <button
              onClick={() => setActiveTab('salary')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'salary' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Salary Slip
            </button>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            {/* Mobile Quotation Generator Button */}
            <div className="mb-4">
              <button
                onClick={() => setActiveTab('quotations')}
                className={`w-full px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'quotations' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Quotation Generator
              </button>
            </div>

            {/* Mobile Invoice Generator Button */}
            <div className="mb-4">
              <button
                onClick={() => setActiveTab('invoices')}
                className={`w-full px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'invoices' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Invoice Generator
              </button>
            </div>
            
            {/* Mobile Letter Generation Button */}
            <div className="mb-6">
              <button
                onClick={() => setActiveTab('letters')}
                className={`w-full px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'letters' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Letter Generation
              </button>
            </div>

            {/* Mobile Salary Slip Button */}
            <div className="mb-6">
              <button
                onClick={() => setActiveTab('salary')}
                className={`w-full px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'salary' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Salary Slip Generator
              </button>
            </div>

            {/* Mobile Tab Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'jobs' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Jobs
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'applications' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Apps ({applications.length})
              </button>
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {activeTab === 'quotations' ? (
          <QuotationGenerator />
        ) : activeTab === 'invoices' ? (
          <InvoiceGenerator />
        ) : activeTab === 'letters' ? (
          <LetterGenerator />
        ) : activeTab === 'salary' ? (
          <SalarySlipGenerator />
        ) : activeTab === 'applications' ? (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Applications</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name, email, or position..."
                      className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Job Applications ({filteredApplications.length})</h2>
              
              {filteredApplications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No applications found</p>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((application) => {
                    const fullName = application.last_name ? `${application.first_name} ${application.last_name}` : application.first_name;
                    
                    return (
                      <div key={application.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{fullName}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                {application.status}
                              </span>
                              {application.resume_url && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                  📄 Resume
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <strong>Position:</strong> {application.position}
                              </div>
                              <div>
                                <strong>Experience:</strong> {application.experience} years
                              </div>
                              <div>
                                <strong>Location:</strong> {application.location}
                              </div>
                              <div>
                                <strong>Email:</strong> {application.email}
                              </div>
                              <div>
                                <strong>Contact:</strong> {application.contact}
                              </div>
                              <div>
                                <strong>Applied:</strong> {new Date(application.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            <button
                              onClick={() => setSelectedApplication(application)}
                              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </button>
                            
                            {application.resume_url ? (
                              <button
                                onClick={() => downloadResume(application)}
                                className="flex items-center px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Resume
                              </button>
                            ) : (
                              <span className="text-xs text-gray-500 px-3 py-1">No Resume</span>
                            )}
                            
                            <button
                              onClick={() => downloadApplicationData(application)}
                              className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Details
                            </button>
                            <button
                              onClick={() => sendWhatsAppMessage(application)}
                              className="flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              WhatsApp
                            </button>
                            <button
                              onClick={() => deleteApplication(application.id, fullName)}
                              className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                            <select
                              value={application.status}
                              onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                              className="text-xs border rounded px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Position Management */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Positions</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowPositions(!showPositions)}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    {showPositions ? (
                      <>
                        <ChevronUp className="h-5 w-5 mr-2" />
                        Hide Positions
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-5 w-5 mr-2" />
                        Show Positions
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowPositionForm(!showPositionForm)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {showPositionForm ? (
                      <>
                        <X className="h-5 w-5 mr-2" />
                        Close Form
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 mr-2" />
                        Add Position
                      </>
                    )}
                  </button>
                </div>
              </div>

              {showPositionForm && (
                <form onSubmit={handleAddPosition} className="mb-6">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={newPosition}
                      onChange={(e) => setNewPosition(e.target.value)}
                      placeholder="Enter new position title"
                      className="flex-1 px-4 py-2 border rounded-lg"
                      required
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                </form>
              )}

              {showPositions && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {positions.map((position) => (
                    <div
                      key={position.id}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <span>{position.title}</span>
                      <button
                        onClick={() => handleDeletePosition(position.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create Job Posting Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Create New Job Posting</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <select
                    value={positionId}
                    onChange={(e) => setPositionId(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a position</option>
                    {positions.map((position) => (
                      <option key={position.id} value={position.id}>
                        {position.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                    isLoading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'Creating...' : 'Create Job Posting'}
                </button>
              </form>
            </div>

            {/* Current Job Postings */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Current Job Postings</h2>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <p className="text-gray-600">
                          {job.location} • {job.type} • {job.positions?.title}
                        </p>
                        <p className="mt-2">{job.description}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg border border-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No job postings available</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Application Details</h2>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Personal Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {selectedApplication.last_name ? `${selectedApplication.first_name} ${selectedApplication.last_name}` : selectedApplication.first_name}</p>
                        <p><strong>Email:</strong> {selectedApplication.email}</p>
                        <p><strong>Contact:</strong> {selectedApplication.contact}</p>
                        <p><strong>Gender:</strong> {selectedApplication.gender}</p>
                        <p><strong>Location:</strong> {selectedApplication.location}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Professional Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Position:</strong> {selectedApplication.position}</p>
                        <p><strong>Experience:</strong> {selectedApplication.experience} years</p>
                        <p><strong>Graduation Year:</strong> {selectedApplication.graduation_year}</p>
                        <p><strong>Currently Employed:</strong> {selectedApplication.current_employer}</p>
                        {selectedApplication.current_employer === 'Yes' && (
                          <>
                            <p><strong>Current Salary:</strong> ₹{parseInt(selectedApplication.current_salary || '0').toLocaleString('en-IN')}</p>
                            <p><strong>Expected Salary:</strong> ₹{parseInt(selectedApplication.expected_salary || '0').toLocaleString('en-IN')}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Skills</h3>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedApplication.skills}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Resume</h3>
                    {selectedApplication.resume_url ? (
                      <button
                        onClick={() => downloadResume(selectedApplication)}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Resume
                      </button>
                    ) : (
                      <p className="text-sm text-gray-500">No resume uploaded</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Application Status</h3>
                    <select
                      value={selectedApplication.status}
                      onChange={(e) => {
                        updateApplicationStatus(selectedApplication.id, e.target.value);
                        setSelectedApplication({...selectedApplication, status: e.target.value});
                      }}
                      className="px-3 py-2 border rounded-lg"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4 border-t">
                    <button
                      onClick={() => downloadApplicationData(selectedApplication)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Details
                    </button>
                    <button
                      onClick={() => sendWhatsAppMessage(selectedApplication)}
                      className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send to WhatsApp
                    </button>
                    <button
                      onClick={() => {
                        const fullName = selectedApplication.last_name ? `${selectedApplication.first_name} ${selectedApplication.last_name}` : selectedApplication.first_name;
                        deleteApplication(selectedApplication.id, fullName);
                      }}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Application
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}