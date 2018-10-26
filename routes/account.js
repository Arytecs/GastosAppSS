'use strict'

var express = require('express');
var AccountController = require('../controllers/account');
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');

var md_upload = multipart({uploadDir: './uploads/users'})

var api = express.Router();


api.get('/account', AccountController.pruebas);
api.post('/save-account',md_auth.ensureAuth, AccountController.saveAccount);
api.get('/get-accounts/:id', md_auth.ensureAuth, AccountController.getAccounts);
api.put('/update-acc/', md_auth.ensureAuth, AccountController.updateAccount);
api.delete('/delete-acc/:id', md_auth.ensureAuth, AccountController.deleteAccount);


module.exports = api;