//to do: try-catch, validaciones

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
api.set('view engine', 'ejs');


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
    res.render('landing', { dressesList: result });
    // res.json({
    //   info: { found: result.length }, 
    //   results: result, 
    // });
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

  api.post('/dresses', async (req,res) => {
    const data=req.body;
    const {nameDress, style, designer, yearCollection, fabric, color, image, size} = data;
    const conex = await connect_db();
    const dressesSQL= 'insert into wedding_dresses (nameDress, style, designer, yearCollection, fabric, color, image, size) values (?,?,?,?,?,?,?,?)';
    const [result] = await conex.query (dressesSQL, [
        nameDress,
        style,
        designer,
        yearCollection,
        fabric,
        color,
        image,
        size,
    ]);
    res.json ({
        id: result.insertId,
    });
  })
  
  //endpoint put

  api.put ('/dresses/:id', async (req,res) => {
    const conex = await connect_db();
    const idDress= req.params.id;
    const data=req.body;
    const {nameDress, style, designer, yearCollection, fabric, color, image, size} = data;
    const dressesSQL= 'update wedding_dresses set nameDress=?, style=?, designer=?, yearCollection=?, fabric=?, color=?, image=?, size=? where idDress=?';
    const [result] = await conex.query (dressesSQL, [
        nameDress,
        style,
        designer,
        yearCollection,
        fabric,
        color,
        image,
        size,
        idDress,
    ]);
    res.json ({
        success: true,
        message: 'actualizado correctamente'
    })
  })

  //enpoint delete
  api.delete ('/dresses', async (req, res) => {
    const conex= await connect_db();
    const idDress=req.query.id;
    const dressesSQL= 'delete from wedding_dresses where idDress=?';
    const [result] = await conex.query(dressesSQL, [idDress]);
    console.log (result);
    if (result.affectedRows > 0) {
        res.json({
          succes: true,
          message: 'eliminado correctamente',
        });
      } else {
        res.json({
          succes: false,
          message: 'NO se ha eliminado nada',
        });
      }
  })

  