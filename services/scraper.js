const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

class WebScraper {
  constructor() {
    this.userAgent = process.env.USER_AGENT;
    this.timeout = parseInt(process.env.REQUEST_TIMEOUT) || 10000;
  }

  // Cấu hình axios với headers và timeout
  getAxiosConfig() {
    return {
      headers: {
        'User-Agent': this.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: this.timeout,
      maxRedirects: 5,
    };
  }

  // Hàm chính để cào dữ liệu từ URL
  async scrapeUrl(url, selectors = {}) {
    try {
      console.log(`🔍 Bắt đầu cào dữ liệu từ: ${url}`);
      
      // Gửi request đến URL
      const response = await axios.get(url, this.getAxiosConfig());
      const $ = cheerio.load(response.data);

      // Selectors mặc định
      const defaultSelectors = {
        title: 'title, h1, .title, .heading, .post-title',
        content: 'article, .content, .post-content, .entry-content, .main-content, p',
        description: 'meta[name="description"]',
        keywords: 'meta[name="keywords"]',
        author: '.author, .by-author, [rel="author"]',
        publishDate: '.date, .publish-date, .post-date, time',
        images: 'img',
        links: 'a'
      };

      // Merge selectors tùy chỉnh với selectors mặc định
      const finalSelectors = { ...defaultSelectors, ...selectors };

      // Trích xuất dữ liệu
      const scrapedData = {
        url: url,
        title: this.extractText($, finalSelectors.title),
        content: this.extractText($, finalSelectors.content),
        metadata: {
          description: this.extractAttribute($, finalSelectors.description, 'content'),
          keywords: this.extractAttribute($, finalSelectors.keywords, 'content'),
          author: this.extractText($, finalSelectors.author),
          publishDate: this.extractText($, finalSelectors.publishDate),
          images: this.extractImages($, finalSelectors.images),
          links: this.extractLinks($, finalSelectors.links),
          wordCount: this.countWords(this.extractText($, finalSelectors.content)),
          language: this.detectLanguage($),
          responseTime: response.headers['x-response-time'] || 'N/A',
          statusCode: response.status
        }
      };

      console.log(`✅ Cào dữ liệu thành công từ: ${url}`);
      return scrapedData;

    } catch (error) {
      console.error(`❌ Lỗi khi cào dữ liệu từ ${url}:`, error.message);
      throw new Error(`Scraping failed: ${error.message}`);
    }
  }

  // Trích xuất text từ selector
  extractText($, selector) {
    try {
      const elements = $(selector);
      if (elements.length === 0) return '';
      
      // Lấy text từ element đầu tiên hoặc kết hợp tất cả
      return elements.first().text().trim();
    } catch (error) {
      return '';
    }
  }

  // Trích xuất attribute từ selector
  extractAttribute($, selector, attribute) {
    try {
      const element = $(selector).first();
      return element.attr(attribute) || '';
    } catch (error) {
      return '';
    }
  }

  // Trích xuất tất cả hình ảnh
  extractImages($, selector) {
    try {
      const images = [];
      $(selector).each((i, elem) => {
        const src = $(elem).attr('src');
        const alt = $(elem).attr('alt') || '';
        if (src) {
          images.push({ src, alt });
        }
      });
      return images;
    } catch (error) {
      return [];
    }
  }

  // Trích xuất tất cả links
  extractLinks($, selector) {
    try {
      const links = [];
      $(selector).each((i, elem) => {
        const href = $(elem).attr('href');
        const text = $(elem).text().trim();
        if (href) {
          links.push({ href, text });
        }
      });
      return links;
    } catch (error) {
      return [];
    }
  }

  // Đếm số từ
  countWords(text) {
    if (!text) return 0;
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  // Phát hiện ngôn ngữ cơ bản
  detectLanguage($) {
    try {
      return $('html').attr('lang') || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  // Cào nhiều URL cùng lúc
  async scrapeMultipleUrls(urls, selectors = {}, maxConcurrent = 5) {
    const results = [];
    const errors = [];

    // Chia URLs thành các batch để tránh overload
    for (let i = 0; i < urls.length; i += maxConcurrent) {
      const batch = urls.slice(i, i + maxConcurrent);
      const batchPromises = batch.map(async (url) => {
        try {
          const result = await this.scrapeUrl(url, selectors);
          return { success: true, url, data: result };
        } catch (error) {
          return { success: false, url, error: error.message };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          if (result.value.success) {
            results.push(result.value.data);
          } else {
            errors.push(result.value);
          }
        } else {
          errors.push({ url: 'unknown', error: result.reason });
        }
      });

      // Delay giữa các batch để tránh bị block
      if (i + maxConcurrent < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return { results, errors };
  }

  // Validate URL
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
}

module.exports = WebScraper;