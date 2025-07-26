# Web Scraper API

API Node.js để cào dữ liệu từ các trang web và lưu vào PostgreSQL database.

## 🚀 Tính năng

- ✅ Cào dữ liệu từ một URL hoặc nhiều URL cùng lúc
- ✅ Lưu trữ dữ liệu vào PostgreSQL database
- ✅ Tìm kiếm và phân trang dữ liệu
- ✅ Rate limiting để tránh spam
- ✅ Selectors tùy chỉnh cho từng trang web
- ✅ Thống kê và quản lý dữ liệu
- ✅ RESTful API design
- ✅ Error handling và logging

## 📋 Yêu cầu hệ thống

- Node.js >= 14.0.0
- PostgreSQL >= 12.0
- NPM hoặc Yarn

## 🛠️ Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd web-scraper-api
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình Database
Tạo database PostgreSQL:
```sql
CREATE DATABASE web_scraper_db;
```

### 4. Cấu hình Environment Variables
Sao chép file `.env` và cập nhật thông tin:
```bash
cp .env.example .env
```

Cập nhật các thông tin trong file `.env`:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=web_scraper_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Scraping Configuration
USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
REQUEST_TIMEOUT=10000
```

### 5. Chạy server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server sẽ chạy trên `http://localhost:3000`

## 📚 API Documentation

### 🔍 Scraping Endpoints

#### Cào dữ liệu từ một URL
```http
POST /api/scrape
Content-Type: application/json

{
  "url": "https://example.com",
  "selectors": {
    "title": "h1, .title",
    "content": ".content, article",
    "author": ".author"
  }
}
```

#### Cào dữ liệu từ nhiều URL
```http
POST /api/scrape/multiple
Content-Type: application/json

{
  "urls": [
    "https://example1.com",
    "https://example2.com",
    "https://example3.com"
  ],
  "selectors": {
    "title": "h1",
    "content": ".content"
  },
  "maxConcurrent": 3
}
```

### 📊 Data Management Endpoints

#### Lấy tất cả dữ liệu (có phân trang)
```http
GET /api/data?page=1&limit=10&orderBy=created_at&orderDir=DESC
```

#### Tìm kiếm dữ liệu
```http
GET /api/data/search?keyword=example&page=1&limit=10
```

#### Lấy dữ liệu theo ID
```http
GET /api/data/:id
```

#### Cập nhật dữ liệu
```http
PUT /api/data/:id
Content-Type: application/json

{
  "title": "Updated title",
  "content": "Updated content",
  "metadata": {}
}
```

#### Xóa dữ liệu
```http
DELETE /api/data/:id
```

#### Lấy thống kê
```http
GET /api/data/stats
```

#### Xóa dữ liệu cũ
```http
DELETE /api/data/cleanup/old?days=30
```

### 🏥 Health Check
```http
GET /api/health
```

## 📝 Selectors mặc định

API sử dụng các selectors mặc định sau nếu không được chỉ định:

```javascript
{
  title: 'title, h1, .title, .heading, .post-title',
  content: 'article, .content, .post-content, .entry-content, .main-content, p',
  description: 'meta[name="description"]',
  keywords: 'meta[name="keywords"]',
  author: '.author, .by-author, [rel="author"]',
  publishDate: '.date, .publish-date, .post-date, time',
  images: 'img',
  links: 'a'
}
```

## 🛡️ Rate Limiting

- **Scraping endpoints**: 100 requests/15 phút
- **Multiple scraping**: 10 requests/giờ  
- **Data reading**: 1000 requests/15 phút

## 📊 Database Schema

```sql
CREATE TABLE scraped_data (
  id SERIAL PRIMARY KEY,
  url VARCHAR(500) NOT NULL,
  title VARCHAR(500),
  content TEXT,
  metadata JSONB,
  scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Ví dụ sử dụng

### JavaScript/Fetch
```javascript
// Cào dữ liệu từ một URL
const response = await fetch('http://localhost:3000/api/scrape', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com',
    selectors: {
      title: 'h1',
      content: '.content'
    }
  })
});

const data = await response.json();
console.log(data);
```

### cURL
```bash
# Cào dữ liệu
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "selectors": {
      "title": "h1",
      "content": ".content"
    }
  }'

# Lấy dữ liệu
curl "http://localhost:3000/api/data?page=1&limit=5"
```

### Python
```python
import requests

# Cào dữ liệu
response = requests.post('http://localhost:3000/api/scrape', json={
    'url': 'https://example.com',
    'selectors': {
        'title': 'h1',
        'content': '.content'
    }
})

data = response.json()
print(data)
```

## 🚨 Error Handling

API trả về các mã lỗi HTTP tiêu chuẩn:

- `200` - Success
- `400` - Bad Request (URL không hợp lệ, thiếu parameters)
- `404` - Not Found (Dữ liệu không tồn tại)
- `429` - Too Many Requests (Rate limit exceeded)
- `500` - Internal Server Error

Ví dụ response lỗi:
```json
{
  "success": false,
  "message": "URL không hợp lệ",
  "error": "Invalid URL format"
}
```

## 🔒 Security Features

- Helmet.js cho security headers
- Rate limiting
- CORS configuration
- Input validation
- SQL injection protection (parameterized queries)
- Request size limiting

## 📈 Performance Tips

1. **Batch scraping**: Sử dụng `/api/scrape/multiple` cho nhiều URL
2. **Selectors tối ưu**: Chỉ định selectors cụ thể để giảm thời gian xử lý
3. **Pagination**: Sử dụng phân trang khi lấy dữ liệu lớn
4. **Cleanup**: Thường xuyên xóa dữ liệu cũ

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🆘 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs trong console
2. Đảm bảo PostgreSQL đang chạy
3. Kiểm tra cấu hình trong file `.env`
4. Tạo issue trên GitHub