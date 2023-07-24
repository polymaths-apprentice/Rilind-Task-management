const CategoryRepository = require("../Repositories/categoryRepository");

class CategoryService {
  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async getCategoryById(category_id) {
    try {
      const categoryData = await this.categoryRepository.getById(category_id);

      if (categoryData) {
        return new Category(categoryData.id, categoryData.name);
      } else {
        return null;
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getAllCategories() {
    try {
      const categoriesData = await this.categoryRepository.getAll();

      const categories = categoriesData.map(
        (categoryData) => new Category(categoryData.id, categoryData.name)
      );

      return categories;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}

module.exports = CategoryService;
