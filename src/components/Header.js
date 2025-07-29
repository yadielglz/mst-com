import React from 'react';
import { Settings, LogOut, Moon, Sun, History } from 'lucide-react';

const Header = ({ 
  user, 
  onSignOut, 
  onToggleTheme, 
  onShowSettings, 
  onShowQuoteHistory 
}) => {
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <header className="bg-white dark:bg-slate-800 shadow-lg border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <img 
              src="https://i.ibb.co/Y77B0htr/tmobile.png" 
              alt="T-Mobile Logo" 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                T-Mobile Sales Quote Tool
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Create amazing quotes for your customers
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Quote History Button */}
            <button
              onClick={onShowQuoteHistory}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Quote History</span>
            </button>

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
                <div className="hidden sm:block text-right">
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
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 