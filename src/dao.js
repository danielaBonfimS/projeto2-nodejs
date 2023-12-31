const { TaskList } = require('./task-list.entity');
const { Task } = require('./task.entity');

const pg = require('knex')({
  client: 'pg',
  connection: {
    user: 'postgres',
    host: '34.27.124.6',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
  },
});

class DAO {
  constructor() {
    this.taskTable = 'task'
  }

  async createTask(task) {
    const newTask = (await pg.transaction(trx => {
      const taskJSON = this._mapToDb(task);
      return trx(this.taskTable)
      .insert(taskJSON)
      .returning('*')

    }))[0]
    return this._mapToEntityTask(newTask);
  }

  async getTasks() {
    const tasks = await pg.select(['task.*']).from(`${this.taskTable} as task`);
    return this._mapToTasksListEntity(tasks);
  }

  async getTask(id) {
    const task = (await pg.transaction(trx => {
      return trx(this.taskTable)
      .where({id: id})
      .returning('*')

    }))[0]
    return this._mapToEntityTask(task);
  }

  async deleteTask(id){
    await pg.transaction(trx => {
      return trx(this.taskTable)
      .whereIn('id', [id])
      .del()
    })
    return true;
  }

  async updateTask(id, body){
    const updatedTask = (await pg.transaction(trx => {
      return trx(this.taskTable)
      .where('id', id)
      .update(body)
      .returning('*')
    }))[0]

    console.log(updatedTask)
    return this._mapToEntityTask(updatedTask);
  }

  _mapToDb(task) {
    return {
      id: task.id,
      label: task.label,
      description: task.description,
      deadline: task.deadline
    }
  }

  _mapToEntityTask(json){
    return new Task({
      createdAt: json.created_at_utc,
      deadline: json.deadline,
      description: json.description,
      id: json.id,
      label: json.label
    })
  }

  _mapToTasksListEntity(jsonList){
    return new TaskList({
      tasks: jsonList.map(t => this._mapToEntityTask(t))
    })
  }
}

module.exports = { DAO }