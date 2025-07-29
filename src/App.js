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
  SettingsModal,
  QuoteHistoryModal,
  MultiStepQuoteModal,
  DeviceSpecsModal,
  DeviceShowcaseModal
} from './components/Modals';

// Product catalog data for T-Mobile Sales Quote Tool
const PRODUCT_CATALOG = {
  Mobile: {
    plans: {
      'T-Mobile Essentials': { hasLines: true, price: '$60/mo', description: 'Unlimited talk, text & data' },
      'T-Mobile Magenta': { hasLines: true, price: '$70/mo', description: 'Unlimited talk, text & data with Netflix' },
      'T-Mobile Magenta MAX': { hasLines: true, price: '$85/mo', description: 'Unlimited talk, text & data with Netflix & Apple TV+' },
      'T-Mobile Go5G': { hasLines: true, price: '$75/mo', description: 'Unlimited talk, text & data with Netflix' },
      'T-Mobile Go5G Plus': { hasLines: true, price: '$90/mo', description: 'Unlimited talk, text & data with Netflix & Apple TV+' },
      'T-Mobile Go5G Next': { hasLines: true, price: '$95/mo', description: 'Unlimited talk, text & data with Netflix & Apple TV+ & annual upgrade' },
      'T-Mobile Go5G Military': { hasLines: true, price: '$55/mo', description: 'Military discount - Unlimited talk, text & data' },
      'T-Mobile Go5G 55+': { hasLines: true, price: '$55/mo', description: '55+ discount - Unlimited talk, text & data' },
      'T-Mobile Go5G Plus Military': { hasLines: true, price: '$70/mo', description: 'Military discount - Unlimited talk, text & data with Netflix & Apple TV+' },
      'T-Mobile Go5G Plus 55+': { hasLines: true, price: '$70/mo', description: '55+ discount - Unlimited talk, text & data with Netflix & Apple TV+' },
      'BYOD w/ T-Mobile Essentials': { hasLines: false, price: '$60/mo', description: 'Bring your own device' },
      'BYOD w/ T-Mobile Magenta': { hasLines: false, price: '$70/mo', description: 'Bring your own device' },
      'BYOD w/ T-Mobile Magenta MAX': { hasLines: false, price: '$85/mo', description: 'Bring your own device' },
      'T-Mobile Prepaid': { hasLines: true, price: '$40/mo', description: 'Prepaid unlimited plan' },
      'T-Mobile Prepaid Unlimited': { hasLines: true, price: '$50/mo', description: 'Prepaid unlimited plan with hotspot' },
    },
    addOns: {
      'T-Mobile Protection': { name: 'T-Mobile Protection', price: '$7/mo', description: 'Basic device protection' },
      'T-Mobile Protection Plus': { name: 'T-Mobile Protection Plus', price: '$11/mo', description: 'Enhanced device protection with screen repair' },
      'T-Mobile Protection Premium': { name: 'T-Mobile Protection Premium', price: '$15/mo', description: 'Premium device protection with unlimited screen repairs' },
      'T-Mobile JUMP!': { name: 'T-Mobile JUMP!', price: '$12/mo', description: 'Upgrade your phone every 2 years' },
      'T-Mobile JUMP! On Demand': { name: 'T-Mobile JUMP! On Demand', price: '$10/mo', description: 'Upgrade your phone up to 3 times per year' },
      'T-Mobile Plus': { name: 'T-Mobile Plus', price: '$15/mo', description: 'Add 20GB hotspot data' },
      'T-Mobile Plus Up': { name: 'T-Mobile Plus Up', price: '$20/mo', description: 'Add 40GB hotspot data' },
      'T-Mobile International': { name: 'T-Mobile International', price: '$15/mo', description: 'International calling and data' },
      'T-Mobile Global Plus': { name: 'T-Mobile Global Plus', price: '$50/mo', description: 'Premium international features' },
      'T-Mobile Data with DIGITS': { name: 'T-Mobile Data with DIGITS', price: '$10/mo', description: 'Use your phone number on multiple devices' },
    },
    devices: {
      // Apple Smartphones
      'iPhone 16 Pro Max': { 
        price: '$1299.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$45.83', 
        storage: '256GB', 
        color: 'Natural Titanium',
        image: 'https://i.ibb.co/HTzSdF1C/i-Phone16-Pro-Max.jpg',
        brand: 'Apple',
        category: 'Premium',
        specs: {
          display: '6.9" Super Retina XDR OLED',
          processor: 'A18 Pro chip',
          camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
          battery: 'Up to 30 hours video playback',
          features: 'Action Button, USB-C, 5G, Face ID, Titanium design'
        }
      },
      'iPhone 16 Pro': { 
        price: '$1099.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$37.50', 
        storage: '256GB', 
        color: 'Natural Titanium',
        image: 'https://i.ibb.co/hR0TPw28/i-Phone16-Pro.jpg',
        brand: 'Apple',
        category: 'Premium',
        specs: {
          display: '6.3" Super Retina XDR OLED',
          processor: 'A18 Pro chip',
          camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
          battery: 'Up to 25 hours video playback',
          features: 'Action Button, USB-C, 5G, Face ID, Titanium design'
        }
      },
      'iPhone 16 Plus': { 
        price: '$999.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$33.33', 
        storage: '256GB', 
        color: 'Black',
        image: 'https://i.ibb.co/qLCxhCHX/i-Phone16-Plus.jpg',
        brand: 'Apple',
        category: 'Standard',
        specs: {
          display: '6.7" Super Retina XDR OLED',
          processor: 'A18 chip',
          camera: '48MP Main + 12MP Ultra Wide',
          battery: 'Up to 28 hours video playback',
          features: 'USB-C, 5G, Face ID, Dynamic Island'
        }
      },
      'iPhone 16': { 
        price: '$899.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$29.17', 
        storage: '256GB', 
        color: 'Black',
        image: 'https://i.ibb.co/nKy4cXn/iPhone16.jpg',
        brand: 'Apple',
        category: 'Standard',
        specs: {
          display: '6.3" Super Retina XDR OLED',
          processor: 'A18 chip',
          camera: '48MP Main + 12MP Ultra Wide',
          battery: 'Up to 22 hours video playback',
          features: 'USB-C, 5G, Face ID, Dynamic Island'
        }
      },
      'iPhone 16e': { 
        price: '$799.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$25.00', 
        storage: '128GB', 
        color: 'Black',
        image: 'https://i.ibb.co/xSPdxVMG/i-Phone16e.jpg',
        brand: 'Apple',
        category: 'Standard',
        specs: {
          display: '6.1" Super Retina XDR OLED',
          processor: 'A18 chip',
          camera: '48MP Main + 12MP Ultra Wide',
          battery: 'Up to 20 hours video playback',
          features: 'USB-C, 5G, Face ID, Dynamic Island'
        }
      },
      'iPhone 15 Pro Max': { 
        price: '$1199.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$41.67', 
        storage: '256GB', 
        color: 'Natural Titanium',
        image: 'https://i.ibb.co/dJkcYGmh/Phone15-Pro-Max.jpg',
        brand: 'Apple',
        category: 'Premium',
        specs: {
          display: '6.7" Super Retina XDR OLED',
          processor: 'A17 Pro chip',
          camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
          battery: 'Up to 29 hours video playback',
          features: 'Action Button, USB-C, 5G, Face ID'
        }
      },
      'iPhone 15 Pro': { 
        price: '$999.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$33.33', 
        storage: '256GB', 
        color: 'Natural Titanium',
        image: 'https://i.ibb.co/bM6YZ30f/i-Phone15-Pro.jpg',
        brand: 'Apple',
        category: 'Premium',
        specs: {
          display: '6.1" Super Retina XDR OLED',
          processor: 'A17 Pro chip',
          camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
          battery: 'Up to 23 hours video playback',
          features: 'Action Button, USB-C, 5G, Face ID'
        }
      },
      'iPhone 15 Plus': { 
        price: '$899.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$29.17', 
        storage: '256GB', 
        color: 'Black',
        image: 'https://i.ibb.co/jP256r82/i-Phone15-Plus.jpg',
        brand: 'Apple',
        category: 'Standard',
        specs: {
          display: '6.7" Super Retina XDR OLED',
          processor: 'A16 Bionic chip',
          camera: '48MP Main + 12MP Ultra Wide',
          battery: 'Up to 26 hours video playback',
          features: 'USB-C, 5G, Face ID, Dynamic Island'
        }
      },
      'iPhone 15': { 
        price: '$799.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$25.00', 
        storage: '256GB', 
        color: 'Black',
        image: 'https://i.ibb.co/GvBt7vLh/iPhone15.jpg',
        brand: 'Apple',
        category: 'Standard',
        specs: {
          display: '6.1" Super Retina XDR OLED',
          processor: 'A16 Bionic chip',
          camera: '48MP Main + 12MP Ultra Wide',
          battery: 'Up to 20 hours video playback',
          features: 'USB-C, 5G, Face ID, Dynamic Island'
        }
      },
      'iPhone SE (3rd generation)': { 
        price: '$429.99', 
        downPayment: '$0', 
        monthlyPayment: '$17.92', 
        storage: '128GB', 
        color: 'Midnight',
        image: 'https://i.ibb.co/vxyHz2LG/i-Phone-SE3.jpg',
        brand: 'Apple',
        category: 'Budget',
        specs: {
          display: '4.7" Retina HD LCD',
          processor: 'A15 Bionic chip',
          camera: '12MP Main',
          battery: 'Up to 15 hours video playback',
          features: '5G, Touch ID, Home button'
        }
      },
      
      // Samsung Smartphones
      'Galaxy S25 Ultra': { 
        price: '$1399.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$50.00', 
        storage: '256GB', 
        color: 'Titanium Gray',
        image: 'https://i.ibb.co/4ndxNtCZ/S25Ultra.jpg',
        brand: 'Samsung',
        category: 'Premium',
        specs: {
          display: '6.9" Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 4',
          camera: '200MP Main + 12MP Ultra Wide + 50MP Telephoto + 10MP Telephoto',
          battery: '5000mAh, 45W charging',
          features: 'S Pen, 5G, Ultrasonic fingerprint, IP68'
        }
      },
      'Galaxy S25+': { 
        price: '$1099.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$37.50', 
        storage: '256GB', 
        color: 'Onyx Black',
        image: 'https://i.ibb.co/5WyGnVXw/S25Plus.jpg',
        brand: 'Samsung',
        category: 'Premium',
        specs: {
          display: '6.7" Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 4',
          camera: '50MP Main + 12MP Ultra Wide + 10MP Telephoto',
          battery: '4900mAh, 45W charging',
          features: '5G, Ultrasonic fingerprint, IP68'
        }
      },
      'Galaxy S25': { 
        price: '$899.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$29.17', 
        storage: '256GB', 
        color: 'Onyx Black',
        image: 'https://i.ibb.co/LDZ54tmk/S25.jpg',
        brand: 'Samsung',
        category: 'Standard',
        specs: {
          display: '6.2" Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 4',
          camera: '50MP Main + 12MP Ultra Wide + 10MP Telephoto',
          battery: '4000mAh, 25W charging',
          features: '5G, Ultrasonic fingerprint, IP68'
        }
      },
      'Galaxy S25 Edge': { 
        price: '$999.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$33.33', 
        storage: '256GB', 
        color: 'Onyx Black',
        image: 'https://i.ibb.co/nqxfZ22y/S25Edge.jpg',
        brand: 'Samsung',
        category: 'Premium',
        specs: {
          display: '6.6" Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 4',
          camera: '50MP Main + 12MP Ultra Wide + 10MP Telephoto',
          battery: '4500mAh, 25W charging',
          features: '5G, Ultrasonic fingerprint, IP68, Edge display'
        }
      },
      'Galaxy S24 Ultra': { 
        price: '$1299.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$45.83', 
        storage: '256GB', 
        color: 'Titanium Gray',
        image: 'https://i.ibb.co/zhg37nNF/S24Ultra.jpg',
        brand: 'Samsung',
        category: 'Premium',
        specs: {
          display: '6.8" Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 3',
          camera: '200MP Main + 12MP Ultra Wide + 50MP Telephoto + 10MP Telephoto',
          battery: '5000mAh, 45W charging',
          features: 'S Pen, 5G, Ultrasonic fingerprint, IP68'
        }
      },
      'Galaxy S24+': { 
        price: '$999.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$33.33', 
        storage: '256GB', 
        color: 'Onyx Black',
        image: 'https://i.ibb.co/fGQbCq1R/S24Plus.jpg',
        brand: 'Samsung',
        category: 'Premium',
        specs: {
          display: '6.7" Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 3',
          camera: '50MP Main + 12MP Ultra Wide + 10MP Telephoto',
          battery: '4900mAh, 45W charging',
          features: '5G, Ultrasonic fingerprint, IP68'
        }
      },
      'Galaxy S24': { 
        price: '$799.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$25.00', 
        storage: '256GB', 
        color: 'Onyx Black',
        image: 'https://i.ibb.co/NgJ6cR8N/S24.jpg',
        brand: 'Samsung',
        category: 'Standard',
        specs: {
          display: '6.2" Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 3',
          camera: '50MP Main + 12MP Ultra Wide + 10MP Telephoto',
          battery: '4000mAh, 25W charging',
          features: '5G, Ultrasonic fingerprint, IP68'
        }
      },
      'Galaxy Z Fold7': { 
        price: '$1899.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$70.83', 
        storage: '256GB', 
        color: 'Phantom Black',
        image: 'https://i.ibb.co/nNMH68P5/ZFold7.jpg',
        brand: 'Samsung',
        category: 'Premium',
        specs: {
          display: '7.6" Dynamic AMOLED 2X (unfolded) / 6.3" Cover Display',
          processor: 'Snapdragon 8 Gen 4',
          camera: '50MP Main + 12MP Ultra Wide + 10MP Telephoto',
          battery: '4400mAh, 25W charging',
          features: 'S Pen, 5G, Ultrasonic fingerprint, IPX8'
        }
      },
      'Galaxy Z Flip7': { 
        price: '$1099.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$37.50', 
        storage: '256GB', 
        color: 'Mint',
        image: 'https://i.ibb.co/Q3F7m27t/ZFlip7.jpg',
        brand: 'Samsung',
        category: 'Premium',
        specs: {
          display: '6.7" Dynamic AMOLED 2X (unfolded) / 3.4" Cover Display',
          processor: 'Snapdragon 8 Gen 4',
          camera: '50MP Main + 12MP Ultra Wide',
          battery: '3700mAh, 25W charging',
          features: '5G, Ultrasonic fingerprint, IPX8'
        }
      },
      'Galaxy Z Flip7 FE': { 
        price: '$899.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$29.17', 
        storage: '128GB', 
        color: 'Mint',
        image: 'https://i.ibb.co/hFdYSRsW/ZFlip7FE.jpg',
        brand: 'Samsung',
        category: 'Standard',
        specs: {
          display: '6.7" Dynamic AMOLED 2X (unfolded) / 3.4" Cover Display',
          processor: 'Snapdragon 8 Gen 3',
          camera: '50MP Main + 12MP Ultra Wide',
          battery: '3700mAh, 25W charging',
          features: '5G, Ultrasonic fingerprint, IPX8'
        }
      },
      'Galaxy Z Fold6': { 
        price: '$1799.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$66.67', 
        storage: '256GB', 
        color: 'Phantom Black',
        image: 'https://i.ibb.co/8LRdT53Z/ZFold6.jpg',
        brand: 'Samsung',
        category: 'Premium',
        specs: {
          display: '7.6" Dynamic AMOLED 2X (unfolded) / 6.3" Cover Display',
          processor: 'Snapdragon 8 Gen 3',
          camera: '50MP Main + 12MP Ultra Wide + 10MP Telephoto',
          battery: '4400mAh, 25W charging',
          features: 'S Pen, 5G, Ultrasonic fingerprint, IPX8'
        }
      },
      'Galaxy Z Flip6': { 
        price: '$999.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$33.33', 
        storage: '256GB', 
        color: 'Mint',
        image: 'https://i.ibb.co/1YjSdkqC/ZFlip6.jpg',
        brand: 'Samsung',
        category: 'Premium',
        specs: {
          display: '6.7" Dynamic AMOLED 2X (unfolded) / 3.4" Cover Display',
          processor: 'Snapdragon 8 Gen 3',
          camera: '50MP Main + 12MP Ultra Wide',
          battery: '3700mAh, 25W charging',
          features: '5G, Ultrasonic fingerprint, IPX8'
        }
      },
      'Galaxy A56 5G': { 
        price: '$499.99', 
        downPayment: '$0', 
        monthlyPayment: '$20.83', 
        storage: '128GB', 
        color: 'Awesome Blue',
        image: 'https://i.ibb.co/4wkhhSqn/A56.jpg',
        brand: 'Samsung',
        category: 'Standard',
        specs: {
          display: '6.6" Super AMOLED',
          processor: 'Exynos 1480',
          camera: '50MP Main + 12MP Ultra Wide + 5MP Macro',
          battery: '5000mAh, 25W charging',
          features: '5G, Ultrasonic fingerprint, IP67'
        }
      },
      'Galaxy A36 5G': { 
        price: '$399.99', 
        downPayment: '$0', 
        monthlyPayment: '$16.67', 
        storage: '128GB', 
        color: 'Awesome Blue',
        image: 'https://i.ibb.co/x8dbtLfM/image-2025-07-28-220041971.png',
        brand: 'Samsung',
        category: 'Standard',
        specs: {
          display: '6.6" Super AMOLED',
          processor: 'Exynos 1380',
          camera: '50MP Main + 8MP Ultra Wide + 2MP Macro',
          battery: '5000mAh, 25W charging',
          features: '5G, Ultrasonic fingerprint, IP67'
        }
      },
      'Galaxy A16 5G': { 
        price: '$199.99', 
        downPayment: '$0', 
        monthlyPayment: '$8.33', 
        storage: '128GB', 
        color: 'Blue Black',
        image: 'https://i.ibb.co/C3QMxXtt/A16.jpg',
        brand: 'Samsung',
        category: 'Budget',
        specs: {
          display: '6.5" Super AMOLED',
          processor: 'MediaTek Dimensity 6100+',
          camera: '50MP Main + 5MP Ultra Wide + 2MP Macro',
          battery: '5000mAh, 25W charging',
          features: '5G, Side fingerprint, IP67'
        }
      },
      
      // Google Smartphones
      'Pixel 9 Pro Fold': { 
        price: '$1799.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$66.67', 
        storage: '256GB', 
        color: 'Obsidian',
        image: 'https://i.ibb.co/rRsk56Tr/9ProFold.jpg',
        brand: 'Google',
        category: 'Premium',
        specs: {
          display: '7.6" LTPO OLED (unfolded) / 6.3" Cover Display',
          processor: 'Google Tensor G4',
          camera: '50MP Main + 48MP Ultra Wide + 48MP Telephoto',
          battery: '5000mAh, 30W charging',
          features: '5G, Face unlock, IPX8, Advanced AI features'
        }
      },
      'Pixel 9 Pro XL': { 
        price: '$1199.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$41.67', 
        storage: '256GB', 
        color: 'Obsidian',
        image: 'https://i.ibb.co/DPtjhNsm/9ProXL.jpg',
        brand: 'Google',
        category: 'Premium',
        specs: {
          display: '6.7" LTPO OLED',
          processor: 'Google Tensor G4',
          camera: '50MP Main + 48MP Ultra Wide + 48MP Telephoto',
          battery: '5000mAh, 30W charging',
          features: '5G, Face unlock, IP68, Advanced AI features'
        }
      },
      'Pixel 9 Pro': { 
        price: '$999.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$33.33', 
        storage: '256GB', 
        color: 'Obsidian',
        image: 'https://i.ibb.co/s9W11pXq/9Pro.jpg',
        brand: 'Google',
        category: 'Premium',
        specs: {
          display: '6.7" LTPO OLED',
          processor: 'Google Tensor G4',
          camera: '50MP Main + 48MP Ultra Wide + 48MP Telephoto',
          battery: '4950mAh, 30W charging',
          features: '5G, Face unlock, IP68, Advanced AI features'
        }
      },
      'Pixel 9': { 
        price: '$799.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$25.00', 
        storage: '256GB', 
        color: 'Obsidian',
        image: 'https://i.ibb.co/kgmQhDb6/Pixel9.jpg',
        brand: 'Google',
        category: 'Standard',
        specs: {
          display: '6.2" OLED',
          processor: 'Google Tensor G4',
          camera: '50MP Main + 12MP Ultra Wide',
          battery: '4600mAh, 27W charging',
          features: '5G, Face unlock, IP68, Advanced AI features'
        }
      },
      'Pixel 8a': { 
        price: '$499.99', 
        downPayment: '$0', 
        monthlyPayment: '$20.83', 
        storage: '128GB', 
        color: 'Charcoal',
        image: 'https://i.ibb.co/FLr7PStH/Pixel8a.jpg',
        brand: 'Google',
        category: 'Budget',
        specs: {
          display: '6.1" OLED',
          processor: 'Google Tensor G3',
          camera: '64MP Main + 13MP Ultra Wide',
          battery: '4500mAh, 18W charging',
          features: '5G, Fingerprint sensor, IP67, AI features'
        }
      },
      
      // Motorola Smartphones
      'Motorola Razr Ultra (2025)': { 
        price: '$1199.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$41.67', 
        storage: '256GB', 
        color: 'Viva Magenta',
        image: 'https://i.ibb.co/cc7pYSgk/Razr-Ultra25.jpg',
        brand: 'Motorola',
        category: 'Premium',
        specs: {
          display: '6.9" pOLED (unfolded) / 3.6" pOLED (folded)',
          processor: 'Snapdragon 8 Gen 3',
          camera: '50MP Main + 13MP Ultra Wide',
          battery: '4000mAh, 30W charging',
          features: '5G, Side fingerprint, IP52, External display'
        }
      },
      'Motorola razr+ (2025)': { 
        price: '$999.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$33.33', 
        storage: '256GB', 
        color: 'Viva Magenta',
        image: 'https://i.ibb.co/xSkm99ft/Razr-Plus2025.jpg',
        brand: 'Motorola',
        category: 'Premium',
        specs: {
          display: '6.9" pOLED (unfolded) / 3.6" pOLED (folded)',
          processor: 'Snapdragon 8+ Gen 1',
          camera: '12MP Main + 13MP Ultra Wide',
          battery: '3800mAh, 30W charging',
          features: '5G, Side fingerprint, IP52, External display'
        }
      },
      'Motorola razr (2025)': { 
        price: '$699.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$20.83', 
        storage: '128GB', 
        color: 'Sage Green',
        image: 'https://i.ibb.co/SX6g2dkG/Razr25.jpg',
        brand: 'Motorola',
        category: 'Standard',
        specs: {
          display: '6.9" pOLED (unfolded) / 1.5" OLED (folded)',
          processor: 'Snapdragon 7 Gen 1',
          camera: '64MP Main + 13MP Ultra Wide',
          battery: '4200mAh, 30W charging',
          features: '5G, Side fingerprint, IP52, External display'
        }
      },
      'Moto G Stylus 5G (2025)': { 
        price: '$299.99', 
        downPayment: '$0', 
        monthlyPayment: '$12.50', 
        storage: '128GB', 
        color: 'Steel Blue',
        image: 'https://i.ibb.co/sp0cVtrV/GStylus25.jpg',
        brand: 'Motorola',
        category: 'Budget',
        specs: {
          display: '6.6" IPS LCD',
          processor: 'Snapdragon 6 Gen 1',
          camera: '50MP Main + 8MP Ultra Wide',
          battery: '5000mAh, 20W charging',
          features: '5G, Side fingerprint, Stylus, IP52'
        }
      },
      'Moto G 5G (2025)': { 
        price: '$199.99', 
        downPayment: '$0', 
        monthlyPayment: '$8.33', 
        storage: '128GB', 
        color: 'Sage Green',
        image: 'https://i.ibb.co/Cs7c6mdp/MotoG25.jpg',
        brand: 'Motorola',
        category: 'Budget',
        specs: {
          display: '6.6" IPS LCD',
          processor: 'Snapdragon 4 Gen 1',
          camera: '50MP Main + 2MP Macro',
          battery: '5000mAh, 15W charging',
          features: '5G, Side fingerprint, IP52'
        }
      },
      
      // OnePlus Smartphones
      'OnePlus 13 5G': { 
        price: '$899.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$29.17', 
        storage: '256GB', 
        color: 'Silk Black',
        image: 'https://i.ibb.co/KxphT2z0/One-Plus13.jpg',
        brand: 'OnePlus',
        category: 'Premium',
        specs: {
          display: '6.82" LTPO AMOLED',
          processor: 'Snapdragon 8 Gen 4',
          camera: '50MP Main + 48MP Ultra Wide + 64MP Telephoto',
          battery: '5400mAh, 100W charging',
          features: '5G, Ultrasonic fingerprint, IP68, Hasselblad camera'
        }
      },
      'OnePlus 12R 5G': { 
        price: '$799.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$25.00', 
        storage: '256GB', 
        color: 'Silk Black',
        image: 'https://i.ibb.co/rfp6TC70/One-Plus12.jpg',
        brand: 'OnePlus',
        category: 'Premium',
        specs: {
          display: '6.82" LTPO AMOLED',
          processor: 'Snapdragon 8 Gen 3',
          camera: '50MP Main + 48MP Ultra Wide + 64MP Telephoto',
          battery: '5400mAh, 100W charging',
          features: '5G, Ultrasonic fingerprint, IP68, Hasselblad camera'
        }
      },
      'OnePlus Nord 5': { 
        price: '$399.99', 
        downPayment: '$0', 
        monthlyPayment: '$16.67', 
        storage: '128GB', 
        color: 'Chromatic Gray',
        image: 'https://i.ibb.co/8gLLvTRw/One-Plus-Nord5.jpg',
        brand: 'OnePlus',
        category: 'Budget',
        specs: {
          display: '6.7" AMOLED',
          processor: 'Snapdragon 7+ Gen 2',
          camera: '108MP Main + 8MP Ultra Wide + 2MP Macro',
          battery: '5000mAh, 67W charging',
          features: '5G, Side fingerprint, Fast charging'
        }
      },
      
      // TCL Smartphones
      'TCL 60 SE': { 
        price: '$299.99', 
        downPayment: '$0', 
        monthlyPayment: '$12.50', 
        storage: '128GB', 
        color: 'Black',
        image: 'https://i.ibb.co/35s8QF8M/TCL60.jpg',
        brand: 'TCL',
        category: 'Budget',
        specs: {
          display: '6.7" IPS LCD',
          processor: 'MediaTek Dimensity 6100+',
          camera: '50MP Main + 8MP Ultra Wide + 2MP Macro',
          battery: '5000mAh, 18W charging',
          features: '5G, Side fingerprint, IP52'
        }
      },
      
      // Apple Tablets
      'iPad Pro 13-inch (M4)': { 
        price: '$1099.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$37.50', 
        storage: '256GB', 
        color: 'Space Gray',
        image: 'https://i.ibb.co/Ld9yjpFg/i-Pad-Pro13-M4.jpg',
        brand: 'Apple',
        category: 'Premium',
        specs: {
          display: '13" Liquid Retina XDR',
          processor: 'M4 chip',
          camera: '12MP Ultra Wide + 10MP Ultra Wide',
          battery: 'Up to 10 hours',
          features: '5G, Face ID, Apple Pencil Pro, Magic Keyboard'
        }
      },
      'iPad Pro 11-inch (M4)': { 
        price: '$899.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$29.17', 
        storage: '256GB', 
        color: 'Space Gray',
        image: 'https://i.ibb.co/Ld9yjpFg/i-Pad-Pro13-M4.jpg',
        brand: 'Apple',
        category: 'Premium',
        specs: {
          display: '11" Liquid Retina XDR',
          processor: 'M4 chip',
          camera: '12MP Ultra Wide + 10MP Ultra Wide',
          battery: 'Up to 10 hours',
          features: '5G, Face ID, Apple Pencil Pro, Magic Keyboard'
        }
      },
      'iPad Air 13-inch (M3)': { 
        price: '$799.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$25.00', 
        storage: '256GB', 
        color: 'Space Gray',
        image: 'https://i.ibb.co/BV5cSvhr/i-Pad-Air13-M2.jpg',
        brand: 'Apple',
        category: 'Standard',
        specs: {
          display: '13" Liquid Retina',
          processor: 'M3 chip',
          camera: '12MP Ultra Wide',
          battery: 'Up to 10 hours',
          features: '5G, Touch ID, Apple Pencil, Smart Keyboard'
        }
      },
      'iPad Air 11-inch (M3)': { 
        price: '$599.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$16.67', 
        storage: '256GB', 
        color: 'Space Gray',
        image: 'https://i.ibb.co/j9VHZjw4/i-Pad-Air11-M3.jpg',
        brand: 'Apple',
        category: 'Standard',
        specs: {
          display: '11" Liquid Retina',
          processor: 'M3 chip',
          camera: '12MP Ultra Wide',
          battery: 'Up to 10 hours',
          features: '5G, Touch ID, Apple Pencil, Smart Keyboard'
        }
      },
      'iPad (11th generation)': { 
        price: '$449.99', 
        downPayment: '$0', 
        monthlyPayment: '$18.75', 
        storage: '128GB', 
        color: 'Space Gray',
        image: 'https://i.ibb.co/xKWHKPPM/i-Pad11gen.jpg',
        brand: 'Apple',
        category: 'Budget',
        specs: {
          display: '10.9" Liquid Retina',
          processor: 'A14 Bionic chip',
          camera: '12MP Ultra Wide',
          battery: 'Up to 10 hours',
          features: '5G, Touch ID, Apple Pencil, Smart Keyboard'
        }
      },
      'iPad mini (7th generation)': { 
        price: '$499.99', 
        downPayment: '$0', 
        monthlyPayment: '$20.83', 
        storage: '128GB', 
        color: 'Space Gray',
        image: 'https://i.ibb.co/Df2Zg3wZ/i-Pad-Mini7.jpg',
        brand: 'Apple',
        category: 'Budget',
        specs: {
          display: '8.3" Liquid Retina',
          processor: 'A15 Bionic chip',
          camera: '12MP Ultra Wide',
          battery: 'Up to 10 hours',
          features: '5G, Touch ID, Apple Pencil, Compact design'
        }
      },
      
      // Samsung Tablets
      'Galaxy Tab S10+': { 
        price: '$899.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$29.17', 
        storage: '256GB', 
        color: 'Mystic Black',
        image: 'https://i.ibb.co/5hrz9S4K/Tab-S10-Plus.jpg',
        brand: 'Samsung',
        category: 'Premium',
        specs: {
          display: '14.6" Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 4',
          camera: '13MP + 8MP',
          battery: '11200mAh, 45W charging',
          features: '5G, S Pen, Ultrasonic fingerprint, IP68'
        }
      },
      'Galaxy Tab S10': { 
        price: '$699.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$20.83', 
        storage: '256GB', 
        color: 'Mystic Black',
        image: 'https://i.ibb.co/k2ymtrfg/TabS10.jpg',
        brand: 'Samsung',
        category: 'Standard',
        specs: {
          display: '12.4" Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 4',
          camera: '13MP + 8MP',
          battery: '10090mAh, 45W charging',
          features: '5G, S Pen, Ultrasonic fingerprint, IP68'
        }
      },
      'Galaxy Tab S9 FE 5G': { 
        price: '$499.99', 
        downPayment: '$0', 
        monthlyPayment: '$20.83', 
        storage: '128GB', 
        color: 'Mystic Black',
        image: 'https://i.ibb.co/608Bq6wH/TabS9FE.jpg',
        brand: 'Samsung',
        category: 'Budget',
        specs: {
          display: '12.4" LCD',
          processor: 'Exynos 1380',
          camera: '8MP + 8MP',
          battery: '10090mAh, 25W charging',
          features: '5G, S Pen, Side fingerprint'
        }
      },
      
      // TCL Tablets
      'TCL TAB 10 5G': { 
        price: '$299.99', 
        downPayment: '$0', 
        monthlyPayment: '$12.50', 
        storage: '128GB', 
        color: 'Black',
        image: 'https://i.ibb.co/8gyKwz9m/TCLTab10.jpg',
        brand: 'TCL',
        category: 'Budget',
        specs: {
          display: '10.1" IPS LCD',
          processor: 'MediaTek Dimensity 6100+',
          camera: '8MP + 2MP',
          battery: '6000mAh, 18W charging',
          features: '5G, Side fingerprint, T-Mobile optimized'
        }
      },
      
      // Apple Smartwatches
      'Apple Watch Ultra 2': { 
        price: '$799.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$25.00', 
        storage: '32GB', 
        color: 'Natural Titanium',
        image: 'https://i.ibb.co/p60B9KNj/Ultra2.jpg',
        brand: 'Apple',
        category: 'Premium',
        specs: {
          display: '49mm Always-On Retina',
          processor: 'S9 chip',
          camera: 'N/A',
          battery: 'Up to 36 hours',
          features: 'Cellular, GPS, Heart rate, ECG, Blood oxygen'
        }
      },
      'Apple Watch Series 10': { 
        price: '$399.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$8.33', 
        storage: '32GB', 
        color: 'Midnight',
        image: 'https://i.ibb.co/6L1xnQS/WatchS10.jpg',
        brand: 'Apple',
        category: 'Standard',
        specs: {
          display: '45mm Always-On Retina',
          processor: 'S9 chip',
          camera: 'N/A',
          battery: 'Up to 18 hours',
          features: 'Cellular, GPS, Heart rate, ECG, Blood oxygen'
        }
      },
      'Apple Watch SE (3rd generation)': { 
        price: '$249.99', 
        downPayment: '$0', 
        monthlyPayment: '$10.42', 
        storage: '32GB', 
        color: 'Midnight',
        image: 'https://i.ibb.co/C57q5Vsh/WatchSE3.jpg',
        brand: 'Apple',
        category: 'Budget',
        specs: {
          display: '44mm Retina',
          processor: 'S9 chip',
          camera: 'N/A',
          battery: 'Up to 18 hours',
          features: 'Cellular, GPS, Heart rate, Fall detection'
        }
      },
      
      // Samsung Smartwatches
      'Galaxy Watch7': { 
        price: '$299.99', 
        downPayment: '$0', 
        monthlyPayment: '$12.50', 
        storage: '16GB', 
        color: 'Black',
        image: 'https://i.ibb.co/C5FfV23n/Galaxy-Watch7.jpg',
        brand: 'Samsung',
        category: 'Standard',
        specs: {
          display: '44mm Super AMOLED',
          processor: 'Exynos W1000',
          camera: 'N/A',
          battery: 'Up to 40 hours',
          features: 'Cellular, GPS, Heart rate, ECG, Blood pressure'
        }
      },
      'Galaxy Watch7 Ultra': { 
        price: '$649.99', 
        downPayment: '$199.99', 
        monthlyPayment: '$18.75', 
        storage: '32GB', 
        color: 'Titanium Gray',
        image: 'https://i.ibb.co/sdF0KmWy/Galaxy-Watch-Ultra.jpg',
        brand: 'Samsung',
        category: 'Premium',
        specs: {
          display: '47mm Super AMOLED',
          processor: 'Exynos W1000',
          camera: 'N/A',
          battery: 'Up to 100 hours',
          features: 'Cellular, GPS, Heart rate, ECG, Blood pressure, Diving'
        }
      },
      'Galaxy Watch FE': { 
        price: '$199.99', 
        downPayment: '$0', 
        monthlyPayment: '$8.33', 
        storage: '16GB', 
        color: 'Black',
        image: 'https://i.ibb.co/gbwFYtW3/Galaxy-Watch-FE.jpg',
        brand: 'Samsung',
        category: 'Budget',
        specs: {
          display: '40mm Super AMOLED',
          processor: 'Exynos W920',
          camera: 'N/A',
          battery: 'Up to 30 hours',
          features: 'Cellular, GPS, Heart rate, Sleep tracking'
        }
      },
      
      // Google Smartwatches
      'Pixel Watch 3': { 
        price: '$349.99', 
        downPayment: '$0', 
        monthlyPayment: '$14.58', 
        storage: '32GB', 
        color: 'Obsidian',
        image: 'https://i.ibb.co/sdDD6ngV/Pixel-Watch3.jpg',
        brand: 'Google',
        category: 'Standard',
        specs: {
          display: '41mm AMOLED',
          processor: 'Google Tensor G3',
          camera: 'N/A',
          battery: 'Up to 24 hours',
          features: 'Cellular, GPS, Heart rate, ECG, Blood oxygen'
        }
      },
      
      // T-Mobile Hotspots & Internet
      'T-Mobile 5G Hotspot': { 
        price: '$199.99', 
        downPayment: '$0', 
        monthlyPayment: '$8.33', 
        storage: 'N/A', 
        color: 'Black',
        image: 'https://i.ibb.co/HLTSpVvP/T-Mobile-logo-2022-svg.png',
        brand: 'T-Mobile',
        category: 'Budget',
        specs: {
          display: '2.4" LCD',
          processor: 'Qualcomm Snapdragon X55',
          camera: 'N/A',
          battery: 'Up to 8 hours',
          features: '5G, Wi-Fi 6, 15+ connected devices, 4,000mAh battery'
        }
      },
      'T-Mobile Internet Gateway': { 
        price: '$0', 
        downPayment: '$0', 
        monthlyPayment: '$0', 
        storage: 'N/A', 
        color: 'White',
        image: 'https://i.ibb.co/HLTSpVvP/T-Mobile-logo-2022-svg.png',
        brand: 'T-Mobile',
        category: 'Budget',
        specs: {
          display: 'N/A',
          processor: 'Qualcomm Snapdragon X55',
          camera: 'N/A',
          battery: 'N/A',
          features: '5G Home Internet, Wi-Fi 6, Unlimited data, No equipment fees'
        }
      }
    }
  },
  Internet: {
    plans: {
      'T-Mobile Home Internet': { name: 'T-Mobile Home Internet', price: '$50/mo', description: 'Unlimited 5G home internet' },
      'T-Mobile Home Internet Plus': { name: 'T-Mobile Home Internet Plus', price: '$70/mo', description: 'Enhanced 5G home internet with priority data' },
      'T-Mobile 5G Home Internet': { name: 'T-Mobile 5G Home Internet', price: '$50/mo', description: '5G home internet service' },
      'T-Mobile Home Internet Lite': { name: 'T-Mobile Home Internet Lite', price: '$30/mo', description: 'Basic home internet service' },
      'T-Mobile Business Internet': { name: 'T-Mobile Business Internet', price: '$70/mo', description: 'Business-grade internet service' },
    },
    equipment: {
      'T-Mobile 5G Gateway': { price: '$0', deposit: '$0', monthlyPayment: '$0', description: '5G home internet gateway included' },
      'T-Mobile 4G LTE Gateway': { price: '$0', deposit: '$0', monthlyPayment: '$0', description: '4G LTE home internet gateway included' },
      'T-Mobile Business Gateway': { price: '$0', deposit: '$0', monthlyPayment: '$0', description: 'Business internet gateway included' },
    }
  },
  TV: {
    plans: {
      'T-Mobile TVision': { name: 'T-Mobile TVision', price: '$40/mo', description: 'Streaming TV service' },
      'T-Mobile TVision VIBE': { name: 'T-Mobile TVision VIBE', price: '$10/mo', description: 'Basic streaming channels' },
      'T-Mobile TVision LIVE TV': { name: 'T-Mobile TVision LIVE TV', price: '$64.99/mo', description: 'Live TV streaming service' },
      'T-Mobile TVision LIVE TV+': { name: 'T-Mobile TVision LIVE TV+', price: '$84.99/mo', description: 'Premium live TV streaming service' },
      'T-Mobile TVision CHANNELS': { name: 'T-Mobile TVision CHANNELS', price: '$29.99/mo', description: 'Channel streaming service' },
    },
    addOns: {
      'T-Mobile TVision Premium': { name: 'T-Mobile TVision Premium', price: '$9.99/mo', description: 'Premium channel package' },
      'T-Mobile TVision Sports': { name: 'T-Mobile TVision Sports', price: '$9.99/mo', description: 'Sports channel package' },
      'T-Mobile TVision Entertainment': { name: 'T-Mobile TVision Entertainment', price: '$9.99/mo', description: 'Entertainment channel package' },
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
  const [showQuoteHistory, setShowQuoteHistory] = useState(false);
  const [lastDeletedSale, setLastDeletedSale] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);

  // Modal states
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showDeviceShowcase, setShowDeviceShowcase] = useState(false);

  // Add debugging for mobile view - MOVED AFTER STATE DECLARATIONS
  useEffect(() => {
    console.log('App: Component rendering...');
    console.log('App: User state:', user);
    console.log('App: Show auth modal:', showAuthModal);
    console.log('App: Show splash:', showSplash);
    console.log('App: Show OOBE:', showOOBE);
    console.log('App: Show pin modal:', showPinModal);
    console.log('App: Window width:', window.innerWidth);
    console.log('App: Is mobile view:', window.innerWidth < 640);
    
    // Force mobile view detection
    const handleResize = () => {
      console.log('App: Window resized to:', window.innerWidth);
      console.log('App: Is mobile view:', window.innerWidth < 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [user, showAuthModal, showSplash, showOOBE, showPinModal]);

  // Firebase authentication listener
  useEffect(() => {
    console.log('App: Initializing Firebase auth listener...');
    
    try {
    const unsubscribe = onAuthChange((user) => {
        console.log('App: Auth state changed:', user ? 'User logged in' : 'User logged out');
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
    } catch (error) {
      console.error('App: Firebase auth error:', error);
      // Fallback: show auth modal even if Firebase fails
      setIsLoading(false);
      setShowAuthModal(true);
    }
  }, []);

  // Load user data from Firebase
  const loadUserData = async () => {
    console.log('App: Loading user data...');
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
      console.error('App: Error loading user data:', error);
      toast.error('Failed to load user data');
      // Continue with default settings even if Firebase fails
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

  // Process quotes with pricing calculations
  const quotesWithPricing = React.useMemo(() => {
    if (!sales || sales.length === 0) return [];

    // Return sales as quotes with calculated totals
    return sales.map(sale => {
      const totalMonthly = sale.services.reduce((sum, service) => {
        let serviceTotal = 0;
        
        // Add plan price
        if (service.planPrice) {
          const planPrice = parseFloat(service.planPrice.replace('$', '').replace('/mo', ''));
          serviceTotal += planPrice * (service.lines || 1);
        }
        
        // Add device monthly payment
        if (service.devicePrice && service.device) {
          const deviceData = PRODUCT_CATALOG.Mobile.devices[service.device];
          if (deviceData) {
            serviceTotal += parseFloat(deviceData.monthlyPayment.replace('$', ''));
          }
        }
        
        // Add add-on prices
        if (service.addOns && service.addOns.length > 0) {
          service.addOns.forEach(addonName => {
            const addonData = PRODUCT_CATALOG.Mobile.addOns[addonName];
            if (addonData) {
              const addonPrice = parseFloat(addonData.price.replace('$', '').replace('/mo', ''));
              serviceTotal += addonPrice;
            }
          });
        }
        
        return sum + serviceTotal;
      }, 0);

      const totalOneTime = sale.services.reduce((sum, service) => {
        let oneTimeTotal = 0;
        
        // Add device down payment
        if (service.device && service.devicePrice) {
          const deviceData = PRODUCT_CATALOG.Mobile.devices[service.device];
          if (deviceData) {
            oneTimeTotal += parseFloat(deviceData.downPayment.replace('$', ''));
          }
        }
        
        return sum + oneTimeTotal;
      }, 0);

      return { 
        ...sale, 
        totalMonthly: parseFloat(totalMonthly.toFixed(2)),
        totalOneTime: parseFloat(totalOneTime.toFixed(2)),
        totalFirstMonth: totalMonthly + totalOneTime
      };
    });
  }, [sales]);

  // Calculate dashboard metrics
  const dashboardMetrics = React.useMemo(() => {
    const totalQuotes = quotesWithPricing.length;
    const totalMonthlyRevenue = quotesWithPricing.reduce((sum, quote) => sum + quote.totalMonthly, 0);
    const totalOneTimeRevenue = quotesWithPricing.reduce((sum, quote) => sum + quote.totalOneTime, 0);
    const avgMonthlyPerQuote = totalQuotes > 0 ? totalMonthlyRevenue / totalQuotes : 0;
    
    return { 
      totalQuotes, 
      totalMonthlyRevenue, 
      totalOneTimeRevenue, 
      avgMonthlyPerQuote,
      totalFirstMonthRevenue: totalMonthlyRevenue + totalOneTimeRevenue
    };
  }, [quotesWithPricing]);

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

  // Filter and sort quotes
  const filteredAndSortedQuotes = React.useMemo(() => {
    let processedQuotes = [...quotesWithPricing];
    
    // Filter by product
    if (filterProduct !== 'all') {
      processedQuotes = processedQuotes.filter(quote => 
        quote.services.some(s => s.category === filterProduct)
      );
    }
    
    // Search filter
    if (searchQuery) {
      processedQuotes = processedQuotes.filter(quote =>
        quote.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (quote.notes && quote.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Sort
    processedQuotes.sort((a, b) => {
      switch(sortSales) {
        case 'date_asc':
          return new Date(a.saleDate) - new Date(b.saleDate);
        case 'total_desc':
          return b.totalMonthly - a.totalMonthly;
        case 'total_asc':
          return a.totalMonthly - b.totalMonthly;
        default:
          return new Date(b.saleDate) - new Date(a.saleDate);
      }
    });
    
    return processedQuotes;
  }, [quotesWithPricing, filterProduct, searchQuery, sortSales]);

  // Event handlers
  // Handle add sale
  const handleAddSale = async (quoteData) => {
    try {
      // Convert the new quote data structure to the existing sale structure
      const saleData = {
        customerName: quoteData.customerName,
        saleDate: quoteData.saleDate,
        notes: quoteData.notes,
        services: quoteData.services,
        discounts: quoteData.discounts,
        fees: quoteData.fees,
        totals: quoteData.totals
      };

      const result = await firebaseAddSale(saleData);
      if (result.success) {
        setShowSaleModal(false);
        setCurrentSaleServices([]);
        toast.success('Quote saved successfully!');
      } else {
        toast.error('Failed to save quote');
      }
    } catch (error) {
      console.error('Error adding sale:', error);
      toast.error('Failed to save quote');
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
    a.download = `tmobile-quotes-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Quotes exported successfully');
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

  // Handle OOBE completion
  const handleOOBEComplete = (goals) => {
    setCurrentGoals(goals);
    setShowOOBE(false);
    setShowSplash(false);
  };

  // Handle save goals
  const handleSaveGoals = async (newGoals) => {
    try {
      const result = await saveGoals(newGoals);
      if (result.success) {
        setCurrentGoals(newGoals);
        setShowGoalsModal(false);
        toast.success('Goals saved successfully!');
      } else {
        toast.error('Failed to save goals');
      }
    } catch (error) {
      console.error('Error saving goals:', error);
      toast.error('Failed to save goals');
    }
  };

  // Handle save profile
  const handleSaveProfile = async (name) => {
    try {
      const newSettings = { ...userSettings, name };
      const result = await saveUserSettings(newSettings);
      if (result.success) {
        setUserSettings(newSettings);
        setShowProfileModal(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    }
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl text-center">
          <img src="https://i.ibb.co/V0r0hgn7/tmobile-header.png" alt="T-Mobile Logo" className="h-16 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Sales Quote Tool</h1>
          <div className="flex justify-center mt-6">
            <div className="w-8 h-8 border-4 border-att-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth modal if no user
  if (!user && showAuthModal) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <AuthModal onAuthSuccess={handleAuthSuccess} />
        <Toaster position="top-right" />
      </div>
    );
  }

  // Fallback UI - Always show something
  try {
  if (showSplash) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl text-center">
            <img src="https://i.ibb.co/V0r0hgn7/tmobile-header.png" alt="T-Mobile Logo" className="h-16 mx-auto mb-4 object-contain" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Sales Quote Tool</h1>
          
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Toaster position="top-right" />
      
        {/* Header */}
      <Header 
        user={user}
          onSignOut={handleSignOut}
          onToggleTheme={toggleTheme}
          onShowSettings={() => setShowSettingsModal(true)}
          weather={weather}
          tempUnit={userSettings.tempUnit}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-2">
              Welcome to Sales Quote Tool! 🚀
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 px-2">
              Create amazing quotes for your customers with our fun and easy interface
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setShowQuoteModal(true)}
              className="btn-fun bg-gradient-to-r from-[#E20074] to-[#FF6B9D] hover:from-[#B8005C] hover:to-[#E55A8A] text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 touch-manipulation"
            >
              <div className="text-3xl mb-2">📝</div>
              <h3 className="text-lg sm:text-xl font-bold mb-1">Create New Quote</h3>
              <p className="text-sm sm:text-base opacity-90">Start a professional quote</p>
            </button>
            
            <button
              onClick={() => setShowSettingsModal(true)}
              className="btn-fun bg-gradient-to-r from-[#4A4A4A] to-[#6B7280] hover:from-[#2D2D2D] hover:to-[#4B5563] text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 touch-manipulation"
            >
              <div className="text-3xl mb-2">⚙️</div>
              <h3 className="text-lg sm:text-xl font-bold mb-1">Settings</h3>
              <p className="text-sm sm:text-base opacity-90">Configure app & view history</p>
            </button>
            
            <button
              onClick={() => setShowDeviceShowcase(true)}
              className="btn-fun bg-gradient-to-r from-[#E20074] to-[#FF6B9D] hover:from-[#B8005C] hover:to-[#E55A8A] text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 touch-manipulation"
            >
              <div className="text-3xl mb-2">📱</div>
              <h3 className="text-lg sm:text-xl font-bold mb-1">Device Showcase</h3>
              <p className="text-sm sm:text-base opacity-90">Browse devices & plans</p>
            </button>
          </div>
          
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Available Plans</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">15+</p>
                </div>
                <div className="text-3xl sm:text-4xl">📋</div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Device Options</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">50+</p>
                </div>
                <div className="text-3xl sm:text-4xl">📱</div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">5G Coverage</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">99%</p>
                </div>
                <div className="text-3xl sm:text-4xl">📶</div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Customer Support</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">24/7</p>
                </div>
                <div className="text-3xl sm:text-4xl">🛟</div>
              </div>
            </div>
          </div>

          {/* Device and Plans Showcase */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">Device & Plans Showcase</h3>
              <button
                onClick={() => setShowDeviceShowcase(true)}
                className="text-[#E20074] hover:text-[#B8005C] font-medium text-sm transition-colors"
              >
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Premium Smartphones */}
              <div className="bg-gradient-to-br from-[#F8E6F0] to-[#FFF0F5] dark:from-slate-700 dark:to-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="text-center">
                  <div className="text-3xl mb-2">📱</div>
                  <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">Premium Smartphones</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">iPhone 15, Samsung S24</p>
                  <p className="text-sm font-semibold text-[#E20074]">From $0/mo</p>
                </div>
              </div>

              {/* Foldable Devices */}
              <div className="bg-gradient-to-br from-[#F8E6F0] to-[#FFF0F5] dark:from-slate-700 dark:to-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="text-center">
                  <div className="text-3xl mb-2">📱</div>
                  <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">Foldable Devices</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Z Fold6, Z Flip6, Razr+</p>
                  <p className="text-sm font-semibold text-[#E20074]">From $0/mo</p>
                </div>
              </div>

              {/* Budget Options */}
              <div className="bg-gradient-to-br from-[#F8E6F0] to-[#FFF0F5] dark:from-slate-700 dark:to-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="text-center">
                  <div className="text-3xl mb-2">📱</div>
                  <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">Budget Options</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Moto G, REVVL, A-Series</p>
                  <p className="text-sm font-semibold text-[#E20074]">From $0/mo</p>
                </div>
              </div>

              {/* Tablets & Watches */}
              <div className="bg-gradient-to-br from-[#F8E6F0] to-[#FFF0F5] dark:from-slate-700 dark:to-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="text-center">
                  <div className="text-3xl mb-2">⌚</div>
                  <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">Tablets & Watches</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">iPad, Galaxy Tab, Apple Watch</p>
                  <p className="text-sm font-semibold text-[#E20074]">From $0/mo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Promotional Banners */}
          <div className="space-y-4">
            {/* Current Promotions Banner */}
            <div className="bg-gradient-to-r from-[#E20074] to-[#FF6B9D] rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">🎉 Current Promotions</h3>
                  <p className="text-sm sm:text-base opacity-90 mb-3">
                    Get up to $800 off when you switch to T-Mobile! Plus, enjoy 3 months of Netflix on us.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Switch & Save</span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Netflix on Us</span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">5G Included</span>
                  </div>
                </div>
                <div className="text-4xl sm:text-5xl ml-4">📱</div>
              </div>
            </div>

            {/* 5G Network Banner */}
            <div className="bg-gradient-to-r from-[#4A90E2] to-[#7BB3F0] rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">🚀 America's Largest 5G Network</h3>
                  <p className="text-sm sm:text-base opacity-90 mb-3">
                    Experience lightning-fast speeds with our nationwide 5G coverage. No extra charges!
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Nationwide 5G</span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">No Extra Cost</span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Ultra Capacity</span>
                  </div>
                </div>
                <div className="text-4xl sm:text-5xl ml-4">📶</div>
              </div>
            </div>

            {/* Family Plans Banner */}
            <div className="bg-gradient-to-r from-[#50C878] to-[#7DCEA0] rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">👨‍👩‍👧‍👦 Family Plans Starting at $120/mo</h3>
                  <p className="text-sm sm:text-base opacity-90 mb-3">
                    Up to 4 lines with unlimited data, talk & text. The more lines, the more you save!
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">4 Lines $120</span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Unlimited Data</span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Family Savings</span>
                  </div>
                </div>
                <div className="text-4xl sm:text-5xl ml-4">👨‍👩‍👧‍👦</div>
              </div>
            </div>
          </div>
        </div>

      {/* Modals */}
        {showQuoteModal && (
          <MultiStepQuoteModal
            onClose={() => setShowQuoteModal(false)}
            onSave={handleAddSale}
            productCatalog={PRODUCT_CATALOG}
          />
        )}

        {showDeviceShowcase && (
          <DeviceShowcaseModal
            onClose={() => setShowDeviceShowcase(false)}
            productCatalog={PRODUCT_CATALOG}
          />
        )}

        {showQuoteHistory && (
          <QuoteHistoryModal
            onClose={() => setShowQuoteHistory(false)}
            quotes={filteredAndSortedQuotes}
            onDeleteSale={handleDeleteSale}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterProduct={filterProduct}
            onFilterChange={setFilterProduct}
            sortSales={sortSales}
            onSortChange={setSortSales}
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
            onShowGoals={() => setShowGoalsModal(true)}
            onShowQuoteHistory={() => {
              setShowSettingsModal(false);
              setShowQuoteHistory(true);
            }}
            quotesWithPricing={quotesWithPricing}
          />
        )}

      {showGoalsModal && (
        <GoalsModal 
          goals={currentGoals}
            onSave={handleSaveGoals}
          onClose={() => setShowGoalsModal(false)}
        />
      )}

      {showProfileModal && (
        <ProfileModal 
          name={userSettings.name}
            onSave={handleSaveProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}

        {showPinModal && (
          <PinModal
            onUnlock={handlePinUnlock}
            pinLock={pinLock}
          />
        )}

      {showSearchPopout && (
        <SearchPopout 
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onClose={() => setShowSearchPopout(false)}
        />
      )}

        {showOOBE && (
          <OOBEScreen onComplete={handleOOBEComplete} />
        )}

        {/* Undo Toast */}
      {lastDeletedSale && (
          <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <span>Quote deleted</span>
        <button
          onClick={handleUndoDelete}
                className="text-att-blue hover:text-att-blue-light font-medium"
        >
                Undo
        </button>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('App: Error rendering main content:', error);
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Error</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            An unexpected error occurred. Please try refreshing the page or contact support.
          </p>
      <button
            onClick={() => window.location.reload()}
            className="bg-att-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-300"
      >
            Refresh Page
      </button>
        </div>
    </div>
  );
  }
}

export default App; 