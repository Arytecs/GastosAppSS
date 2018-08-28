'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

//Database Connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/prueba', { useNewUrlParser: true })
    .then(() => {
        console.log("Conectado");

        //Crear servidor
        app.listen(port, () => {
            console.log('Servidor corriendo en http://localhost:3800');
        });
    })
    .catch((error) => console.log(error));