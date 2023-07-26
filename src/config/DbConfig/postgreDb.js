const { Pool } = require("pg");
const IDatabase = require("./dbInterface");

class PostGreDB extends IDatabase {
  static instance;

  constructor() {
    if (PostGreDB.instance) {
      return PostGreDB.instance;
    }

    super();
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    PostGreDB.instance = this;
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

module.exports = PostGreDB;
