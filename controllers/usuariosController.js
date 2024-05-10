'use strict'

const { validationResult } = require("express-validator")
const bcrypt = require('bcrypt');

// modelo
var Usuarios = require("../modelos/usuarios")

var controller = {
    usuarios: function (req, res) {
        Usuarios.find().exec((err, usuarios) => {
            if (err) return res.status(500).json({
                status: 500,
                mensaje: err,
            })
            // si viene vacio 
            if (!usuarios) return res.status(400).json({
                status: 400,
                mensaje: "No existen datos"
            })

            return res.status(200).json({
                status: 200,
                data: usuarios
            })

        });

    },
    usuario: function (req, res) {
        let usuario_id = req.params.usuario_id;

        Usuarios.findOne({ usuario_id: usuario_id }).exec((err, usuario) => {
            if (err) return res.status(500).json({
                status: 500,
                mensaje: err,
            })
            // si viene vacio 
            if (!usuario) return res.status(400).json({
                status: 400,
                mensaje: "No existen datos"
            })

            return res.status(200).json({
                status: 200,
                data: usuario
            })

        });



    },
    crear_usuario: function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        let user = req.body;

        Usuarios.findOne({ usuario_id: user.usuario_id }).exec((err, usuario) => {
            if (err) return res.status(500).json({
                status: 500,
                mensaje: err,
            })
      
            if (usuario) return res.status(200).json({
                status: 200,
                mensaje: "El usuario Id ya existe"
            })

            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(user.pass, salt, function(err, hash) {

                    
                    // Store hash in your password DB.
                    let usuarios_model = new Usuarios();
                    usuarios_model.usuario_id = user.usuario_id;
                    usuarios_model.nombre = user.nombre;
                    usuarios_model.edad = user.edad;
                    usuarios_model.email = user.email;
                    usuarios_model.pass = hash;

                    console.log(usuarios_model.pass)

                        
                    usuarios_model.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).json({ status: 500, mensaje: err });
                        if (!usuarioGuardado) return res.status(200).json({ status: 200, mensaje: "No se guardo el registro" })
                    });
        
                    return res.status(200).json({
                        status: 200,
                        menssage: "Usuario almacenado con exito"
                    })
        
        
                });
            });

        });




    },

    updateUsuario: function (req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        let usuario_id = req.params.usuario_id;
        let user = req.body;

        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(user.pass, salt, function(err, hash) {

                let usuarios_update = {
                    nombre: user.nombre,
                    edad: user.edad,
                    pass: hash
                }
        
                Usuarios.findOneAndUpdate({ usuario_id: usuario_id }, usuarios_update, { new: true }, (err, usuarioUpdate) => {
                    if (err) return res.status(500).send({ menssage: 'Error al actualizar el usuario' });
                    if (!usuarioUpdate) return res.status(404).send({ menssage: "No existe el usuario" });
        
                    return res.status(200).json({
                        nombre: usuarioUpdate.nombre,
                        edad: usuarioUpdate.edad,
                        pass: usuarioUpdate.pass
        
                    })
                })

            })
        })

        
    },

    deleteUsuario: function (req, res) {
        let usuario_id = req.params.usuario_id
        Usuarios.findOneAndRemove({ usuario_id: usuario_id}, (err, usuariosDelete)=>{
            if (err) return res.status(500).send({ menssage: 'Error al actualizar el usuario' });
            if (!usuariosDelete) return res.status(404).send({ menssage: "No existe el usuario" });
            
            return res.status(200).json({
                message:"Usuario eliminado con exito"
    
            })
        })

   
    }




};

module.exports = controller;