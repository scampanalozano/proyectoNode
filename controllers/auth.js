'use strict'
const { validationResult } = require("express-validator")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

var Usuarios = require("../modelos/usuarios")
var Sesion = require("../modelos/accessToken")

var controller = {
    login: function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        let login_info = req.body;
        Usuarios.findOne({ email: login_info.email})
        .then( usuarios=> {
            
            bcrypt.compare(login_info.pass, usuarios.pass, function (err, result) {
                if (result) {

                    const payload = {
                        user: usuarios
                    }
                    const accessToken = jwt.sign(payload, process.env.KEY, {
                        expiresIn: '1d'
                    })

                    let today = new Date().toISOString();

                    let update_sesion = {
                        user: usuarios.email,
                        key: accessToken,
                        creationDate: today,
                        expirationDate: '1d',
                        activo: true

                    }

                    Sesion.findOneAndUpdate({ user: usuarios.email }, update_sesion, { upsert: true, new: true })
                        .then(sesion => {

                            if (!sesion) {
                                return res.status(401).send({
                                    status: 401,
                                    message: "Usuario no encontrado"
                                });

                            }

                            return res.status(200).send({
                                status: 200,
                                message: "Login Correcto",
                                token: accessToken
                            })

                        })
                        .catch(error => {
                            console.log(error)
                            return res.status(500).send({
                                status: 500,
                                message: "Error detectado"

                            })
                        })

                }else{
                    return res.status(401).send({
                        status:401,
                        message:"Datos no validos"
                    })
                }


            })
           





        })
       

    },

    logout: function (req, res) {

        const token = req.headers['x-entrega-access-token'];
        console.log(token)
        Sesion.findOneAndDelete({ user: req.decoded.user.email, key: token })
            .then(sesion => {
                if (!sesion) {
                    return res.status(200).send({
                        status: 200,
                        message: "Token invalido"
                    })
                }
                return res.status(200).send({
                    status: 200,
                    message: "Sesión finalizada"
                })

            }).catch(error => {
                return res.status(500).send({
                    status: 500,
                    message: "Token invalido"
                })
            })


    }


};

module.exports = controller;