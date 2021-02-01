// Mongo conectado 
const mongoose = require('../database');

// Responsável pro criptografar a senha
const bcrypt = require('bcryptjs');

// Modelo de usuário, define as colunas
const ProjectSchema = new mongoose.Schema({
   title: {
   	 type: String,
   	 require: true,
   },
   description: {
     type: String,
     require: true,
   },
   user: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
     require: true
   },
   tasks: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Task'
   }],
   createdAt: {
   	 type: Date,
   	 default: Date.now
   },
});



// DEFINE O MODEL PARA SER UTILIZADO NO MONGO DB
const Project = mongoose.model('Project', ProjectSchema);

// REALIZA A EXPORTAÇÃO DO MODEL
module.exports = Project;