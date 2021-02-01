const jwt        = require('jsonwebtoken');
const authConfig = require('../config/auth.json'); // INFORMAÇÃO UNICA PARA A CRIPTOGRAFIA DO JSONWEBTOKEN


/*
  O OBJETIVO DESSE EXPORT E DE SERVIR COMO INTERMEDIARIO PARA AS ROTAS DOS CONTROLLERS, PARA VERIFICAR O TOKEN DE ACESSO DA API
*/


// module.exports = definie que isso vai ser exportado direto
// é melhor fazer assim, do que exportar la no final do arquivo, levando em consideração que isso é a unica coisa a ser exportada desse arquivo
module.exports = (req, res, next) => {

  // É POR ONDE A GENTE ENVIA O JSON WEB TOKEN
  const authHeader = req.headers.authorization;
    
  // Sem cabeçalhos
  if(!authHeader)
  	return res.status(401).send({ error: 'No token provided'});
  
  const parts = authHeader.split(' ');

  // Sem duas partes
  if(!parts.length === 2)
  	return res.status(401).send({ error: 'Token Error'});
  

  // DESESTRUTURAÇÂO
  const [ scheme, token ] = parts;
  
  // sem o Bearer
  if(!/^Bearer$/i.test(scheme)) 
  	return res.status(401).send({ error: 'Token malformated'});
 
  // Passa a informação unica, o token
  // A saida é o dado criptografado no authController
  // decoded.id = tem que ser a mesma propriedade usado no authController (.id)
  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if(err) 
    	res.status(401).send({ error: 'Token invalido'});
    
    req.userId = decoded.id;
    
    // CONTINUA COM A ROTA QUE FOI CHAMADA PELO O USUARIO NORMALMENTE, SEM INTERRUPÇÃO
    return next();
  })
};
