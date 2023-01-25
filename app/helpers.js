module.exports=


    function agregarWorkers(arrayRegistros,name){
        //se importa requeridos
        const mysql = require('mysql')
        const {Worker} = require('worker_threads')

        //conexion a DB
        const connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'workers'
        });
        //se crea worker principal
        const arrayaRegistros = arrayRegistros
        const nombre = name
        const value = new Worker('./app/controllers/WorkerPrincipal.js', { workerData: { arrayaRegistros: arrayaRegistros, name:name } })
        const { [name]: constant } = { [name]: value };
        //se conecta a la BD
        connection.connect();

        //se limpia tabla worker_principal
        connection.query("TRUNCATE TABLE worker_principal", function (err, result) {
            if (err) throw err;
        });

        //se agrega woker principal a la tabla en DB
        connection.query(`INSERT INTO worker_principal (nombre_worker,cantidad_secundarios) VALUES ('${nombre}',${arrayaRegistros.length})`, function (err, result) {
            if (err) throw err;
        })

        //se cierra conexion
        connection.end()
        }

