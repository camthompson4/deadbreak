import { auth } from './firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  getAuth
} from 'firebase/auth';
import jwt from 'jsonwebtoken';
import { app } from './firebase';

export interface AuthResponse {
  token: string;
  user: {
    email: string;
    role: 'teacher' | 'student';
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// List of authorized teacher emails
const AUTHORIZED_TEACHERS = [
  'cameronbrown1357@gmail.com',  // Add your email here
  'teacher@example.com'
];

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    console.log('Attempting login for:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Firebase auth successful');
    
    const role = AUTHORIZED_TEACHERS.includes(email) ? 'teacher' : 'student';
    console.log('Assigned role:', role);
    
    const token = jwt.sign(
      { 
        email: userCredential.user.email, 
        role,
        uid: userCredential.user.uid 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('JWT created successfully');

    return {
      token,
      user: {
        email: email,
        role
      }
    };
  } catch (error) {
    console.error('Sign in error:', error);
    throw new Error('Invalid credentials');
  }
}

export async function signUp(email: string, password: string) {
  try {
    console.log('Initializing Firebase auth...');
    const auth = getAuth(app);
    console.log('Firebase auth initialized');

    console.log('Creating user account...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User account created:', userCredential.user.uid);

    return {
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      }
    };
  } catch (error) {
    console.error('Firebase signup error:', error);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
} 