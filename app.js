// Import required modules and packages
const express = require("express");

const dotenv = require("dotenv");
dotenv.config();

const db = require("./src/config/db");
const taskRoutes = require("./src/routes/taskRoutes");
const errorMiddleware = require("./src/middleware/errorMiddleware");
const swaggerDocs = require("./src/middleware/swagger");
const swaggerUi = require("swagger-ui-express");

// Load environment variables

// Create Express app
const app = express();

// Middleware
app.use(express.json());

// Database connection
db.connect();

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
