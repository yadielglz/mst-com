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
    addOns: {
      'T-Mobile Home Internet Protection': { name: 'T-Mobile Home Internet Protection', price: '$5/mo', description: 'Basic equipment protection' },
      'T-Mobile Home Internet Plus Protection': { name: 'T-Mobile Home Internet Plus Protection', price: '$8/mo', description: 'Enhanced equipment protection' },
      'T-Mobile Static IP': { name: 'T-Mobile Static IP', price: '$10/mo', description: 'Static IP address for business' },
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

  // Quote building state
  const [isBuildingQuote, setIsBuildingQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState({
    plan: null,
    device: null,
    addOns: [],
    customerInfo: {}
  });
  const [collapsedSections, setCollapsedSections] = useState({
    plans: false,
    devices: false,
    addOns: false
  });

  // Mobile detection and responsive handling
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768; // Changed from 640 to 768 for better tablet support
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      console.log('App: Window width:', window.innerWidth);
      console.log('App: Is mobile:', isMobile);
      console.log('App: Is tablet:', isTablet);
    };
    
    // Check on mount
    checkMobile();
    
    // Force mobile view detection
    const handleResize = () => {
      console.log('App: Window resized to:', window.innerWidth);
      checkMobile();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Removed problematic dependencies

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
        console.log('App: User authenticated, loading data...');
        loadUserData();
      } else {
        // User is signed out, reset state and show auth modal
        console.log('App: User signed out, resetting state...');
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
        setShowSplash(true);
        setShowOOBE(false);
        setShowPinModal(false);
        setShowSettingsModal(false);
        setShowQuoteModal(false);
        setShowDeviceShowcase(false);
        setShowQuoteHistory(false);
        setShowGoalsModal(false);
        setShowProfileModal(false);
        setShowSearchPopout(false);
        setShowSaleModal(false);
        setShowSettingsMenu(false);
        setShowAuthModal(true);
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

  // Additional check for authenticated user on mount
  useEffect(() => {
    const checkCurrentUser = () => {
      const currentUser = getCurrentUser();
      console.log('App: Checking current user:', currentUser);
      if (currentUser && !user) {
        console.log('App: Found authenticated user, updating state');
        setUser(currentUser);
        setIsLoading(false);
        loadUserData();
      }
    };
    
    // Check after a short delay to ensure Firebase is initialized
    const timer = setTimeout(checkCurrentUser, 1000);
    return () => clearTimeout(timer);
  }, [user]);

  // Fallback timeout to ensure auth modal shows if no user after 3 seconds
  useEffect(() => {
    if (!user && !isLoading) {
      const timer = setTimeout(() => {
        console.log('App: Fallback timeout - ensuring auth modal is visible');
        if (!user && !showAuthModal) {
          setShowAuthModal(true);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, showAuthModal]);

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
    console.log('App: Auth success, user:', user);
    setUser(user);
    setShowAuthModal(false);
    
    // Check if this is a new user
    const settingsResult = await getUserSettings();
    if (!settingsResult.success || !settingsResult.settings) {
      console.log('App: New user, showing OOBE');
      setShowOOBE(true);
    } else {
      console.log('App: Existing user, hiding splash');
      setShowSplash(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      console.log('App: User signing out...');
      await signOutUser();
      
      // Reset all app state
      setUser(null);
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
      setShowSplash(true);
      setShowOOBE(false);
      setShowPinModal(false);
      setShowSettingsModal(false);
      setShowQuoteModal(false);
      setShowDeviceShowcase(false);
      setShowQuoteHistory(false);
      setShowGoalsModal(false);
      setShowProfileModal(false);
      setShowSearchPopout(false);
      setShowSaleModal(false);
      setShowSettingsMenu(false);
      
      // Show auth modal
      setShowAuthModal(true);
      
      toast.success('Signed out successfully');
      console.log('App: Sign out complete, auth modal should be visible');
    } catch (error) {
      console.error('App: Sign out error:', error);
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
      console.log('App: Saving quote data:', quoteData);
      
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
        setShowQuoteModal(false); // Fixed: Close the quote modal, not sale modal
        setCurrentSaleServices([]);
        toast.success('Quote saved successfully!');
        console.log('App: Quote saved successfully, modal closed');
      } else {
        toast.error('Failed to save quote');
        console.error('App: Failed to save quote:', result.error);
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

  // Handle pin unlock
  const handlePinUnlock = () => {
    setShowPinModal(false);
    setShowAuthModal(true);
  };

  // Quote building functions
  const startNewQuote = () => {
    setIsBuildingQuote(true);
    setCurrentQuote({
      plan: null,
      device: null,
      addOns: [],
      customerInfo: {}
    });
  };

  const selectPlan = (planName, planData) => {
    setCurrentQuote(prev => ({
      ...prev,
      plan: { name: planName, ...planData }
    }));
  };

  const selectDevice = (deviceName, deviceData) => {
    setCurrentQuote(prev => ({
      ...prev,
      device: { name: deviceName, ...deviceData }
    }));
  };

  const toggleAddOn = (addonName, addonData) => {
    setCurrentQuote(prev => {
      const existingAddon = prev.addOns.find(addon => addon.name === addonName);
      if (existingAddon) {
        return {
          ...prev,
          addOns: prev.addOns.filter(addon => addon.name !== addonName)
        };
      } else {
        return {
          ...prev,
          addOns: [...prev.addOns, { name: addonName, ...addonData }]
        };
      }
    });
  };

  const saveQuote = () => {
    if (currentQuote.plan) {
      handleAddSale({
        customerName: 'New Customer',
        saleDate: new Date().toISOString(),
        notes: 'Quote created in builder',
        services: [currentQuote.plan],
        discounts: [],
        fees: [],
        totals: calculateQuoteTotals()
      });
      setIsBuildingQuote(false);
      setCurrentQuote({
        plan: null,
        device: null,
        addOns: [],
        customerInfo: {}
      });
    }
  };

  const calculateQuoteTotals = () => {
    let totalMonthly = 0;
    let totalOneTime = 0;

    // Add plan cost
    if (currentQuote.plan) {
      const planPrice = parseFloat(currentQuote.plan.price.replace('$', '').replace('/mo', ''));
      totalMonthly += planPrice;
    }

    // Add device cost
    if (currentQuote.device) {
      const deviceMonthly = parseFloat(currentQuote.device.monthlyPayment.replace('$', '').replace('/mo', ''));
      const deviceDown = parseFloat(currentQuote.device.downPayment.replace('$', ''));
      totalMonthly += deviceMonthly;
      totalOneTime += deviceDown;
    }

    // Add add-ons
    currentQuote.addOns.forEach(addon => {
      const addonPrice = parseFloat(addon.price.replace('$', '').replace('/mo', ''));
      totalMonthly += addonPrice;
    });

    return {
      totalMonthly: Math.max(0, totalMonthly),
      totalOneTime,
      totalFirstMonth: Math.max(0, totalMonthly) + totalOneTime
    };
  };

  const cancelQuote = () => {
    setIsBuildingQuote(false);
    setCurrentQuote({
      plan: null,
      device: null,
      addOns: [],
      customerInfo: {}
    });
  };

  const clearQuote = () => {
    setCurrentQuote({
      plan: null,
      device: null,
      addOns: [],
      customerInfo: {}
    });
  };

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Show loading screen
  if (isLoading) {
    console.log('App: Showing loading screen');
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl text-center">
          <img src="https://i.ibb.co/V0r0hgn7/tmobile-header.png" alt="T-Mobile Logo" className="h-16 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">TST (T-Mobile Sales Tool)</h1>
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
    console.log('App: Showing auth modal');
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess} 
        />
        <Toaster position="top-right" />
      </div>
    );
  }

  // Fallback UI - Always show something
  if (showSplash) {
    console.log('App: Showing splash screen');
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
              onClick={() => {
                console.log('App: Disclaimer dismissed, user:', user, 'showAuthModal:', showAuthModal);
                setShowSplash(false);
                // If no user, show auth modal after disclaimer
                if (!user) {
                  setShowAuthModal(true);
                }
              }}
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
    console.log('App: Showing OOBE screen');
    return <OOBEScreen onComplete={handleOOBEComplete} />;
  }

  if (showPinModal) {
    console.log('App: Showing pin modal');
    return <PinModal onUnlock={handlePinUnlock} pinLock={pinLock} />;
  }

  // Debug logging for main content
  console.log('App: Rendering main content - user:', user, 'showAuthModal:', showAuthModal, 'showSplash:', showSplash);

  // Fallback: If no user and no auth modal showing, show auth modal
  if (!user && !showAuthModal) {
    console.log('App: Fallback - showing auth modal');
    setShowAuthModal(true);
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Loading...</h1>
          <p className="text-slate-600 dark:text-slate-300">Please wait while we set up your session.</p>
        </div>
      </div>
    );
  }

  // Ultimate fallback - if we somehow get here, show auth modal
  if (!user) {
    console.log('App: Ultimate fallback - forcing auth modal');
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <AuthModal 
          isOpen={true}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess} 
        />
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
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

      {/* T-Mobile Quote Builder Interface */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        
        {/* Left Sidebar - Quote Builder */}
        <div className="w-full lg:w-1/2 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
          <div className="p-4">
            {/* Quote Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-att-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Q</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    {isBuildingQuote ? 'Building New Quote' : 'T-Mobile Quote Builder'}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {isBuildingQuote ? 'Select your plan, device, and add-ons' : 'Create professional quotes'}
                  </p>
                </div>
              </div>
              {isBuildingQuote ? (
                <div className="flex gap-2">
                  <button
                    onClick={cancelQuote}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveQuote}
                    className="px-4 py-2 bg-att-blue text-white rounded-lg font-medium hover:bg-att-blue-dark transition-colors"
                  >
                    Save Quote
                  </button>
                </div>
              ) : (
                <button
                  onClick={startNewQuote}
                  className="px-4 py-2 bg-att-blue text-white rounded-lg font-medium hover:bg-att-blue-dark transition-colors"
                >
                  NEW QUOTE
                </button>
              )}
            </div>

            {isBuildingQuote ? (
              /* Quote Building Interface */
              <div className="space-y-6">
                {/* Plan Selection */}
                <div>
                  <div 
                    className="flex items-center justify-between mb-4 cursor-pointer"
                    onClick={() => toggleSection('plans')}
                  >
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Select Your Plan</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {currentQuote.plan ? '1 selected' : '0 selected'}
                      </span>
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        {collapsedSections.plans ? '▼' : '▲'}
                      </button>
                    </div>
                  </div>
                  {!collapsedSections.plans && (
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(PRODUCT_CATALOG.Mobile.plans).slice(0, 6).map(([planName, planData]) => (
                        <div 
                          key={planName} 
                          className={`bg-white dark:bg-slate-700 rounded-lg border p-4 hover:border-att-blue transition-colors cursor-pointer ${
                            currentQuote.plan?.name === planName ? 'border-att-blue bg-att-blue/5' : 'border-slate-200 dark:border-slate-600'
                          }`}
                          onClick={() => selectPlan(planName, planData)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-800 dark:text-white">{planName}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{planData.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-att-blue">{planData.price}</div>
                              <div className="text-xs text-slate-500">per line</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Device Selection */}
                <div>
                  <div 
                    className="flex items-center justify-between mb-4 cursor-pointer"
                    onClick={() => toggleSection('devices')}
                  >
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Choose Your Device</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {currentQuote.device ? '1 selected' : '0 selected'}
                      </span>
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        {collapsedSections.devices ? '▼' : '▲'}
                      </button>
                    </div>
                  </div>
                  {!collapsedSections.devices && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(PRODUCT_CATALOG.Mobile.devices).slice(0, 8).map(([deviceName, deviceData]) => (
                        <div 
                          key={deviceName} 
                          className={`bg-white dark:bg-slate-700 rounded-lg border p-4 hover:border-att-blue transition-colors cursor-pointer ${
                            currentQuote.device?.name === deviceName ? 'border-att-blue bg-att-blue/5' : 'border-slate-200 dark:border-slate-600'
                          }`}
                          onClick={() => selectDevice(deviceName, deviceData)}
                        >
                          <div className="text-center">
                            {deviceData.image ? (
                              <img 
                                src={deviceData.image} 
                                alt={deviceName}
                                className="w-16 h-16 mx-auto mb-2 object-contain rounded-lg"
                              />
                            ) : (
                              <div className="text-3xl mb-2">📱</div>
                            )}
                            <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">{deviceName}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{deviceData.storage} • {deviceData.color}</p>
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-att-blue">{deviceData.monthlyPayment}/mo</div>
                              <div className="text-xs text-slate-500">${parseFloat(deviceData.downPayment.replace('$', ''))} down</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add-ons */}
                <div>
                  <div 
                    className="flex items-center justify-between mb-4 cursor-pointer"
                    onClick={() => toggleSection('addOns')}
                  >
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Add Protection & Features</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {currentQuote.addOns.length} selected
                      </span>
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        {collapsedSections.addOns ? '▼' : '▲'}
                      </button>
                    </div>
                  </div>
                  {!collapsedSections.addOns && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(PRODUCT_CATALOG.Mobile.addOns).slice(0, 6).map(([addonName, addonData]) => {
                        const isSelected = currentQuote.addOns.some(addon => addon.name === addonName);
                        return (
                          <div 
                            key={addonName} 
                            className={`bg-white dark:bg-slate-700 rounded-lg border p-3 hover:border-att-blue transition-colors cursor-pointer ${
                              isSelected ? 'border-att-blue bg-att-blue/5' : 'border-slate-200 dark:border-slate-600'
                            }`}
                            onClick={() => toggleAddOn(addonName, addonData)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-800 dark:text-white text-sm">{addonName}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{addonData.description}</p>
                              </div>
                              <div className="text-sm font-bold text-att-blue">{addonData.price}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Default View - Show sample content */
              <div className="space-y-6">
                {/* Plan Selection */}
                <div className="mb-6">
                  <div 
                    className="flex items-center justify-between mb-4 cursor-pointer"
                    onClick={() => toggleSection('plans')}
                  >
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Select Your Plan</h3>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                      {collapsedSections.plans ? '▼' : '▲'}
                    </button>
                  </div>
                  {!collapsedSections.plans && (
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(PRODUCT_CATALOG.Mobile.plans).slice(0, 6).map(([planName, planData]) => (
                        <div key={planName} className="bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 p-4 hover:border-att-blue transition-colors cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-800 dark:text-white">{planName}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{planData.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-att-blue">{planData.price}</div>
                              <div className="text-xs text-slate-500">per line</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Device Selection */}
                <div className="mb-6">
                  <div 
                    className="flex items-center justify-between mb-4 cursor-pointer"
                    onClick={() => toggleSection('devices')}
                  >
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Choose Your Device</h3>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                      {collapsedSections.devices ? '▼' : '▲'}
                    </button>
                  </div>
                  {!collapsedSections.devices && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(PRODUCT_CATALOG.Mobile.devices).slice(0, 8).map(([deviceName, deviceData]) => (
                        <div key={deviceName} className="bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 p-4 hover:border-att-blue transition-colors cursor-pointer">
                          <div className="text-center">
                            {deviceData.image ? (
                              <img 
                                src={deviceData.image} 
                                alt={deviceName}
                                className="w-16 h-16 mx-auto mb-2 object-contain rounded-lg"
                              />
                            ) : (
                              <div className="text-3xl mb-2">📱</div>
                            )}
                            <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">{deviceName}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{deviceData.storage} • {deviceData.color}</p>
                            <div className="space-y-1">
                              <div className="text-sm font-bold text-att-blue">{deviceData.monthlyPayment}/mo</div>
                              <div className="text-xs text-slate-500">${parseFloat(deviceData.downPayment.replace('$', ''))} down</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add-ons */}
                <div className="mb-6">
                  <div 
                    className="flex items-center justify-between mb-4 cursor-pointer"
                    onClick={() => toggleSection('addOns')}
                  >
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Add Protection & Features</h3>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                      {collapsedSections.addOns ? '▼' : '▲'}
                    </button>
                  </div>
                  {!collapsedSections.addOns && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(PRODUCT_CATALOG.Mobile.addOns).slice(0, 6).map(([addonName, addonData]) => (
                        <div key={addonName} className="bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 p-3 hover:border-att-blue transition-colors cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-800 dark:text-white text-sm">{addonName}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{addonData.description}</p>
                            </div>
                            <div className="text-sm font-bold text-att-blue">{addonData.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Quote Summary */}
        <div className="w-full lg:w-1/2 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
          <div className="p-4">
            {/* Quote Summary Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Quote Summary</h2>
              <div className="flex gap-2">
                {isBuildingQuote && (currentQuote.plan || currentQuote.device || currentQuote.addOns.length > 0) && (
                  <button
                    onClick={clearQuote}
                    className="px-3 py-1 bg-slate-500 text-white rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors"
                  >
                    Clear Quote
                  </button>
                )}
                {isBuildingQuote && currentQuote.plan && (
                  <button className="px-3 py-1 bg-orange-500 text-white rounded-lg text-sm font-medium">
                    Save Quote 💾
                  </button>
                )}
              </div>
            </div>

            {/* Dynamic Quote Summary */}
            <div className="space-y-4">
              {isBuildingQuote && (currentQuote.plan || currentQuote.device || currentQuote.addOns.length > 0) ? (
                /* Live Quote Summary */
                <>
                  {/* Plan Summary */}
                  {currentQuote.plan && (
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-slate-800 dark:text-white">{currentQuote.plan.name}</h3>
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">▼</button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Monthly Plan Cost</span>
                          <span className="font-semibold text-slate-800 dark:text-white">{currentQuote.plan.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{currentQuote.plan.description}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Device Summary */}
                  {currentQuote.device && (
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                      <div className="flex items-center gap-3 mb-3">
                        {currentQuote.device.image ? (
                          <img 
                            src={currentQuote.device.image} 
                            alt={currentQuote.device.name}
                            className="w-12 h-12 object-contain rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                            <span className="text-xl">📱</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800 dark:text-white">{currentQuote.device.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{currentQuote.device.storage} • {currentQuote.device.color}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Monthly Device Payment</span>
                          <span className="font-semibold text-slate-800 dark:text-white">{currentQuote.device.monthlyPayment}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">One-time Down Payment</span>
                          <span className="font-semibold text-slate-800 dark:text-white">{currentQuote.device.downPayment}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add-ons Summary */}
                  {currentQuote.addOns.length > 0 && (
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                      <h4 className="font-medium text-slate-800 dark:text-white mb-3">Protection & Features</h4>
                      <div className="space-y-2">
                        {currentQuote.addOns.map((addon, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-400">{addon.name}</span>
                            <span className="font-semibold text-slate-800 dark:text-white">{addon.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Total Summary */}
                  <div className="bg-gradient-to-r from-att-blue to-att-blue-light rounded-lg p-4 text-white">
                    <h4 className="font-semibold mb-3">Monthly Total</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm opacity-90">Plan + Device + Add-ons</span>
                        <span className="font-bold text-lg">${calculateQuoteTotals().totalMonthly.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm opacity-90">One-time Costs</span>
                        <span className="font-semibold">${calculateQuoteTotals().totalOneTime.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-white border-opacity-20 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">First Month Total</span>
                          <span className="font-bold text-xl">${calculateQuoteTotals().totalFirstMonth.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : isBuildingQuote ? (
                /* Empty State when Building Quote */
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">No Quote Items Selected</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Select a plan, device, or add-ons to see your quote summary here.
                  </p>
                </div>
              ) : (
                /* Sample Quote */
                <>
                  {/* Plan Summary */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-800 dark:text-white">T-Mobile Go5G Plus</h3>
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">▼</button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Monthly Plan Cost</span>
                        <span className="font-semibold text-slate-800 dark:text-white">$90.00</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Unlimited talk, text & data with Netflix & Apple TV+</span>
                      </div>
                    </div>
                  </div>

                  {/* Device Summary */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src="https://i.ibb.co/HTzSdF1C/i-Phone16-Pro-Max.jpg" 
                        alt="iPhone 16 Pro Max"
                        className="w-12 h-12 object-contain rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800 dark:text-white">iPhone 16 Pro Max</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">256GB • Natural Titanium</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Monthly Device Payment</span>
                        <span className="font-semibold text-slate-800 dark:text-white">$45.83</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">One-time Down Payment</span>
                        <span className="font-semibold text-slate-800 dark:text-white">$199.99</span>
                      </div>
                    </div>
                  </div>

                  {/* Add-ons Summary */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <h4 className="font-medium text-slate-800 dark:text-white mb-3">Protection & Features</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">T-Mobile Protection Plus</span>
                        <span className="font-semibold text-slate-800 dark:text-white">$11.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">T-Mobile JUMP!</span>
                        <span className="font-semibold text-slate-800 dark:text-white">$12.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Summary */}
                  <div className="bg-gradient-to-r from-att-blue to-att-blue-light rounded-lg p-4 text-white">
                    <h4 className="font-semibold mb-3">Monthly Total</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm opacity-90">Plan + Device + Add-ons</span>
                        <span className="font-bold text-lg">$158.83</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm opacity-90">One-time Costs</span>
                        <span className="font-semibold">$199.99</span>
                      </div>
                      <div className="border-t border-white border-opacity-20 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">First Month Total</span>
                          <span className="font-bold text-xl">$358.82</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* T-Mobile Benefits */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <h4 className="font-medium text-slate-800 dark:text-white mb-3">T-Mobile Benefits</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">America's Largest 5G Network</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Netflix on Us</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Apple TV+ on Us</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">No Annual Service Contracts</span>
                  </div>
                </div>
              </div>
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
}

export default App;
