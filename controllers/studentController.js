const getStudents = async (pool, page, limit) => {
    const offset = (page - 1) * limit;
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM students ORDER BY RollNo LIMIT $1 OFFSET $2', [limit, offset]);
      const total = await client.query('SELECT COUNT(*) FROM students');
      const totalPages = Math.ceil(total.rows[0].count / limit);
  
      return {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total: parseInt(total.rows[0].count, 10),
        totalPages,
        data: result.rows,
      };
    } catch (error) {
      console.error('Error retrieving students:', error);
      throw error;
    } finally {
      client.release();
    }
  };
  
  module.exports = {
    getStudents,
  };
  