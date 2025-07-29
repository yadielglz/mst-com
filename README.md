# T-Mobile Commission Tracker

A modern React-based web application for T-Mobile sales representatives to track their commissions, set performance goals, and monitor their sales progress.

## 🚀 Features

### Core Functionality
- **Sales Tracking**: Log and manage individual sales with customer details, services, and commission calculations
- **Goal Setting**: Set and track weekly and monthly goals for Mobile, Internet, and TV services
- **Progress Monitoring**: Visual progress bars and real-time goal tracking
- **Commission Calculator**: Manual commission entry for T-Mobile's product catalog

### Enhanced Features (New in React Version)
1. **Advanced Analytics Dashboard**: Enhanced visual metrics with icons and better data presentation
2. **Real-time Weather Integration**: Live weather updates with temperature unit toggle
3. **Export/Import Functionality**: Backup and restore your data with JSON export/import
4. **Improved Search & Filtering**: Enhanced search capabilities with real-time filtering
5. **Responsive Design**: Optimized for both desktop and mobile devices
6. **Dark Mode Support**: Toggle between light and dark themes
7. **PIN Lock Security**: Optional PIN protection for your data
8. **Toast Notifications**: User-friendly feedback for all actions

### Technical Improvements
- **React 18**: Modern React with hooks and functional components
- **Component Architecture**: Modular, reusable components
- **Local Storage**: Persistent data storage in browser
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Optimized rendering and state management

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mst-com.git
   cd mst-com
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

## 📱 Usage

### Getting Started
1. **First Time Setup**: Complete the onboarding process to set your initial goals
2. **Log Sales**: Click "Log New Sale" to add customer sales with services
3. **Track Progress**: Monitor your progress against weekly and monthly goals
4. **Manage Data**: Use export/import features to backup your data

### Key Features
- **Sales Logging**: Add customer sales with multiple services per sale
- **Goal Tracking**: Set and monitor performance goals
- **Data Management**: Export/import your data for backup
- **Settings**: Customize theme, temperature units, and profile

## 🎨 Product Catalog

The app includes a comprehensive T-Mobile product catalog with current plans, pricing, and equipment:

### Mobile Services
- **Unlimited Plans**: Essentials ($60/mo), Magenta ($70/mo), Magenta MAX ($85/mo)
- **Go5G Plans**: Go5G ($75/mo), Go5G Plus ($90/mo), Go5G Next ($95/mo)
- **Special Plans**: Military ($55/mo), 55+ ($55/mo), Prepaid ($40-50/mo)
- **BYOD Plans**: Available for all unlimited plans
- **Device Upgrades**: Various pricing options

### Mobile Devices
- **iPhone Series**: iPhone 15 Pro Max ($1199.99), iPhone 15 Pro ($999.99), iPhone 15 ($799.99)
- **Samsung Series**: Galaxy S24 Ultra ($1299.99), Galaxy S24+ ($999.99), Galaxy S24 ($799.99)
- **Google Series**: Pixel 8 Pro ($999.99), Pixel 8 ($699.99)
- **Other Brands**: OnePlus 12 ($799.99)

### Mobile Add-ons
- **Protection**: Basic ($7/mo), Plus ($11/mo), Premium ($15/mo)
- **JUMP!**: JUMP! ($12/mo), JUMP! On Demand ($10/mo)
- **Plus Features**: Plus ($15/mo), Plus Up ($20/mo)
- **International**: International ($15/mo), Global Plus ($50/mo)
- **DIGITS**: Data with DIGITS ($10/mo)

### Internet Services
- **Home Internet**: Basic ($50/mo), Plus ($70/mo), Lite ($30/mo)
- **5G Home Internet**: $50/mo
- **Business Internet**: $70/mo
- **Equipment**: 5G Gateway, 4G LTE Gateway, Business Gateway (all $0)

### TV Services
- **TVision Plans**: Basic ($40/mo), VIBE ($10/mo)
- **LIVE TV**: LIVE TV ($64.99/mo), LIVE TV+ ($84.99/mo)
- **CHANNELS**: $29.99/mo
- **Add-ons**: Premium ($9.99/mo), Sports ($9.99/mo), Entertainment ($9.99/mo)

## 🔧 Configuration

### Environment Variables
No environment variables required - the app runs entirely client-side.

### Customization
- Modify `src/data/productCatalog.js` to update commission rates
- Update `src/styles.css` for custom styling
- Configure goals and settings through the app interface

## 📊 Data Structure

### Sales Data
```javascript
{
  id: number,
  customerName: string,
  saleDate: string,
  services: Array<Service>,
  totalCommission: number,
  notes: string
}
```

### Goals Data
```javascript
{
  weekly: { mobile: number, internet: number, tv: number },
  monthly: { mobile: number, internet: number, tv: number }
}
```

## 🔒 Privacy & Security

- **Local Storage**: All data is stored locally in your browser
- **No Server**: No data is transmitted to external servers
- **PIN Protection**: Optional PIN lock for additional security
- **Export Control**: Full control over your data export/import

## 🚀 Deployment

### GitHub Pages
1. Update `homepage` in `package.json` with your repository URL
2. Run `npm run deploy`
3. Configure GitHub Pages in repository settings

### Other Platforms
- **Netlify**: Connect repository and build with `npm run build`
- **Vercel**: Import repository and deploy automatically
- **Firebase**: Use Firebase Hosting for deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This is an assistant tool for tracking purposes only. No information is transmitted over the internet. All data is stored locally in your browser and will be lost if the page is refreshed or closed. Any discrepancies in official commission calculations must be handled with HR or your direct supervisor.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the app's help section
- Contact your T-Mobile supervisor for official commission questions

## 🔄 Changelog

### Version 2.1.0 (T-Mobile Version)
- Switched from AT&T to T-Mobile product catalog
- Removed automatic commission calculation
- Added manual commission entry for each service
- Updated branding throughout the application
- Updated product catalog to T-Mobile services

### Version 2.0.0 (React Version)
- Complete rewrite in React 18
- Enhanced UI/UX with modern design
- Added export/import functionality
- Improved mobile responsiveness
- Added dark mode support
- Enhanced search and filtering
- Real-time weather integration
- Toast notifications
- PIN lock security

### Version 1.0.0 (Original HTML Version)
- Basic sales tracking
- Goal setting and monitoring
- Local storage persistence
- Responsive design 