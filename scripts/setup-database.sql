-- Tạo database (chạy lệnh này với quyền superuser)
-- CREATE DATABASE web_scraper_db;

-- Kết nối đến database web_scraper_db và chạy các lệnh sau:

-- Tạo bảng scraped_data
CREATE TABLE IF NOT EXISTS scraped_data (
    id SERIAL PRIMARY KEY,
    url VARCHAR(500) NOT NULL,
    title VARCHAR(500),
    content TEXT,
    metadata JSONB,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo các index để tối ưu hiệu suất
CREATE INDEX IF NOT EXISTS idx_scraped_data_url ON scraped_data(url);
CREATE INDEX IF NOT EXISTS idx_scraped_data_scraped_at ON scraped_data(scraped_at);
CREATE INDEX IF NOT EXISTS idx_scraped_data_created_at ON scraped_data(created_at);
CREATE INDEX IF NOT EXISTS idx_scraped_data_title ON scraped_data USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_scraped_data_content ON scraped_data USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_scraped_data_metadata ON scraped_data USING gin(metadata);

-- Tạo trigger để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_scraped_data_updated_at 
    BEFORE UPDATE ON scraped_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Thêm một số dữ liệu mẫu (tùy chọn)
INSERT INTO scraped_data (url, title, content, metadata) VALUES 
(
    'https://example.com/sample1',
    'Sample Article 1',
    'This is a sample content for testing purposes. It contains some text to demonstrate the scraping functionality.',
    '{"author": "Test Author", "publishDate": "2024-01-01", "wordCount": 20, "language": "en"}'
),
(
    'https://example.com/sample2', 
    'Sample Article 2',
    'Another sample content with different information. This helps test search and filtering capabilities.',
    '{"author": "Another Author", "publishDate": "2024-01-02", "wordCount": 18, "language": "en"}'
)
ON CONFLICT DO NOTHING;

-- Hiển thị thông tin về bảng đã tạo
\d scraped_data;