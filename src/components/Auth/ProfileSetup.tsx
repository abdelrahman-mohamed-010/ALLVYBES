import React, { useState } from 'react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useStore } from '../../store/useStore';
import { User, Instagram, Phone, Mail, AlertTriangle } from 'lucide-react';

export const ProfileSetup: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { darkMode } = useStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    artistName: user?.artistName || '',
    bio: '',
    instagram: '',
    phone: '',
    emergencyContact: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.artistName.trim()) {
      setError('Artist name is required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Update user profile
      updateProfile({
        artistName: formData.artistName.trim(),
        profileComplete: true,
      });

      // Navigate to home
      navigate('/', { replace: true });
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile setup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-white'}`}>
      <div className="px-6 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-green to-primary-purple rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-white" size={40} />
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${
              darkMode ? 'text-dark-text' : 'text-gray-900'
            }`}>
              Complete Your Profile
            </h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {user?.isAdmin ? 'Set up your admin profile' : 'Tell us about yourself as an artist'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={user?.isAdmin ? "Organization Name" : "Artist Name"}
              value={formData.artistName}
              onChange={(value) => setFormData({ ...formData, artistName: value })}
              placeholder={user?.isAdmin ? "Your organization name" : "Your stage name"}
              icon={User}
              required
            />

            {!user?.isAdmin && (
              <>
                <div className="space-y-1">
                  <label className={`block text-sm font-medium ${
                    darkMode ? 'text-dark-text' : 'text-gray-700'
                  }`}>
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about your music and style..."
                    rows={3}
                    className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-dark-text
                      focus:ring-2 focus:ring-primary-green focus:border-transparent
                      placeholder-gray-500 dark:placeholder-gray-400`}
                  />
                </div>

                <Input
                  label="Instagram Handle"
                  value={formData.instagram}
                  onChange={(value) => setFormData({ ...formData, instagram: value.replace('@', '') })}
                  placeholder="username (without @)"
                  icon={Instagram}
                />
              </>
            )}

            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              placeholder="(555) 123-4567"
              icon={Phone}
            />

            <Input
              label="Emergency Contact"
              value={formData.emergencyContact}
              onChange={(value) => setFormData({ ...formData, emergencyContact: value })}
              placeholder="Name and phone number"
              icon={AlertTriangle}
            />

            {error && (
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full"
              glow
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};