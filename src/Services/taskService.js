const TaskRepository = require("../Repositories/taskRepository");

class TaskService {
  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async getTaskById(id) {
    try {
      const taskData = await this.taskRepository.getById(id);
      if (taskData) {
        return new Task(
          taskData.id,
          taskData.title,
          taskData.description,
          taskData.due_date,
          taskData.category_id,
          taskData.status
        );
      } else {
        return null;
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getTasksByCategoryId(categoryId) {
    try {
      const tasksData = await this.taskRepository.getByCategoryId(categoryId);
      const tasks = tasksData.map(
        (taskData) =>
          new Task(
            taskData.id,
            taskData.title,
            taskData.description,
            taskData.due_date,
            taskData.category_id,
            taskData.status
          )
      );
      return tasks;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getAllTasks() {
    try {
      const tasksData = await this.taskRepository.getAll();
      const tasks = tasksData.map(
        (taskData) =>
          new Task(
            taskData.id,
            taskData.title,
            taskData.description,
            taskData.due_date,
            taskData.category_id,
            taskData.status
          )
      );
      return tasks;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async createTask(title, description, dueDate, categoryId, status) {
    try {
      const newTaskData = await this.taskRepository.create(
        title,
        description,
        dueDate,
        categoryId,
        status
      );

      return new Task(
        newTaskData.id,
        newTaskData.title,
        newTaskData.description,
        newTaskData.due_date,
        newTaskData.category_id,
        newTaskData.status
      );
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async updateTask(taskId, title, description, dueDate, categoryId, status) {
    // Validate dueDate here if needed
    // ...

    try {
      const updatedTaskData = await this.taskRepository.update(
        taskId,
        title,
        description,
        dueDate,
        categoryId,
        status
      );

      return new Task(
        updatedTaskData.id,
        updatedTaskData.title,
        updatedTaskData.description,
        updatedTaskData.due_date,
        updatedTaskData.category_id,
        updatedTaskData.status
      );
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async deleteTask(taskId) {
    try {
      return await this.taskRepository.delete(taskId);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}

module.exports = TaskService;
