const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();


// Crear el servidor de express
const app = express();

//  Base de datos - conexion de prueba
dbConnection();

//  CORS
app.use(cors());

// directorio publico
app.use( express.static('public') );

// lectura y parseo del body
app.use( express.json() );

// rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));




const port = process.env.PORT;

// Escuchar peticiones
app.listen( port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});