import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCjcNKOVJegWdk7uO6_6d31QJbM6X8WI-0",
  authDomain: "dead-break-education.firebaseapp.com",
  projectId: "dead-break-education",
  storageBucket: "dead-break-education.firebasestorage.app",
  messagingSenderId: "558582541396",
  appId: "1:558582541396:web:65b028f118ff31ffd1d1c1",
  measurementId: "G-4TT2R2D7TQ"
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth }; 