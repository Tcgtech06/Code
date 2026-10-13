import { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function LoginForm() {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState(''); // Email or Username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const savedIdentifier = localStorage.getItem('vilvah_identifier');
    const savedPassword = localStorage.getItem('vilvah_password');
    if (savedIdentifier && savedPassword) {
      setIdentifier(savedIdentifier);
      setPassword(savedPassword);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('vilvah_identifier', identifier);
        localStorage.setItem('vilvah_password', password);
      } else {
        localStorage.removeItem('vilvah_identifier');
        localStorage.removeItem('vilvah_password');
      }

      let emailToLogin = identifier;

      // If it doesn't look like an email, assume it's a username
      if (!identifier.includes('@')) {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', identifier)
          .single();

        if (profileError || !data) {
          throw new Error('Username not found. Please check your username or use your email.');
        }
        emailToLogin = data.email;
      }

      await signIn(emailToLogin, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4 sm:px-0">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Login</h2>
          <p className="text-sm sm:text-base text-gray-600">Access the booking management system</p>
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
                Username or Email
              </div>
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
              placeholder="Username or your@email.com"
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
                placeholder="Enter your password"
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
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-2 sm:py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <a href="/signup" className="text-green-600 hover:text-green-700 font-semibold">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
