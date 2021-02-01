const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');

const authConfig = require("../config/auth"); 

const User    = require('../models/User'); // objeto de model de usuário
const router  = express.Router();


// geração do token
// Parametro: informação que define um token UNICO
// portanto é passado o id do usuário, que é UNICO
// o segundo parametro é a informação que vai ser utilizada para definir como unico
// o arquivo auth json contem a informação que define o hash como UNICO dentre todas as aplicações
// teceiro parametro define o tempo de expiração 86400 segundos : 1 dia
function gerenateToken(params = {}) {
   return jwt.sign(params, authConfig.secret, {
      expiresIn: 86400,
   });
}


router.post('/register', async (req, res) => {
  const { email } = req.body;

  try {
    // procura por email repetidos
    if(await User.findOne({email}))
      return res.status(400).send({ 'error': 'Email ja cadastrado'});

    // repassa todos os parametros(req.body) para o schema, para ser criado
    const user = await User.create(req.body);
    user.password = undefined;

    res.send({
       user, 
       token: gerenateToken({ id: user.id})
    });
  }
  catch(err) {
    return res.status(400).send({ error: 'erro de cadastro'})
  }
});




router.post('/authenticate', async (req, res) => {
   const {email, password} = req.body;

   const user = await User.findOne({email}).select('+password');// passa o password também
    
   if(!user)
      return res.status(400).send({ error: 'User Not found'});

   if(!await bcrypt.compare(password, user.password))
      return res.status(400).send({ error: 'Invalid password' });

   user.password = undefined;
   res.send({
      user, 
      token: gerenateToken({ id: user.id})
   });
});






// RECEBE O APP DO INDEX
// REPASSA O REGISTER PARA O APP DO INDEX PRINCIPAL COM O PREFIXO AUTH
module.exports = app => app.use('/auth', router);