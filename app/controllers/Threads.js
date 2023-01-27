const {workerData} = require('worker_threads')
const mysql = require('mysql');

//Se toman los valor recibidos por el worker padre
const threadData = workerData.threadData
const wokrerPadre = workerData.workerId //id del worker padre
const uudid = workerData.uudid //id del thread
const id = threadData.id //id de parametro para realizar consulta

//se realiza supuesta query para obtener los coprobantes a trabajar
const arraysThread = {
    123:[1000,15000,1200,210,500,600],
    456:[1000,800,330,1200,210,500,600]
}

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
connection.query(`INSERT INTO threads (uuid, descripcion, worker_id, estado_id,registros_total) VALUES ('${uudid}','${threadData.descripcion}','${wokrerPadre}',1,${arraysThread[id].length})`, function (err, result) {
    if (err) throw err;
})

//recorre y cargar registros de avance en BD
console.log("---------------------------------------")
console.log('inicio operacion Worker '+ uudid)
for(let c = 0; c <= arraysThread[id].length; c++){
    total = c
    newData = {registros_completados:total,estado_id:2,fecha_inicio:new Date()}
    //se comprueba si es el ultimo registro se cambia estado de worker a inactivo.
    if (arraysThread[id].length==c)
    newData.estado_id = 3
    newData.fecha_fin = new Date()
    //se actualiza informacion en la tabla
    connection.query('UPDATE threads SET ? WHERE uuid = ?', [newData, uudid], (error, results) => {
        if (error) throw error;
    });
}
//Se actualizan los estados y las de fecha_cierre
const finEstado={
    fecha_fin: new Date(),
    estado_id: 3
}
connection.query('UPDATE workers SET ? WHERE uuid = ?', [finEstado, wokrerPadre], (error, results) => {
    if (error) throw error;
});

//se cierra conexion
connection.end()

//se finaliza la carga y avance de registros
console.log('*fin operacion worker '+ uudid )
console.log("---------------------------------------")


