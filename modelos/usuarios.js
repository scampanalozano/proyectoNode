'use strict'




var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuariosSchema = Schema(
    {
        usuario_id:{type: Number, require: true, unique: true},
        nombre : {type: String, require: true},
        edad: {type: Number, require: true}, 
        email: {type: String, require: true},
        pass: {type: String, require: true}
    }

);

module.exports = mongoose.model('usuarios', UsuariosSchema)