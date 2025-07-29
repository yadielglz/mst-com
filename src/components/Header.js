import React, { useState, useEffect } from 'react';
import { Settings, LogOut, Moon, Sun, Menu, X, Clock, Cloud, User, ChevronDown } from 'lucide-react';

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
    <header className="bg-white dark:bg-slate-800 shadow-lg border-b border-slate-200 dark:border-slate-700 mobile-menu-container sticky top-0 z-50">
      {/* Desktop Header */}
      <div className="hidden sm:block">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-4">
              <img 
                src="https://i.ibb.co/V0r0hgn7/tmobile-header.png" 
                alt="T-Mobile Logo" 
                className="h-8 sm:h-12 w-auto object-contain"
              />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
                  Sales Quote Tool
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Create amazing quotes for your customers
                </p>
              </div>
            </div>

            {/* Clock and Weather - Desktop */}
            <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-3">
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
          </div>
        </div>
      </div>

      {/* Mobile Header - Creative Portrait Design */}
      <div className="sm:hidden">
        {/* Main Mobile Header Bar */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Time */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img 
                src="https://i.ibb.co/V0r0hgn7/tmobile-header.png" 
                alt="T-Mobile Logo" 
                className="h-8 w-auto object-contain flex-shrink-0"
              />
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 flex-shrink-0">
                <Clock className="w-4 h-4" />
                <div className="text-right">
                  <div className="text-sm font-medium">{formatTime(currentTime)}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{formatDate(currentTime)}</div>
                </div>
              </div>
            </div>

            {/* Center: Weather (if available) */}
            {weather && weather.temp && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 mx-2">
                <span className="text-lg">{weather.condition}</span>
                <div className="text-right">
                  <div className="text-sm font-medium">{weather.temp}°{tempUnit || 'F'}</div>
                </div>
              </div>
            )}

            {/* Right: Menu Button */}
            <button
              onClick={() => {
                console.log('Mobile menu toggle clicked, current state:', isMobileMenuOpen);
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200 flex-shrink-0"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Creative Slide Down */}
        {isMobileMenuOpen && (
          <div className="border-t border-slate-200 dark:border-slate-700 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <div className="px-4 py-4 space-y-3">
              {/* User Profile Card */}
              {user && (
                <div className="bg-gradient-to-r from-att-blue to-att-blue-light rounded-xl p-4 text-white shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-white/80">
                        Sales Representative
                      </p>
                    </div>
                    <ChevronDown className="w-5 h-5 text-white/60" />
                  </div>
                </div>
              )}

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Settings */}
                <button
                  onClick={() => {
                    console.log('Settings clicked');
                    onShowSettings();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 dark:border-slate-600"
                >
                  <div className="w-10 h-10 bg-att-blue/10 rounded-full flex items-center justify-center">
                    <Settings className="w-5 h-5 text-att-blue" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Settings</span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={() => {
                    console.log('Theme toggle clicked');
                    onToggleTheme();
                  }}
                  className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 dark:border-slate-600"
                >
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-600 rounded-full flex items-center justify-center">
                    {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {isDark ? 'Light' : 'Dark'}
                  </span>
                </button>
              </div>

              {/* Sign Out Button */}
              {user && (
                <button
                  onClick={() => {
                    console.log('Sign out clicked');
                    onSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              )}

              {/* App Info */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sales Quote Tool v1.0
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 