const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Ví dụ cào dữ liệu từ các trang tin tức
async function scrapeNewsExample() {
  console.log('📰 Ví dụ cào dữ liệu từ trang tin tức\n');

  try {
    // Ví dụ 1: Cào từ một trang tin tức đơn giản
    console.log('1. Cào dữ liệu từ một URL...');
    
    const singleScrapeResult = await axios.post(`${API_BASE_URL}/scrape`, {
      url: 'https://httpbin.org/html', // URL demo
      selectors: {
        title: 'h1, title',
        content: 'p, div',
        description: 'meta[name="description"]',
        author: '.author, .byline',
        publishDate: '.date, time'
      }
    });

    console.log('✅ Kết quả cào dữ liệu:');
    console.log('   ID:', singleScrapeResult.data.data.id);
    console.log('   Title:', singleScrapeResult.data.data.title);
    console.log('   Content preview:', singleScrapeResult.data.data.content.substring(0, 100) + '...');
    console.log('   Metadata:', JSON.stringify(singleScrapeResult.data.data.metadata, null, 2));
    console.log('');

    // Ví dụ 2: Cào từ nhiều URL cùng lúc
    console.log('2. Cào dữ liệu từ nhiều URL...');
    
    const multipleUrls = [
      'https://httpbin.org/html',
      'https://httpbin.org/json'
    ];

    const multipleScrapeResult = await axios.post(`${API_BASE_URL}/scrape/multiple`, {
      urls: multipleUrls,
      selectors: {
        title: 'h1, .headline, .title',
        content: '.article-content, .post-content, p',
        author: '.author, .writer, .byline',
        publishDate: '.publish-date, .date, time[datetime]'
      },
      maxConcurrent: 2
    });

    console.log('✅ Kết quả cào nhiều URL:');
    console.log('   Tổng số URL:', multipleScrapeResult.data.data.summary.total);
    console.log('   Thành công:', multipleScrapeResult.data.data.summary.successful);
    console.log('   Thất bại:', multipleScrapeResult.data.data.summary.failed);
    
    if (multipleScrapeResult.data.data.successful.length > 0) {
      console.log('   Dữ liệu đầu tiên:');
      const firstResult = multipleScrapeResult.data.data.successful[0];
      console.log('     ID:', firstResult.id);
      console.log('     Title:', firstResult.title);
      console.log('     URL:', firstResult.url);
    }
    console.log('');

    // Ví dụ 3: Tìm kiếm dữ liệu đã cào
    console.log('3. Tìm kiếm dữ liệu...');
    
    const searchResult = await axios.get(`${API_BASE_URL}/data/search?keyword=html&page=1&limit=5`);
    
    console.log('✅ Kết quả tìm kiếm:');
    console.log('   Từ khóa:', searchResult.data.keyword);
    console.log('   Số kết quả:', searchResult.data.data.length);
    console.log('   Trang hiện tại:', searchResult.data.pagination.currentPage);
    console.log('   Tổng số trang:', searchResult.data.pagination.totalPages);
    console.log('');

    // Ví dụ 4: Lấy thống kê
    console.log('4. Lấy thống kê dữ liệu...');
    
    const statsResult = await axios.get(`${API_BASE_URL}/data/stats`);
    
    console.log('✅ Thống kê:');
    console.log('   Tổng số bản ghi:', statsResult.data.data.totalRecords);
    console.log('   Số URL duy nhất:', statsResult.data.data.uniqueUrls);
    console.log('   Độ dài nội dung trung bình:', statsResult.data.data.avgContentLength, 'ký tự');
    console.log('   Dữ liệu trong tuần:');
    
    if (statsResult.data.data.weeklyData.length > 0) {
      statsResult.data.data.weeklyData.forEach(day => {
        console.log(`     ${day.date}: ${day.count} bản ghi`);
      });
    } else {
      console.log('     Không có dữ liệu trong tuần qua');
    }
    console.log('');

    // Ví dụ 5: Lấy tất cả dữ liệu với phân trang
    console.log('5. Lấy tất cả dữ liệu...');
    
    const allDataResult = await axios.get(`${API_BASE_URL}/data?page=1&limit=3&orderBy=created_at&orderDir=DESC`);
    
    console.log('✅ Danh sách dữ liệu:');
    console.log('   Trang:', allDataResult.data.pagination.currentPage, '/', allDataResult.data.pagination.totalPages);
    console.log('   Tổng số bản ghi:', allDataResult.data.pagination.totalItems);
    
    allDataResult.data.data.forEach((item, index) => {
      console.log(`   ${index + 1}. ID: ${item.id}`);
      console.log(`      Title: ${item.title || 'N/A'}`);
      console.log(`      URL: ${item.url}`);
      console.log(`      Created: ${new Date(item.created_at).toLocaleString()}`);
      console.log('');
    });

    console.log('🎉 Hoàn thành tất cả ví dụ!');

  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
  }
}

// Ví dụ về selectors cho các trang web phổ biến
function showSelectorsExamples() {
  console.log('📋 Ví dụ selectors cho các trang web phổ biến:\n');

  const examples = {
    'Trang tin tức chung': {
      title: 'h1, .headline, .article-title, .post-title',
      content: '.article-content, .post-content, .entry-content, .content',
      author: '.author, .byline, .writer, [rel="author"]',
      publishDate: '.publish-date, .date, time[datetime], .timestamp',
      category: '.category, .tag, .section'
    },
    'Blog cá nhân': {
      title: 'h1.post-title, .entry-title, .blog-title',
      content: '.post-content, .entry-content, .blog-content',
      author: '.author-name, .post-author, .by-author',
      publishDate: '.post-date, .published, .entry-date',
      tags: '.tags, .post-tags, .categories'
    },
    'E-commerce': {
      title: 'h1.product-title, .product-name, .item-title',
      content: '.product-description, .item-description, .product-details',
      price: '.price, .cost, .amount, .product-price',
      rating: '.rating, .stars, .review-score',
      availability: '.stock, .availability, .in-stock'
    },
    'Wikipedia': {
      title: 'h1.firstHeading, #firstHeading',
      content: '.mw-parser-output p, .mw-content-text p',
      infobox: '.infobox',
      categories: '#mw-normal-catlinks ul li'
    }
  };

  Object.entries(examples).forEach(([siteName, selectors]) => {
    console.log(`${siteName}:`);
    Object.entries(selectors).forEach(([key, selector]) => {
      console.log(`  ${key}: "${selector}"`);
    });
    console.log('');
  });
}

// Chạy ví dụ
if (require.main === module) {
  console.log('🚀 Web Scraper API - Ví dụ sử dụng\n');
  
  // Hiển thị ví dụ selectors
  showSelectorsExamples();
  
  // Chạy ví dụ cào dữ liệu
  scrapeNewsExample();
}

module.exports = {
  scrapeNewsExample,
  showSelectorsExamples
};