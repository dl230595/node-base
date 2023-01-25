const {Worker, workerData} = require('worker_threads')
const {parentPort} = require('worker_threads')
const mysql = require('mysql')
const dataHilos = workerData.arrayaRegistros
const nombre = workerData.name

//conexion a DB
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'workers'
});

//conexion a la base de datos
connection.connect();

//recuperar ID del worker

//se limpia la tabla de workers secundarios
connection.query("TRUNCATE TABLE workers_secundarios", function (err, result) {
    if (err) throw err;
});

//se cierra conexion
connection.end()

//se crean los N workers secundarios
for (let i = 0; i < dataHilos.length; i++) {
    const registrosTotales = dataHilos[i]
    const id = i + 1
    //se crean los datos para nombrar los workers de manera dinamica
    const name = "worker" + i;
    //Al worker secundario se le pasa como dato, la cantidad de registros que trabajara, su id, y el nombre del worker padre.
    const value = new Worker('./app/controllers/WorkerSecundario.js' , { workerData: { registrosTotales: registrosTotales , id: id, workerPrincipal:nombre } });
    const { [name]: constant } = { [name]: value };
}


