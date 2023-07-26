// Import required modules and packages
const express = require("express");

const dotenv = require("dotenv");
dotenv.config();

const PostGreDB = require("./src/config/DbConfig/postgreDb");
const taskRouteConfig = require("./src/config/RouteConfig/taskRoutesConfig");

const categoriesRoutes = require("./src/routes/categoriesRoutes");
const swaggerDocs = require("./src/middleware/swagger");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const db = new PostGreDB();

const app = express();

app.use(cors());

app.use(express.json());

db.connect();

// Set up task routes using the configuration

//taskRouteConfig separate the configuration for /tasks since it will have dependency injection for the routes

taskRouteConfig(app);
app.use("/categories", categoriesRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start the server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
