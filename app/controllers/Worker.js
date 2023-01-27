const {Worker, workerData} = require('worker_threads')
const mysql = require('mysql')
const id = workerData.id //Solo para query
const wokrerId = workerData.uuid //id del propio worker
const { v4: uuidv4 } = require('uuid'); //para crear el id del thread

//Supuesta consulta con eL ID del worker recibido por wokerData.
const queryID = {
    arrayHilos:[
        {
            id: 123,
            descripcion:"Enero"
        },
        {
            id:456 ,
            descripcion:"Febrero"
        }

    ],
    descripcion:"2022"
}

//se crea para pasar como parametro en consulta
const inicioDescripcion = {
    descripcion: queryID.descripcion,
    fecha_inicio: new Date()
}

//conexion a DB
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'workers'
});

//conexion a la base de datos
connection.connect();

//se actualiza datos del worker, agregando la descripcion despues del resultado de la consulta previa con el ID recibido y la fecha de inicio
connection.query('UPDATE workers SET ? WHERE uuid = ?', [inicioDescripcion, wokrerId], (error, results) => {
    if (error) throw error;
});

//se limpia la tabla de workers secundarios
connection.query("TRUNCATE TABLE threads", function (err, result) {
    if (err) throw err;
});

//se crean los N workers secundarios
for (let i = 0; i < queryID.arrayHilos.length; i++) {
    //se crean los datos para nombrar los workers de manera dinamica
    const name = "thread_" + queryID.arrayHilos[i].descripcion;
    //Al worker secundario se le pasa como dato, un objeto con id y descripcion, su id, y el id del worker padre.
    const value = new Worker('./app/controllers/Threads.js' , { workerData: { threadData: queryID.arrayHilos[i] , uudid: uuidv4(), workerId:wokrerId} });
    const { [name]: constant } = { [name]: value };
}
//se cierra conexion
connection.end()




