const { Pool } = require('pg');
require('dotenv').config();

// Cấu hình kết nối PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Số lượng connection tối đa
  idleTimeoutMillis: 30000, // Thời gian timeout cho idle connection
  connectionTimeoutMillis: 2000, // Thời gian timeout khi kết nối
});

// Test kết nối database
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Kết nối PostgreSQL thành công!');
    client.release();
  } catch (err) {
    console.error('❌ Lỗi kết nối PostgreSQL:', err.message);
  }
};

// Tạo bảng nếu chưa tồn tại
const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scraped_data (
        id SERIAL PRIMARY KEY,
        url VARCHAR(500) NOT NULL,
        title VARCHAR(500),
        content TEXT,
        metadata JSONB,
        scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_scraped_data_url ON scraped_data(url);
      CREATE INDEX IF NOT EXISTS idx_scraped_data_scraped_at ON scraped_data(scraped_at);
    `);
    
    console.log('✅ Database tables đã được tạo thành công!');
  } catch (err) {
    console.error('❌ Lỗi tạo database tables:', err.message);
  }
};

module.exports = {
  pool,
  testConnection,
  initDatabase
};