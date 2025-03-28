import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCjcNKOVJegWdk7uO6_6d31QJbM6X8WI-0",
  authDomain: "dead-break-education.firebaseapp.com",
  projectId: "dead-break-education",
  storageBucket: "dead-break-education.appspot.com",
  messagingSenderId: "558582541396",
  appId: "1:558582541396:web:65b028f118ff31ffd1d1c1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }; 