
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();

  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.attempts.get(key);

    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      this.attempts.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (entry.count >= maxAttempts) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingTime(key: string): number {
    const entry = this.attempts.get(key);
    if (!entry) return 0;
    
    const now = Date.now();
    return Math.max(0, entry.resetTime - now);
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.attempts.entries()) {
      if (now > entry.resetTime) {
        this.attempts.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Clean up expired entries every 5 minutes
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);

export const checkLoginRateLimit = (email: string): boolean => {
  // Allow 5 login attempts per 15 minutes per email
  return rateLimiter.isAllowed(`login:${email}`, 5, 15 * 60 * 1000);
};

export const getLoginRateLimitRemainingTime = (email: string): number => {
  return rateLimiter.getRemainingTime(`login:${email}`);
};
