import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X, Plus, Lock, User, Target, Download, Upload, LogOut, Trash2, Moon, Sun, Check, Smartphone, FileText } from 'lucide-react';

// Sale Modal
export const SaleModal = ({ onClose, onSave, currentServices, setCurrentServices, productCatalog }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    saleDate: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [lines, setLines] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const addServiceToSale = () => {
    if (!selectedCategory || !selectedPlan) return;

    const categoryData = productCatalog[selectedCategory];
    const planData = categoryData.plans[selectedPlan];
    const service = { 
      category: selectedCategory, 
      planName: selectedPlan, 
      device: selectedDevice,
      planPrice: planData.price,
      planDescription: planData.description,
      devicePrice: selectedDevice ? categoryData.devices?.[selectedDevice]?.price : null,
      deviceDetails: selectedDevice ? categoryData.devices?.[selectedDevice] : null,
      addOns: [], 
      lines: null 
    };

    if (selectedCategory === 'Mobile') {
      service.addOns = selectedAddons;
      if (planData.hasLines) {
        service.lines = lines;
      }
    }

    setCurrentServices(prev => [...prev, service]);
    setSelectedPlan('');
    setSelectedDevice('');
    setSelectedAddons([]);
    setLines(1);
  };

  const removeService = (index) => {
    setCurrentServices(prev => prev.filter((_, i) => i !== index));
  };

  // This will be recalculated dynamically in App.js, but we can show a temporary total here
  const tempTotalCommission = currentServices.reduce((sum, s) => sum + (s.manualCommission || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentServices.length === 0) return;
    
    // We no longer save totalCommission, it will be calculated on the fly
    const saleData = {
      customerName: formData.customerName,
      saleDate: formData.saleDate,
      services: currentServices,
      notes: formData.notes
    };
    
    onSave(saleData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Quote</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sale Date</label>
              <input
                type="date"
                value={formData.saleDate}
                onChange={(e) => setFormData(prev => ({ ...prev, saleDate: e.target.value }))}
                className="form-input"
                required
              />
            </div>
          </div>

          <hr className="my-4 dark:border-slate-700" />

            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl">
              <h3 className="font-semibold text-xl mb-4">Add Service(s) 🚀</h3>
              
              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">1. Choose Service Category</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: 'Mobile', icon: '📱', color: 'from-blue-500 to-blue-600', desc: 'Phone plans & devices' },
                    { key: 'Internet', icon: '🌐', color: 'from-green-500 to-green-600', desc: 'Home internet service' },
                    { key: 'TV', icon: '📺', color: 'from-purple-500 to-purple-600', desc: 'Streaming TV services' }
                  ].map((category) => (
                    <button
                      key={category.key}
                      onClick={() => setSelectedCategory(category.key)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedCategory === category.key
                          ? `border-slate-400 bg-gradient-to-r ${category.color} text-white shadow-lg`
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <div className="font-semibold">{category.key}</div>
                      <div className={`text-sm ${selectedCategory === category.key ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
                        {category.desc}
                      </div>
                    </button>
                  ))}
                </div>
            </div>

              {/* Plan Selection */}
            {selectedCategory && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">2. Choose Plan</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                    {Object.entries(productCatalog[selectedCategory].plans).map(([planName, planData]) => (
                      <button
                        key={planName}
                        onClick={() => setSelectedPlan(planName)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          selectedPlan === planName
                            ? 'border-att-blue bg-att-blue text-white shadow-lg'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold">{planName}</div>
                          <div className={`font-bold text-lg ${selectedPlan === planName ? 'text-white' : 'text-emerald-600'}`}>
                            {planData.price}
                          </div>
                        </div>
                        <div className={`text-sm ${selectedPlan === planName ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
                          {planData.description}
                        </div>
                      </button>
                    ))}
                </div>
                </div>
              )}

              {/* Device Selection for Mobile */}
              {selectedCategory === 'Mobile' && selectedPlan && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">3. Choose Device (Optional)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                    <button
                      onClick={() => setSelectedDevice('')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        selectedDevice === ''
                          ? 'border-att-blue bg-att-blue text-white shadow-lg'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="text-2xl mb-2">📱</div>
                      <div className="font-semibold">Bring Your Own Device</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">No device cost</div>
                    </button>
                    {Object.entries(productCatalog.Mobile.devices || {}).map(([deviceName, deviceData]) => (
                      <button
                        key={deviceName}
                        onClick={() => setSelectedDevice(deviceName)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          selectedDevice === deviceName
                            ? 'border-att-blue bg-att-blue text-white shadow-lg'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold">{deviceName}</div>
                          <div className={`font-bold ${selectedDevice === deviceName ? 'text-white' : 'text-emerald-600'}`}>
                            {deviceData.price}
                          </div>
                        </div>
                        <div className={`text-sm ${selectedDevice === deviceName ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
                          {deviceData.storage} • {deviceData.color}
                        </div>
                        <div className={`text-xs ${selectedDevice === deviceName ? 'text-white/80' : 'text-slate-400'}`}>
                          ${deviceData.downPayment} down • ${deviceData.monthlyPayment}/mo
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lines Selection for Mobile */}
                {selectedCategory === 'Mobile' && selectedPlan && productCatalog.Mobile.plans[selectedPlan]?.hasLines && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">4. Number of Lines</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[1, 2, 3, 4, 5].map((lineCount) => (
                      <button
                        key={lineCount}
                        onClick={() => setLines(lineCount)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          lines === lineCount
                            ? 'border-att-blue bg-att-blue text-white shadow-lg'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="text-lg font-bold">{lineCount}</div>
                        <div className="text-xs">Line{lineCount > 1 ? 's' : ''}</div>
                      </button>
                    ))}
                  </div>
                  </div>
                )}

              {/* Add-ons Selection for Mobile */}
              {selectedCategory === 'Mobile' && selectedPlan && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">5. Add-ons (Optional)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    {Object.entries(productCatalog.Mobile.addOns || {}).map(([addonName, addonData]) => (
                      <label
                        key={addonName}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                          selectedAddons.includes(addonName)
                            ? 'border-att-blue bg-att-blue text-white shadow-lg'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedAddons.includes(addonName)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAddons(prev => [...prev, addonName]);
                              } else {
                                setSelectedAddons(prev => prev.filter(a => a !== addonName));
                              }
                            }}
                            className="h-4 w-4 text-att-blue rounded"
                          />
                          <div className="flex-1">
                            <div className="font-semibold">{addonName}</div>
                            <div className={`text-sm ${selectedAddons.includes(addonName) ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
                              {addonData.description}
                        </div>
                            <div className={`font-bold ${selectedAddons.includes(addonName) ? 'text-white' : 'text-emerald-600'}`}>
                              {addonData.price}
                            </div>
                          </div>
                        </div>
                      </label>
                      ))}
                    </div>
              </div>
            )}

            <button
              type="button"
              onClick={addServiceToSale}
              disabled={!selectedCategory || !selectedPlan}
                className="w-full flex items-center justify-center bg-gradient-to-r from-att-blue to-att-blue-light text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 hover:shadow-lg transition-all duration-200"
            >
                <Plus className="w-5 h-5 mr-2" />
                Add Service to Quote
            </button>
          </div>

          <hr className="my-4 dark:border-slate-700" />

          <div>
              <h3 className="font-semibold text-lg mb-2">Services in this Quote</h3>
            <div className="space-y-2">
              {currentServices.length === 0 ? (
                <p className="text-sm text-center py-4">No services added yet.</p>
              ) : (
                currentServices.map((service, index) => (
                    <div key={index} className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 dark:text-slate-100">
                            {service.planName} - {service.planPrice}
                        {service.lines ? ` (${service.lines} lines)` : ''}
                      </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {service.planDescription}
                          </p>
                          {service.device && (
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                              📱 {service.device} - {service.devicePrice}
                              {service.deviceDetails && (
                                <span className="text-xs text-slate-500 ml-2">
                                  ({service.deviceDetails.storage}, {service.deviceDetails.color})
                                </span>
                              )}
                            </p>
                          )}
                          <p className="text-sm text-slate-500 dark:text-slate-400">{service.category}</p>
                          {service.addOns && service.addOns.length > 0 && (
                            <p className="text-xs text-slate-400 mt-1">
                              Add-ons: {service.addOns.join(', ')}
                            </p>
                          )}
                    </div>
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg flex justify-between items-center">
              <span className="text-lg font-bold">Total Monthly:</span>
              <span className="text-2xl font-bold text-emerald-600">${tempTotalCommission.toFixed(2)}/mo</span>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows="3"
              className="form-input"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
                Save Quote
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Goals Modal
export const GoalsModal = ({ goals, onSave, onClose }) => {
  const [formData, setFormData] = useState(goals);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Set Performance Goals</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset>
            <legend className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Weekly Goals
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="block">
                Mobile Lines
                <input
                  type="number"
                  value={formData.weekly.mobile}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    weekly: { ...prev.weekly, mobile: parseInt(e.target.value) || 0 }
                  }))}
                  className="form-input mt-1"
                  min="0"
                />
              </label>
              <label className="block">
                Internet
                <input
                  type="number"
                  value={formData.weekly.internet}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    weekly: { ...prev.weekly, internet: parseInt(e.target.value) || 0 }
                  }))}
                  className="form-input mt-1"
                  min="0"
                />
              </label>
              <label className="block">
                TV
                <input
                  type="number"
                  value={formData.weekly.tv}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    weekly: { ...prev.weekly, tv: parseInt(e.target.value) || 0 }
                  }))}
                  className="form-input mt-1"
                  min="0"
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Monthly Goals
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="block">
                Mobile Lines
                <input
                  type="number"
                  value={formData.monthly.mobile}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    monthly: { ...prev.monthly, mobile: parseInt(e.target.value) || 0 }
                  }))}
                  className="form-input mt-1"
                  min="0"
                />
              </label>
              <label className="block">
                Internet
                <input
                  type="number"
                  value={formData.monthly.internet}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    monthly: { ...prev.monthly, internet: parseInt(e.target.value) || 0 }
                  }))}
                  className="form-input mt-1"
                  min="0"
                />
              </label>
              <label className="block">
                TV
                <input
                  type="number"
                  value={formData.monthly.tv}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    monthly: { ...prev.monthly, tv: parseInt(e.target.value) || 0 }
                  }))}
                  className="form-input mt-1"
                  min="0"
                />
              </label>
            </div>
          </fieldset>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Goals
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Profile Modal
export const ProfileModal = ({ name, onSave, onClose }) => {
  const [profileName, setProfileName] = useState(name);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(profileName);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            Set Profile Name
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-1">Your Name</label>
          <input
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="form-input"
            required
          />

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Name
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// PIN Modal
export const PinModal = ({ onUnlock, pinLock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === pinLock.pin) {
      onUnlock();
    } else {
      setError('Incorrect PIN');
      setPin('');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Lock className="w-6 h-6" />
            App Lock
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-1">Enter PIN</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError('');
            }}
            maxLength="6"
            className="form-input mb-4"
            placeholder={error || "Enter PIN"}
            required
            autoFocus
          />

          <div className="flex justify-end space-x-3">
            <button type="submit" className="btn btn-primary">
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Search Popout
export const SearchPopout = ({ query, onQueryChange, onClose }) => {
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search sales..."
          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow"
          aria-label="Search sales"
          autoFocus
        />
        <button
          onClick={onClose}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
          aria-label="Close search"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// OOBE Screen
export const OOBEScreen = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState({
    weekly: { mobile: 10, internet: 5, tv: 2 },
    monthly: { mobile: 40, internet: 20, tv: 8 }
  });

  const totalSteps = 6;

  const steps = [
    { number: 1, title: 'Select Plans', icon: '📋' },
    { number: 2, title: 'Choose Devices', icon: '📱' },
    { number: 3, title: 'Add Services', icon: '🔧' },
    { number: 4, title: 'Discounts & Fees', icon: '💰' },
    { number: 5, title: 'Customer Info', icon: '👤' },
    { number: 6, title: 'Quote Summary', icon: '📊' }
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    onComplete(goals);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-att-light-gray p-4">
      <div className="w-full max-w-lg mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2 text-center">{steps[step].title}</h2>
        {steps[step].content}

        <div className="mt-8">
          <button 
            onClick={() => onComplete(goals)}
            className="w-full bg-att-blue text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-800 transition-colors duration-300 text-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

// Settings Modal
export const SettingsModal = ({
  isOpen,
  onClose,
  onSetProfile,
  onToggleTheme,
  onToggleTempUnit,
  onSignOut,
  user,
  onShowGoals,
  onShowQuoteHistory,
  quotesWithPricing
}) => {
  const isDark = document.documentElement.classList.contains('dark');

  // Calculate sales analytics
  const totalQuotes = quotesWithPricing?.length || 0;
  const thisMonthQuotes = quotesWithPricing?.filter(quote => {
    const quoteDate = new Date(quote.saleDate);
    const now = new Date();
    return quoteDate.getMonth() === now.getMonth() && quoteDate.getFullYear() === now.getFullYear();
  }).length || 0;
  const avgQuoteValue = totalQuotes > 0 
    ? Math.round(quotesWithPricing?.reduce((sum, quote) => sum + quote.totalMonthly, 0) / totalQuotes)
    : 0;
  const totalMonthly = quotesWithPricing?.reduce((sum, quote) => sum + quote.totalMonthly, 0) || 0;

  return (
    <div className="modal-backdrop">
      <div className="modal-content max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Settings ⚙️</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* User Profile Section */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Profile</h3>
          <button
              onClick={onSetProfile}
              className="flex items-center gap-3 w-full p-4 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <div className="text-left">
                <div className="font-medium text-slate-800 dark:text-white">Set Profile Name</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Customize your display name</div>
              </div>
          </button>
          </div>

          {/* Goals Management Section */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Goals Management</h3>
            <button
              onClick={onShowGoals}
              className="flex items-center gap-3 w-full p-4 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              <Target className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <div className="text-left">
                <div className="font-medium text-slate-800 dark:text-white">Manage Goals</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Set and track your sales goals</div>
              </div>
            </button>
          </div>

          {/* Quote History Section */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Quote Management</h3>
            <button
              onClick={onShowQuoteHistory}
              className="flex items-center gap-3 w-full p-4 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <div className="text-left">
                <div className="font-medium text-slate-800 dark:text-white">Quote History</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">View and manage all your quotes</div>
              </div>
            </button>
          </div>

          {/* Sales Analytics Section */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Sales Analytics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <div className="text-sm text-slate-500 dark:text-slate-400">Total Quotes</div>
                <div className="text-2xl font-bold text-slate-800 dark:text-white">{totalQuotes}</div>
              </div>
              <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <div className="text-sm text-slate-500 dark:text-slate-400">This Month</div>
                <div className="text-2xl font-bold text-slate-800 dark:text-white">{thisMonthQuotes}</div>
              </div>
              <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <div className="text-sm text-slate-500 dark:text-slate-400">Avg Quote Value</div>
                <div className="text-2xl font-bold text-slate-800 dark:text-white">${avgQuoteValue}/mo</div>
              </div>
              <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <div className="text-sm text-slate-500 dark:text-slate-400">Total Monthly</div>
                <div className="text-2xl font-bold text-slate-800 dark:text-white">${totalMonthly}</div>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  {isDark ? <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" /> : <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
                  <div>
                    <div className="font-medium text-slate-800 dark:text-white">Dark Mode</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Toggle dark/light theme</div>
                  </div>
                </div>
                <button
                  onClick={onToggleTheme}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isDark ? 'bg-att-blue' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isDark ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Account Section */}
          {user && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Account</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Signed in as</div>
                  <div className="font-medium text-slate-800 dark:text-white">{user.email}</div>
                </div>
            <button
                  onClick={onSignOut}
                  className="flex items-center gap-3 w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  <div className="text-left">
                    <div className="font-medium text-red-600">Sign Out</div>
                    <div className="text-sm text-red-500">Sign out of your account</div>
                  </div>
            </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 

// Quote History Modal
export const QuoteHistoryModal = ({ 
  onClose, 
  quotes, 
  onDeleteSale, 
  searchQuery, 
  onSearchChange, 
  filterProduct, 
  onFilterChange, 
  sortSales, 
  onSortChange 
}) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Quote History 📋</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search quotes by customer name..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full form-input"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterProduct}
                onChange={(e) => onFilterChange(e.target.value)}
                className="form-input"
              >
                <option value="all">All Services</option>
                <option value="Mobile">Mobile</option>
                <option value="Internet">Internet</option>
                <option value="TV">TV</option>
              </select>
              <select
                value={sortSales}
                onChange={(e) => onSortChange(e.target.value)}
                className="form-input"
              >
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="total_desc">Highest Value</option>
                <option value="total_asc">Lowest Value</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quotes List */}
        <div className="flex-1 overflow-y-auto">
          {quotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                No quotes found
              </h3>
              <p className="text-slate-500 dark:text-slate-500">
                {searchQuery ? 'Try adjusting your search terms' : 'Create your first quote to get started!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <div key={quote.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                          {quote.customerName}
                        </h3>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm rounded-full">
                          {format(new Date(quote.saleDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Services</p>
                          <div className="space-y-1">
                            {quote.services.map((service, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="text-sm">
                                  {service.category === 'Mobile' ? '📱' : 
                                   service.category === 'Internet' ? '🌐' : '📺'}
                                </span>
                                <span className="text-sm text-slate-700 dark:text-slate-300">
                                  {service.planName}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Pricing</p>
                          <div className="space-y-1">
                            <p className="text-lg font-bold text-emerald-600">
                              ${quote.totalMonthly.toFixed(2)}/mo
                            </p>
                            {quote.totalOneTime > 0 && (
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                +${quote.totalOneTime.toFixed(2)} one-time
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {quote.notes && (
                        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            <span className="font-medium">Notes:</span> {quote.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => onDeleteSale(quote.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete quote"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 

// Multi-Step Quote Modal
export const MultiStepQuoteModal = ({ onClose, onSave, productCatalog }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    saleDate: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [selectedFees, setSelectedFees] = useState([]);

  const totalSteps = 6;

  const steps = [
    { number: 1, title: 'Select Plans', icon: '📋' },
    { number: 2, title: 'Choose Devices', icon: '📱' },
    { number: 3, title: 'Add Services', icon: '🔧' },
    { number: 4, title: 'Discounts & Fees', icon: '💰' },
    { number: 5, title: 'Customer Info', icon: '👤' },
    { number: 6, title: 'Quote Summary', icon: '📊' }
  ];

  // Add debugging
  console.log('MultiStepQuoteModal: Current step:', currentStep);
  console.log('MultiStepQuoteModal: Form data:', formData);
  console.log('MultiStepQuoteModal: Selected services:', selectedServices);

  const calculateTotals = () => {
    let totalMonthly = 0;
    let totalOneTime = 0;

    // Calculate services
    selectedServices.forEach(service => {
      // Find the plan/add-on in the catalog with proper null checks
      const plan = (productCatalog.Mobile?.plans?.[service.name]) || 
                   (productCatalog.Internet?.plans?.[service.name]) || 
                   (productCatalog.TV?.plans?.[service.name]);
      
      const addOn = (productCatalog.Mobile?.addOns?.[service.name]) || 
                    (productCatalog.Internet?.addOns?.[service.name]) || 
                    (productCatalog.TV?.addOns?.[service.name]);

      if (plan) {
        totalMonthly += parseFloat(plan.price) * service.lines;
      } else if (addOn) {
        totalMonthly += parseFloat(addOn.price) * service.lines;
      }

      // Add device monthly payments (but not down payments)
      if (service.device && service.device !== 'show-devices' && service.device !== '') {
        const device = productCatalog.Mobile?.devices?.[service.device];
        if (device) {
          totalMonthly += parseFloat(device.monthlyPayment.replace('$', '').replace('/mo', ''));
          // Note: Down payment is now handled as a fee, not automatically added
        }
      }
    });

    // Apply discounts (subtract from monthly)
    const totalDiscounts = selectedDiscounts.reduce((sum, discount) => sum + Math.abs(discount.amount), 0);
    totalMonthly -= totalDiscounts;

    // Add fees (one-time costs)
    const totalFees = selectedFees.reduce((sum, fee) => sum + fee.amount, 0);
    totalOneTime += totalFees;

    return {
      totalMonthly: Math.max(0, totalMonthly), // Ensure monthly total doesn't go negative
      totalOneTime,
      totalFirstMonth: Math.max(0, totalMonthly) + totalOneTime
    };
  };

  const renderStepContent = () => {
    console.log('MultiStepQuoteModal: Rendering step content for step:', currentStep);
    
    try {
      switch (currentStep) {
        case 1:
          return <PlanSelectionStep selectedServices={selectedServices} setSelectedServices={setSelectedServices} productCatalog={productCatalog} />;
        case 2:
          return <DeviceSelectionStep selectedServices={selectedServices} setSelectedServices={setSelectedServices} productCatalog={productCatalog} />;
        case 3:
          return <ServicesStep selectedServices={selectedServices} setSelectedServices={setSelectedServices} productCatalog={productCatalog} />;
        case 4:
          return <DiscountsFeesStep selectedDiscounts={selectedDiscounts} setSelectedDiscounts={setSelectedDiscounts} selectedFees={selectedFees} setSelectedFees={setSelectedFees} />;
        case 5:
          return <CustomerInfoStep formData={formData} setFormData={setFormData} />;
        case 6:
          return <QuoteSummaryStep formData={formData} selectedServices={selectedServices} selectedDiscounts={selectedDiscounts} selectedFees={selectedFees} totals={calculateTotals()} productCatalog={productCatalog} />;
        default:
          console.error('MultiStepQuoteModal: Invalid step:', currentStep);
          return <div className="text-center p-8">Invalid step: {currentStep}</div>;
      }
    } catch (error) {
      console.error('MultiStepQuoteModal: Error rendering step content:', error);
      return <div className="text-center p-8 text-red-600">Error rendering step content: {error.message}</div>;
    }
  };

  const handleNext = () => {
    console.log('MultiStepQuoteModal: Next button clicked, current step:', currentStep);
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    console.log('MultiStepQuoteModal: Previous button clicked, current step:', currentStep);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    console.log('MultiStepQuoteModal: Save button clicked');
    try {
      const quoteData = {
        ...formData,
        services: selectedServices,
        discounts: selectedDiscounts,
        fees: selectedFees,
        totals: calculateTotals(),
        createdAt: new Date().toISOString()
      };
      console.log('MultiStepQuoteModal: Saving quote data:', quoteData);
      onSave(quoteData);
    } catch (error) {
      console.error('MultiStepQuoteModal: Error in handleSave:', error);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content max-w-6xl max-h-[90vh] overflow-hidden mx-4 sm:mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">Create Quote 📋</h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">Step {currentStep} of {totalSteps}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Progress Steps - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 ${
                  currentStep >= step.number
                    ? 'bg-att-blue border-att-blue text-white'
                    : 'border-slate-300 dark:border-slate-600 text-slate-400'
                }`}>
                  <span className="text-sm sm:text-lg">{step.icon}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 transition-all duration-200 ${
                    currentStep > step.number ? 'bg-att-blue' : 'bg-slate-300 dark:bg-slate-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <span key={step.number} className={`text-xs font-medium ${
                currentStep >= step.number ? 'text-att-blue' : 'text-slate-400'
              }`}>
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto mb-4 sm:mb-6 px-2 sm:px-0">
          {renderStepContent()}
        </div>

        {/* Navigation - Mobile Optimized */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 sm:px-6 py-2 sm:py-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            ← Previous
          </button>
          
          <div className="flex gap-2 sm:gap-3">
            {currentStep === totalSteps ? (
              <button
                onClick={handleSave}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-att-blue to-att-blue-light text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
              >
                Save Quote
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-att-blue to-att-blue-light text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Step Components
const CustomerInfoStep = ({ formData, setFormData }) => {
  console.log('CustomerInfoStep: Rendering with formData:', formData);
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-2">Customer Information</h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Enter customer details to complete your quote
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Customer Name *
          </label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            placeholder="Enter customer's full name"
            className="w-full form-input"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              placeholder="customer@example.com"
              className="w-full form-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              placeholder="(555) 123-4567"
              className="w-full form-input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Quote Date
          </label>
          <input
            type="date"
            value={formData.saleDate}
            onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
            className="w-full form-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any special requirements, promotions, or notes..."
            rows={3}
            className="w-full form-input"
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#F8E6F0] to-[#FFF0F5] dark:from-slate-700 dark:to-slate-800 p-4 rounded-lg">
        <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Ready for Quote Summary</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          All quote details have been configured. Click "Next" to review the complete quote summary.
        </p>
      </div>
    </div>
  );
};

const PlanSelectionStep = ({ selectedServices, setSelectedServices, productCatalog }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [lines, setLines] = useState(1);
  const [mobileLines, setMobileLines] = useState([]);

  const addService = () => {
    if (!selectedCategory || !selectedPlan) return;

    const categoryData = productCatalog[selectedCategory];
    const planData = categoryData.plans[selectedPlan];
    
    if (selectedCategory === 'Mobile' && planData.hasLines) {
      // For mobile plans with lines, create individual line entries
      const newLines = [];
      for (let i = 0; i < lines; i++) {
        newLines.push({
          id: Date.now() + i,
          category: selectedCategory,
          planName: selectedPlan,
          planPrice: planData.price,
          planDescription: planData.description,
          device: '',
          deviceDetails: null,
          addOns: [],
          lineNumber: i + 1,
          isIndividualLine: true
        });
      }
      setMobileLines(prev => [...prev, ...newLines]);
    } else {
      // For non-mobile or single-line services
      const service = {
        category: selectedCategory,
        planName: selectedPlan,
        planPrice: planData.price,
        planDescription: planData.description,
        device: '',
        deviceDetails: null,
        addOns: [],
        lines: null,
        isIndividualLine: false
      };
      setSelectedServices(prev => [...prev, service]);
    }
    
    setSelectedPlan('');
    setLines(1);
  };

  const removeService = (index) => {
    setSelectedServices(prev => prev.filter((_, i) => i !== index));
  };

  const removeMobileLine = (lineId) => {
    setMobileLines(prev => prev.filter(line => line.id !== lineId));
  };

  const updateMobileLine = (lineId, updates) => {
    setMobileLines(prev => prev.map(line => 
      line.id === lineId ? { ...line, ...updates } : line
    ));
  };

  const addMobileLinesToServices = () => {
    if (mobileLines.length > 0) {
      setSelectedServices(prev => [...prev, ...mobileLines]);
      setMobileLines([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📱</div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-2">Select Plans</h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Choose the services your customer needs</p>
      </div>

      {/* Service Category Selection */}
      <div className="space-y-4">
        <h4 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">Service Category</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {Object.keys(productCatalog).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 text-center ${
                selectedCategory === category
                  ? 'border-att-blue bg-att-blue text-white shadow-lg'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="text-2xl sm:text-3xl mb-2">
                {category === 'Mobile' ? '📱' : category === 'Internet' ? '🌐' : '📺'}
              </div>
              <div className="font-semibold text-sm sm:text-base">{category}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Plan Selection */}
      {selectedCategory && (
        <div className="space-y-4">
          <h4 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">
            {selectedCategory} Plans
          </h4>
          
          {/* Lines Selection for Mobile */}
          {selectedCategory === 'Mobile' && (
            <div className="mb-4">
              <label className="block text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 mb-2">
                Number of Lines
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    onClick={() => setLines(num)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                      lines === num
                        ? 'bg-att-blue text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Plan Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {Object.entries(productCatalog[selectedCategory].plans).map(([planName, planData]) => (
              <button
                key={planName}
                onClick={() => setSelectedPlan(planName)}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedPlan === planName
                    ? 'border-att-blue bg-att-blue text-white shadow-lg'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="font-semibold text-sm sm:text-base mb-2">{planName}</div>
                <div className={`text-lg sm:text-xl font-bold mb-2 ${
                  selectedPlan === planName ? 'text-white' : 'text-emerald-600'
                }`}>
                  {planData.price}
                </div>
                <div className={`text-xs sm:text-sm ${
                  selectedPlan === planName ? 'text-white/80' : 'text-slate-500'
                }`}>
                  {planData.description}
                </div>
              </button>
            ))}
          </div>

          {/* Add Service Button */}
          {selectedPlan && (
            <div className="flex justify-center">
              <button
                onClick={addService}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-att-blue to-att-blue-light text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
              >
                Add {selectedCategory} Plan
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mobile Lines Management */}
      {mobileLines.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">Mobile Lines Setup</h4>
            <button
              onClick={addMobileLinesToServices}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              Add All Lines to Quote
            </button>
          </div>
          
          <div className="space-y-3">
            {mobileLines.map((line) => (
              <div key={line.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-slate-800 dark:text-white">Line {line.lineNumber}</h5>
                  <button
                    onClick={() => removeMobileLine(line.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Plan
                    </label>
                    <select
                      value={line.planName}
                      onChange={(e) => updateMobileLine(line.id, { planName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-att-blue focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    >
                      {Object.entries(productCatalog.Mobile.plans).map(([planName, planData]) => (
                        <option key={planName} value={planName}>
                          {planName} - {planData.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Device
                    </label>
                    <select
                      value={line.device}
                      onChange={(e) => {
                        const deviceName = e.target.value;
                        updateMobileLine(line.id, { 
                          device: deviceName,
                          deviceDetails: deviceName ? productCatalog.Mobile.devices[deviceName] : null
                        });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-att-blue focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    >
                      <option value="">BYOD</option>
                      {Object.entries(productCatalog.Mobile.devices).map(([deviceName, deviceData]) => (
                        <option key={deviceName} value={deviceName}>
                          {deviceName} - {deviceData.price}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {line.device && line.deviceDetails && (
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img 
                        src={line.deviceDetails.image} 
                        alt={line.device}
                        className="w-12 h-12 object-contain"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{line.device}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {line.deviceDetails.storage} • {line.deviceDetails.color}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          ${line.deviceDetails.downPayment} down • ${line.deviceDetails.monthlyPayment}/mo
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Services */}
      {selectedServices.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">Selected Services</h4>
          <div className="space-y-3">
            {selectedServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex-1">
                  <div className="font-semibold text-sm sm:text-base">
                    {service.isIndividualLine ? `Line ${service.lineNumber}: ${service.planName}` : service.planName}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {service.planDescription}
                  </div>
                  {service.device && (
                    <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Device: {service.device}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-emerald-600 text-sm sm:text-base">{service.planPrice}</div>
                  </div>
                  <button
                    onClick={() => removeService(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DeviceSelectionStep = ({ selectedServices, setSelectedServices, productCatalog }) => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDeviceForSpecs, setSelectedDeviceForSpecs] = useState(null);

  const brands = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Motorola', 'TCL', 'REVVL'];
  const categories = ['Premium', 'Standard', 'Budget'];

  const updateServiceDevice = (serviceIndex, deviceName) => {
    const updatedServices = [...selectedServices];
    if (deviceName === '') {
      updatedServices[serviceIndex].device = '';
      updatedServices[serviceIndex].deviceDetails = null;
    } else {
      updatedServices[serviceIndex].device = deviceName;
      updatedServices[serviceIndex].deviceDetails = productCatalog.Mobile.devices[deviceName];
    }
    setSelectedServices(updatedServices);
  };

  const filteredDevices = Object.entries(productCatalog.Mobile.devices).filter(([name, device]) => {
    if (selectedBrand && device.brand !== selectedBrand) return false;
    if (selectedCategory && device.category !== selectedCategory) return false;
    return true;
  });

  const mobileServices = selectedServices.filter(s => s.category === 'Mobile' && s.isIndividualLine);
  const nonMobileServices = selectedServices.filter(s => s.category !== 'Mobile' || !s.isIndividualLine);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📱</div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-2">Device Management</h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Configure devices for each mobile line</p>
      </div>

      {/* Mobile Lines Device Configuration */}
      {mobileServices.length > 0 && (
        <div className="space-y-6">
          <h4 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">Mobile Lines</h4>
          
          {mobileServices.map((service, serviceIndex) => (
            <div key={serviceIndex} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 sm:p-6">
              <div className="mb-4">
                <h5 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">
                  Line {service.lineNumber}: {service.planName}
                </h5>
                <p className="text-sm text-slate-500 dark:text-slate-400">{service.planDescription}</p>
              </div>

              {/* Device Selection */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <label className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">Device:</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateServiceDevice(serviceIndex, '')}
                      className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                        !service.device
                          ? 'bg-att-blue text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      BYOD
                    </button>
                    <button
                      onClick={() => updateServiceDevice(serviceIndex, 'show-devices')}
                      className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                        service.device && service.device !== ''
                          ? 'bg-att-blue text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      New Device
                    </button>
                  </div>
                </div>

                {/* Device Grid - Show when user wants a new device */}
                {(service.device && service.device !== '') && (
                  <div className="space-y-4">
                    {/* Filters - Mobile Optimized */}
                    <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
                      <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="w-full sm:max-w-xs px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-att-blue focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base"
                      >
                        <option value="">All Brands</option>
                        {brands.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full sm:max-w-xs px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-att-blue focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base"
                      >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400">
                      Available Devices ({filteredDevices.length})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-64 overflow-y-auto">
                      {filteredDevices.map(([deviceName, deviceData]) => (
                        <button
                          key={deviceName}
                          onClick={() => updateServiceDevice(serviceIndex, deviceName)}
                          className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            service.device === deviceName
                              ? 'border-att-blue bg-att-blue text-white shadow-lg'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 sm:gap-3 mb-2">
                            <DeviceImage 
                              src={deviceData.image} 
                              alt={deviceName}
                              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm sm:text-base truncate">{deviceName}</div>
                              <div className={`text-xs ${service.device === deviceName ? 'text-white/80' : 'text-slate-500'}`}>
                                {deviceData.brand} • {deviceData.category}
                              </div>
                            </div>
                          </div>
                          <div className={`text-xs sm:text-sm ${service.device === deviceName ? 'text-white/90' : 'text-slate-600'}`}>
                            {deviceData.storage} • {deviceData.color}
                          </div>
                          <div className={`font-bold text-sm sm:text-base ${service.device === deviceName ? 'text-white' : 'text-emerald-600'}`}>
                            {deviceData.price}
                          </div>
                          <div className={`text-xs ${service.device === deviceName ? 'text-white/80' : 'text-slate-400'}`}>
                            ${deviceData.downPayment} down • ${deviceData.monthlyPayment}/mo
                          </div>
                          
                          {/* View Specs Button */}
                          <div className="mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDeviceForSpecs({ name: deviceName, ...deviceData });
                              }}
                              className={`w-full py-1 px-2 rounded text-xs font-medium transition-colors ${
                                service.device === deviceName
                                  ? 'bg-white/20 text-white hover:bg-white/30'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                              }`}
                            >
                              View Specs
                            </button>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {/* Selected Device Summary */}
                    {service.device && service.device !== 'show-devices' && service.deviceDetails && (
                      <div className="mt-4 p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center gap-3">
                          <DeviceImage 
                            src={service.deviceDetails.image} 
                            alt={service.device}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-emerald-800 dark:text-emerald-200 text-sm sm:text-base truncate">{service.device}</div>
                            <div className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-300">
                              {service.deviceDetails.storage} • {service.deviceDetails.color}
                            </div>
                            <div className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-300">
                              ${service.deviceDetails.downPayment} down • ${service.deviceDetails.monthlyPayment}/mo
                            </div>
                          </div>
                          <button
                            onClick={() => updateServiceDevice(serviceIndex, '')}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* BYOD Message */}
                {!service.device && (
                  <div className="mt-4 p-3 sm:p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl sm:text-3xl">📱</div>
                      <div>
                        <div className="font-medium text-slate-800 dark:text-white text-sm sm:text-base">Bring Your Own Device</div>
                        <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">No device cost - use your existing phone</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Non-Mobile Services */}
      {nonMobileServices.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">Other Services</h4>
          {nonMobileServices.map((service, serviceIndex) => (
            <div key={serviceIndex} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 sm:p-6">
              <div className="mb-4">
                <h5 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">{service.planName}</h5>
                <p className="text-sm text-slate-500 dark:text-slate-400">{service.planDescription}</p>
                <p className="text-sm text-slate-400 dark:text-slate-500">No device selection needed for this service</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Mobile Services Message */}
      {mobileServices.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📱</div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
            No Mobile Lines to Configure
          </h3>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-500">
            Go back to step 2 to add mobile plans that require device selection
          </p>
        </div>
      )}

      {/* Device Specs Modal */}
      {selectedDeviceForSpecs && (
        <DeviceSpecsModal
          device={selectedDeviceForSpecs}
          onClose={() => setSelectedDeviceForSpecs(null)}
        />
      )}
    </div>
  );
};

const ServicesStep = ({ selectedServices, setSelectedServices, productCatalog }) => {
  const updateServiceAddOns = (serviceIndex, addonName, checked) => {
    const updatedServices = [...selectedServices];
    if (checked) {
      updatedServices[serviceIndex].addOns = [...updatedServices[serviceIndex].addOns, addonName];
    } else {
      updatedServices[serviceIndex].addOns = updatedServices[serviceIndex].addOns.filter(addon => addon !== addonName);
    }
    setSelectedServices(updatedServices);
  };

  const mobileServices = selectedServices.filter(s => s.category === 'Mobile' && s.isIndividualLine);
  const nonMobileServices = selectedServices.filter(s => s.category !== 'Mobile' || !s.isIndividualLine);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔧</div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-2">Add Services</h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Select add-ons for your mobile lines</p>
      </div>

      {/* Mobile Lines Add-ons */}
      {mobileServices.length > 0 && (
        <div className="space-y-6">
          <h4 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">Mobile Lines Add-ons</h4>
          
          {mobileServices.map((service, serviceIndex) => (
            <div key={serviceIndex} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 sm:p-6">
              <div className="mb-4">
                <h5 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">
                  Line {service.lineNumber}: {service.planName}
                </h5>
                <p className="text-sm text-slate-500 dark:text-slate-400">{service.planDescription}</p>
                {service.device && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Device: {service.device}
                  </p>
                )}
              </div>

              {/* Add-ons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Object.entries(productCatalog.Mobile.addOns).map(([addonName, addonData]) => (
                  <label
                    key={addonName}
                    className={`relative flex items-start p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      service.addOns.includes(addonName)
                        ? 'border-att-blue bg-att-blue text-white shadow-lg'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={service.addOns.includes(addonName)}
                      onChange={(e) => updateServiceAddOns(serviceIndex, addonName, e.target.checked)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm sm:text-base mb-1">{addonName}</div>
                      <div className={`text-xs sm:text-sm mb-2 ${
                        service.addOns.includes(addonName) ? 'text-white/80' : 'text-slate-500'
                      }`}>
                        {addonData.description}
                      </div>
                      <div className={`font-bold text-sm sm:text-base ${
                        service.addOns.includes(addonName) ? 'text-white' : 'text-emerald-600'
                      }`}>
                        {addonData.price}
                      </div>
                    </div>
                    <div className={`ml-3 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                      service.addOns.includes(addonName)
                        ? 'border-white bg-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {service.addOns.includes(addonName) && (
                        <Check className="w-3 h-3 text-att-blue" />
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {/* Selected Add-ons Summary */}
              {service.addOns.length > 0 && (
                <div className="mt-4 p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <div className="text-sm sm:text-base font-medium text-emerald-800 dark:text-emerald-200 mb-2">
                    Selected Add-ons:
                  </div>
                  <div className="space-y-1">
                    {service.addOns.map(addonName => {
                      const addonData = productCatalog.Mobile.addOns[addonName];
                      return (
                        <div key={addonName} className="flex justify-between text-sm">
                          <span className="text-emerald-700 dark:text-emerald-300">{addonName}</span>
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">{addonData?.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Non-Mobile Services */}
      {nonMobileServices.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">Other Services</h4>
          {nonMobileServices.map((service, serviceIndex) => (
            <div key={serviceIndex} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 sm:p-6">
              <div className="mb-4">
                <h5 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">{service.planName}</h5>
                <p className="text-sm text-slate-500 dark:text-slate-400">{service.planDescription}</p>
                <p className="text-sm text-slate-400 dark:text-slate-500">No add-ons available for this service</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Mobile Services Message */}
      {mobileServices.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔧</div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
            No Mobile Lines to Configure
          </h3>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-500">
            Go back to step 2 to add mobile plans that can have add-ons
          </p>
        </div>
      )}
    </div>
  );
};

const DiscountsFeesStep = ({ selectedDiscounts, setSelectedDiscounts, selectedFees, setSelectedFees }) => {
  const addDiscount = () => {
    setSelectedDiscounts([...selectedDiscounts, { name: '', amount: 0 }]);
  };

  const addFee = () => {
    setSelectedFees([...selectedFees, { name: '', amount: 0 }]);
  };

  const updateDiscount = (index, field, value) => {
    const updated = [...selectedDiscounts];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedDiscounts(updated);
  };

  const updateFee = (index, field, value) => {
    const updated = [...selectedFees];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedFees(updated);
  };

  const removeDiscount = (index) => {
    setSelectedDiscounts(selectedDiscounts.filter((_, i) => i !== index));
  };

  const removeFee = (index) => {
    setSelectedFees(selectedFees.filter((_, i) => i !== index));
  };

  // Standard discount options
  const discountOptions = [
    { value: 'military', label: 'Military Discount', amount: -10 },
    { value: 'autopay', label: 'AutoPay Discount', amount: -5 },
    { value: 'paperless', label: 'Paperless Billing', amount: -2 },
    { value: 'senior', label: 'Senior Discount', amount: -8 },
    { value: 'student', label: 'Student Discount', amount: -10 },
    { value: 'firstresponder', label: 'First Responder', amount: -10 },
    { value: 'teacher', label: 'Teacher Discount', amount: -10 },
    { value: 'nurse', label: 'Nurse Discount', amount: -10 },
    { value: 'custom', label: 'Custom Discount', amount: 0 }
  ];

  // Standard fee options
  const feeOptions = [
    { value: 'activation', label: 'Activation Fee', amount: 35 },
    { value: 'downpayment', label: 'Down Payment Required', amount: 0 },
    { value: 'simcard', label: 'SIM Card Fee', amount: 10 },
    { value: 'shipping', label: 'Shipping & Handling', amount: 15 },
    { value: 'custom', label: 'Custom Fee', amount: 0 }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-2">Discounts & Fees</h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Add any applicable discounts and fees to your quote
        </p>
      </div>

      {/* Discounts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-white">Discounts</h4>
          <button
            onClick={addDiscount}
            className="flex items-center gap-2 px-3 py-2 bg-[#E20074] text-white text-sm rounded-lg hover:bg-[#B8005C] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Discount
          </button>
        </div>

        {selectedDiscounts.map((discount, index) => (
          <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div className="flex-1">
              <select
                value={discount.name}
                onChange={(e) => {
                  const selected = discountOptions.find(opt => opt.value === e.target.value);
                  updateDiscount(index, 'name', e.target.value);
                  updateDiscount(index, 'amount', selected ? selected.amount : 0);
                }}
                className="w-full form-input mb-2"
              >
                <option value="">Select Discount Type</option>
                {discountOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              {discount.name === 'custom' && (
                <input
                  type="text"
                  placeholder="Custom discount name"
                  value={discount.customName || ''}
                  onChange={(e) => updateDiscount(index, 'customName', e.target.value)}
                  className="w-full form-input mb-2"
                />
              )}
              
              <input
                type="number"
                placeholder="Discount amount ($)"
                value={discount.amount}
                onChange={(e) => updateDiscount(index, 'amount', parseFloat(e.target.value) || 0)}
                className="w-full form-input"
              />
            </div>
            <button
              onClick={() => removeDiscount(index)}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Fees Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-white">Fees</h4>
          <button
            onClick={addFee}
            className="flex items-center gap-2 px-3 py-2 bg-[#E20074] text-white text-sm rounded-lg hover:bg-[#B8005C] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Fee
          </button>
        </div>

        {selectedFees.map((fee, index) => (
          <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div className="flex-1">
              <select
                value={fee.name}
                onChange={(e) => {
                  const selected = feeOptions.find(opt => opt.value === e.target.value);
                  updateFee(index, 'name', e.target.value);
                  updateFee(index, 'amount', selected ? selected.amount : 0);
                }}
                className="w-full form-input mb-2"
              >
                <option value="">Select Fee Type</option>
                {feeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              {fee.name === 'custom' && (
                <input
                  type="text"
                  placeholder="Custom fee name"
                  value={fee.customName || ''}
                  onChange={(e) => updateFee(index, 'customName', e.target.value)}
                  className="w-full form-input mb-2"
                />
              )}
              
              {fee.name === 'downpayment' && (
                <input
                  type="number"
                  placeholder="Down payment amount ($)"
                  value={fee.amount}
                  onChange={(e) => updateFee(index, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-full form-input"
                />
              )}
              
              {fee.name !== 'downpayment' && (
                <input
                  type="number"
                  placeholder="Fee amount ($)"
                  value={fee.amount}
                  onChange={(e) => updateFee(index, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-full form-input"
                />
              )}
            </div>
            <button
              onClick={() => removeFee(index)}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-[#F8E6F0] to-[#FFF0F5] dark:from-slate-700 dark:to-slate-800 p-4 rounded-lg">
        <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Summary</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Total Discounts:</span>
            <span className="text-green-600 font-semibold">
              -${selectedDiscounts.reduce((sum, d) => sum + Math.abs(d.amount), 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total Fees:</span>
            <span className="text-red-600 font-semibold">
              ${selectedFees.reduce((sum, f) => sum + f.amount, 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuoteSummaryStep = ({ formData, selectedServices, selectedDiscounts, selectedFees, totals, productCatalog }) => {
  const mobileServices = selectedServices.filter(s => s.category === 'Mobile' && s.isIndividualLine);
  const nonMobileServices = selectedServices.filter(s => s.category !== 'Mobile' || !s.isIndividualLine);

  // Standard discount options
  const discountOptions = [
    { value: 'military', label: 'Military Discount', amount: -10 },
    { value: 'autopay', label: 'AutoPay Discount', amount: -5 },
    { value: 'paperless', label: 'Paperless Billing', amount: -2 },
    { value: 'senior', label: 'Senior Discount', amount: -8 },
    { value: 'student', label: 'Student Discount', amount: -10 },
    { value: 'firstresponder', label: 'First Responder', amount: -10 },
    { value: 'teacher', label: 'Teacher Discount', amount: -10 },
    { value: 'nurse', label: 'Nurse Discount', amount: -10 },
    { value: 'custom', label: 'Custom Discount', amount: 0 }
  ];

  // Standard fee options
  const feeOptions = [
    { value: 'activation', label: 'Activation Fee', amount: 35 },
    { value: 'downpayment', label: 'Down Payment Required', amount: 0 },
    { value: 'simcard', label: 'SIM Card Fee', amount: 10 },
    { value: 'shipping', label: 'Shipping & Handling', amount: 15 },
    { value: 'custom', label: 'Custom Fee', amount: 0 }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📊</div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-2">Quote Summary</h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Review your quote before saving</p>
      </div>

      {/* Customer Info */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 sm:p-6">
        <h4 className="text-lg sm:text-xl font-semibold mb-4 text-slate-800 dark:text-white">Customer Information</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Name</div>
            <div className="font-medium text-slate-800 dark:text-white">{formData.customerName}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Email</div>
            <div className="font-medium text-slate-800 dark:text-white">{formData.customerEmail || 'Not provided'}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Phone</div>
            <div className="font-medium text-slate-800 dark:text-white">{formData.customerPhone || 'Not provided'}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Quote Date</div>
            <div className="font-medium text-slate-800 dark:text-white">{formData.saleDate}</div>
          </div>
        </div>
        {formData.notes && (
          <div className="mt-4">
            <div className="text-sm text-slate-500 dark:text-slate-400">Notes</div>
            <div className="font-medium text-slate-800 dark:text-white">{formData.notes}</div>
          </div>
        )}
      </div>

      {/* Mobile Lines */}
      {mobileServices.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">Mobile Lines</h4>
          {mobileServices.map((service, index) => (
            <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 sm:p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base">
                    Line {service.lineNumber}: {service.planName}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{service.planDescription}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600 text-sm sm:text-base">{service.planPrice}</div>
                </div>
              </div>
              
              {service.device && service.deviceDetails && (
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <DeviceImage 
                        src={service.deviceDetails.image} 
                        alt={service.device}
                        className="w-12 h-12 object-contain"
                      />
                      <div>
                        <div className="font-medium text-slate-800 dark:text-white text-sm">{service.device}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {service.deviceDetails.storage} • {service.deviceDetails.color}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-800 dark:text-white text-sm">{service.deviceDetails.price}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        ${service.deviceDetails.downPayment} down • ${service.deviceDetails.monthlyPayment}/mo
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {service.addOns && service.addOns.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Add-ons:</div>
                  <div className="space-y-1">
                    {service.addOns.map(addonName => {
                      const addonData = productCatalog?.Mobile?.addOns?.[addonName];
                      return (
                        <div key={addonName} className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">{addonName}</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{addonData?.price || 'N/A'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Other Services */}
      {nonMobileServices.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">Other Services</h4>
          {nonMobileServices.map((service, index) => (
            <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 sm:p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base">{service.planName}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{service.planDescription}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600 text-sm sm:text-base">{service.planPrice}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Discounts & Fees */}
      {(selectedDiscounts.length > 0 || selectedFees.length > 0) && (
        <div className="space-y-4">
          <h4 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">Discounts & Fees</h4>
          
          {selectedDiscounts.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-emerald-600">Discounts:</div>
              {selectedDiscounts.map((discount, index) => (
                <div key={index} className="flex justify-between p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded">
                  <span className="text-slate-700 dark:text-slate-300">{discount.name}</span>
                  <span className="font-medium text-emerald-600">-${discount.amount}</span>
                </div>
              ))}
            </div>
          )}

          {selectedFees.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-amber-600">Fees:</div>
              {selectedFees.map((fee, index) => (
                <div key={index} className="flex justify-between p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <span className="text-slate-700 dark:text-slate-300">{fee.name}</span>
                  <span className="font-medium text-amber-600">+${fee.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Discounts & Fees Summary */}
      {(selectedDiscounts.length > 0 || selectedFees.length > 0) && (
        <div className="bg-gradient-to-r from-[#F8E6F0] to-[#FFF0F5] dark:from-slate-700 dark:to-slate-800 p-4 rounded-lg">
          <h4 className="font-semibold text-slate-800 dark:text-white mb-3">Discounts & Fees</h4>
          
          {selectedDiscounts.length > 0 && (
            <div className="mb-3">
              <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Discounts:</h5>
              <div className="space-y-1">
                {selectedDiscounts.map((discount, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      {discount.name === 'custom' ? discount.customName : 
                       discountOptions.find(opt => opt.value === discount.name)?.label || discount.name}
                    </span>
                    <span className="text-green-600 font-semibold">-${Math.abs(discount.amount).toFixed(2)}/mo</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {selectedFees.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fees:</h5>
              <div className="space-y-1">
                {selectedFees.map((fee, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      {fee.name === 'custom' ? fee.customName : 
                       feeOptions.find(opt => opt.value === fee.name)?.label || fee.name}
                    </span>
                    <span className="text-red-600 font-semibold">+${fee.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Totals */}
      <div className="bg-gradient-to-r from-[#E20074] to-[#FF6B9D] text-white p-4 sm:p-6 rounded-lg">
        <h4 className="text-lg sm:text-xl font-semibold mb-4">Quote Totals</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-lg sm:text-xl">
            <span>Monthly Total:</span>
            <span className="font-bold">${totals.totalMonthly.toFixed(2)}/mo</span>
          </div>
          <div className="flex justify-between text-lg sm:text-xl">
            <span>One-Time Total:</span>
            <span className="font-bold">${totals.totalOneTime.toFixed(2)}</span>
          </div>
          <div className="border-t border-white/20 pt-3">
            <div className="flex justify-between text-lg sm:text-xl">
              <span>First Bill Total:</span>
              <span className="font-bold">${totals.totalFirstMonth.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm opacity-90">
              <span>Includes first month + one-time fees</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 

// Add image fallback component
const DeviceImage = ({ src, alt, className = "w-16 h-16 object-cover rounded-lg" }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    console.log('Device image failed to load:', src);
    setImageError(true);
  };
  
  if (imageError) {
    return (
      <div className={`${className} bg-slate-200 dark:bg-slate-700 flex items-center justify-center`}>
        <Smartphone className="w-8 h-8 text-slate-400" />
      </div>
    );
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

// Device Specifications Modal
export const DeviceSpecsModal = ({ device, onClose }) => {
  if (!device || !device.specs) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Device Specifications</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Device Header */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <DeviceImage 
              src={device.image} 
              alt={device.name}
              className="w-16 h-16 object-contain"
            />
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{device.name}</h3>
              <p className="text-slate-600 dark:text-slate-400">{device.brand} • {device.category}</p>
              <p className="text-emerald-600 font-semibold">{device.price}</p>
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Display</h4>
                <p className="text-slate-600 dark:text-slate-400">{device.specs.display}</p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Processor</h4>
                <p className="text-slate-600 dark:text-slate-400">{device.specs.processor}</p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Battery</h4>
                <p className="text-slate-600 dark:text-slate-400">{device.specs.battery}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Camera</h4>
                <p className="text-slate-600 dark:text-slate-400">{device.specs.camera}</p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Key Features</h4>
                <p className="text-slate-600 dark:text-slate-400">{device.specs.features}</p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Storage & Color</h4>
                <p className="text-slate-600 dark:text-slate-400">{device.storage} • {device.color}</p>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Pricing Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-slate-600 dark:text-slate-400">Full Price:</span>
                <p className="font-semibold text-slate-800 dark:text-white">{device.price}</p>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Down Payment:</span>
                <p className="font-semibold text-slate-800 dark:text-white">{device.downPayment}</p>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Monthly Payment:</span>
                <p className="font-semibold text-slate-800 dark:text-white">{device.monthlyPayment}/mo</p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-att-blue text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DeviceShowcaseModal = ({ onClose, productCatalog }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');

  const categories = ['all', 'Premium', 'Standard', 'Budget'];
  const brands = ['all', 'Apple', 'Samsung', 'Google', 'Motorola', 'OnePlus', 'TCL'];

  const filteredDevices = Object.entries(productCatalog.Mobile.devices).filter(([name, device]) => {
    const categoryMatch = selectedCategory === 'all' || device.category === selectedCategory;
    const brandMatch = selectedBrand === 'all' || device.brand === selectedBrand;
    return categoryMatch && brandMatch;
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content max-w-7xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Device & Plans Showcase</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-input"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="form-input"
            >
              {brands.map(brand => (
                <option key={brand} value={brand}>
                  {brand === 'all' ? 'All Brands' : brand}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Device Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {filteredDevices.map(([deviceName, device]) => (
            <div key={deviceName} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <DeviceImage
                  src={device.image}
                  alt={deviceName}
                  className="w-16 h-16 mx-auto mb-3 object-contain"
                />
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-1 truncate">{deviceName}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{device.brand} • {device.category}</p>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-emerald-600">{device.price}</p>
                  <p className="text-xs text-slate-500">Down: {device.downPayment}</p>
                  <p className="text-xs text-slate-500">{device.monthlyPayment}/mo</p>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => {
                      // This could open a detailed view or add to quote
                      console.log('View device:', deviceName);
                    }}
                    className="w-full py-1 px-3 bg-att-blue text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Plans Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Available Plans</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(productCatalog.Mobile.plans).map(([planName, plan]) => (
              <div key={planName} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-2">{planName}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{plan.description}</p>
                <p className="text-lg font-bold text-emerald-600">{plan.price}/mo</p>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-att-blue text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}; 