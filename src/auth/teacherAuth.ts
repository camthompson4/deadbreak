import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET!;
const REGISTRATION_CODE_SALT = process.env.REGISTRATION_CODE_SALT || 'default-salt';

interface DecodedToken {
  email: string;
  role: string;
  uid: string;
  iat: number;
  exp: number;
}

interface TeacherCredentials {
  email: string;
  uid: string;
  registrationCode: string;
}

export class TeacherAuthService {
  private static instance: TeacherAuthService;
  private registeredTeachers: Set<string>;
  private failedAttempts: Map<string, { count: number; lastAttempt: number }>;
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  private constructor() {
    this.registeredTeachers = new Set();
    this.failedAttempts = new Map();
  }

  static getInstance(): TeacherAuthService {
    if (!TeacherAuthService.instance) {
      TeacherAuthService.instance = new TeacherAuthService();
    }
    return TeacherAuthService.instance;
  }

  async registerTeacher(credentials: TeacherCredentials): Promise<string> {
    // Check for lockout
    if (this.isLockedOut(credentials.email)) {
      throw new Error('Account temporarily locked. Please try again later.');
    }

    try {
      // Verify registration code with timing-safe comparison
      if (!this.verifyRegistrationCode(credentials.registrationCode)) {
        this.recordFailedAttempt(credentials.email);
        throw new Error('Invalid registration code');
      }

      // Check if already registered
      if (this.registeredTeachers.has(credentials.email)) {
        throw new Error('Email already registered');
      }

      // Register teacher
      this.registeredTeachers.add(credentials.email);

      // Create token with additional security measures
      return this.createSecureToken(credentials);
    } catch (error) {
      throw error;
    }
  }

  private isLockedOut(email: string): boolean {
    const attempts = this.failedAttempts.get(email);
    if (!attempts) return false;

    const now = Date.now();
    if (attempts.count >= this.MAX_FAILED_ATTEMPTS && 
        now - attempts.lastAttempt < this.LOCKOUT_DURATION) {
      return true;
    }

    // Reset if lockout period has passed
    if (now - attempts.lastAttempt >= this.LOCKOUT_DURATION) {
      this.failedAttempts.delete(email);
    }

    return false;
  }

  private recordFailedAttempt(email: string): void {
    const attempts = this.failedAttempts.get(email) || { count: 0, lastAttempt: 0 };
    this.failedAttempts.set(email, {
      count: attempts.count + 1,
      lastAttempt: Date.now()
    });
  }

  private verifyRegistrationCode(code: string): boolean {
    const expectedCode = process.env.TEACHER_REGISTRATION_CODE;
    if (!expectedCode) throw new Error('Registration code not configured');

    // Use timing-safe comparison
    return crypto.timingSafeEqual(
      Buffer.from(code),
      Buffer.from(expectedCode)
    );
  }

  private createSecureToken(credentials: TeacherCredentials): string {
    return jwt.sign(
      { 
        email: credentials.email,
        role: 'teacher',
        uid: credentials.uid,
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { 
        expiresIn: '7d',
        algorithm: 'HS512'
      }
    );
  }

  async verifyToken(token: string): Promise<DecodedToken> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        algorithms: ['HS512']
      }) as DecodedToken;

      // Additional validation
      if (!this.registeredTeachers.has(decoded.email)) {
        throw new Error('Teacher not registered');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  isTeacherRegistered(email: string): boolean {
    return this.registeredTeachers.has(email);
  }
}

interface TeacherCredentials {
  email: string;
  password: string;
  role: 'admin' | 'teacher';
  permissions: string[];
}

class TeacherAuthController {
  async login(credentials: TeacherCredentials): Promise<string> {
    // ... authentication logic
    const authToken = await this.generateAuthToken(credentials);
    return authToken;
  }
  
  async validatePermissions(teacherId: string, action: string): Promise<boolean> {
    // ... permission validation
    const isAuthorized = await this.checkPermissions(teacherId, action);
    return isAuthorized;
  }

  private async generateAuthToken(credentials: TeacherCredentials): Promise<string> {
    // Implementation will use JWT
    return 'generated-token';
  }

  private async checkPermissions(teacherId: string, action: string): Promise<boolean> {
    // Implementation will check against database
    return true;
  }
} 