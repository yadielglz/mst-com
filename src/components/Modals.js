import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X, Plus, Lock, User, Target, Download, Upload, LogOut, Trash2, Moon, Sun } from 'lucide-react';

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

  const steps = [
    {
      title: 'Welcome!',
      content: (
        <div className="text-center">
          <img src="https://i.ibb.co/HLTSpVvP/T-Mobile-logo-2022-svg.png" alt="T-Mobile Emblem" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-att-gray dark:text-slate-200 mb-2">
            Welcome to T-Mobile Sales Quote Tool
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Create professional quotes for T-Mobile services, devices, and plans. Your data is private and never leaves your device.
          </p>
          <ul className="text-left text-sm text-slate-600 dark:text-slate-300 mb-6 list-disc list-inside">
            <li>✔️ Local, private storage</li>
            <li>✔️ Create detailed quotes with all T-Mobile services</li>
            <li>✔️ PIN lock for extra privacy</li>
            <li>✔️ Export/import your quotes anytime</li>
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

// Settings Modal
export const SettingsModal = ({
  isOpen,
  onClose,
  onSetProfile,
  onToggleTheme,
  onToggleTempUnit,
  onSignOut,
  user,
  onShowGoals
}) => {
  const isDark = document.documentElement.classList.contains('dark');

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