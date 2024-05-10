'use strict'

require('dotenv').config();
var jwt = require("jsonwebtoken")

var Sesion = require("../modelos/accessToken");
const usuarios = require('../modelos/usuarios');

var middleware = {
    userprotectUrl: function (req, res, next) {
        const token = req.headers['x-entrega-access-token'];
        if (token) {
            jwt.verify(token, process.env.KEY, (err, decoded)=>{
                if(err){
                    return res.status(401).send({
                        status:401,
                        message:"Token no valido"
                    })
                }else{
                    req.decoded = decoded;
                    Sesion.findOne({email:req.decoded.user.email, key:token, active:true })
                    .then(sesion =>{
                        if(!sesion){
                            return res.status(401).send({
                                status: 401,
                                message: "Sesión no encontrada"

                            });
                        }
                        next();

                    }).catch(error=>{
                        return res.status(500).send({
                            status:500,
                            message: "Error"
                        })
                    })


                  


                }

            });

        } else {
            return res.status(401).send({
                status: 401,
                message: "Datos no validos"
            });

        }

 

    }

}

module.exports = middleware;