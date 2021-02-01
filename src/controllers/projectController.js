const express        = require('express');
const authMiddleware = require('../middleware/auth');

const Project        = require('../models/Project');
const Task           = require('../models/Task');

const router = express.Router();
router.use(authMiddleware);










// LISTA TODOS OS PROJETOS
router.get('/', async (req, res) => {
	try {                                            // RETORNA AS ANTIDADES POPULADAS
    const projects = await Project.find().populate(['user', 'tasks']);
    return res.send({ projects });
	}
	catch(err){
    res.status(400).send({ error : 'Error no get' })
	}
});









// LISTA UM PROJETO ESPECIFICO
router.get('/:projectId', async (req, res) => {
	try {                                                                   // RETORNA AS ANTIDADES POPULADAS
    const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);
    return res.send({ project });
	}
	catch(err){
    res.status(400).send({ error : 'Error no get' })
	}
});









// REALIZA O CADASTRO DE UM PROJETO
router.post('/', async (req, res) => {
	try {
    const {title, description, tasks } = req.body;

    // 1- REGISTRA O PROJETO
    const project = await Project.create({title, description, user: req.userId});
    
  
    // 2- AGUARDA O VINCULO DE TODAS AS TAREFAS AO PROJETO CADASTRADO
    await Promise.all(tasks.map(async task => {
    	const projectTask = new Task({ ...task, project: project._id });
    	await projectTask.save();

    	project.tasks.push(projectTask);
    }));
    
    // 3- SALVA AS ALTERAÇÕES
    await project.save();
    return res.send({ project });
	}
	catch(err){
    res.status(400).send({ error : 'Error no create' })
	}
});










// REALIZA O UPDATE DE UM PROJETO
router.put('/:projectId', async (req, res) => {
	try {
    const {title, description, tasks } = req.body;

    // AQUI ELE JA FAZ O UPDATE DAS INFORMAÇÕES DE PROJETO
    const project = await Project.findByIdAndUpdate(req.params.projectId, {
    	title, 
    	description, 
    }, 
    { new: true });// { new: true } RETORNA OS DADOS ATUALIZADOS, O MONGO POR PADRAO RETORNA OS VALORES ANTIGOS

    // REMOVE TODAS AS TASKS, PARA ADICIONAS AS NOVAS
    project.tasks = [];

    //1- REMOVE AS TASKS
    await Task.remove({ project: project._id });

    //2- ADICIONA AS TASKS
    await Promise.all(tasks.map(async task => {
    	const projectTask = new Task({ ...task, project: project._id });
    	await projectTask.save();

    	project.tasks.push(projectTask);
    }));

    //3- SALVA AS TASKAS OPERADAS
    await project.save();
    return res.send({ project });
	}
	catch(err){
    res.status(400).send({ error : 'Error no UPDATE' })
	}
});








// DELETA UM PROJETO ESPECIFICO
router.delete('/:projectId', async (req, res) => {
	try {
    const projects = await Project.findByIdAndRemove(req.params.projectId).populate('user');
    return res.send();
	}
	catch(err){
    res.status(400).send({ error : 'Error no get' })
	}
});













module.exports = app => app.use('/projects', router);