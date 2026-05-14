import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { status: 429, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { status: 429, message: "Upload limit exceeded, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: 429, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
