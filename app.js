// Import required modules and packages
const express = require("express");
const dotenv = require("dotenv");
const db = require("./src/config/db");
const taskRoutes = require("./src/routes/taskRoutes");
const errorMiddleware = require("./src/middleware/errorMiddleware");
const swaggerDocs = require("./src/middleware/swagger");
const swaggerUi = require("swagger-ui-express");

// Load environment variables
dotenv.config();

console.log(process.env.DB_USER);
console.log(process.env.DB_HOST);
console.log(process.env.DB_NAME);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_PORT);

// Create Express app
const app = express();

// Middleware
app.use(express.json());

// Database connection
// db.connect();

// Routes
app.use("/tasks", taskRoutes);

// Error handling middleware
// app.use(errorMiddleware);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start the server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
