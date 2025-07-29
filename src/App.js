import React, { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, startOfMonth, isWithinInterval } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Plus, 
  Settings, 
  Search, 
  Trash2, 
  Edit, 
  Lock, 
  User, 
  Target, 
  TrendingUp,
  Download,
  Upload,
  BarChart3,
  Calendar,
  DollarSign,
  Smartphone,
  Wifi,
  Tv,
  ExternalLink,
  X,
  Check,
  AlertCircle,
  Info,
  LogOut
} from 'lucide-react';

// Import Firebase services
import { 
  onAuthChange, 
  getCurrentUser, 
  signOutUser,
  subscribeToSales,
  saveUserSettings,
  getUserSettings,
  saveGoals,
  getGoals,
  addSale as firebaseAddSale,
  deleteSale as firebaseDeleteSale
} from './services/firebaseService';

// Import components
import Header from './components/Header';
import { MobileDashboard, DesktopDashboard } from './components/Dashboard';
import GoalsSection from './components/GoalsSection';
import SalesLog from './components/SalesLog';
import AuthModal from './components/AuthModal';
import { 
  SaleModal, 
  GoalsModal, 
  ProfileModal, 
  PinModal, 
  SearchPopout, 
  OOBEScreen,
  SettingsModal
} from './components/Modals';

// Product catalog data
const PRODUCT_CATALOG = {
  Mobile: {
    plans: {
      'T-Mobile Essentials': { hasLines: true, price: '$60/mo' },
      'T-Mobile Magenta': { hasLines: true, price: '$70/mo' },
      'T-Mobile Magenta MAX': { hasLines: true, price: '$85/mo' },
      'T-Mobile Go5G': { hasLines: true, price: '$75/mo' },
      'T-Mobile Go5G Plus': { hasLines: true, price: '$90/mo' },
      'T-Mobile Go5G Next': { hasLines: true, price: '$95/mo' },
      'T-Mobile Go5G Military': { hasLines: true, price: '$55/mo' },
      'T-Mobile Go5G 55+': { hasLines: true, price: '$55/mo' },
      'T-Mobile Go5G Plus Military': { hasLines: true, price: '$70/mo' },
      'T-Mobile Go5G Plus 55+': { hasLines: true, price: '$70/mo' },
      'BYOD w/ T-Mobile Essentials': { hasLines: false, price: '$60/mo' },
      'BYOD w/ T-Mobile Magenta': { hasLines: false, price: '$70/mo' },
      'BYOD w/ T-Mobile Magenta MAX': { hasLines: false, price: '$85/mo' },
      'T-Mobile Device Upgrade': { hasLines: false, price: 'Varies' },
      'T-Mobile Prepaid': { hasLines: true, price: '$40/mo' },
      'T-Mobile Prepaid Unlimited': { hasLines: true, price: '$50/mo' },
    },
    addOns: {
      'T-Mobile Protection': { name: 'T-Mobile Protection', price: '$7/mo' },
      'T-Mobile Protection Plus': { name: 'T-Mobile Protection Plus', price: '$11/mo' },
      'T-Mobile Protection Premium': { name: 'T-Mobile Protection Premium', price: '$15/mo' },
      'T-Mobile JUMP!': { name: 'T-Mobile JUMP!', price: '$12/mo' },
      'T-Mobile JUMP! On Demand': { name: 'T-Mobile JUMP! On Demand', price: '$10/mo' },
      'T-Mobile Plus': { name: 'T-Mobile Plus', price: '$15/mo' },
      'T-Mobile Plus Up': { name: 'T-Mobile Plus Up', price: '$20/mo' },
      'T-Mobile International': { name: 'T-Mobile International', price: '$15/mo' },
      'T-Mobile Global Plus': { name: 'T-Mobile Global Plus', price: '$50/mo' },
      'T-Mobile Data with DIGITS': { name: 'T-Mobile Data with DIGITS', price: '$10/mo' },
    },
    devices: {
      'iPhone 15 Pro Max': { price: '$1199.99', downPayment: '$199.99', monthlyPayment: '$41.67' },
      'iPhone 15 Pro': { price: '$999.99', downPayment: '$199.99', monthlyPayment: '$33.33' },
      'iPhone 15': { price: '$799.99', downPayment: '$199.99', monthlyPayment: '$25.00' },
      'iPhone 15 Plus': { price: '$899.99', downPayment: '$199.99', monthlyPayment: '$29.17' },
      'Samsung Galaxy S24 Ultra': { price: '$1299.99', downPayment: '$199.99', monthlyPayment: '$45.83' },
      'Samsung Galaxy S24+': { price: '$999.99', downPayment: '$199.99', monthlyPayment: '$33.33' },
      'Samsung Galaxy S24': { price: '$799.99', downPayment: '$199.99', monthlyPayment: '$25.00' },
      'Google Pixel 8 Pro': { price: '$999.99', downPayment: '$199.99', monthlyPayment: '$33.33' },
      'Google Pixel 8': { price: '$699.99', downPayment: '$199.99', monthlyPayment: '$20.83' },
      'OnePlus 12': { price: '$799.99', downPayment: '$199.99', monthlyPayment: '$25.00' },
    }
  },
  Internet: {
    plans: {
      'T-Mobile Home Internet': { name: 'T-Mobile Home Internet', price: '$50/mo' },
      'T-Mobile Home Internet Plus': { name: 'T-Mobile Home Internet Plus', price: '$70/mo' },
      'T-Mobile 5G Home Internet': { name: 'T-Mobile 5G Home Internet', price: '$50/mo' },
      'T-Mobile Home Internet Lite': { name: 'T-Mobile Home Internet Lite', price: '$30/mo' },
      'T-Mobile Business Internet': { name: 'T-Mobile Business Internet', price: '$70/mo' },
    },
    equipment: {
      'T-Mobile 5G Gateway': { price: '$0', deposit: '$0', monthlyPayment: '$0' },
      'T-Mobile 4G LTE Gateway': { price: '$0', deposit: '$0', monthlyPayment: '$0' },
      'T-Mobile Business Gateway': { price: '$0', deposit: '$0', monthlyPayment: '$0' },
    }
  },
  TV: {
    plans: {
      'T-Mobile TVision': { name: 'T-Mobile TVision', price: '$40/mo' },
      'T-Mobile TVision VIBE': { name: 'T-Mobile TVision VIBE', price: '$10/mo' },
      'T-Mobile TVision LIVE TV': { name: 'T-Mobile TVision LIVE TV', price: '$64.99/mo' },
      'T-Mobile TVision LIVE TV+': { name: 'T-Mobile TVision LIVE TV+', price: '$84.99/mo' },
      'T-Mobile TVision CHANNELS': { name: 'T-Mobile TVision CHANNELS', price: '$29.99/mo' },
    },
    addOns: {
      'T-Mobile TVision Premium': { name: 'T-Mobile TVision Premium', price: '$9.99/mo' },
      'T-Mobile TVision Sports': { name: 'T-Mobile TVision Sports', price: '$9.99/mo' },
      'T-Mobile TVision Entertainment': { name: 'T-Mobile TVision Entertainment', price: '$9.99/mo' },
    }
  }
};

function App() {
  // Authentication state
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // State management
  const [sales, setSales] = useState([]);
  const [userSettings, setUserSettings] = useState({
    name: '',
    theme: 'light',
    tempUnit: 'F',
    initialSetupComplete: false
  });
  const [currentGoals, setCurrentGoals] = useState({
    weekly: { mobile: 0, internet: 0, tv: 0 },
    monthly: { mobile: 0, internet: 0, tv: 0 }
  });
  const [pinLock, setPinLock] = useState({ enabled: false, pin: '' });
  const [currentSaleServices, setCurrentSaleServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProduct, setFilterProduct] = useState('all');
  const [sortSales, setSortSales] = useState('date_desc');
  const [weather, setWeather] = useState({ temp: null, condition: '☀️' });
  const [showSplash, setShowSplash] = useState(true);
  const [showOOBE, setShowOOBE] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showSearchPopout, setShowSearchPopout] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [lastDeletedSale, setLastDeletedSale] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);

  // Firebase authentication listener
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setIsLoading(false);
      
      if (user) {
        // User is signed in, load their data
        loadUserData();
      } else {
        // User is signed out, show auth modal
        setShowAuthModal(true);
        setSales([]);
        setUserSettings({
          name: '',
          theme: 'light',
          tempUnit: 'F',
          initialSetupComplete: false
        });
        setCurrentGoals({
          weekly: { mobile: 0, internet: 0, tv: 0 },
          monthly: { mobile: 0, internet: 0, tv: 0 }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Load user data from Firebase
  const loadUserData = async () => {
    try {
      // Load settings
      const settingsResult = await getUserSettings();
      if (settingsResult.success && settingsResult.settings) {
        setUserSettings(settingsResult.settings);
        document.documentElement.classList.toggle('dark', settingsResult.settings.theme === 'dark');
      }

      // Load goals
      const goalsResult = await getGoals();
      if (goalsResult.success && goalsResult.goals) {
        setCurrentGoals(goalsResult.goals);
      }

      // Set up real-time sales listener
      const unsubscribe = subscribeToSales((salesData) => {
        setSales(salesData);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
    }
  };

  // Handle authentication success
  const handleAuthSuccess = async (user) => {
    setUser(user);
    setShowAuthModal(false);
    
    // Check if this is a new user
    const settingsResult = await getUserSettings();
    if (!settingsResult.success || !settingsResult.settings) {
      setShowOOBE(true);
    } else {
      setShowSplash(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  // Save settings to Firebase
  useEffect(() => {
    if (user && userSettings.name) {
      saveUserSettings(userSettings);
    }
  }, [userSettings, user]);

  // Save goals to Firebase
  useEffect(() => {
    if (user && currentGoals.weekly.mobile > 0) {
      saveGoals(currentGoals);
    }
  }, [currentGoals, user]);

  // Time and weather updates
  useEffect(() => {
    const updateTimeAndWeather = () => {
      updateWeather();
    };

    updateTimeAndWeather();
    const interval = setInterval(updateTimeAndWeather, 60000);
    return () => clearInterval(interval);
  }, [userSettings.tempUnit]);

  // Weather API call
  const updateWeather = useCallback(async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit`
        );
        const data = await response.json();
        
        if (data?.current_weather) {
          const tempF = data.current_weather.temperature;
          const tempC = (tempF - 32) * 5/9;
          const displayTemp = userSettings.tempUnit === 'F' ? tempF.toFixed(0) : tempC.toFixed(0);
          const code = data.current_weather.weathercode;
          let emoji = '☀️';
          if (code > 70) emoji = '🌧️';
          else if (code > 50) emoji = '🌦️';
          else if (code > 2) emoji = '☁️';
          
          setWeather({ temp: displayTemp, condition: emoji });
        }
      } catch (error) {
        console.log('Weather unavailable');
      }
    }
  }, [userSettings.tempUnit]);

  // Process sales with manual commission amounts
  const salesWithManualCommissions = React.useMemo(() => {
    if (!sales || sales.length === 0) return [];

    // Return sales as-is since commissions are now manual
    return sales.map(sale => {
      const totalCommission = sale.services.reduce((sum, service) => {
        return sum + (service.manualCommission || 0);
      }, 0);

      return { ...sale, totalCommission };
    });
  }, [sales]);

  // Calculate dashboard metrics
  const dashboardMetrics = React.useMemo(() => {
    const totalSales = salesWithManualCommissions.length;
    const totalCommission = salesWithManualCommissions.reduce((sum, sale) => sum + sale.totalCommission, 0);
    const avgCommission = totalSales > 0 ? totalCommission / totalSales : 0;
    
    return { totalSales, totalCommission, avgCommission };
  }, [salesWithManualCommissions]);

  // Calculate progress
  const progress = React.useMemo(() => {
    const weeklyProgress = { Mobile: 0, Internet: 0, TV: 0 };
    const monthlyProgress = { Mobile: 0, Internet: 0, TV: 0 };
    
    const startOfWeekDate = startOfWeek(new Date());
    const startOfMonthDate = startOfMonth(new Date());
    
    sales.forEach(sale => {
      const saleDate = new Date(sale.saleDate);
      sale.services.forEach(service => {
        const category = service.category;
        const units = category === 'Mobile' ? (service.lines || 0) : 1;
        
        if (saleDate >= startOfMonthDate) {
          monthlyProgress[category] += units;
        }
        if (saleDate >= startOfWeekDate) {
          weeklyProgress[category] += units;
        }
      });
    });
    
    return { weeklyProgress, monthlyProgress };
  }, [sales]);

  // Filter and sort sales
  const filteredAndSortedSales = React.useMemo(() => {
    let processedSales = [...salesWithManualCommissions];
    
    // Filter by product
    if (filterProduct !== 'all') {
      processedSales = processedSales.filter(sale => 
        sale.services.some(s => s.category === filterProduct)
      );
    }
    
    // Search filter
    if (searchQuery) {
      processedSales = processedSales.filter(sale =>
        sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sale.notes && sale.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Sort
    processedSales.sort((a, b) => {
      switch(sortSales) {
        case 'date_asc':
          return new Date(a.saleDate) - new Date(b.saleDate);
        case 'commission_desc':
          return b.totalCommission - a.totalCommission;
        case 'commission_asc':
          return a.totalCommission - b.totalCommission;
        default:
          return new Date(b.saleDate) - new Date(a.saleDate);
      }
    });
    
    return processedSales;
  }, [salesWithManualCommissions, filterProduct, searchQuery, sortSales]);

  // Event handlers
  const handleAddSale = async (saleData) => {
    try {
      const result = await firebaseAddSale(saleData);
      if (result.success) {
        setCurrentSaleServices([]);
        setShowSaleModal(false);
        toast.success('Sale logged successfully!');
      } else {
        toast.error('Failed to log sale: ' + result.error);
      }
    } catch (error) {
      toast.error('Failed to log sale');
    }
  };

  const handleDeleteSale = async (saleId) => {
    try {
      const result = await firebaseDeleteSale(saleId);
      if (result.success) {
        const saleToDelete = sales.find(s => s.id === saleId);
        if (saleToDelete) {
          setLastDeletedSale({ sale: saleToDelete, id: saleId });
          
          // Clear previous timeout
          if (undoTimeout) clearTimeout(undoTimeout);
          
          // Set new timeout
          const timeout = setTimeout(() => {
            setLastDeletedSale(null);
          }, 6000);
          setUndoTimeout(timeout);
          
          toast.success('Sale deleted');
        }
      } else {
        toast.error('Failed to delete sale: ' + result.error);
      }
    } catch (error) {
      toast.error('Failed to delete sale');
    }
  };

  const handleUndoDelete = () => {
    if (lastDeletedSale) {
      setSales(prev => [...prev, lastDeletedSale.sale]);
      setLastDeletedSale(null);
      if (undoTimeout) {
        clearTimeout(undoTimeout);
        setUndoTimeout(null);
      }
      toast.success('Sale restored');
    }
  };

  const toggleTheme = () => {
    const newTheme = userSettings.theme === 'light' ? 'dark' : 'light';
    setUserSettings(prev => ({ ...prev, theme: newTheme }));
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleTempUnit = () => {
    setUserSettings(prev => ({
      ...prev,
      tempUnit: prev.tempUnit === 'F' ? 'C' : 'F'
    }));
  };

  const exportData = () => {
    const data = {
      sales,
      settings: userSettings,
      goals: currentGoals,
      pinLock
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tmobile-commission-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.sales) setSales(data.sales);
          if (data.settings) setUserSettings(data.settings);
          if (data.goals) setCurrentGoals(data.goals);
          if (data.pinLock) setPinLock(data.pinLock);
          toast.success('Data imported successfully');
        } catch (error) {
          toast.error('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleOOBEComplete = (goals) => {
    setCurrentGoals(goals);
    setUserSettings(prev => ({ ...prev, initialSetupComplete: true }));
    setShowOOBE(false);
    setShowSplash(false);
    toast.success('Welcome to T-Mobile Commission Tracker!');
  };

  // Render components
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl text-center">
          <img src="https://i.ibb.co/HLTSpVvP/T-Mobile-logo-2022-svg.png" alt="T-Mobile Emblem" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">T-Mobile Commission Tracker</h1>
          <div className="flex justify-center mt-6">
            <div className="w-8 h-8 border-4 border-att-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl text-center">
          <img src="https://i.ibb.co/HLTSpVvP/T-Mobile-logo-2022-svg.png" alt="T-Mobile Emblem" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">T-Mobile Commission Tracker</h1>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Important Disclaimer</h2>
            <p className="text-sm text-blue-700 dark:text-blue-300 text-left leading-relaxed">
              <strong>This is an assistant tool for tracking purposes only.</strong>
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 text-left mt-3 space-y-1">
              <li>• Your data is stored securely in the cloud and synced across devices</li>
              <li>• This tool is for personal use and tracking only</li>
              <li>• Any discrepancies in official commission calculations must be handled with HR or your direct supervisor</li>
              <li>• This is not an official T-Mobile application</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => setShowSplash(false)}
              className="w-full bg-att-blue text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-800 transition-colors duration-300 text-lg"
            >
              I Understand and Agree
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              By clicking "I Understand and Agree", you acknowledge that you have read and understood this disclaimer.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showOOBE) {
    return <OOBEScreen onComplete={handleOOBEComplete} />;
  }

  if (showPinModal) {
    return <PinModal onUnlock={() => setShowPinModal(false)} pinLock={pinLock} />;
  }

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 ${userSettings.theme}`}>
      <Toaster position="top-right" />
      
      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
      
      <Header 
        userSettings={userSettings}
        weather={weather}
        onOpenSearch={() => setShowSearchPopout(true)}
        onToggleSettings={() => setShowSettingsMenu(!showSettingsMenu)}
        onOpenSettingsModal={() => setShowSettingsModal(true)}
        onSetProfile={() => setShowProfileModal(true)}
        onToggleTheme={toggleTheme}
        onToggleTempUnit={toggleTempUnit}
        onSignOut={handleSignOut}
        showSettingsMenu={showSettingsMenu}
        user={user}
      />

      <main className="flex-1 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <MobileDashboard metrics={dashboardMetrics} onOpenSaleModal={() => setShowSaleModal(true)} />
          
          {/* Mobile Action Buttons */}
          <div className="flex justify-end items-center gap-4 mb-4 md:hidden">
            <a
              href="https://mst.att.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white border border-slate-300 dark:border-slate-700 text-att-blue hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open MST
            </a>
            <button
              onClick={() => setShowSaleModal(true)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Log Sale
            </button>
          </div>
          
          <DesktopDashboard metrics={dashboardMetrics} onOpenSaleModal={() => setShowSaleModal(true)} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SalesLog 
                sales={filteredAndSortedSales}
                onDeleteSale={handleDeleteSale}
                filterProduct={filterProduct}
                sortSales={sortSales}
                onFilterChange={setFilterProduct}
                onSortChange={setSortSales}
                userSettings={userSettings}
              />
            </div>
            <div>
              <GoalsSection 
                goals={currentGoals}
                progress={progress}
                onEditGoals={() => setShowGoalsModal(true)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showSaleModal && (
        <SaleModal 
          onClose={() => setShowSaleModal(false)}
          onSave={handleAddSale}
          currentServices={currentSaleServices}
          setCurrentServices={setCurrentSaleServices}
          productCatalog={PRODUCT_CATALOG}
        />
      )}

      {showGoalsModal && (
        <GoalsModal 
          goals={currentGoals}
          onSave={(newGoals) => {
            setCurrentGoals(newGoals);
            setShowGoalsModal(false);
          }}
          onClose={() => setShowGoalsModal(false)}
        />
      )}

      {showProfileModal && (
        <ProfileModal 
          name={userSettings.name}
          onSave={(name) => {
            setUserSettings(prev => ({ ...prev, name }));
            setShowProfileModal(false);
          }}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {showSearchPopout && (
        <SearchPopout 
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onClose={() => setShowSearchPopout(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          onSetProfile={() => setShowProfileModal(true)}
          onToggleTheme={toggleTheme}
          onToggleTempUnit={toggleTempUnit}
          onSignOut={handleSignOut}
          user={user}
        />
      )}

      {/* Undo Delete Button */}
      {lastDeletedSale && (
        <button
          onClick={handleUndoDelete}
          className="fixed bottom-4 left-4 z-50 bg-amber-500 text-white rounded-full p-3 shadow-lg hover:bg-amber-700 flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Undo Delete
        </button>
      )}

      {/* Privacy Info Button */}
      <button
        onClick={() => toast('All data is stored locally in your browser')}
        className="fixed bottom-4 right-4 z-50 bg-att-blue text-white rounded-full p-3 shadow-lg hover:bg-blue-800"
        title="Privacy Info"
      >
        <Info className="w-6 h-6" />
      </button>
    </div>
  );
}

export default App; 