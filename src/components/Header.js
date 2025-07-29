import React from 'react';
import { Settings, Search, ExternalLink, Plus, LogOut, User } from 'lucide-react';

const Header = ({ 
  userSettings, 
  weather, 
  onOpenSearch, 
  onToggleSettings,
  onOpenSettingsModal,
  onSetProfile,
  onToggleTheme,
  onToggleTempUnit,
  onSignOut,
  showSettingsMenu,
  user
}) => {
  const [time, setTime] = React.useState('--:-- --');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white dark:bg-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <img src="https://i.ibb.co/Y77B0htr/tmobile.png" alt="T-Mobile Logo" className="h-8" />
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Commission Tracker
              </h1>
              {user && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-lg font-semibold text-att-blue">{time}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {weather.temp ? `${weather.temp}°${userSettings.tempUnit} ${weather.condition}` : 'Loading...'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSearch}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Search className="w-5 h-5" />
              </button>
              {/* Mobile Settings Button */}
              <button
                onClick={onOpenSettingsModal}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
              >
                <Settings className="w-5 h-5" />
              </button>
              {/* Desktop Settings Pop-out */}
              <div className="relative hidden md:inline-block">
                <button
                  onClick={onToggleSettings}
                  className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Settings className="w-5 h-5" />
                </button>
                {showSettingsMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl z-20 border dark:border-slate-700">
                    <div className="p-2 text-sm">
                      <button
                        onClick={() => { onSetProfile(); onToggleSettings(); }}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                      >
                        <User className="w-4 h-4" /> Set Profile Name
                      </button>
                      <div className="flex items-center justify-between px-3 py-2">
                        <span>Dark Mode</span>
                        <button
                          onClick={onToggleTheme}
                          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${userSettings.theme === 'dark' ? 'bg-att-blue' : 'bg-slate-200'}`}
                        >
                          <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${userSettings.theme === 'dark' ? 'translate-x-5' : ''}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2">
                        <span>Temp Unit</span>
                        <button
                          onClick={onToggleTempUnit}
                          className="px-3 py-1 text-xs rounded-md bg-slate-200 dark:bg-slate-700"
                        >
                          °C / °F
                        </button>
                      </div>
                      {user && (
                        <>
                          <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                          <button
                            onClick={() => { onSignOut(); onToggleSettings(); }}
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-red-500 flex items-center gap-2"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 