const CategoryRepository = require("../../Repositories/categoryRepository");
const PostGreDB = require("../../config/DbConfig/postgreDb");

jest.mock("../../config/DbConfig/postgreDb");

describe("CategoryRepository", () => {
  var categoryRepo;
  var db;

  beforeAll(() => {
    db = new PostGreDB();
    db.query = jest.fn();
    categoryRepo = new CategoryRepository(db);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getById", () => {
    test("should return the category when it exists", async () => {
      const category_id = 1;
      const expectedCategory = { id: 1, name: "Test Category" };
      db.query.mockResolvedValueOnce([expectedCategory]);

      const result = await categoryRepo.getById(category_id);

      expect(result).toEqual(expectedCategory);
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM categories WHERE id = $1",
        [category_id]
      );
    });

    test("should throw an error when the database query fails", async () => {
      const category_id = 3;
      db.query.mockRejectedValueOnce(new Error());

      await expect(categoryRepo.getById(category_id)).rejects.toThrow(
        "Database query failed to get category by ID"
      );
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM categories WHERE id = $1",
        [category_id]
      );
    });

    test("should throw an error when the category does not exist", async () => {
      const category_id = 2;
      db.query.mockImplementation(() => Promise.resolve([]));

      await expect(categoryRepo.getById(category_id)).rejects.toThrow(
        "Category not found"
      );

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM categories WHERE id = $1",
        [category_id]
      );
    });
  });

  describe("getAll", () => {
    test("should return an array of categories", async () => {
      const categoryData = [
        { id: 1, name: "Category 1" },
        { id: 2, name: "Category 2" },
      ];
      db.query.mockResolvedValueOnce(categoryData);

      const result = await categoryRepo.getAll();

      expect(result).toEqual(categoryData);
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM categories");
    });

    test("should throw an error when there is an error in the database query", async () => {
      const errorMessage = "Database query failed to get all categories";
      db.query.mockRejectedValueOnce(new Error());

      await expect(categoryRepo.getAll()).rejects.toThrow(errorMessage);
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM categories");
    });
  });

  describe("createCategory", () => {});
});
