const db = require("../config/db");

// taskModel.js
class Task {
  constructor(id, title, description, dueDate, categoryId, status) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.categoryId = categoryId;
    this.status = status;
  }

  // Getters
  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  getDueDate() {
    return this.dueDate;
  }

  getCategoryId() {
    return this.categoryId;
  }

  getStatus() {
    return this.status;
  }
}

module.exports = Task;

// class Task {
//   constructor(id, title, description, dueDate, categoryId, status) {
//     this.id = id;
//     this.title = title;
//     this.description = description;
//     this.dueDate = dueDate;
//     this.categoryId = categoryId;
//     this.status = status;
//   }

//   static async getById(id) {
//     const query = "SELECT * FROM tasks WHERE id = $1";
//     const values = [id];

//     try {
//       const result = await db.query(query, values);

//       if (result.length > 0) {
//         const taskData = result[0];
//         return new Task(
//           taskData.id,
//           taskData.title,
//           taskData.description,
//           taskData.due_date,
//           taskData.category_id,
//           taskData.status
//         );
//       } else {
//         return null;
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   }

//   static async getByCategoryId(id) {
//     const query = "SELECT * FROM tasks WHERE category_id = $1";
//     const values = [id];

//     console.log("Test test");
//     try {
//       const result = await db.query(query, values);
//       console.log(result);

//       const tasks = result.map((taskData) => {
//         return new Task(
//           taskData.id,
//           taskData.title,
//           taskData.description,
//           taskData.due_date,
//           taskData.category_id,
//           taskData.status
//         );
//       });
//       return tasks;
//     } catch (error) {
//       console.log(error.message);
//     }
//   }

//   static async getAll() {
//     const query = "SELECT * FROM tasks";

//     try {
//       const result = await db.query(query);

//       console.log(result);

//       const tasks = result.map((taskData) => {
//         return new Task(
//           taskData.id,
//           taskData.title,
//           taskData.description,
//           taskData.due_date,
//           taskData.category_id,
//           taskData.status
//         );
//       });
//       return tasks;
//     } catch (err) {
//       console.log(err.message);
//     }
//   }

//   static async create(title, description, dueDate, categoryId, status) {
//     const query =
//       "INSERT INTO tasks (title, description, due_date, category_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description, due_date , category_id , status";
//     const values = [title, description, dueDate, categoryId, status];

//     const currentDate = new Date();
//     const inputDate = new Date(dueDate);

//     if (inputDate <= currentDate) {
//       throw new Error("Due date must be a future date");
//     }

//     try {
//       const result = await db.query(query, values);

//       console.log(result);
//       const newTask = result[0];
//       return newTask;
//     } catch (error) {
//       console.log(error.message);
//     }
//   }

//   static async update(taskId, title, description, dueDate, categoryId, status) {
//     const query =
//       "UPDATE tasks SET title = $1, description = $2, due_date = $3, category_id = $4 , status = $5 WHERE id = $6 RETURNING id, title, description, due_date , category_id, status";
//     const values = [title, description, dueDate, categoryId, status, taskId];

//     try {
//       console.log("_________________________________");

//       const result = await db.query(query, values);
//       console.log(result);
//       return result[0];
//     } catch (error) {
//       console.log(error.message);
//     }
//   }
//   static async delete(taskId) {
//     const query = "DELETE FROM tasks WHERE id = $1 RETURNING *";
//     const values = [taskId];

//     try {
//       const result = await db.query(query, values);

//       if (result.length > 0) {
//         return true;
//       }
//       return result[0] > 0;
//     } catch (error) {
//       console.log(error.message);
//       return false;
//     }
//   }
// }

module.exports = Task;
