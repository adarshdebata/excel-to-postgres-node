const deleteStudent = async (pool, rollNo) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "DELETE FROM students WHERE RollNo = $1 RETURNING *",
      [rollNo]
    );
    if (result.rows.length > 0) {
      return {
        message: `Student with RollNo ${rollNo} deleted successfully`,
        deletedStudent: result.rows[0],
      };
    } else {
      return { message: `Student with RollNo ${rollNo} not found` };
    }
  } catch (error) {
    console.error("Error deleting student:", error);
    throw new Error("Failed to delete student");
  } finally {
    client.release();
  }
};

module.exports = {
  deleteStudent,
};
