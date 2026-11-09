import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDmihDphrCpjxwu-Q06jjnl3D7HU3zPmzA',
  authDomain: 'realtonypark-react-app.firebaseapp.com',
  projectId: 'realtonypark-react-app',
  storageBucket: 'realtonypark-react-app.firebasestorage.app',
  messagingSenderId: '610678422886',
  appId: '1:610678422886:web:919d4c9305b487b3a65ca7',
  databaseURL: 'https://realtonypark-react-app-default-rtdb.firebaseio.com',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
export const auth = getAuth(app);
