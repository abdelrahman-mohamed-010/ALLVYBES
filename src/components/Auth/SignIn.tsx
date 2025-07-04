import React, { useState } from 'react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../lib/supabase';
import { useStore } from '../../store/useStore';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useStore();

  const from = location.state?.from?.pathname || '/';
  const message = location.state?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await auth.signIn(email.trim(), password);

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // Navigate to intended destination or home
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? 'bg-dark-bg' : 'bg-gradient-to-br from-primary-green/10 to-primary-purple/10'
    }`}>
      <div className="w-full max-w-md px-6">
        <form
          onSubmit={handleSubmit}
          className={`p-8 rounded-2xl shadow-xl ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-primary-green to-primary-purple bg-clip-text text-transparent">
              ALL VYBES
            </h1>
            <h2 className={`text-2xl font-bold mb-2 ${
              darkMode ? 'text-dark-text' : 'text-gray-900'
            }`}>
              Welcome Back
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Sign in to your account
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-6 p-3 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
              <p className="text-green-700 dark:text-green-400 text-sm">{message}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={setEmail}
              icon={Mail}
              required
              className="w-full"
            />
            
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={setPassword}
                icon={Lock}
                required
                className="w-full pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? 'text-gray-400 hover:text-dark-text' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full mt-6"
            glow
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </Button>

          {/* Footer Links */}
          <div className="mt-6 space-y-3">
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-primary-purple hover:text-primary-purple/80 text-sm font-medium"
              >
                Forgot your password?
              </Link>
            </div>
            
            <div className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-primary-green hover:text-primary-green/80 font-medium"
              >
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};