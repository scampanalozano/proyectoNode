'use strict' // sea mas estrico con respecto a los errores
//conexion de la base de datos
const mongoose = require('mongoose')
const app=require("./app")
var porte = 3000;



// conexión de la base de datos (promesa)
const moongose = require('mongoose');
moongose.Promise = global.Promise;
moongose.connect("mongodb+srv://antonellacampana6:AvbraKBzmX3vpCvA@cluster0.5lis8of.mongodb.net/EntregaTrabajo") // conectarnos con la url con la conexion de mongose
     .then(() =>{
        console.log("Conexión de base de datos establecida")

        //crear el servidor
        app.listen(porte, ()=>{
          console.log(`Example app listening on port ${porte}` )
         });
       
      })
     .catch(err => console.log("error"))