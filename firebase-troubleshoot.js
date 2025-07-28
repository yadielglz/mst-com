// Firebase Troubleshooting Script
// Run this in your browser console to diagnose Firebase issues

console.log('🔍 Firebase Troubleshooting Script');
console.log('=====================================');

// Check if Firebase is loaded
if (typeof firebase === 'undefined') {
  console.error('❌ Firebase is not loaded');
} else {
  console.log('✅ Firebase is loaded');
}

// Check authentication state
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('✅ User is authenticated:', user.email);
    console.log('User ID:', user.uid);
    
    // Test Firestore permissions
    testFirestorePermissions(user.uid);
  } else {
    console.log('❌ No user is authenticated');
  }
});

async function testFirestorePermissions(userId) {
  console.log('\n🧪 Testing Firestore Permissions...');
  
  try {
    // Test reading from sales collection
    const salesQuery = await firebase.firestore()
      .collection('sales')
      .where('userId', '==', userId)
      .limit(1)
      .get();
    
    console.log('✅ Can read from sales collection');
    
    // Test writing to sales collection
    const testSale = {
      customerName: 'Test Customer',
      saleDate: new Date().toISOString().split('T')[0],
      services: [{
        category: 'Mobile',
        planName: 'Test Plan',
        manualCommission: 10
      }],
      userId: userId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await firebase.firestore()
      .collection('sales')
      .add(testSale);
    
    console.log('✅ Can write to sales collection');
    
    // Clean up test document
    await docRef.delete();
    console.log('✅ Can delete from sales collection');
    
    console.log('\n🎉 All Firestore permissions are working correctly!');
    
  } catch (error) {
    console.error('❌ Firestore permission error:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'permission-denied') {
      console.log('\n💡 Solution: Update your Firestore security rules');
      console.log('Go to Firebase Console → Firestore Database → Rules');
      console.log('Make sure you have the correct security rules published');
    }
  }
}

// Check Firebase config
console.log('\n📋 Firebase Configuration:');
console.log('Project ID:', firebase.app().options.projectId);
console.log('Auth Domain:', firebase.app().options.authDomain);

console.log('\n📖 To run this script:');
console.log('1. Open browser console (F12)');
console.log('2. Copy and paste this entire script');
console.log('3. Press Enter to run'); 