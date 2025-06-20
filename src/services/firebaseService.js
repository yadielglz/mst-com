import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { db, auth } from '../firebase';

// Authentication functions
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signUpUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Sales functions
export const addSale = async (saleData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const saleWithMetadata = {
      ...saleData,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'sales'), saleWithMetadata);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getSales = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'sales'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const sales = [];
    querySnapshot.forEach((doc) => {
      sales.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, sales };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteSale = async (saleId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    await deleteDoc(doc(db, 'sales', saleId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateSale = async (saleId, saleData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const saleWithMetadata = {
      ...saleData,
      updatedAt: serverTimestamp()
    };

    await updateDoc(doc(db, 'sales', saleId), saleWithMetadata);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Real-time sales listener
export const subscribeToSales = (callback) => {
  const user = auth.currentUser;
  if (!user) return null;

  const q = query(
    collection(db, 'sales'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const sales = [];
    snapshot.forEach((doc) => {
      sales.push({ id: doc.id, ...doc.data() });
    });
    callback(sales);
  }, (error) => {
    console.error('Sales subscription error:', error);
  });
};

// User settings functions
export const saveUserSettings = async (settings) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const settingsWithMetadata = {
      ...settings,
      userId: user.uid,
      updatedAt: serverTimestamp()
    };

    // Use user's UID as document ID for settings
    await updateDoc(doc(db, 'userSettings', user.uid), settingsWithMetadata);
    return { success: true };
  } catch (error) {
    // If document doesn't exist, create it
    try {
      const user = auth.currentUser;
      const settingsWithMetadata = {
        ...settings,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'userSettings'), settingsWithMetadata);
      return { success: true };
    } catch (createError) {
      return { success: false, error: createError.message };
    }
  }
};

export const getUserSettings = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'userSettings'),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return { success: true, settings: null };
    }

    const settings = querySnapshot.docs[0].data();
    return { success: true, settings };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Goals functions
export const saveGoals = async (goals) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const goalsWithMetadata = {
      ...goals,
      userId: user.uid,
      updatedAt: serverTimestamp()
    };

    await updateDoc(doc(db, 'goals', user.uid), goalsWithMetadata);
    return { success: true };
  } catch (error) {
    // If document doesn't exist, create it
    try {
      const user = auth.currentUser;
      const goalsWithMetadata = {
        ...goals,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'goals'), goalsWithMetadata);
      return { success: true };
    } catch (createError) {
      return { success: false, error: createError.message };
    }
  }
};

export const getGoals = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'goals'),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return { success: true, goals: null };
    }

    const goals = querySnapshot.docs[0].data();
    return { success: true, goals };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 