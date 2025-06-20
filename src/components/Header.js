import React from 'react';
import { Settings, Search, ExternalLink, Plus, LogOut, User } from 'lucide-react';

const Header = ({ 
  userSettings, 
  weather, 
  onOpenSaleModal, 
  onOpenSearch, 
  onToggleSettings, 
  onOpenSettingsModal,
  onSetProfile, 
  onToggleTheme, 
  onToggleTempUnit,
  showSettingsMenu,
  user,
  onSignOut
}) => {
  const [time, setTime] = React.useState('--:-- --');
  const [date, setDate] = React.useState('---------- --, ----');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex flex-wrap md:flex-nowrap justify-between items-center mb-6 gap-4 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <img src="https://i.ibb.co/1tYMnVRF/ATTLogo-Main.png" alt="AT&T Logo" className="h-10" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Commission Tracker
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {userSettings.name ? `Welcome, ${userSettings.name}!` : 'Welcome!'}
            {user && (
              <span className="ml-2 text-xs text-slate-400">
                ({user.email})
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="w-full md:w-auto flex items-center justify-center md:justify-end gap-4">
        <div className="flex items-center w-full justify-center md:justify-end gap-2">
          <div className="text-center md:text-right">
            <p className="text-xl sm:text-2xl font-semibold text-att-blue">{time}</p>
            <p className="text-xs sm:text-sm text-att-gray dark:text-slate-400">{date}</p>
            <p className="text-xs sm:text-sm text-att-gray dark:text-slate-400">
              {weather.temp ? `${weather.temp}°${userSettings.tempUnit} ${weather.condition}` : 'Loading weather...'}
            </p>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-1 ml-2 md:hidden">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
              aria-label="Open search"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenSettingsModal}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
              aria-label="Settings"
              title="Settings"
            >
              <Settings className="w-6 h-6 text-att-gray dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={onToggleSettings}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <Settings className="h-6 w-6 text-att-gray dark:text-slate-400" />
            </button>
            
            {showSettingsMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl z-20">
                <div className="p-2 text-sm">
                  <button
                    onClick={onSetProfile}
                    className="w-full text-left px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Set Profile Name
                  </button>
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <label>Dark Mode</label>
                    <button
                      onClick={onToggleTheme}
                      className="px-2 rounded-md bg-slate-200 dark:bg-slate-700"
                    >
                      Toggle
                    </button>
                  </div>
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <label>Temp Unit</label>
                    <button
                      onClick={onToggleTempUnit}
                      className="px-2 rounded-md bg-slate-200 dark:bg-slate-700"
                    >
                      °C / °F
                    </button>
                  </div>
                  {user && (
                    <button
                      onClick={onSignOut}
                      className="w-full text-left px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-red-600 dark:text-red-400 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 