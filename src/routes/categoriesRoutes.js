const express = require("express");
const router = express.Router();
const CategoryService = require("../Services/categoryService");
const PostgreDb = require("../config/DbConfig/postgreDb");
const CategoryRepository = require("../Repositories/categoryRepository");

const db = new PostgreDb();
const categoryRepository = new CategoryRepository(db);
const categoryService = new CategoryService(categoryRepository);
const cache = {};
// GET all categories
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Category"
 */
router.get("/", async (req, res, next) => {
  try {
    const cachedCategories = cache["allCategories"];

    if (cachedCategories) {
      res.set("ETag", cachedCategories.etag);
      res.set("Last-Modified", cachedCategories.lastModified);
      return res.json(cachedCategories.data);
    }

    const categories = await categoryService.getAllCategories();

    const etag = categoryService.generateETag(categories);
    const lastModified = new Date().toUTCString();

    cache["allCategories"] = { data: categories, etag, lastModified };

    res.set("ETag", etag);
    res.set("Last-Modified", lastModified);

    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// GET a specific category by ID
/**
 * @swagger
 * /categories/{category_id}:
 *   get:
 *     summary: Get a specific category by ID
 *     parameters:
 *       - in: path
 *         name: category_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Category"
 */
router.get("/:category_id", async (req, res, next) => {
  const category_id = req.params.category_id;

  try {
    const category = await categoryService.getCategoryById(category_id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
