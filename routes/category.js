'use strict'

var express = require('express');
var CategoryController = require('../controllers/category');
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');

var md_upload = multipart({uploadDir: './uploads/users'})

var api = express.Router();


api.get('/category', CategoryController.pruebas);
api.post('/save-category', md_auth.ensureAuth, CategoryController.saveCategory);
api.get('/get-categories/:id', md_auth.ensureAuth, CategoryController.getCategories);
api.delete('/delete-category/:id', md_auth.ensureAuth, CategoryController.deleteCategory);


module.exports = api;