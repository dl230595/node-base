const {parentPort, workerData} = require('worker_threads')
const mysql = require('mysql');


//Se toman los valor recibidos por el worker padre
const registrosTotales = parseInt(workerData.registrosTotales)
const workerId = parseInt(workerData.id)
const wokrerPadre = workerData.workerPrincipal
//se definen variables
var total = 0;

// se crea conexión y se conecta
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'workers'
});
connection.connect();

//se agrega el worker a la tabla workers_secundarios, se pasa id, estado,cantidad total de registos de trabajo y worker padre
connection.query(`INSERT INTO workers_secundarios (worker_id,estado, registros_totales, worker_padre) VALUES (${workerId},'1',${registrosTotales},'${wokrerPadre}')`, function (err, result) {
    if (err) throw err;
    })

//recorre y cargar registros de avance en BD
console.log("---------------------------------------")
console.log('inicio operacion Worker '+ workerId)
const t0 = performance.now()
for(let c = 0; c <= registrosTotales; c++){
    total = c
    newData = {registros_completados:total,estado:2}
    //se comprueba si es el ultimo registro se cambia estado de worker a inactivo.
    if (registrosTotales==c)
    newData.estado = 1
    //se actualiza informacion en la tabla
    connection.query('UPDATE workers_secundarios SET ? WHERE worker_id = ?', [newData, workerId], (error, results) => {
        if (error) throw error;
    });
}
//se finaliza la carga y avance de registros
const tz =  performance.now() - t0
console.log('*fin operacion worker '+ workerId +', demoró ' + (tz/1000).toFixed(2) + ' segundos')
console.log("---------------------------------------")
//se cierra conexion
connection.end()