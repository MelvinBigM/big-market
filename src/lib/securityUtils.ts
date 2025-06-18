
import { EnhancedRateLimiter, logSecurityEvent, SecurityEventTypes } from './enhancedRateLimiting';
import { validateEmail, validatePassword, sanitizeInput } from './validation';

// Security utility functions for common operations
export class SecurityUtils {
  
  // Validate and secure login attempt
  static async validateLoginAttempt(email: string, password: string): Promise<{
    isValid: boolean;
    errors: string[];
    canProceed: boolean;
  }> {
    const errors: string[] = [];
    
    // Input validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error!);
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.push(passwordValidation.error!);
    }
    
    // Rate limiting check
    const rateLimitCheck = await EnhancedRateLimiter.checkLoginAttempt(
      email,
      undefined, // IP address would be available server-side
      navigator.userAgent
    );
    
    if (!rateLimitCheck.allowed) {
      errors.push(`Trop de tentatives de connexion. Réessayez dans ${Math.ceil((rateLimitCheck.remainingTime || 0) / 1000)} secondes.`);
      
      // Log rate limit violation
      await logSecurityEvent(SecurityEventTypes.LOGIN_RATE_LIMIT, {
        email: sanitizeInput(email),
        remaining_time: rateLimitCheck.remainingTime
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      canProceed: rateLimitCheck.allowed
    };
  }
  
  // Secure form data processing
  static sanitizeFormData<T extends Record<string, any>>(data: T): T {
    const sanitized = { ...data };
    
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (typeof value === 'string') {
        (sanitized as any)[key] = sanitizeInput(value);
      }
    });
    
    return sanitized;
  }
  
  // Check if user action is permitted
  static async checkActionPermission(
    userId: string, 
    action: string, 
    resourceId?: string
  ): Promise<boolean> {
    // Check rate limiting for the specific action
    const allowed = EnhancedRateLimiter.checkApiRateLimit(userId, action);
    
    if (!allowed) {
      await logSecurityEvent(SecurityEventTypes.SUSPICIOUS_ACTIVITY, {
        user_id: userId,
        action,
        resource_id: resourceId,
        reason: 'rate_limit_exceeded'
      });
      return false;
    }
    
    // Log legitimate action
    await logSecurityEvent(SecurityEventTypes.DATA_ACCESS, {
      user_id: userId,
      action,
      resource_id: resourceId
    });
    
    return true;
  }
  
  // Generate secure random tokens
  static generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  // Validate session integrity
  static validateSession(): boolean {
    // Check if session is within expected parameters
    const sessionStart = sessionStorage.getItem('session_start');
    if (!sessionStart) {
      return false;
    }
    
    const startTime = parseInt(sessionStart);
    const now = Date.now();
    const maxSessionTime = 8 * 60 * 60 * 1000; // 8 hours
    
    if (now - startTime > maxSessionTime) {
      sessionStorage.removeItem('session_start');
      return false;
    }
    
    return true;
  }
  
  // Initialize security session
  static initializeSecureSession(): void {
    sessionStorage.setItem('session_start', Date.now().toString());
    sessionStorage.setItem('session_token', this.generateSecureToken());
  }
  
  // Clear security session
  static clearSecureSession(): void {
    sessionStorage.removeItem('session_start');
    sessionStorage.removeItem('session_token');
  }
}

// Security constants
export const SECURITY_CONSTANTS = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_COOLDOWN_MINUTES: 15,
  SESSION_TIMEOUT_HOURS: 8,
  MAX_ADMIN_ACTIONS_PER_MINUTE: 30,
  MAX_ACCESS_REQUESTS_PER_HOUR: 3,
  MAX_API_CALLS_PER_MINUTE: 100
} as const;

// Security event severity levels
export enum SecuritySeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Get security event severity
export const getSecurityEventSeverity = (eventType: string): SecuritySeverity => {
  switch (eventType) {
    case SecurityEventTypes.SUSPICIOUS_ACTIVITY:
    case 'authentication_error':
      return SecuritySeverity.CRITICAL;
    case SecurityEventTypes.LOGIN_RATE_LIMIT:
    case 'unauthorized_access_attempt':
      return SecuritySeverity.HIGH;
    case SecurityEventTypes.LOGIN_FAILURE:
    case 'data_validation_error':
      return SecuritySeverity.MEDIUM;
    case SecurityEventTypes.LOGIN_SUCCESS:
    case SecurityEventTypes.DATA_ACCESS:
      return SecuritySeverity.LOW;
    default:
      return SecuritySeverity.MEDIUM;
  }
};
