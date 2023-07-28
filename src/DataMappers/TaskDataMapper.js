//not neccesary 

class TaskDataMapper {
  mapToTask(taskData) {
    if (!taskData) return null;

    const { id, title, description, due_date, category_id, status } = taskData;
    return {
      id,
      title,
      description,
      dueDate: due_date,
      categoryId: category_id,
      status,
    };
  }
}

module.exports = TaskDataMapper;
