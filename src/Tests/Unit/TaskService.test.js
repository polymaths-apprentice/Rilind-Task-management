const TaskService = require("../../Services/taskService");

const mockTaskDataRetriever = {
  getTaskById: jest.fn(),
  getTasksByCategoryId: jest.fn(),
  getAllTasks: jest.fn(),
};

const mockTaskDataMapper = {
  mapToTask: jest.fn((taskData) => taskData),
};

const mockTaskErrorHandler = {
  handleErrors: jest.fn(),
};

const mockTaskRepository = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const taskService = new TaskService(
  mockTaskDataRetriever,
  mockTaskDataMapper,
  mockTaskErrorHandler,
  mockTaskRepository
);

describe("getTaskById", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  test("should return a task when found", async () => {
    const taskData = { id: 1, title: "Task 1", description: "Description 1" };

    mockTaskDataRetriever.getTaskById.mockResolvedValueOnce(taskData);

    const result = await taskService.getTaskById(1);

    expect(result).toEqual(taskData);
    expect(mockTaskDataMapper.mapToTask).toHaveBeenCalledWith(taskData);
  });
});

describe("getTasksByCategoryId", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  test("should return an array of tasks", async () => {
    const tasksData = [
      { id: 1, title: "Task 1", description: "Description 1" },
      { id: 2, title: "Task 2", description: "Description 2" },
    ];

    mockTaskDataRetriever.getTasksByCategoryId.mockResolvedValueOnce(tasksData);

    const result = await taskService.getTasksByCategoryId(101);

    expect(result).toEqual(tasksData);
    expect(mockTaskDataMapper.mapToTask).toHaveBeenCalledTimes(
      tasksData.length
    );
  });
});

describe("getAllTasks", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  test("should return an array of tasks", async () => {
    const tasksData = [
      { id: 1, title: "Task 1", description: "Description 1" },
      { id: 2, title: "Task 2", description: "Description 2" },
    ];

    mockTaskDataRetriever.getAllTasks.mockResolvedValueOnce(tasksData);

    const result = await taskService.getAllTasks();

    expect(result).toEqual(tasksData);
    expect(mockTaskDataMapper.mapToTask).toHaveBeenCalledTimes(
      tasksData.length
    );
  });
});

describe("create", () => {
  test("should create a task successfully", async () => {
    const taskData = {
      title: "Test Task",
      description: "This is a test task",
      dueDate: "2023-07-31",
      categoryId: 1,
      status: "pending",
    };

    const expectedTask = { ...taskData, id: 1 };

    mockTaskRepository.create.mockResolvedValue(expectedTask);

    const createdTask = await taskService.create(taskData);

    expect(mockTaskRepository.create).toHaveBeenCalledWith(taskData);
    expect(createdTask).toEqual(expectedTask);
  });

  test("should throw an error if the due date is in the past", async () => {
    const taskData = {
      title: "Test Task",
      description: "This is a test task",
      dueDate: "2020-01-01",
      categoryId: 1,
      status: "created",
    };

    await expect(taskService.create(taskData)).rejects.toThrow(
      "Due date must be a future date"
    );
  });

  test("should throw an error if the task creation fails", async () => {
    const taskData = {
      title: "Test Task",
      description: "This is a test task",
      dueDate: "2023-07-31",
      categoryId: 1,
      status: "created",
    };

    mockTaskRepository.create.mockRejectedValue(
      new Error("Failed to create task")
    );

    await expect(taskService.create(taskData)).rejects.toThrow(
      "Failed to create task"
    );
  });
});

describe("updateTask", () => {
  test("should update a task successfully", async () => {
    const taskId = 1;
    const title = "Updated Task";
    const description = "This is an updated task";
    const dueDate = "2023-08-15";
    const categoryId = 2;
    const status = "completed";

    const updatedTaskData = {
      id: taskId,
      title,
      description,
      dueDate,
      categoryId,
      status,
    };
    mockTaskRepository.update = jest.fn().mockResolvedValue(updatedTaskData);

    const updatedTask = await mockTaskRepository.update(
      taskId,
      title,
      description,
      dueDate,
      categoryId,
      status
    );

    expect(updatedTask).toEqual(updatedTaskData);
    expect(mockTaskRepository.update).toHaveBeenCalledWith(
      taskId,
      title,
      description,
      dueDate,
      categoryId,
      status
    );
  });

  test("should throw an error if the update fails", async () => {
    const taskId = 1;
    const title = "Updated Task";
    const description = "This is an updated task";
    const dueDate = "2023-08-15";
    const categoryId = 2;
    const status = "completed";

    mockTaskRepository.update = jest
      .fn()
      .mockRejectedValue(new Error("Failed to update task"));

    await expect(
      mockTaskRepository.update(
        taskId,
        title,
        description,
        dueDate,
        categoryId,
        status
      )
    ).rejects.toThrow("Failed to update task");
  });
});

describe("deleteTask", () => {
  test("should delete a task successfully", async () => {
    const taskId = 1;

    mockTaskRepository.delete.mockResolvedValue(true);

    const isDeleted = await taskService.deleteTask(taskId);

    expect(isDeleted).toBe(true);
    expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId);
  });

  test("should throw an error if the task is not found for deletion", async () => {
    const taskId = 1;

    mockTaskRepository.delete.mockResolvedValue(false);

    await expect(taskService.deleteTask(taskId)).rejects.toThrow(
      "Task not found"
    );
    expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId);
  });

  test("should throw an error if the task deletion fails", async () => {
    const taskId = 1;

    mockTaskRepository.delete.mockRejectedValue(
      new Error("Failed to delete task")
    );

    await expect(taskService.deleteTask(taskId)).rejects.toThrow(
      "Failed to delete the task"
    );
    expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId);
  });
});
