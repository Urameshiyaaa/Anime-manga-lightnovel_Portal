const express = require('express');
const router = express.Router();
const ScraperController = require('../controllers/scraperController');

// Middleware để validate JSON
const validateJSON = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body không được để trống'
      });
    }
  }
  next();
};

// Routes cho scraping
router.post('/scrape', validateJSON, ScraperController.scrapeUrl);
router.post('/scrape/multiple', validateJSON, ScraperController.scrapeMultipleUrls);

// Routes cho quản lý dữ liệu
router.get('/data', ScraperController.getAllData);
router.get('/data/search', ScraperController.searchData);
router.get('/data/stats', ScraperController.getStats);
router.get('/data/:id', ScraperController.getDataById);
router.put('/data/:id', validateJSON, ScraperController.updateData);
router.delete('/data/:id', ScraperController.deleteData);

// Routes cho maintenance
router.delete('/data/cleanup/old', ScraperController.cleanOldData);

// Health check
router.get('/health', ScraperController.healthCheck);

module.exports = router;