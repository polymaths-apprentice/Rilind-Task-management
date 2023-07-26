class TaskDataRetriever {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async getTaskById(id) {
    try {
      const taskData = await this.taskRepository.getById(id);
      return taskData;
    } catch (error) {
      throw new Error("Failed to get task by ID");
    }
  }

  async getTasksByCategoryId(categoryId) {
    try {
      const tasksData = await this.taskRepository.getByCategoryId(categoryId);
      return tasksData;
    } catch (error) {
      throw new Error("Failed to get tasks by category ID");
    }
  }

  async getAllTasks() {
    try {
      const tasksData = await this.taskRepository.getAll();

      return tasksData;
    } catch (error) {
      throw new Error("Failed to get all tasks");
    }
  }
}

module.exports = TaskDataRetriever;
