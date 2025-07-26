const { pool } = require('../config/database');

class ScrapedData {
  // Lưu dữ liệu đã cào vào database
  static async create(data) {
    try {
      const query = `
        INSERT INTO scraped_data (url, title, content, metadata, scraped_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const values = [
        data.url,
        data.title,
        data.content,
        JSON.stringify(data.metadata),
        new Date()
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
      throw error;
    }
  }

  // Lưu nhiều dữ liệu cùng lúc
  static async createBatch(dataArray) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const results = [];
      for (const data of dataArray) {
        const query = `
          INSERT INTO scraped_data (url, title, content, metadata, scraped_at)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
        
        const values = [
          data.url,
          data.title,
          data.content,
          JSON.stringify(data.metadata),
          new Date()
        ];

        const result = await client.query(query, values);
        results.push(result.rows[0]);
      }
      
      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Lỗi khi lưu batch dữ liệu:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Lấy tất cả dữ liệu với phân trang
  static async findAll(page = 1, limit = 10, orderBy = 'created_at', orderDir = 'DESC') {
    try {
      const offset = (page - 1) * limit;
      
      const countQuery = 'SELECT COUNT(*) FROM scraped_data';
      const countResult = await pool.query(countQuery);
      const totalItems = parseInt(countResult.rows[0].count);
      
      const query = `
        SELECT id, url, title, 
               SUBSTRING(content, 1, 200) as content_preview,
               metadata, scraped_at, created_at
        FROM scraped_data
        ORDER BY ${orderBy} ${orderDir}
        LIMIT $1 OFFSET $2
      `;
      
      const result = await pool.query(query, [limit, offset]);
      
      return {
        data: result.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      throw error;
    }
  }

  // Tìm dữ liệu theo ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM scraped_data WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Lỗi khi tìm dữ liệu theo ID:', error);
      throw error;
    }
  }

  // Tìm dữ liệu theo URL
  static async findByUrl(url) {
    try {
      const query = 'SELECT * FROM scraped_data WHERE url = $1 ORDER BY created_at DESC';
      const result = await pool.query(query, [url]);
      return result.rows;
    } catch (error) {
      console.error('Lỗi khi tìm dữ liệu theo URL:', error);
      throw error;
    }
  }

  // Tìm kiếm dữ liệu theo từ khóa
  static async search(keyword, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const countQuery = `
        SELECT COUNT(*) FROM scraped_data 
        WHERE title ILIKE $1 OR content ILIKE $1
      `;
      const countResult = await pool.query(countQuery, [`%${keyword}%`]);
      const totalItems = parseInt(countResult.rows[0].count);
      
      const query = `
        SELECT id, url, title,
               SUBSTRING(content, 1, 200) as content_preview,
               metadata, scraped_at, created_at
        FROM scraped_data
        WHERE title ILIKE $1 OR content ILIKE $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
      
      const result = await pool.query(query, [`%${keyword}%`, limit, offset]);
      
      return {
        data: result.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          itemsPerPage: limit
        },
        keyword
      };
    } catch (error) {
      console.error('Lỗi khi tìm kiếm dữ liệu:', error);
      throw error;
    }
  }

  // Cập nhật dữ liệu
  static async update(id, data) {
    try {
      const query = `
        UPDATE scraped_data 
        SET title = $2, content = $3, metadata = $4, updated_at = $5
        WHERE id = $1
        RETURNING *
      `;
      
      const values = [
        id,
        data.title,
        data.content,
        JSON.stringify(data.metadata),
        new Date()
      ];

      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Lỗi khi cập nhật dữ liệu:', error);
      throw error;
    }
  }

  // Xóa dữ liệu theo ID
  static async delete(id) {
    try {
      const query = 'DELETE FROM scraped_data WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Lỗi khi xóa dữ liệu:', error);
      throw error;
    }
  }

  // Xóa dữ liệu cũ (older than X days)
  static async deleteOldData(days = 30) {
    try {
      const query = `
        DELETE FROM scraped_data 
        WHERE created_at < NOW() - INTERVAL '${days} days'
        RETURNING COUNT(*)
      `;
      const result = await pool.query(query);
      return result.rowCount;
    } catch (error) {
      console.error('Lỗi khi xóa dữ liệu cũ:', error);
      throw error;
    }
  }

  // Thống kê dữ liệu
  static async getStats() {
    try {
      const queries = [
        'SELECT COUNT(*) as total_records FROM scraped_data',
        'SELECT COUNT(DISTINCT url) as unique_urls FROM scraped_data',
        'SELECT DATE(created_at) as date, COUNT(*) as count FROM scraped_data WHERE created_at >= NOW() - INTERVAL \'7 days\' GROUP BY DATE(created_at) ORDER BY date',
        'SELECT AVG(LENGTH(content)) as avg_content_length FROM scraped_data WHERE content IS NOT NULL'
      ];

      const [totalResult, urlsResult, weeklyResult, avgLengthResult] = await Promise.all(
        queries.map(query => pool.query(query))
      );

      return {
        totalRecords: parseInt(totalResult.rows[0].total_records),
        uniqueUrls: parseInt(urlsResult.rows[0].unique_urls),
        weeklyData: weeklyResult.rows,
        avgContentLength: Math.round(parseFloat(avgLengthResult.rows[0].avg_content_length) || 0)
      };
    } catch (error) {
      console.error('Lỗi khi lấy thống kê:', error);
      throw error;
    }
  }
}

module.exports = ScrapedData;