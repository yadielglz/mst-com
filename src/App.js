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
  Info
} from 'lucide-react';

// Import components
import Header from './components/Header';
import { MobileDashboard, DesktopDashboard } from './components/Dashboard';
import GoalsSection from './components/GoalsSection';
import SalesLog from './components/SalesLog';
import { 
  SaleModal, 
  GoalsModal, 
  ProfileModal, 
  PinModal, 
  SearchPopout, 
  OOBEScreen 
} from './components/Modals';

// Product catalog data
const PRODUCT_CATALOG = {
  Mobile: {
    plans: {
      'AT&T Unlimited Starter': { baseCommission: 30, hasLines: true },
      'AT&T Unlimited Extra': { baseCommission: 40, hasLines: true },
      'AT&T Unlimited Premium': { baseCommission: 50, hasLines: true },
      'BYOD w/ AT&T Starter': { baseCommission: 20, hasLines: false },
      'BYOD w/ AT&T Extra': { baseCommission: 30, hasLines: false },
      'BYOD w/ AT&T Premium': { baseCommission: 40, hasLines: false },
      'AT&T Device Upgrade': { baseCommission: 5, hasLines: false },
    },
    addOns: {
      'AT&T Next Up': { 
        commission: 10, 
        combo: { 
          'AT&T Unlimited Starter': 40, 
          'AT&T Unlimited Extra': 60, 
          'AT&T Unlimited Premium': 70, 
          'AT&T Device Upgrade': 15 
        }
      },
      'AT&T Protect Advantage for 1 Tier 1': { commission: 14 },
      'AT&T Protect Advantage for 1 Tier 2': { commission: 17 },
      'AT&T Protect Advantage for 4': { commission: 50 },
      'AT&T Turbo': { commission: 7 },
    }
  },
  Internet: {
    plans: {
      'AT&T Fiber 1000': { baseCommission: 200.00 },
      'AT&T Fiber 500': { baseCommission: 150.00 },
      'AT&T Fiber 300': { baseCommission: 100.00 },
      'AT&T Fiber 100': { baseCommission: 100.00 },
      'AT&T Fiber <100': { baseCommission: 75.00 },
    }
  },
  DirecTV: {
    plans: {
      'DirecTV Stream Premium': { baseCommission: 50.00 },
      'DirecTV Stream Basic': { baseCommission: 40.00 },
      'DirecTV Satellite Premium': { baseCommission: 50.00 },
      'DirecTV Satellite Basic': { baseCommission: 40.00 },
    }
  }
};

function App() {
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
  const [lastDeletedSale, setLastDeletedSale] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSales = localStorage.getItem('salesTrackerSales');
    const savedSettings = localStorage.getItem('salesTrackerSettings');
    const savedGoals = localStorage.getItem('salesTrackerGoals');
    const savedPin = localStorage.getItem('salesTrackerPin');

    if (savedSales) setSales(JSON.parse(savedSales));
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setUserSettings(settings);
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    }
    if (savedGoals) setCurrentGoals(JSON.parse(savedGoals));
    if (savedPin) setPinLock(JSON.parse(savedPin));

    // Check if first time user
    if (!savedSettings || !JSON.parse(savedSettings).initialSetupComplete) {
      setShowOOBE(true);
    } else {
      setShowSplash(false);
    }

    // Check PIN lock
    if (savedPin && JSON.parse(savedPin).enabled) {
      setShowPinModal(true);
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('salesTrackerSales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('salesTrackerSettings', JSON.stringify(userSettings));
  }, [userSettings]);

  useEffect(() => {
    localStorage.setItem('salesTrackerGoals', JSON.stringify(currentGoals));
  }, [currentGoals]);

  useEffect(() => {
    localStorage.setItem('salesTrackerPin', JSON.stringify(pinLock));
  }, [pinLock]);

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

  // Calculate dashboard metrics
  const dashboardMetrics = React.useMemo(() => {
    const totalSales = sales.length;
    const totalCommission = sales.reduce((sum, sale) => sum + sale.totalCommission, 0);
    const avgCommission = totalSales > 0 ? totalCommission / totalSales : 0;
    
    return { totalSales, totalCommission, avgCommission };
  }, [sales]);

  // Calculate progress
  const progress = React.useMemo(() => {
    const weeklyProgress = { Mobile: 0, Internet: 0, TV: 0 };
    const monthlyProgress = { Mobile: 0, Internet: 0, TV: 0 };
    
    const startOfWeekDate = startOfWeek(new Date());
    const startOfMonthDate = startOfMonth(new Date());
    
    sales.forEach(sale => {
      const saleDate = new Date(sale.saleDate);
      sale.services.forEach(service => {
        const category = service.category === 'DirecTV' ? 'TV' : service.category;
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
    let processedSales = [...sales];
    
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
        sale.notes.toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [sales, filterProduct, searchQuery, sortSales]);

  // Event handlers
  const handleAddSale = (saleData) => {
    const newSale = {
      ...saleData,
      id: Date.now()
    };
    
    setSales(prev => [...prev, newSale]);
    setCurrentSaleServices([]);
    setShowSaleModal(false);
    toast.success('Sale logged successfully!');
  };

  const handleDeleteSale = (saleId) => {
    const saleToDelete = sales.find(s => s.id === saleId);
    if (saleToDelete) {
      setLastDeletedSale({ sale: saleToDelete, id: saleId });
      setSales(prev => prev.filter(s => s.id !== saleId));
      
      // Clear previous timeout
      if (undoTimeout) clearTimeout(undoTimeout);
      
      // Set new timeout
      const timeout = setTimeout(() => {
        setLastDeletedSale(null);
      }, 6000);
      setUndoTimeout(timeout);
      
      toast.success('Sale deleted');
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
    a.download = `att-commission-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
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
    toast.success('Welcome to AT&T Commission Tracker!');
  };

  // Render components
  if (showSplash) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-att-light-gray p-4">
        <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl text-center">
          <img src="https://i.ibb.co/1tYMnVRF/ATTLogo-Main.png" alt="AT&T Emblem" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-att-gray dark:text-slate-200 mb-2">AT&T Commission Tracker</h1>
          <p className="text-xs text-slate-400 mt-6 text-center leading-relaxed">
            <strong>Disclaimer:</strong> This is an assistant tool for tracking purposes only. No information is transmitted over the internet. All data is stored locally in your browser and will be lost if the page is refreshed or closed. Any discrepancies in official commission calculations must be handled with HR or your direct supervisor.
          </p>
          <div className="pt-6">
            <button 
              onClick={() => setShowSplash(false)}
              className="w-full bg-att-blue text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:bg-blue-800 transition-colors duration-300"
            >
              I Agree
            </button>
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
    <div className="min-h-screen bg-att-light-gray text-slate-800 dark:bg-slate-900 dark:text-slate-200">
      <Toaster position="top-right" />
      
      {/* Header */}
      <Header 
        userSettings={userSettings}
        weather={weather}
        onOpenSaleModal={() => setShowSaleModal(true)}
        onOpenSearch={() => setShowSearchPopout(true)}
        onToggleSettings={() => setShowSettingsMenu(!showSettingsMenu)}
        onSetProfile={() => setShowProfileModal(true)}
        onToggleTheme={toggleTheme}
        onToggleTempUnit={toggleTempUnit}
        showSettingsMenu={showSettingsMenu}
      />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 md:p-6">
        {/* Mobile Dashboard */}
        <MobileDashboard 
          metrics={dashboardMetrics}
          onOpenSaleModal={() => setShowSaleModal(true)}
        />

        {/* Desktop Dashboard */}
        <DesktopDashboard metrics={dashboardMetrics} />

        {/* Goals Section */}
        <GoalsSection 
          goals={currentGoals}
          progress={progress}
          onEditGoals={() => setShowGoalsModal(true)}
        />

        {/* Sales Log */}
        <SalesLog 
          sales={filteredAndSortedSales}
          onAddSale={() => setShowSaleModal(true)}
          onDeleteSale={handleDeleteSale}
          filterProduct={filterProduct}
          sortSales={sortSales}
          onFilterChange={setFilterProduct}
          onSortChange={setSortSales}
        />
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