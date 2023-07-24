const CategoryRepository = require("../../Repositories/categoryRepository");
const db = require("../../config/postgreDb");

// Mock the db.query function using jest.fn()
jest.mock("../../config/postgreDb", () => ({
  query: jest.fn(),
}));

describe("getById", () => {
  afterEach(() => {
    db.query.mockReset();
  });

  test("should return the category when it exists", async () => {
    const category_id = 1;
    const expectedCategory = { id: 1, name: "Test Category" };
    db.query.mockResolvedValueOnce([expectedCategory]);

    const categoryRepo = new CategoryRepository();
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
    db.query.mockRejectedValueOnce(new Error("Database query failed"));

    const categoryRepo = new CategoryRepository();

    await expect(categoryRepo.getById(category_id)).rejects.toThrow(
      "Failed to get category by ID"
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

    const categoryRepo = new CategoryRepository();

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
  afterEach(() => {
    db.query.mockReset();
  });

  test("should return an array of categories", async () => {
    const categoryData = [
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
    ];
    db.query.mockResolvedValueOnce(categoryData);

    const categoryRepository = new CategoryRepository();
    const result = await categoryRepository.getAll();

    expect(result).toEqual(categoryData);
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM categories");
  });

  test("should throw an error when there is an error in the database query", async () => {
    const errorMessage = "Failed to get all categories";
    db.query.mockRejectedValueOnce(new Error(errorMessage));

    const categoryRepository = new CategoryRepository();

    await expect(categoryRepository.getAll()).rejects.toThrow(errorMessage);
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM categories");
  });
});
