const express = require("express");
const router = express.Router();
const Task = require("../models/taskModel");
const db = require("../config/db");
const swagger = require("../middleware/swagger");

// GET all tasks
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.getAll();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// GET a task by ID
/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the task
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.get("/:id", async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);
    const task = await Task.getById(taskId);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    next(error);
  }
});

// POST a new task
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request
 */
router.post("/", async (req, res, next) => {
  try {
    const { title, description, dueDate, categoryId } = req.body;
    const task = await Task.create(title, description, dueDate, categoryId);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// PUT (update) an existing task
/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update an existing task
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the task
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       400:
 *         description: Bad request
 */
router.put("/:id", async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);
    const { title, description, dueDate, categoryId } = req.body;
    const updatedTask = await Task.update(
      taskId,
      title,
      description,
      dueDate,
      categoryId
    );
    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE a task
/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the task
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: Task not found
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);
    const deletedTask = await Task.delete(taskId);
    if (deletedTask) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
