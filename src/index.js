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


//endpoint ListAll
api.get('/dresses', async (req, res) => {
    const conex = await connect_db();
  
    const dressesSQL = 'select * from wedding_dresses';
    const [result] = await conex.query(dressesSQL);
  
    res.json({
      info: { found: result.length }, 
      results: result, 
    });
  });

  //endpoint filterId
  api.get('/dresses/:id', async (req, res) => {
    
    const idDresses= req.params.id;
    const conex = await connect_db();
    const dressesSQL = 'select * from wedding_dresses where idDress=?';
    const [result] = await conex.query(dressesSQL ,[idDresses]);
    res.json({
      results: result, 
    });
  });

  //endpoint filterName
  api.get('/name', async (req, res) => {
    const conex = await connect_db();
    const dressesSQL = 'select * from wedding_dresses where nameDress= ?';
    const [result] = await conex.query(dressesSQL ,[req.query.name]);
    console.log (req.query.name)
    res.json({
      results: result, 
    });
  });


  //endpoint filterfabric
  api.get('/fabric', async (req, res) => {
    const conex = await connect_db();
    const dressesSQL = 'select * from wedding_dresses where fabric= ?';
    const [result] = await conex.query(dressesSQL ,[req.query.fabric]);
    console.log (req.query.fabric)
    res.json({
      results: result, 
    });
  });

  //endpoint filterStyle

  //endpoint post
  //endpoint put
  //enpoint delete

  