class TaskErrorHandler {
  handleErrors(error) {
    throw new Error(error.message);
  }
}

module.exports = TaskErrorHandler;
