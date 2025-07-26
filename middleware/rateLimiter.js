const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Rate limiter cho scraping endpoints
const scrapingLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Quá nhiều request từ IP này, vui lòng thử lại sau.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip successful requests
  skipSuccessfulRequests: false,
  // Skip failed requests
  skipFailedRequests: false,
  // Custom key generator (optional)
  keyGenerator: (req) => {
    return req.ip;
  },
  // Custom handler for when limit is exceeded
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Quá nhiều request từ IP này, vui lòng thử lại sau.',
      retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000),
      limit: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000
    });
  }
});

// Rate limiter nghiêm ngặt hơn cho multiple URL scraping
const multipleScrapeLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 requests per hour for multiple scraping
  message: {
    success: false,
    message: 'Quá nhiều request cào nhiều URL từ IP này, vui lòng thử lại sau 1 giờ.',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Quá nhiều request cào nhiều URL từ IP này, vui lòng thử lại sau 1 giờ.',
      retryAfter: 3600,
      limit: 10,
      windowMs: 60 * 60 * 1000
    });
  }
});

// Rate limiter nhẹ hơn cho các API đọc dữ liệu
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs for read operations
  message: {
    success: false,
    message: 'Quá nhiều request đọc dữ liệu từ IP này, vui lòng thử lại sau.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  scrapingLimiter,
  multipleScrapeLimit,
  readLimiter
};