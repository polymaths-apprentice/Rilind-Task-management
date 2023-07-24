const express = require("express");
const router = express.Router();
const CategoryService = require("../Services/categoryService");

const categoryService = new CategoryService();

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
    const categories = await categoryService.getAllCategories();
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
    const category = await Category.getById(category_id);
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
