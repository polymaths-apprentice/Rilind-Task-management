const db = require("../config/db");
class Task {
  constructor(id, title, description, dueDate, categoryId) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.categoryId = categoryId;
  }

  static async getById(id) {
    const query = "SELECT * FROM tasks WHERE id = $1";
    const values = [id];

    try {
      const result = await db.query(query, values);

      if (result.length > 0) {
        const taskData = result[0];
        return new Task(
          taskData.id,
          taskData.title,
          taskData.description,
          taskData.due_date,
          taskData.category_id
        );
      } else {
        return null;
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  static async getAll() {
    const query = "SELECT * FROM tasks";

    try {
      const result = await db.query(query);

      console.log(result);

      const tasks = result.map((taskData) => {
        return new Task(
          taskData.id,
          taskData.title,
          taskData.description,
          taskData.due_date,
          taskData.category_id
        );
      });
      return tasks;
    } catch (err) {
      console.log(err.message);
    }
  }

  static async create(title, description, dueDate, categoryId) {
    const query =
      "INSERT INTO tasks (title, description, due_date, category_id) VALUES ($1, $2, $3, $4) RETURNING id, title, description, due_date , category_id ";
    const values = [title, description, dueDate, categoryId];

    const currentDate = new Date();
    const inputDate = new Date(dueDate);

    if (inputDate <= currentDate) {
      throw new Error("Due date must be a future date");
    }

    try {
      const result = await db.query(query, values);

      console.log(result);
      const newTask = result[0];
      return newTask;
    } catch (error) {
      console.log(error.message);
    }
  }

  static async update(taskId, title, description, dueDate, categoryId) {
    const query =
      "UPDATE tasks SET title = $1, description = $2, due_date = $3, category_id = $4 WHERE id = $5 RETURNING id, title, description, due_date , category_id";
    const values = [title, description, dueDate, categoryId, taskId];

    try {
      const result = await db.query(query, values);
      console.log(result);
      return result[0];
    } catch (error) {
      console.log(error.message);
    }
  }
  static async delete(taskId) {
    const query = "DELETE FROM tasks WHERE id = $1 RETURNING *";
    const values = [taskId];

    try {
      const result = await db.query(query, values);

      if (result.length > 0) {
        return true;
      }
      return result[0] > 0;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
}

module.exports = Task;
