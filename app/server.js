const express = require('express');
const cors = require('cors')
const app = express();
const agregarWorkers = require('./helpers.js')

// Setting
const PORT = process.env.PORT || 3000;

// Middleware
// Para poder rellenar el req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
/*
Documentacion
https://www.npmjs.com/package/cors
*/
var corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
}
app.use(cors(corsOptions))
// Rutas
app.use(require('./routes/public'));

// Arrancamos el servidor
app.listen(PORT, function () {
    console.log(`La app ha arracado en http://localhost:${PORT}`);
});




//se define el array que se pasa como dato al worker principal
const arrayRegistros = [2000,1000,500,1300,4500,9000,15200,3600,8500,850,460,1101,1200,5000,90000]
const arrayRegistdos2= [2000,1000,500,1300,4500,19000]
//se llama a la funcion para crear el worker principal
agregarWorkers(arrayRegistros,'pepito')
agregarWorkers(arrayRegistdos2,'workerMain_2')




