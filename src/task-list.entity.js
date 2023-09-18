class TaskList {
  constructor({
    tasks
  }) {
    this.tasks = tasks;
  }

  get getTasksSortedByCreation(){
    return this.tasks.sort((a, b) => a.createdAt - b.createdAt);
  }
}

module.exports = {TaskList}