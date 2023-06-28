const { Pool } = require("pg");

console.log(process.env.DB_USER);
console.log(process.env.DB_HOST);
console.log(process.env.DB_NAME);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_PORT);

class Database {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
  }

  async connect() {
    try {
      await this.pool.connect();
      console.log("Connected to the database");
    } catch (error) {
      console.error("Failed to connect to the database", error);
    }
  }

  async query(text, values) {
    try {
      const result = await this.pool.query(text, values);
      return result.rows;
    } catch (error) {
      console.error("Database query error", error);
      throw error;
    }
  }
}

module.exports = new Database();
