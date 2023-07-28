class TaskService {
  constructor(
    taskDataRetriever,
    taskDataMapper,
    taskErrorHandler,
    taskRepository
  ) {
    this.taskDataRetriever = taskDataRetriever;
    this.taskDataMapper = taskDataMapper;
    this.taskErrorHandler = taskErrorHandler;
    this.taskRepository = taskRepository;
  }

  async getTaskById(id) {
    try {
      const taskData = await this.taskDataRetriever.getTaskById(id);

      if (taskData) {
        const task = this.taskDataMapper.mapToTask(taskData);
        return task;
      } else {
        throw new Error("Task not found");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getTasksByCategoryId(categoryId) {
    try {
      const tasksData = await this.taskDataRetriever.getTasksByCategoryId(
        categoryId
      );

      const tasks = tasksData.map((taskData) =>
        this.taskDataMapper.mapToTask(taskData)
      );
      return tasks;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllTasks() {
    try {
      const tasksData = await this.taskDataRetriever.getAllTasks();

      const tasks = tasksData.map((taskData) =>
        this.taskDataMapper.mapToTask(taskData)
      );
      return tasks;
    } catch (error) {
      this.taskErrorHandler.handleErrors(error);
    }
  }

  async create(title, description, dueDate, categoryId, status) {
    try {
      const currentDate = new Date();
      const inputDate = new Date(dueDate);

      if (inputDate <= currentDate) {
        throw new Error("Due date must be a future date");
      }

      const result = await this.taskRepository.create({
        title,
        description,
        dueDate,
        categoryId,
        status,
      });

      return result;
    } catch (error) {
      if (error.message === "Due date must be a future date") {
        throw error;
      } else {
        //swallowing errors here
        //creating a new stack trace, dis the previous one
        throw new Error("Failed to create task");
      }
    }
  }

  async updateTask(taskId, title, description, dueDate, categoryId, status) {
    try {
      const updatedTaskData = await this.taskRepository.update({
        taskId,
        title,
        description,
        dueDate,
        categoryId,
        status,
      });

      if (updatedTaskData) {
        const updatedTask = this.taskDataMapper.mapToTask(updatedTaskData);
        return updatedTask;
      } else {
        throw new Error("Failed to update the task");
      }
    } catch (error) {
      throw new Error("Failed to update the task");
    }
  }

  async deleteTask(taskId) {
    try {
      const isDeleted = await this.taskRepository.delete(taskId);
      if (isDeleted) {
        return true;
      } else {
        throw new Error("Task not found");
      }
    } catch (error) {
      if (error.message === "Task not found") {
        throw error;
      } else {
        throw new Error("Failed to delete the task");
      }
    }
  }
}

module.exports = TaskService;
