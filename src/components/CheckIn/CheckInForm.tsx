import React, { useState } from 'react';
import { User, Mail, Phone, AlertTriangle, Instagram, ArrowLeft } from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { useStore } from '../../store/useStore';
import { CheckIn, User as UserType } from '../../types';

interface CheckInFormProps {
  onBack: () => void;
  onComplete: () => void;
}

export const CheckInForm: React.FC<CheckInFormProps> = ({ onBack, onComplete }) => {
  const { currentEvent, addUser, addCheckIn, setCurrentUser, darkMode } = useStore();
  
  const [formData, setFormData] = useState({
    artistName: '',
    instagram: '',
    phone: '',
    email: '',
    emergencyContact: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.artistName.trim()) {
      newErrors.artistName = 'Artist name is required';
    }
    
    if (!formData.instagram.trim()) {
      newErrors.instagram = 'Instagram handle is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !currentEvent) return;
    
    setIsSubmitting(true);
    
    try {
      // Create new user
      const newUser: UserType = {
        id: Date.now().toString(),
        artistName: formData.artistName,
        instagram: formData.instagram,
        phone: formData.phone,
        email: formData.email,
        emergencyContact: formData.emergencyContact,
        createdAt: new Date(),
      };
      
      // Create check-in record
      const newCheckIn: CheckIn = {
        id: Date.now().toString(),
        userId: newUser.id,
        eventId: currentEvent.id,
        timestamp: new Date(),
        guestCount: 0,
        songCount: 1,
        isComplete: false,
        isStar: false,
        performed: false,
        specialEffects: false,
      };
      
      addUser(newUser);
      addCheckIn(newCheckIn);
      setCurrentUser(newUser);
      
      setTimeout(() => {
        onComplete();
      }, 1000);
      
    } catch (error) {
      console.error('Check-in failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-white'} pb-20`}>
      <div className="px-6 py-8">
        <div className="flex items-center mb-8">
          <Button onClick={onBack} variant="ghost" icon={ArrowLeft} size="sm">
            Back
          </Button>
        </div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-green to-primary-purple rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-white" size={32} />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
            Artist Check-In
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentEvent?.name}
          </p>
        </div>

        <div className="space-y-6">
          <Input
            label="Artist Name"
            value={formData.artistName}
            onChange={(value) => setFormData({ ...formData, artistName: value })}
            placeholder="Your stage name"
            icon={User}
            required
            error={errors.artistName}
          />
          
          <Input
            label="Instagram Handle"
            value={formData.instagram}
            onChange={(value) => setFormData({ ...formData, instagram: value.replace('@', '') })}
            placeholder="username (without @)"
            icon={Instagram}
            required
            error={errors.instagram}
          />
          
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            placeholder="(555) 123-4567"
            icon={Phone}
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            placeholder="your@email.com"
            icon={Mail}
          />
          
          <Input
            label="Emergency Contact"
            value={formData.emergencyContact}
            onChange={(value) => setFormData({ ...formData, emergencyContact: value })}
            placeholder="Name and phone number"
            icon={AlertTriangle}
          />
        </div>

        <div className="mt-8">
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full"
            glow
          >
            {isSubmitting ? 'Checking In...' : 'Complete Check-In'}
          </Button>
        </div>
        
        <div className={`mt-6 p-4 rounded-xl ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
        }`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            By checking in, you'll be added to the event lobby where other artists can discover and connect with you.
          </p>
        </div>
      </div>
    </div>
  );
};