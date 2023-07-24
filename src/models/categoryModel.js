const db = require("../config/db");

class Category {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  // Getters
  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }
}

module.exports = Category;
