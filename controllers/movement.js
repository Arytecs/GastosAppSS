'use strict'

var Category = require('../models/category');
var Movement = require('../models/movement');
var jwt = require('../services/jwt')
var mongoosePaginate = require('mongoose-pagination')
var fs = require('fs');
var path =  require('path');
var moment = require('moment');


function pruebas(req, res){
    res.status(200).send({
        message: 'Acción de pruebas en el servidor de nodejs'
    })
}

function saveMovement(req, res) {
    const {name, amount, date, category, account, userId} = req.body;

    if (name && amount && date && category && account && userId) {
      let movement = new Movement({
        name: name,        
        amount: amount,
        created_at: moment().unix(),
        date: date,
        category: category,
        account: account,
        userId: userId
      });
  
      movement.save((err, movementStored) => {
            if (err)
            return res.status(500).send({ message: 'Error al guardar la categoria' });
    
            if (movementStored) {
                res.status(200).send({ category: movementStored });
            } else {
                res.status(404).send({ message: 'No se ha registrado la categoria' });
                }           
            });
    } else {
      res.status(200).send({
        message: 'Envía todos los campos necesarios'
      });
    }
}

function deleteMovement(req, res) {
    const movementId = req.params.id;

    Movement.find({'_id': movementId}).remove(err => {
        if(err) return res.status(500).send({message: 'Error al borrar el movimiento'});

        return res.status(200).send({message: 'Movimiento eliminado'});
    });
}

function getMovements(req, res) {

    Movement.find({ 'account': req.params.id }).sort('-created_at').exec((err, movements) => {
        if(err) return res.status(500).send({message: 'Error devolver los movimientos'});

        return res.status(200).send({movements});
    });    
}


module.exports = {
    pruebas,
    saveMovement,
    deleteMovement,
    getMovements
}