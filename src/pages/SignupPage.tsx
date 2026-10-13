import { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, Home, User } from 'lucide-react';
// removed useAuth import
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function SignupPage() {
  // We don't need signUp from useAuth since we call supabase directly to pass metadata
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('vilvah_email');
    const savedPassword = localStorage.getItem('vilvah_password');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('vilvah_email', email);
        localStorage.setItem('vilvah_password', password);
      } else {
        localStorage.removeItem('vilvah_email');
        localStorage.removeItem('vilvah_password');
      }

      // We use signUp from context, but we need to pass metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username: username }
        }
      });

      if (error) throw error;
      
      // Also try to insert into profiles table if it exists (it handles linking username to email for login)
      if (data?.user) {
        try {
          await supabase.from('profiles').insert([
            { id: data.user.id, username, email }
          ]);
        } catch (profileErr) {
          console.warn("Could not insert into profiles table, maybe it doesn't exist yet", profileErr);
        }
      }

      navigate('/'); // Redirect to home on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
      <button
        onClick={() => navigate('/')}
        className="mb-8 inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
      >
        <Home className="w-5 h-5" />
        Back to Home
      </button>

      <div className="w-full max-w-md px-4 sm:px-0">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-sm sm:text-base text-gray-600">Sign up to book conference halls</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs sm:text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </div>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                placeholder="Unique username"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 sm:py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  placeholder="Create a password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me-signup"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me-signup" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold py-2 sm:py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
            
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <a href="/admin" className="text-green-600 hover:text-green-700 font-semibold">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
