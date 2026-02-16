import { Request, Response, NextFunction } from "express";

// In-memory failed login tracker
const failedLoginAttempts: Record<string, { count: number; lastAttempt: number }> = {};
const MAX_ATTEMPTS = 2;
const BLOCK_TIME = 5 * 60 * 1000; // 5 minutes

export const loginLimiter = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const attempts = failedLoginAttempts[email] || { count: 0, lastAttempt: 0 };
    const now = Date.now();

    // Block if too many failed attempts
    if (attempts.count >= MAX_ATTEMPTS && now - attempts.lastAttempt < BLOCK_TIME) {
        return res.status(429).json({
            message: "Too many failed login attempts. Try again later."
        });
    }

    // Pass attempts info to controller via request
    (req as any).loginAttempts = attempts;
    next();
};

// Helper to record failed login
export const recordFailedLogin = (email: string) => {
    const now = Date.now();
    const attempts = failedLoginAttempts[email] || { count: 0, lastAttempt: 0 };
    failedLoginAttempts[email] = { count: attempts.count + 1, lastAttempt: now };
};

// Helper to reset after successful login
export const resetFailedLogin = (email: string) => {
    failedLoginAttempts[email] = { count: 0, lastAttempt: 0 };
};
