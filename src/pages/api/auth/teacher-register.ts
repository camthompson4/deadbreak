import type { NextApiRequest, NextApiResponse } from 'next';
import { createTeacherToken, TeacherAuthService } from '../../../auth/teacherAuth';
import { applyRateLimit } from '../../../middleware/rateLimit';
import { validateEmail, validatePassword } from '../../../utils/validation';

// Move to secure environment variables
const ALLOWED_EMAIL_DOMAINS = new Set(['deadbreak.edu', 'deadbreak.com']);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Apply rate limiting
    await applyRateLimit(req, res);

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, uid, registrationCode, password } = req.body;

    // Enhanced input validation
    if (!email || !uid || !registrationCode || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format and domain
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const emailDomain = email.split('@')[1];
    if (!ALLOWED_EMAIL_DOMAINS.has(emailDomain)) {
      return res.status(403).json({ 
        error: 'Registration is only allowed with authorized email domains' 
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    // Use singleton service for registration
    const teacherAuth = TeacherAuthService.getInstance();
    
    try {
      const token = await teacherAuth.registerTeacher({
        email,
        uid,
        registrationCode
      });

      // Log successful registration (in production, use proper logging service)
      console.log(`Teacher registered successfully: ${email}`);

      res.status(200).json({ token });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invalid registration code') {
          return res.status(403).json({ error: 'Invalid registration code' });
        }
        if (error.message === 'Email already registered') {
          return res.status(409).json({ error: 'Email already registered' });
        }
      }
      throw error;
    }
  } catch (error) {
    console.error('Teacher registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
} 