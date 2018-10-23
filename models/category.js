'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = Schema({
    name: String,
    idPadre: String,
    creator: String,
    branch: Boolean
});

module.exports = mongoose.model('Category', CategorySchema);
