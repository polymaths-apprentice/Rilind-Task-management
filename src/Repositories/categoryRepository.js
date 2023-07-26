class CategoryRepository {
  constructor(db) {
    this.db = db;
  }

  async getById(category_id) {
    const query = "SELECT * FROM categories WHERE id = $1";
    const values = [category_id];
    try {
      const result = await this.db.query(query, values);

      if (result.length > 0) {
        return result[0];
      } else {
        throw new Error("Category not found");
      }
    } catch (error) {
      if (error.message === "Category not found") {
        throw error;
      } else {
        throw new Error("Database query failed to get category by ID");
      }
    }
  }

  async getAll() {
    const query = "SELECT * FROM categories";
    try {
      const result = await this.db.query(query);
      return result;
    } catch (error) {
      throw new Error("Database query failed to get all categories");
    }
  }
}

module.exports = CategoryRepository;
