// Mongo conectado 
const mongoose = require('../database');

// Responsável pro criptografar a senha
const bcrypt = require('bcryptjs');

// Modelo de usuário, define as colunas
const TaskSchema = new mongoose.Schema({
   title: {
   	 type: String,
   	 require: true,
   },
   project: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Project',
     require: true
   },
   assignedTo: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
     require: true
   },
   completed: {
    type: Boolean,
     require: true,
     default: false
   },
   createdAt: {
   	 type: Date,
   	 default: Date.now
   },
});



// DEFINE O MODEL PARA SER UTILIZADO NO MONGO DB
const Task = mongoose.model('Task', TaskSchema);

// REALIZA A EXPORTAÇÃO DO MODEL
module.exports = Task;