const swaggerJsdoc = require("swagger-jsdoc");

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
        url: "http://localhost:3001",
      },
    ],
    components: {
      schemas: {
        Task: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            title: {
              type: "string",
            },

            description: {
              type: "string",
            },
            dueDate: {
              type: "string",
              format: "date-time",
            },
            categoryId: {
              type: "integer",
            },
            status: {
              type: "string",
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            name: {
              type: "string",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/taskRoutes.js", "./src/routes/categoriesRoutes.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
