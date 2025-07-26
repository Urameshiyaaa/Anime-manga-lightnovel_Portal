const WebScraper = require('../services/scraper');
const ScrapedData = require('../models/ScrapedData');

const scraper = new WebScraper();

class ScraperController {
  // Cào dữ liệu từ một URL
  static async scrapeUrl(req, res) {
    try {
      const { url, selectors } = req.body;

      // Validate URL
      if (!url) {
        return res.status(400).json({
          success: false,
          message: 'URL là bắt buộc'
        });
      }

      if (!scraper.isValidUrl(url)) {
        return res.status(400).json({
          success: false,
          message: 'URL không hợp lệ'
        });
      }

      // Cào dữ liệu
      const scrapedData = await scraper.scrapeUrl(url, selectors);
      
      // Lưu vào database
      const savedData = await ScrapedData.create(scrapedData);

      res.json({
        success: true,
        message: 'Cào dữ liệu thành công',
        data: savedData
      });

    } catch (error) {
      console.error('Lỗi trong scrapeUrl:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cào dữ liệu',
        error: error.message
      });
    }
  }

  // Cào dữ liệu từ nhiều URL
  static async scrapeMultipleUrls(req, res) {
    try {
      const { urls, selectors, maxConcurrent = 5 } = req.body;

      // Validate URLs
      if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Danh sách URLs là bắt buộc và phải là một mảng'
        });
      }

      // Validate từng URL
      const invalidUrls = urls.filter(url => !scraper.isValidUrl(url));
      if (invalidUrls.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Một số URL không hợp lệ',
          invalidUrls
        });
      }

      // Cào dữ liệu từ nhiều URL
      const { results, errors } = await scraper.scrapeMultipleUrls(urls, selectors, maxConcurrent);
      
      // Lưu dữ liệu thành công vào database
      let savedData = [];
      if (results.length > 0) {
        savedData = await ScrapedData.createBatch(results);
      }

      res.json({
        success: true,
        message: `Cào dữ liệu hoàn thành. Thành công: ${results.length}, Lỗi: ${errors.length}`,
        data: {
          successful: savedData,
          errors: errors,
          summary: {
            total: urls.length,
            successful: results.length,
            failed: errors.length
          }
        }
      });

    } catch (error) {
      console.error('Lỗi trong scrapeMultipleUrls:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cào dữ liệu từ nhiều URL',
        error: error.message
      });
    }
  }

  // Lấy tất cả dữ liệu đã cào
  static async getAllData(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        orderBy = 'created_at', 
        orderDir = 'DESC' 
      } = req.query;

      const result = await ScrapedData.findAll(
        parseInt(page), 
        parseInt(limit), 
        orderBy, 
        orderDir
      );

      res.json({
        success: true,
        message: 'Lấy dữ liệu thành công',
        ...result
      });

    } catch (error) {
      console.error('Lỗi trong getAllData:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy dữ liệu',
        error: error.message
      });
    }
  }

  // Lấy dữ liệu theo ID
  static async getDataById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID không hợp lệ'
        });
      }

      const data = await ScrapedData.findById(parseInt(id));

      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy dữ liệu'
        });
      }

      res.json({
        success: true,
        message: 'Lấy dữ liệu thành công',
        data
      });

    } catch (error) {
      console.error('Lỗi trong getDataById:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy dữ liệu',
        error: error.message
      });
    }
  }

  // Tìm kiếm dữ liệu
  static async searchData(req, res) {
    try {
      const { keyword, page = 1, limit = 10 } = req.query;

      if (!keyword) {
        return res.status(400).json({
          success: false,
          message: 'Từ khóa tìm kiếm là bắt buộc'
        });
      }

      const result = await ScrapedData.search(keyword, parseInt(page), parseInt(limit));

      res.json({
        success: true,
        message: 'Tìm kiếm thành công',
        ...result
      });

    } catch (error) {
      console.error('Lỗi trong searchData:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tìm kiếm dữ liệu',
        error: error.message
      });
    }
  }

  // Cập nhật dữ liệu
  static async updateData(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID không hợp lệ'
        });
      }

      const updatedData = await ScrapedData.update(parseInt(id), updateData);

      if (!updatedData) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy dữ liệu để cập nhật'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật dữ liệu thành công',
        data: updatedData
      });

    } catch (error) {
      console.error('Lỗi trong updateData:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật dữ liệu',
        error: error.message
      });
    }
  }

  // Xóa dữ liệu
  static async deleteData(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID không hợp lệ'
        });
      }

      const deletedData = await ScrapedData.delete(parseInt(id));

      if (!deletedData) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy dữ liệu để xóa'
        });
      }

      res.json({
        success: true,
        message: 'Xóa dữ liệu thành công',
        data: deletedData
      });

    } catch (error) {
      console.error('Lỗi trong deleteData:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa dữ liệu',
        error: error.message
      });
    }
  }

  // Lấy thống kê
  static async getStats(req, res) {
    try {
      const stats = await ScrapedData.getStats();

      res.json({
        success: true,
        message: 'Lấy thống kê thành công',
        data: stats
      });

    } catch (error) {
      console.error('Lỗi trong getStats:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê',
        error: error.message
      });
    }
  }

  // Xóa dữ liệu cũ
  static async cleanOldData(req, res) {
    try {
      const { days = 30 } = req.query;
      const deletedCount = await ScrapedData.deleteOldData(parseInt(days));

      res.json({
        success: true,
        message: `Đã xóa ${deletedCount} bản ghi cũ hơn ${days} ngày`,
        deletedCount
      });

    } catch (error) {
      console.error('Lỗi trong cleanOldData:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa dữ liệu cũ',
        error: error.message
      });
    }
  }

  // Health check cho scraper
  static async healthCheck(req, res) {
    try {
      // Test một URL đơn giản
      const testUrl = 'https://httpbin.org/html';
      const startTime = Date.now();
      
      await scraper.scrapeUrl(testUrl);
      
      const responseTime = Date.now() - startTime;

      res.json({
        success: true,
        message: 'Scraper hoạt động bình thường',
        data: {
          status: 'healthy',
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Scraper có vấn đề',
        data: {
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      });
    }
  }
}

module.exports = ScraperController;