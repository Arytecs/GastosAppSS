'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    avatar: String,
    created_at: String,
    dob: String
});

module.exports = mongoose.model('User', UserSchema);