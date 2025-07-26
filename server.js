const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { testConnection, initDatabase } = require('./config/database');
const scraperRoutes = require('./routes/scraper');
const { scrapingLimiter, multipleScrapeLimit, readLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:5500'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Apply rate limiting to specific routes
app.use('/api/scrape/multiple', multipleScrapeLimit);
app.use('/api/scrape', scrapingLimiter);
app.use('/api/data', readLimiter);

// API Routes
app.use('/api', scraperRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Web Scraper API đang hoạt động!',
    version: '1.0.0',
    endpoints: {
      scraping: {
        'POST /api/scrape': 'Cào dữ liệu từ một URL',
        'POST /api/scrape/multiple': 'Cào dữ liệu từ nhiều URL',
        'GET /api/health': 'Kiểm tra trạng thái scraper'
      },
      data: {
        'GET /api/data': 'Lấy tất cả dữ liệu (có phân trang)',
        'GET /api/data/search': 'Tìm kiếm dữ liệu',
        'GET /api/data/stats': 'Thống kê dữ liệu',
        'GET /api/data/:id': 'Lấy dữ liệu theo ID',
        'PUT /api/data/:id': 'Cập nhật dữ liệu',
        'DELETE /api/data/:id': 'Xóa dữ liệu',
        'DELETE /api/data/cleanup/old': 'Xóa dữ liệu cũ'
      }
    },
    documentation: {
      'Cào một URL': {
        method: 'POST',
        endpoint: '/api/scrape',
        body: {
          url: 'https://example.com',
          selectors: {
            title: 'h1',
            content: '.content'
          }
        }
      },
      'Cào nhiều URL': {
        method: 'POST',
        endpoint: '/api/scrape/multiple',
        body: {
          urls: ['https://example1.com', 'https://example2.com'],
          selectors: {
            title: 'h1',
            content: '.content'
          },
          maxConcurrent: 3
        }
      },
      'Lấy dữ liệu': {
        method: 'GET',
        endpoint: '/api/data?page=1&limit=10&orderBy=created_at&orderDir=DESC'
      },
      'Tìm kiếm': {
        method: 'GET',
        endpoint: '/api/data/search?keyword=example&page=1&limit=10'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint không tồn tại',
    availableEndpoints: [
      'GET /',
      'POST /api/scrape',
      'POST /api/scrape/multiple',
      'GET /api/data',
      'GET /api/data/search',
      'GET /api/data/stats',
      'GET /api/data/:id',
      'PUT /api/data/:id',
      'DELETE /api/data/:id',
      'DELETE /api/data/cleanup/old',
      'GET /api/health'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // Handle different types of errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format',
      error: 'Request body contains invalid JSON'
    });
  }
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Request body too large',
      error: 'Request body exceeds the maximum allowed size'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Initialize database tables
    await initDatabase();
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`
🚀 Web Scraper API Server đang chạy!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📚 API Documentation: http://localhost:${PORT}
🔍 Health Check: http://localhost:${PORT}/api/health

📋 Available Endpoints:
   POST /api/scrape - Cào dữ liệu từ một URL
   POST /api/scrape/multiple - Cào dữ liệu từ nhiều URL
   GET /api/data - Lấy tất cả dữ liệu
   GET /api/data/search - Tìm kiếm dữ liệu
   GET /api/data/stats - Thống kê dữ liệu
   GET /api/health - Kiểm tra trạng thái

🛡️  Rate Limits:
   - Scraping: ${process.env.RATE_LIMIT_MAX_REQUESTS || 100} requests/15min
   - Multiple Scraping: 10 requests/hour
   - Data Reading: 1000 requests/15min
      `);
    });

    // Handle server errors
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} đã được sử dụng. Vui lòng thử port khác.`);
      } else {
        console.error('❌ Server error:', err);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Không thể khởi động server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();