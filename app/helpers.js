module.exports=

    function agregarWorkers(id){
        //se importa requeridos
        const mysql = require('mysql')
        const {Worker} = require('worker_threads')
        const { v4: uuidv4 } = require('uuid');
        const uuid = uuidv4()


        //conexion a DB
        const connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'workers'
        });
        //se conecta a la BD
        connection.connect();

        //se limpia tabla worker_principal
        connection.query("TRUNCATE TABLE workers", function (err, result) {
            if (err) throw err;
        });

        //se crea el nombre del worker con el worker+id recibido
        const nombre = "worker_" + id
        //se agrega woker principal a la tabla en DB
        connection.query(`INSERT INTO workers (uuid,estado_id) VALUES ('${uuid}',1)`, function (err, result) {
            if (err) throw err;
            //se crea worker principal
            const value = new Worker('./app/controllers/Worker.js', { workerData: { id: id, uuid:uuid,} })
            const { [nombre]: constant } = { [nombre]: value };
        })

        //se cierra conexion
        connection.end()
        }

