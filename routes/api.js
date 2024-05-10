'use strict' 
// levantar el servicio web
const express = require('express');
const api = express.Router();
const { body } = require('express-validator');

var UsuariosController = require("../controllers/usuariosController")
var middleware= require("../middleware/middleware")
let AuthController= require("../controllers/auth")


api.get("/usuarios/", middleware.userprotectUrl, UsuariosController.usuarios)
api.get("/usuario/:usuario_id", middleware.userprotectUrl, UsuariosController.usuario)
api.post("/usuario" ,  middleware.userprotectUrl,[
    body('usuario_id').not().isEmpty(),
    body('nombre').not().isEmpty(),
    body('edad').not().isEmpty(),
    body('email').not().isEmpty(),
    body('pass').not().isEmpty(),
], UsuariosController.crear_usuario)
api.put("/usuario/:usuario_id", middleware.userprotectUrl,[
    body('nombre').not().isEmpty(),
    body('edad').not().isEmpty(),
    body('pass').not().isEmpty(),
], UsuariosController.updateUsuario)
api.delete("/usuario/:usuario_id", middleware.userprotectUrl, UsuariosController.deleteUsuario)

api.post("/login" ,[
    body('email').not().isEmpty(),
    body('pass').not().isEmpty(),
], AuthController.login)
api.post("/logout",middleware.userprotectUrl, AuthController.logout)

module.exports= api;