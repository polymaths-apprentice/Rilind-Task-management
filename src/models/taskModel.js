class Task {
  constructor(id, title, description, dueDate, categoryId, status) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.categoryId = categoryId;
    this.status = status;
  }

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
