//Prueba dev nodemon console.log ("holis");

//importo dependencias
const express = require ('express');
const cors = require ('cors');
const mysql = require ('mysql2/promise');
require ('dotenv').config();

//creo server
const api= express();

//configuro server 
api.use (cors()); //para que acepte las peticiones
api.use (express.json()); // para que use el formato json

//configuro el puerto 
const port = process.env.PORT || 4001;
api.listen (port, () => {
    console.log (`Server is listening to http://localhost:${port}`);
})

//conecto con la base de datos
async function connect_db () {
    const conex = await mysql.createConnection ({
        host: process.env.HOST || 'localhost' ,
        user: process.env.DB_USER || 'root' ,
        password: process.env.DB_PASS || 'psicologia89',
        database: 'bridal_db',
    });    
    conex.connect ();
    console.log ('Successfully connected')
    return conex;
}



api.get('/wedding_dresses', async (req, res) => {
    const conex = await connect_db();
  
    const weddingDressesSQL = 'select *from wedding_dresses';
    const [result] = await conex.query(weddingDressesSQL);
    
  
    res.json({
      info: { found: result.length }, // número de elementos
      results: result, // listado
    });
  });