const express = require('express')
const cors = require('cors')
const {dbConnection} = require('../database/config')

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuaiosPath = '/api/usuarios'
        this.authPath = '/api/auth'
        this.pistasPath = '/api/pistas'
        this.deportesPath = '/api/deportes'

        //Conectar a base de datos
        this.conectarDB();
        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        //CORS
        this.app.use(cors());

        //LEctura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use( express.static('public'));
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuaiosPath, require('../routes/usuarios'));
        this.app.use(this.pistasPath, require('../routes/pistas'));
        this.app.use(this.deportesPath,  require('../routes/deportes'));
       
        
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Sevidor corriendo en puerto ', this.port);
        });
    }
}

module.exports = Server;