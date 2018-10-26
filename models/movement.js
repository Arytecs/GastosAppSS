'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovementSchema = Schema({
    name: String,
    amount: Number,
    date: String,
    created_at: String,
    category: String,
    account: String,
    userId: String,
});

module.exports = mongoose.model('Movement', MovementSchema);