const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Hàm helper để gọi API
async function callAPI(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi gọi ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

// Test các API endpoints
async function runTests() {
  console.log('🚀 Bắt đầu test Web Scraper API...\n');

  try {
    // 1. Health Check
    console.log('1. 🏥 Test Health Check...');
    const healthCheck = await callAPI('GET', '/health');
    console.log('✅ Health Check:', healthCheck.message);
    console.log('   Response time:', healthCheck.data.responseTime);
    console.log('');

    // 2. Cào dữ liệu từ một URL
    console.log('2. 🔍 Test cào dữ liệu từ một URL...');
    const scrapeResult = await callAPI('POST', '/scrape', {
      url: 'https://httpbin.org/html',
      selectors: {
        title: 'h1',
        content: 'p'
      }
    });
    console.log('✅ Cào dữ liệu thành công!');
    console.log('   ID:', scrapeResult.data.id);
    console.log('   Title:', scrapeResult.data.title);
    console.log('   URL:', scrapeResult.data.url);
    console.log('');

    // 3. Lấy thống kê
    console.log('3. 📊 Test lấy thống kê...');
    const stats = await callAPI('GET', '/data/stats');
    console.log('✅ Thống kê:');
    console.log('   Tổng số bản ghi:', stats.data.totalRecords);
    console.log('   Số URL duy nhất:', stats.data.uniqueUrls);
    console.log('   Độ dài nội dung trung bình:', stats.data.avgContentLength);
    console.log('');

    // 4. Lấy tất cả dữ liệu
    console.log('4. 📋 Test lấy tất cả dữ liệu...');
    const allData = await callAPI('GET', '/data?page=1&limit=5');
    console.log('✅ Lấy dữ liệu thành công!');
    console.log('   Trang hiện tại:', allData.pagination.currentPage);
    console.log('   Tổng số trang:', allData.pagination.totalPages);
    console.log('   Số bản ghi:', allData.data.length);
    console.log('');

    // 5. Tìm kiếm dữ liệu
    console.log('5. 🔎 Test tìm kiếm dữ liệu...');
    const searchResult = await callAPI('GET', '/data/search?keyword=html&page=1&limit=3');
    console.log('✅ Tìm kiếm thành công!');
    console.log('   Từ khóa:', searchResult.keyword);
    console.log('   Số kết quả:', searchResult.data.length);
    console.log('');

    // 6. Cào nhiều URL (test với URLs đơn giản)
    console.log('6. 🔍 Test cào nhiều URL...');
    const multipleUrls = [
      'https://httpbin.org/json',
      'https://httpbin.org/html'
    ];
    
    const multipleResult = await callAPI('POST', '/scrape/multiple', {
      urls: multipleUrls,
      selectors: {
        title: 'title, h1',
        content: 'body, p'
      },
      maxConcurrent: 2
    });
    
    console.log('✅ Cào nhiều URL thành công!');
    console.log('   Tổng số URL:', multipleResult.data.summary.total);
    console.log('   Thành công:', multipleResult.data.summary.successful);
    console.log('   Thất bại:', multipleResult.data.summary.failed);
    console.log('');

    // 7. Lấy dữ liệu theo ID (lấy ID từ kết quả scrape đầu tiên)
    if (scrapeResult.data.id) {
      console.log('7. 🎯 Test lấy dữ liệu theo ID...');
      const dataById = await callAPI('GET', `/data/${scrapeResult.data.id}`);
      console.log('✅ Lấy dữ liệu theo ID thành công!');
      console.log('   ID:', dataById.data.id);
      console.log('   Title:', dataById.data.title);
      console.log('   Created at:', dataById.data.created_at);
      console.log('');
    }

    console.log('🎉 Tất cả tests đã hoàn thành thành công!');

  } catch (error) {
    console.error('❌ Test thất bại:', error.message);
    process.exit(1);
  }
}

// Chạy tests
if (require.main === module) {
  runTests();
}

module.exports = { runTests, callAPI };