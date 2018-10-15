'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = Schema({
    name: String,
    image: String,
    creator: {type: Schema.ObjectId, ref: 'User'},
    shared: [],
    created_at: String
});

module.exports = mongoose.model('Account', AccountSchema);