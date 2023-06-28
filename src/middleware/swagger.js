const swaggerJsdoc = require("swagger-jsdoc");
const swaggerAutogen = require("swagger-autogen")();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "API documentation for the Task Management API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/taskRoutes.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
