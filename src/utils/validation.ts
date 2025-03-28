export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (password.length < 12) {
    return { 
      isValid: false, 
      error: 'Password must be at least 12 characters long' 
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return { 
      isValid: false, 
      error: 'Password must include uppercase, lowercase, numbers, and special characters' 
    };
  }

  return { isValid: true };
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 255); // Limit length
} 