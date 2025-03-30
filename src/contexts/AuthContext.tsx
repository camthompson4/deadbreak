import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword as firebaseCreateUser,
  User as FirebaseUser
} from 'firebase/auth';

// Rename our custom user interface to avoid conflict
interface AuthUser {
  email: string | null;
  role: 'student' | 'teacher';
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: 'student' | 'teacher') => Promise<void>;
  register: (userData: StudentRegistrationData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<any>;
}

interface StudentRegistrationData {
  fullName: string;
  phoneNumber: string;
  email: string;
  ssnLast4: string;
  headshot?: File;
  optInAlerts: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const storedRole = localStorage.getItem('userRole');
        setUser({
          email: firebaseUser.email,
          role: (storedRole as 'student' | 'teacher') || 'student'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, role: 'student' | 'teacher') => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('userRole', role);
      setUser({ email: userCredential.user.email!, role });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: StudentRegistrationData) => {
    try {
      // Create temporary password (in production, you'd want to handle this differently)
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // Create Firebase user
      const userCredential = await firebaseCreateUser(
        auth, 
        userData.email, 
        tempPassword
      );

      // Store additional user data
      const response = await fetch('/api/students/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          uid: userCredential.user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register student');
      }

      // Set user state
      setUser({
        email: userData.email,
        role: 'student'
      });
      
      localStorage.setItem('userRole', 'student');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('userRole');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const createUserWithEmailAndPassword = async (email: string, password: string) => {
    try {
      const userCredential = await firebaseCreateUser(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading,
      createUserWithEmailAndPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 