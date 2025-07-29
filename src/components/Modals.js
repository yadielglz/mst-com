import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X, Plus, Lock, User, Target, Download, Upload, LogOut } from 'lucide-react';

// Sale Modal
export const SaleModal = ({ onClose, onSave, currentServices, setCurrentServices, productCatalog }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    saleDate: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [lines, setLines] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [manualCommission, setManualCommission] = useState('');

  const addServiceToSale = () => {
    if (!selectedCategory || !selectedPlan) return;

    const categoryData = productCatalog[selectedCategory];
    const planData = categoryData.plans[selectedPlan];
    const service = { 
      category: selectedCategory, 
      planName: selectedPlan, 
      manualCommission: parseFloat(manualCommission) || 0,
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
    setSelectedAddons([]);
    setLines(1);
    setManualCommission('');
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Log New Sale</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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

          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Add Service(s)</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">1. Select Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-input"
              >
                <option value="">-- Select --</option>
                <option value="Mobile">Mobile</option>
                <option value="Internet">Internet</option>
                <option value="DirecTV">DirecTV</option>
              </select>
            </div>

            {selectedCategory && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">2. Configure Service</label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="form-input"
                  >
                    <option value="">-- Select Plan --</option>
                    {Object.keys(productCatalog[selectedCategory].plans).map(planName => (
                      <option key={planName} value={planName}>{planName}</option>
                    ))}
                  </select>
                </div>

                {selectedCategory === 'Mobile' && selectedPlan && productCatalog.Mobile.plans[selectedPlan]?.hasLines && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Number of Lines</label>
                    <input
                      type="number"
                      value={lines}
                      onChange={(e) => setLines(parseInt(e.target.value) || 1)}
                      className="form-input"
                      min="1"
                    />
                  </div>
                )}

                {selectedCategory === 'Mobile' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Add-ons</label>
                    <div className="space-y-2">
                      {Object.keys(productCatalog.Mobile.addOns).map(addonName => (
                        <div key={addonName} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`addon-${addonName}`}
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
                          <label htmlFor={`addon-${addonName}`} className="ml-2 text-sm">
                            {addonName}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Manual Commission ($)</label>
                  <input
                    type="number"
                    value={manualCommission}
                    onChange={(e) => setManualCommission(e.target.value)}
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={addServiceToSale}
              disabled={!selectedCategory || !selectedPlan}
              className="mt-4 w-full flex items-center justify-center bg-att-blue-light text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </button>
          </div>

          <hr className="my-4 dark:border-slate-700" />

          <div>
            <h3 className="font-semibold text-lg mb-2">Services in this Sale</h3>
            <div className="space-y-2">
              {currentServices.length === 0 ? (
                <p className="text-sm text-center py-4">No services added yet.</p>
              ) : (
                currentServices.map((service, index) => (
                  <div key={index} className="bg-slate-100 dark:bg-slate-700/50 p-2 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold">
                        {service.planName}
                        {service.lines ? ` (${service.lines} lines)` : ''}
                      </p>
                      <p className="text-sm text-slate-500">{service.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-emerald-500">${(service.manualCommission || 0).toFixed(2)}</span>
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
            <span className="text-lg font-bold">Total Commission:</span>
            <span className="text-2xl font-bold text-emerald-600">${tempTotalCommission.toFixed(2)}</span>
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
              Save Sale
            </button>
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

  const steps = [
    {
      title: 'Welcome!',
      content: (
        <div className="text-center">
          <img src="https://i.ibb.co/HLTSpVvP/T-Mobile-logo-2022-svg.png" alt="T-Mobile Emblem" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-att-gray dark:text-slate-200 mb-2">
            Welcome to T-Mobile Commission Tracker
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Track your sales, set goals, and stay motivated. Your data is private and never leaves your device.
          </p>
          <ul className="text-left text-sm text-slate-600 dark:text-slate-300 mb-6 list-disc list-inside">
            <li>✔️ Local, private storage</li>
            <li>✔️ Set and track weekly, monthly, quarterly, and yearly goals</li>
            <li>✔️ PIN lock for extra privacy</li>
            <li>✔️ Export/import your data anytime</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Set Your Initial Goals',
      content: (
        <form onSubmit={(e) => {
          e.preventDefault();
          onComplete(goals);
        }}>
          <p className="text-center text-slate-500 mb-6">You can change these later in the settings.</p>
          
          <fieldset className="border-t pt-4 dark:border-slate-700">
            <legend className="font-semibold text-lg mb-2 px-2">Weekly Goals</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="block">
                Mobile Lines
                <input
                  type="number"
                  value={goals.weekly.mobile}
                  onChange={(e) => setGoals(prev => ({
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
                  value={goals.weekly.internet}
                  onChange={(e) => setGoals(prev => ({
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
                  value={goals.weekly.tv}
                  onChange={(e) => setGoals(prev => ({
                    ...prev,
                    weekly: { ...prev.weekly, tv: parseInt(e.target.value) || 0 }
                  }))}
                  className="form-input mt-1"
                  min="0"
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="border-t pt-4 dark:border-slate-700">
            <legend className="font-semibold text-lg mb-2 px-2">Monthly Goals</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="block">
                Mobile Lines
                <input
                  type="number"
                  value={goals.monthly.mobile}
                  onChange={(e) => setGoals(prev => ({
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
                  value={goals.monthly.internet}
                  onChange={(e) => setGoals(prev => ({
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
                  value={goals.monthly.tv}
                  onChange={(e) => setGoals(prev => ({
                    ...prev,
                    monthly: { ...prev.monthly, tv: parseInt(e.target.value) || 0 }
                  }))}
                  className="form-input mt-1"
                  min="0"
                />
              </label>
            </div>
          </fieldset>

          <div className="flex justify-end pt-4">
            <button type="submit" className="btn btn-primary">
              Start Tracking
            </button>
          </div>
        </form>
      )
    }
  ];

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

// Settings Modal for Mobile
export const SettingsModal = ({
  isOpen,
  onClose,
  onSetProfile,
  onToggleTheme,
  onToggleTempUnit,
  onSignOut,
  user,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-end z-50 md:hidden" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-t-2xl p-4 w-full animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Settings</h2>
          <button onClick={onClose} className="p-2">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-2 text-lg">
          <button
            onClick={() => { onSetProfile(); onClose(); }}
            className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
          >
            <User className="w-5 h-5" />
            Set Profile Name
          </button>
          <div className="flex items-center justify-between p-3 rounded-lg">
            <span>Dark Mode</span>
            <button
              onClick={onToggleTheme}
              className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-slate-200 dark:bg-slate-700"
            >
              <span className="inline-block w-4 h-4 transform bg-white rounded-full transition-transform dark:translate-x-5" />
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg">
            <span>Temp Unit</span>
            <button
              onClick={onToggleTempUnit}
              className="px-3 py-1 text-sm rounded-md bg-slate-200 dark:bg-slate-700"
            >
              °C / °F
            </button>
          </div>
          {user && (
            <button
              onClick={() => { onSignOut(); onClose(); }}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-red-600 dark:text-red-400 flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 