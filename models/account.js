'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = Schema({
    name: String,
    image: String,
    creator: String,
    shared: [],
    created_at: String
});

module.exports = mongoose.model('Account', AccountSchema);