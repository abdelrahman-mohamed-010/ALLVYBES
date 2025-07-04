import React, { useState } from 'react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useStore } from '../../store/useStore';
import { Eye, EyeOff, Mail, Lock, User, UserCheck } from 'lucide-react';

export const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    artistName: '',
    accountType: 'artist' as 'artist' | 'admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.artistName) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            artistName: formData.artistName.trim(),
            isAdmin: formData.accountType === 'admin',
            profileComplete: false,
          }
        }
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // Show success message and redirect to login
        navigate('/login', { 
          state: { 
            message: 'Account created successfully! Please check your email to verify your account.' 
          } 
        });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign up error:', err);
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
              Join the Community
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Create your account to get started
            </p>
          </div>

          {/* Account Type Selection */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-3 ${
              darkMode ? 'text-dark-text' : 'text-gray-700'
            }`}>
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: 'artist' })}
                className={`p-3 rounded-xl border-2 transition-all ${
                  formData.accountType === 'artist'
                    ? 'border-primary-green bg-primary-green/10'
                    : darkMode
                    ? 'border-gray-600 hover:border-gray-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <User className={`mx-auto mb-2 ${
                  formData.accountType === 'artist' ? 'text-primary-green' : 'text-gray-500'
                }`} size={24} />
                <div className={`text-sm font-medium ${
                  formData.accountType === 'artist' 
                    ? 'text-primary-green' 
                    : darkMode ? 'text-dark-text' : 'text-gray-700'
                }`}>
                  Artist
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Perform & Network
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: 'admin' })}
                className={`p-3 rounded-xl border-2 transition-all ${
                  formData.accountType === 'admin'
                    ? 'border-primary-purple bg-primary-purple/10'
                    : darkMode
                    ? 'border-gray-600 hover:border-gray-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <UserCheck className={`mx-auto mb-2 ${
                  formData.accountType === 'admin' ? 'text-primary-purple' : 'text-gray-500'
                }`} size={24} />
                <div className={`text-sm font-medium ${
                  formData.accountType === 'admin' 
                    ? 'text-primary-purple' 
                    : darkMode ? 'text-dark-text' : 'text-gray-700'
                }`}>
                  Event Admin
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Organize Events
                </div>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <Input
              type="text"
              placeholder={formData.accountType === 'admin' ? 'Organization Name' : 'Artist Name'}
              value={formData.artistName}
              onChange={(value) => setFormData({ ...formData, artistName: value })}
              icon={User}
              required
            />

            <Input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              icon={Mail}
              required
            />
            
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(value) => setFormData({ ...formData, password: value })}
                icon={Lock}
                required
                className="pr-12"
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

            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
                icon={Lock}
                required
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? 'text-gray-400 hover:text-dark-text' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </Button>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-green hover:text-primary-green/80 font-medium"
              >
                Sign in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};