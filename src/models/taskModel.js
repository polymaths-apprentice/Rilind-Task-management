class Task {
  constructor(id, title, description, dueDate, categoryId) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.categoryId = categoryId;
  }

  static getById(id) {}

  static getAll() {}

  static create(title, description, dueDate, categoryId) {}

  static update(taskId, title, description, dueDate, categoryId) {}

  static delete(taskId) {}
}

module.exports = Task;
