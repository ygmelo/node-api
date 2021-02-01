// Mongo conectado 
const mongoose = require('../database');

// Responsável pro criptografar a senha
const bcrypt = require('bcryptjs');

// Modelo de usuário, define as colunas
const UserSchema = new mongoose.Schema({
   name: {
   	 type: String,
   	 require: true,
   },
   email: {
   	 type: String,
   	 unique: true,
   	 required: true,
   	 lowercase: true
   },
   password: {
   	 type: String,
   	 require: true,
   	 select: false
   },
   createdAt: {
   	 type: Date,
   	 default: Date.now
   },
});


// função pre do mongose - acontecer algo antes de salvar
UserSchema.pre('save', async function(next){
  /* bcryps retorna uma promisse, por iso async await...
     10: numero de vezes que é aplicado o algoritmo: round */
  const hash    = await bcrypt.hash(this.password, 10);
	this.password = hash;   // this: objeto que esta sendo salvado
  next();
})


// DEFINE O MODEL PARA SER UTILIZADO NO MONGO DB
const User = mongoose.model('User', UserSchema);

// REALIZA A EXPORTAÇÃO DO MODEL
module.exports = User;