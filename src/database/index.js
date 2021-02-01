const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true); // adicionei, tava dando pau

                                                  // adicionei: useNewUrlParser, tava dando pau
mongoose.connect('mongodb://localhost/noderest', { useNewUrlParser: true });
mongoose.Promise = global.Promise; // parce padrão por projeto

module.exports = mongoose; // exporta esse objeto para as demais aplicações poderem importar esse objeto individualmente
