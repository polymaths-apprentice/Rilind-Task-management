const db = require("../config/postgreDb");
const IRepository = require("./IRepository");
const Task = require("../models/taskModel");

class TaskRepository extends IRepository {
  async getById(id) {
    const query = "SELECT * FROM tasks WHERE id = $1";
    const values = [id];

    try {
      const result = await db.query(query, values);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getAll() {
    const query = "SELECT * FROM tasks";

    try {
      const result = await db.query(query);
      return result;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async create(entity) {
    const { title, description, dueDate, categoryId, status } = entity;
    const query =
      "INSERT INTO tasks (title, description, due_date, category_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description, due_date, category_id, status";
    const values = [title, description, dueDate, categoryId, status];

    const currentDate = new Date();
    const inputDate = new Date(dueDate);

    if (inputDate <= currentDate) {
      throw new Error("Due date must be a future date");
    }

    try {
      const result = await db.query(query, values);
      return result[0];
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async update(entity) {
    const { id, title, description, dueDate, categoryId, status } = entity;
    const query =
      "UPDATE tasks SET title = $1, description = $2, due_date = $3, category_id = $4 , status = $5 WHERE id = $6 RETURNING id, title, description, due_date, category_id, status";
    const values = [title, description, dueDate, categoryId, status, id];

    try {
      const result = await db.query(query, values);
      return result[0];
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async delete(id) {
    const query = "DELETE FROM tasks WHERE id = $1 RETURNING *";
    const values = [id];

    try {
      const result = await db.query(query, values);
      return result.length > 0 ? true : false;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}

module.exports = TaskRepository;
