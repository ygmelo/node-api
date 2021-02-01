const express    = require('express');
const bodyParser = require('body-parser');
const app        = express();

// API INTERPRETA INFORMAÇÕES EM JSON
app.use(bodyParser.json());

// DECODAR OS PARAMETROS PASSADOR PELA URL
app.use(bodyParser.urlencoded({ extended: false}));

// app = objeto definido uma vez, e tem que usar em todos outros arquivos:
require('./controllers/authController')(app);    // repasssa o APP - tem que existir apenas um por serviço node, se não criar serviços diferentes
require('./controllers/projectController')(app); // repasssa o APP - tem que existir apenas um por serviço node, se não criar serviços diferentes


app.listen(3000, function(){
	console.log("Servidor rodando na porta 3000");
});

app.use(express.static('view'));
