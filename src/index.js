const express = require('express');
const bodyParser = require('body-parser');
const { Task } = require('./task.entity');
const { DAO } = require('./dao');
const app = express()
const port = 3000

app.use(function (req, res, next) {
  if (req.get('x-amz-sns-message-type')) {
    req.headers['content-type'] = 'application/json';
  }
  next();
})
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json({strict: false}))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/tarefas', async (req, res) => {
  const body = req.body;

  if(!body.label){
    res.status(400).send('Tarefa inválida. O atributo "label" é obrigatório');
  }

  const newTask= new Task({
    description: body.description,
    deadline: body.deadline,
    label: body.label
  })

  try{
    const task = await new DAO().createTask(newTask);
    res.status(200).send(task);
  }catch(e){
    console.log(e);
    res.status(500).send('Erro ao criar tarefa');
  }
})

app.get('/tarefas', async (req, res) => {
  try{
    const taskList = await new DAO().getTasks();
    res.status(200).send(taskList.getTasksSortedByCreation);
  }catch(e){
    console.log(e);
    res.status(500).send('Erro ao buscar tarefas');
  }
})

app.get('/tarefas/:id', async (req, res) => {
  const id = req.params.id;
  try{
    const task = await new DAO().getTask(id);
    res.status(200).send(task);
  }catch(e){
    console.log(e);
    res.status(500).send('Erro ao buscar tarefa');
  }
})

app.patch('/tarefas/:id', async (req, res) => {
  const body = req.body;
  const id = req.params.id;

  console.log(body)
  try{
    const task = await new DAO().updateTask(id, body);
    res.status(200).send(task);
  }catch(e){
    console.log(e);
    res.status(500).send('Erro ao atualizar tarefa');
  }
})

app.delete('/tarefas/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id)
  try{
    const hasDeleted = await new DAO().deleteTask(id);
    res.status(200).send(hasDeleted);
  }catch(e){
    console.log(e);
    res.status(500).send('Erro ao deletar tarefa');
  }
})

module.exports = {
  main: app
}