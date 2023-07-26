const CategoryService = require("../../Services/categoryService");
const CategoryRepository = require("../../Repositories/categoryRepository");

jest.mock("../../Repositories/categoryRepository", () => {
  return jest.fn().mockImplementation(() => ({
    getById: jest.fn(),
    getAll: jest.fn(),
  }));
});

describe("CategoryService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCategoryById", () => {
    test("should return a category when it exists", async () => {
      const category_id = 1;
      const expectedCategoryData = {
        id: category_id,
        name: "Category 1",
      };
      const categoryRepo = new CategoryRepository();
      categoryRepo.getById.mockResolvedValueOnce(expectedCategoryData);

      const categoryService = new CategoryService(categoryRepo);
      const result = await categoryService.getCategoryById(category_id);

      expect(result).toBeDefined();
      expect(result).toEqual(expectedCategoryData);
      expect(categoryRepo.getById).toHaveBeenCalledTimes(1);
      expect(categoryRepo.getById).toHaveBeenCalledWith(category_id);
    });

    test("should return null when the category does not exist", async () => {
      const category_id = 2;
      const categoryRepo = new CategoryRepository();
      categoryRepo.getById.mockResolvedValueOnce(null);

      const categoryService = new CategoryService(categoryRepo);
      const result = await categoryService.getCategoryById(category_id);

      expect(result).toBeNull();
      expect(categoryRepo.getById).toHaveBeenCalledTimes(1);
      expect(categoryRepo.getById).toHaveBeenCalledWith(category_id);
    });

    test("should throw an error when the category retrieval fails", async () => {
      const category_id = 3;
      const errorMessage = "Category retrieval failed";
      const categoryRepo = new CategoryRepository();
      categoryRepo.getById.mockRejectedValueOnce(new Error(errorMessage));

      const categoryService = new CategoryService(categoryRepo);

      await expect(
        categoryService.getCategoryById(category_id)
      ).rejects.toThrow(errorMessage);
      expect(categoryRepo.getById).toHaveBeenCalledTimes(1);
      expect(categoryRepo.getById).toHaveBeenCalledWith(category_id);
    });
  });

  describe("getAllCategories", () => {
    test("should return all categories", async () => {
      const categoriesData = [
        { id: 1, name: "Category 1" },
        { id: 2, name: "Category 2" },
        { id: 3, name: "Category 3" },
      ];

      const categoryRepo = new CategoryRepository();
      categoryRepo.getAll.mockResolvedValueOnce(categoriesData);

      const categoryService = new CategoryService(categoryRepo);
      const result = await categoryService.getAllCategories();

      expect(result).toBeDefined();
      expect(result).toEqual(categoriesData);
      expect(categoryRepo.getAll).toHaveBeenCalledTimes(1);
    });

    test("should throw an error when the category retrieval fails", async () => {
      const errorMessage = "Category retrieval failed";
      const categoryRepo = new CategoryRepository();
      categoryRepo.getAll.mockRejectedValueOnce(new Error(errorMessage));

      const categoryService = new CategoryService(categoryRepo);

      await expect(categoryService.getAllCategories()).rejects.toThrow(
        errorMessage
      );
      expect(categoryRepo.getAll).toHaveBeenCalledTimes(1);
    });
  });
});
