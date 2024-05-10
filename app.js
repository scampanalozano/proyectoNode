'use strict' 
// levantar el servicio web
const express = require('express')
const app = express()

const routes = require('./routes/api')
app.use(express.json())
app.use('' , routes)
module.exports = app;