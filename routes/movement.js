'use strict'

var express = require('express');
var MovementController = require('../controllers/movement');
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');

var api = express.Router();


api.get('/movement', MovementController.pruebas);
api.post('/save-movement', md_auth.ensureAuth, MovementController.saveMovement);
api.delete('/delete-movement/:id', md_auth.ensureAuth, MovementController.deleteMovement);
api.get('/movements/:id', md_auth.ensureAuth, MovementController.getMovements);


module.exports = api;