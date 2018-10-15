'use strict'

var express = require('express');
var AccountController = require('../controllers/account');
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');

var md_upload = multipart({uploadDir: './uploads/users'})

var api = express.Router();


api.get('/prueba', AccountController.pruebas);


module.exports = api;