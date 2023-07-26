const IRepository = require("./IRepository");

class TaskRepository extends IRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async getById(id) {
    const query = "SELECT * FROM tasks WHERE id = $1";
    const values = [id];

    try {
      const result = await this.db.query(query, values);

      if (result.length > 0) {
        return result[0];
      } else {
        throw new Error("Task not found with id");
      }
    } catch (error) {
      if (error.message === "Task not found with id") {
        throw error;
      } else {
        throw new Error("Database query failed to get task by ID");
      }
    }
  }

  async getAll() {
    const query = "SELECT * FROM tasks";

    console.log("TEST TEST TEST");
    try {
      const result = await this.db.query(query);
      return result;
    } catch (error) {
      throw new Error("Database query failed to get all task");
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
      const result = await this.db.query(query, values);
      return result[0];
    } catch (error) {
      throw new Error("Database query failed to create task");
    }
  }

  async update(entity) {
    const { taskId, title, description, dueDate, categoryId, status } = entity;
    const query =
      "UPDATE tasks SET title = $1, description = $2, due_date = $3, category_id = $4 , status = $5 WHERE id = $6 RETURNING id, title, description, due_date, category_id, status";
    const values = [title, description, dueDate, categoryId, status, taskId];
    console.log(taskId, title, description, dueDate, categoryId, status);

    try {
      const result = await this.db.query(query, values);
      return result[0];
    } catch (error) {
      throw new Error("Database query failed to update task with id " + taskId);
    }
  }

  async delete(id) {
    const query = "DELETE FROM tasks WHERE id = $1 RETURNING *";
    const values = [id];

    try {
      const result = await this.db.query(query, values);
      return result.length > 0 ? true : false;
    } catch (error) {
      throw new Error("Database query failed to delete task with id " + id);
    }
  }
}

module.exports = TaskRepository;
