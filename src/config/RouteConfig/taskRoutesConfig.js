const TaskService = require("../../Services/taskService");
const TaskRepository = require("../../Repositories/taskRepository");
const TaskDataMapper = require("../../DataMappers/TaskDataMapper");
const TaskDataRetriever = require("../../DataRetrievers/TaskDataRetriever");
const TaskErrorHandler = require("../../ErrorHandlers/TaskErrorHandler");
const PostgreDb = require("../DbConfig/postgreDb");

const db = new PostgreDb();
const taskRepository = new TaskRepository(db);
const taskDataMapper = new TaskDataMapper();
const taskErrorHandler = new TaskErrorHandler();
const taskDataRetriever = new TaskDataRetriever(taskRepository);

const taskService = new TaskService(
  taskDataRetriever,
  taskDataMapper,
  taskErrorHandler,
  taskRepository
);

const taskRoutes = require("../../routes/taskRoutes")(taskService);

const taskRoutesConfig = (app) => {
  app.use("/tasks", taskRoutes);
};

module.exports = taskRoutesConfig;
