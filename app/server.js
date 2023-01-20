const express = require('express');
const cors = require('cors')
const app = express();

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
