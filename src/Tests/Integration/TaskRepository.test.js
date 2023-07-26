const TaskRepository = require("../../Repositories/taskRepository");
const PostGreDB = require("../../config/DbConfig/postgreDb");

jest.mock("../../config/DbConfig/postgreDb");

describe("TaskRepository", () => {
  var taskRepo;
  var db;

  beforeAll(() => {
    db = new PostGreDB();
    db.query = jest.fn();
    taskRepo = new TaskRepository(db);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getById", () => {
    test("should return a task when it exists", async () => {
      const task_id = 1;
      const expectedTask = {
        id: 1,
        title: "Test Task",
        description: "Test description",
        dueDate: "2023-08-01",
        categoryId: 1,
        status: "pending",
      };
      db.query.mockResolvedValueOnce([expectedTask]);

      const result = await taskRepo.getById(task_id);

      expect(result).toEqual(expectedTask);
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM tasks WHERE id = $1",
        [task_id]
      );
    });

    test("should throw error when the task does not exist with id", async () => {
      const task_id = 2;

      db.query.mockImplementation(() => Promise.resolve([]));

      await expect(taskRepo.getById(task_id)).rejects.toThrow(
        "Task not found with id"
      );
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM tasks WHERE id = $1",
        [task_id]
      );
    });

    test("should throw an error when the database query fails", async () => {
      const task_id = 3;
      db.query.mockRejectedValueOnce(new Error());

      await expect(taskRepo.getById(task_id)).rejects.toThrow(
        "Database query failed to get task by ID"
      );
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM tasks WHERE id = $1",
        [task_id]
      );
    });
  });

  describe("getAllTasks", () => {
    test("should return all tasks", async () => {
      const taskData = [
        {
          id: 1,
          title: "Task 1",
          description: "This is the description for Task 1",
          dueDate: "2023-08-15",
          categoryId: 101,
          status: "pending",
        },
        {
          id: 2,
          title: "Task 2",
          description: "This is the description for Task 2",
          dueDate: "2023-08-20",
          categoryId: 102,
          status: "completed",
        },
        {
          id: 3,
          title: "Task 3",
          description: "This is the description for Task 3",
          dueDate: "2023-08-25",
          categoryId: 103,
          status: "in-progress",
        },
      ];

      db.query.mockResolvedValueOnce(taskData);

      const results = await taskRepo.getAll();

      expect(results.length).toBe(3);
      expect(results).toEqual(taskData);
      expect(db.query).toHaveBeenCalled();
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM tasks");
    });

    test("Should throw an error when database fails to get all tasks", async () => {
      const errorMessage = "Database query failed to get all task";

      db.query.mockRejectedValueOnce(new Error());

      await expect(taskRepo.getAll()).rejects.toThrow(errorMessage);
    });
  });

  describe("create", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should create a new task and return the task object", async () => {
      const taskToCreate = {
        title: "New Task",
        description: "This is a new task",
        dueDate: "2023-08-31",
        categoryId: 201,
        status: "pending",
      };

      const expectedTask = {
        id: 1,
        title: "New Task",
        description: "This is a new task",
        dueDate: "2023-08-31",
        categoryId: 201,
        status: "pending",
      };

      db.query.mockResolvedValueOnce([expectedTask]);

      const createdTask = await taskRepo.create(taskToCreate);

      expect(createdTask).toEqual(expectedTask);
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO tasks (title, description, due_date, category_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description, due_date, category_id, status",
        [
          taskToCreate.title,
          taskToCreate.description,
          taskToCreate.dueDate,
          taskToCreate.categoryId,
          taskToCreate.status,
        ]
      );
    });

    test("should throw an error when the dueDate is not a future date", async () => {
      const taskToCreate = {
        title: "New Task",
        description: "This is a new task",
        dueDate: "2022-08-15", // Past date
        categoryId: 201,
        status: "pending",
      };

      await expect(taskRepo.create(taskToCreate)).rejects.toThrow(
        "Due date must be a future date"
      );
      expect(db.query).not.toHaveBeenCalled();
    });

    it("should throw an error when the database query fails", async () => {
      const taskToCreate = {
        title: "New Task",
        description: "This is a new task",
        dueDate: "2023-08-31",
        categoryId: 201,
        status: "pending",
      };

      db.query.mockRejectedValueOnce(new Error("Database query failed"));

      await expect(taskRepo.create(taskToCreate)).rejects.toThrow(
        "Database query failed to create task"
      );
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe("update", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should update a task and return the updated task object", async () => {
      const taskIdToUpdate = 1;
      const updatedTaskData = {
        id: taskIdToUpdate,
        title: "Updated Task",
        description: "This is an updated task",
        dueDate: "2023-09-15",
        categoryId: 202,
        status: "in-progress",
      };

      const expectedUpdatedTask = {
        id: taskIdToUpdate,
        title: "Updated Task",
        description: "This is an updated task",
        dueDate: "2023-09-15",
        categoryId: 202,
        status: "in-progress",
      };

      db.query.mockResolvedValueOnce([expectedUpdatedTask]);

      const updatedTask = await taskRepo.update(updatedTaskData);

      expect(updatedTask).toEqual(expectedUpdatedTask);
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(
        "UPDATE tasks SET title = $1, description = $2, due_date = $3, category_id = $4 , status = $5 WHERE id = $6 RETURNING id, title, description, due_date, category_id, status",
        [
          updatedTaskData.title,
          updatedTaskData.description,
          updatedTaskData.dueDate,
          updatedTaskData.categoryId,
          updatedTaskData.status,
          taskIdToUpdate,
        ]
      );
    });

    test("should throw an error when the database query fails", async () => {
      const taskIdToUpdate = 1;
      const updatedTaskData = {
        id: taskIdToUpdate,
        title: "Updated Task",
        description: "This is an updated task",
        dueDate: "2023-09-15",
        categoryId: 202,
        status: "in-progress",
      };

      db.query.mockRejectedValueOnce(new Error("Database query failed"));

      await expect(taskRepo.update(updatedTaskData)).rejects.toThrow(
        "Database query failed to update task with id " + taskIdToUpdate
      );
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe("delete", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should delete a task and return true when the task is found", async () => {
      const taskIdToDelete = 1;
      const deletedTaskData = {
        id: taskIdToDelete,
        title: "Task 1",
        description: "This is the description for Task 1",
        dueDate: "2023-08-15",
        categoryId: 101,
        status: "pending",
      };

      db.query.mockResolvedValueOnce([deletedTaskData]);

      const isDeleted = await taskRepo.delete(taskIdToDelete);

      expect(isDeleted).toBe(true);
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(
        "DELETE FROM tasks WHERE id = $1 RETURNING *",
        [taskIdToDelete]
      );
    });

    test("should delete a task and return false when the task is not found", async () => {
      const taskIdToDelete = 2;

      db.query.mockResolvedValueOnce([]);

      const isDeleted = await taskRepo.delete(taskIdToDelete);

      expect(isDeleted).toBe(false);
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(
        "DELETE FROM tasks WHERE id = $1 RETURNING *",
        [taskIdToDelete]
      );
    });

    test("should throw an error when the database query fails", async () => {
      const taskIdToDelete = 3;

      db.query.mockRejectedValueOnce(new Error("Database query failed"));

      await expect(taskRepo.delete(taskIdToDelete)).rejects.toThrow(
        "Database query failed to delete task with id " + taskIdToDelete
      );
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });
});
