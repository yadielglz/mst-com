# Firebase Setup Guide for AT&T Commission Tracker

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "att-commission-tracker" (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" authentication
3. Click "Save"

## 3. Create Firestore Database

1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (we'll add security rules later)
3. Select a location close to your users
4. Click "Done"

## 4. Configure Security Rules

**IMPORTANT**: Replace the default security rules with these secure rules:

1. Go to "Firestore Database" → "Rules"
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Sales collection - users can only access their own sales
    match /sales/{document} {
      allow read, write: if isAuthenticated() && 
        (resource == null || resource.data.userId == request.auth.uid);
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // User settings collection - users can only access their own settings
    match /userSettings/{document} {
      allow read, write: if isAuthenticated() && 
        (document == request.auth.uid || 
         (resource != null && resource.data.userId == request.auth.uid));
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Goals collection - users can only access their own goals
    match /goals/{document} {
      allow read, write: if isAuthenticated() && 
        (resource == null || resource.data.userId == request.auth.uid);
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click "Publish"

## 5. Configure Firestore Indexes

After setting up your database, you must create an index for the sales query to work. Firebase will often provide a direct link in the browser's developer console to create this automatically.

1.  Run the app and sign in.
2.  Open the developer console (F12) and look for a Firebase error that says "The query requires an index."
3.  Click the link in the error message to automatically create the required index.

**Manual Creation:**

If you can't use the automatic link, create the index manually:

1.  Go to **Firestore Database** → **Indexes**.
2.  Click **"Add Index"**.
3.  **Collection ID:** `sales`
4.  **Fields to index:**
    -   `userId` → **Ascending**
    -   `createdAt` → **Descending**
5.  **Query scopes:** Collection
6.  Click **"Create Index"**.

## 6. Get Firebase Configuration

1. Go to "Project settings" (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → "Web"
4. Register app with name: "AT&T Commission Tracker"
5. Copy the configuration object

## 7. Update Application Configuration

1. Open `src/firebase.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## 8. Test the Setup

1. Start your application: `npm start`
2. Try to sign up with a new account
3. Test logging a sale
4. Verify data appears in Firestore Database

## Troubleshooting

### "Missing or insufficient permissions" Error

If you get this error, check:

1. **Security Rules**: Make sure you've published the security rules above
2. **User Authentication**: Ensure the user is properly signed in
3. **Collection Names**: Verify the collections are named exactly: `sales`, `userSettings`, `goals`
4. **User ID Field**: The service automatically adds `userId` field to documents

### Common Issues

- **Test Mode**: If you left the database in test mode, it will work but is insecure
- **Location**: Make sure you selected a database location close to your users
- **Authentication**: Ensure Email/Password authentication is enabled

## Security Notes

- The rules above ensure users can only access their own data
- Each document must have a `userId` field matching the authenticated user's UID
- The application automatically adds this field when creating documents
- Never share your Firebase config publicly in production

## Next Steps

Once setup is complete:
1. Test all functionality (sign up, log sales, view data)
2. Consider enabling additional authentication methods if needed
3. Set up monitoring and alerts in Firebase Console
4. Consider upgrading to a paid plan for production use 