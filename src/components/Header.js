import React, { useState, useEffect } from 'react';
import { Settings, LogOut, Moon, Sun, Menu, X, Clock, Cloud } from 'lucide-react';

const Header = ({ 
  user, 
  onSignOut, 
  onToggleTheme, 
  onShowSettings,
  weather,
  tempUnit
}) => {
  const isDark = document.documentElement.classList.contains('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-lg border-b border-slate-200 dark:border-slate-700 mobile-menu-container">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 sm:gap-4">
            <img 
              src="https://i.ibb.co/V0r0hgn7/tmobile-header.png" 
              alt="T-Mobile Logo" 
              className="h-8 sm:h-12 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
                Sales Quote Tool
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Create amazing quotes for your customers
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-sm font-bold text-slate-800 dark:text-white">
                Quote Tool
              </h1>
            </div>
          </div>

          {/* Clock and Weather - Desktop */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Clock */}
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Clock className="w-4 h-4" />
              <div className="text-right">
                <div className="text-sm font-medium">{formatTime(currentTime)}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{formatDate(currentTime)}</div>
              </div>
            </div>

            {/* Weather */}
            {weather && weather.temp && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span className="text-lg">{weather.condition}</span>
                <div className="text-right">
                  <div className="text-sm font-medium">{weather.temp}°{tempUnit || 'F'}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Weather</div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Settings Button */}
            <button
              onClick={onShowSettings}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* User Menu */}
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800 dark:text-white">
                    {user.email}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sales Representative
                  </p>
                </div>
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={() => {
                console.log('Mobile menu toggle clicked, current state:', isMobileMenuOpen);
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="space-y-3">
              {/* Clock and Weather - Mobile */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  <div>
                    <div className="text-sm font-medium text-slate-800 dark:text-white">{formatTime(currentTime)}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{formatDate(currentTime)}</div>
                  </div>
                </div>
                {weather && weather.temp && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{weather.condition}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-800 dark:text-white">{weather.temp}°{tempUnit || 'F'}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Settings Button */}
              <button
                onClick={() => {
                  console.log('Settings clicked');
                  onShowSettings();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors duration-200"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => {
                  console.log('Theme toggle clicked');
                  onToggleTheme();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors duration-200"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              {/* User Info and Sign Out */}
              {user && (
                <>
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Sales Representative
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      console.log('Sign out clicked');
                      onSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 