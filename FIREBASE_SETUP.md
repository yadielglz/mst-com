# Firebase Setup Guide for AT&T Commission Tracker

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "att-commission-tracker")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click "Email/Password" and enable it
5. Click "Save"

## Step 3: Create Firestore Database

1. In your Firebase project, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Choose a location close to your users
5. Click "Done"

## Step 4: Get Your Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "att-commission-tracker-web")
6. Copy the firebaseConfig object

## Step 5: Update Your Firebase Configuration

1. Open `src/firebase.js` in your project
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 6: Set Up Security Rules (Optional but Recommended)

1. In Firestore Database, go to the "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /sales/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /userSettings/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /goals/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

3. Click "Publish"

## Step 7: Test Your Setup

1. Run your development server: `npm start`
2. Open the app in your browser
3. You should see an authentication modal
4. Create a new account or sign in
5. Try adding a sale to test the Firebase integration

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check that your API key is correct in `src/firebase.js`

2. **"Firebase: Error (auth/operation-not-allowed)"**
   - Make sure Email/Password authentication is enabled in Firebase Console

3. **"Firebase: Error (firestore/permission-denied)"**
   - Check your Firestore security rules
   - Make sure you're signed in before trying to access data

4. **"Firebase: Error (firestore/unavailable)"**
   - Check your internet connection
   - Verify your Firestore database is created and active

### Getting Help:

- Check the [Firebase Documentation](https://firebase.google.com/docs)
- Look at the browser console for detailed error messages
- Verify all configuration values are correct

## Next Steps

Once Firebase is working:

1. **Deploy to Production**: Update your Firebase config for production
2. **Add More Features**: Consider adding push notifications, offline support
3. **Monitor Usage**: Check Firebase Console for usage analytics
4. **Scale Up**: Consider upgrading to a paid plan if you exceed free limits

## Security Notes

- Never commit your Firebase config to public repositories
- Use environment variables for production deployments
- Regularly review your security rules
- Monitor your Firebase usage and costs 