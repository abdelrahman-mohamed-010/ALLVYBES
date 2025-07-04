import React from 'react';
import { ExternalLink, Instagram, Mail, Zap } from 'lucide-react';
import { Button } from '../UI/Button';
import { useStore } from '../../store/useStore';

export const PlatformsPage: React.FC = () => {
  const { platforms, darkMode } = useStore();

  const featuredPlatforms = platforms.filter(p => p.featured);
  const otherPlatforms = platforms.filter(p => !p.featured);

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-white'} pb-20`}>
      <div className="px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Zap className="text-primary-purple mr-2" size={32} />
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
              Platforms
            </h1>
          </div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Discover brands, collectives, and opportunities
          </p>
        </div>

        {/* Featured Platforms */}
        {featuredPlatforms.length > 0 && (
          <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
              Featured
            </h2>
            <div className="space-y-4">
              {featuredPlatforms.map((platform) => (
                <div
                  key={platform.id}
                  className={`p-6 rounded-xl border ${
                    darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                  } hover:scale-[1.02] transition-transform duration-200`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                        {platform.name}
                      </h3>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                        {platform.description}
                      </p>
                    </div>
                    {platform.logo && (
                      <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center ml-4">
                        <img src={platform.logo} alt={platform.name} className="w-full h-full object-cover rounded-lg" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {platform.instagram && (
                      <Button
                        onClick={() => openLink(`https://instagram.com/${platform.instagram}`)}
                        variant="ghost"
                        size="sm"
                        icon={Instagram}
                      >
                        @{platform.instagram}
                      </Button>
                    )}
                    {platform.website && (
                      <Button
                        onClick={() => openLink(platform.website)}
                        variant="ghost"
                        size="sm"
                        icon={ExternalLink}
                      >
                        Website
                      </Button>
                    )}
                    {platform.contactEmail && (
                      <Button
                        onClick={() => openLink(`mailto:${platform.contactEmail}`)}
                        variant="ghost"
                        size="sm"
                        icon={Mail}
                      >
                        Contact
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Platforms */}
        {otherPlatforms.length > 0 && (
          <div>
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
              All Platforms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherPlatforms.map((platform) => (
                <div
                  key={platform.id}
                  className={`p-4 rounded-xl border ${
                    darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                  } hover:scale-[1.02] transition-transform duration-200`}
                >
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                    {platform.name}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                    {platform.description}
                  </p>
                  
                  <div className="flex space-x-2">
                    {platform.instagram && (
                      <button
                        onClick={() => openLink(`https://instagram.com/${platform.instagram}`)}
                        className="text-pink-500 hover:text-pink-600"
                      >
                        <Instagram size={16} />
                      </button>
                    )}
                    {platform.website && (
                      <button
                        onClick={() => openLink(platform.website)}
                        className={darkMode ? 'text-gray-400 hover:text-dark-text' : 'text-gray-600 hover:text-gray-900'}
                      >
                        <ExternalLink size={16} />
                      </button>
                    )}
                    {platform.contactEmail && (
                      <button
                        onClick={() => openLink(`mailto:${platform.contactEmail}`)}
                        className={darkMode ? 'text-gray-400 hover:text-dark-text' : 'text-gray-600 hover:text-gray-900'}
                      >
                        <Mail size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {platforms.length === 0 && (
          <div className="text-center py-12">
            <Zap className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} size={48} />
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No platforms available
            </h3>
            <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Check back later for new opportunities
            </p>
          </div>
        )}
      </div>
    </div>
  );
};