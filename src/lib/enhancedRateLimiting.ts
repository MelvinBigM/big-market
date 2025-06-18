
import { rateLimiter, checkLoginRateLimit, getLoginRateLimitRemainingTime } from './rateLimiting';
import { supabase } from '@/integrations/supabase/client';

// Enhanced rate limiting with security event logging
export class EnhancedRateLimiter {
  // Login attempt tracking with security logging
  static async checkLoginAttempt(email: string, ipAddress?: string, userAgent?: string): Promise<{ allowed: boolean; remainingTime?: number }> {
    const allowed = checkLoginRateLimit(email);
    
    if (!allowed) {
      // Log failed rate limit attempt
      try {
        await supabase.rpc('log_security_event', {
          event_type: 'rate_limit_exceeded',
          user_id: null,
          ip_address: ipAddress || null,
          user_agent: userAgent || null,
          details: { 
            type: 'login_attempts',
            email: email,
            timestamp: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Failed to log security event:', error);
      }
      
      return {
        allowed: false,
        remainingTime: getLoginRateLimitRemainingTime(email)
      };
    }
    
    return { allowed: true };
  }

  // API rate limiting for admin actions
  static checkAdminActionRateLimit(userId: string, action: string): boolean {
    // Allow 30 admin actions per minute per user
    return rateLimiter.isAllowed(`admin_action:${userId}:${action}`, 30, 60 * 1000);
  }

  // Rate limiting for access requests
  static checkAccessRequestRateLimit(userId: string): boolean {
    // Allow 3 access requests per hour per user
    return rateLimiter.isAllowed(`access_request:${userId}`, 3, 60 * 60 * 1000);
  }

  // General API rate limiting
  static checkApiRateLimit(userId: string, endpoint: string): boolean {
    // Allow 100 API calls per minute per user per endpoint
    return rateLimiter.isAllowed(`api:${userId}:${endpoint}`, 100, 60 * 1000);
  }
}

// Security event types for consistent logging
export const SecurityEventTypes = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  LOGIN_RATE_LIMIT: 'login_rate_limit_exceeded',
  ADMIN_ACTION: 'admin_action',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  DATA_ACCESS: 'data_access',
  AUTHENTICATION_ERROR: 'authentication_error'
} as const;

// Utility function to log security events from client side
export const logSecurityEvent = async (
  eventType: string,
  details?: Record<string, any>,
  userId?: string
) => {
  try {
    await supabase.rpc('log_security_event', {
      event_type: eventType,
      user_id: userId || null,
      ip_address: null, // IP will be captured server-side if needed
      user_agent: navigator.userAgent,
      details: details || null
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};
