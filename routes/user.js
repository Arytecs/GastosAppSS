'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');

var md_upload = multipart({uploadDir: './uploads/users'})

var api = express.Router();

api.get('/home', UserController.home);
api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.put('/update-user', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.delete('/delete-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.deleteImage);
api.get('/get-image-user/:imageFile', [md_auth.ensureAuth, md_upload], UserController.getImageFile);
api.delete('/delete-user', md_auth.ensureAuth, UserController.deleteUser);

module.exports = api;