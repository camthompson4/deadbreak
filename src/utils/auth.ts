import { auth } from './firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import jwt from 'jsonwebtoken';

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
  'teacher@example.com',
  // Add more teacher emails here
];

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const role = AUTHORIZED_TEACHERS.includes(email) ? 'teacher' : 'student';
    
    const token = jwt.sign(
      { 
        email: userCredential.user.email, 
        role,
        uid: userCredential.user.uid 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

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

export async function signUp(email: string, password: string): Promise<AuthResponse> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    const token = jwt.sign(
      { 
        email: userCredential.user.email, 
        role: 'student',
        uid: userCredential.user.uid 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        email: email,
        role: 'student'
      }
    };
  } catch (error) {
    console.error('Sign up error:', error);
    throw new Error('Failed to create account');
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