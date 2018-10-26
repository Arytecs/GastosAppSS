'use strict'

var Category = require('../models/category');
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

function saveCategory(req, res) {
    const {name, idPadre, creator, branch} = req.body;

    if (name && idPadre && creator) {
      let category = new Category({
        name: name,        
        idPadre: idPadre,
        creator: creator,
        branch: branch
      });
  
        category.save((err, categoryStored) => {
            if (err)
            return res.status(500).send({ message: 'Error al guardar la categoria' });
    
            if (categoryStored) {
                res.status(200).send({ category: categoryStored });
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

function getCategories(req, res) {

    Category.find({ $or: [ {'creator': req.user.sub}, {'creator': 'ADMIN'}] }).exec((err, categories) => {
        if(err) return res.status(500).send({message: 'Error devolver las categorias'});

        return res.status(200).send({categories});
    });    
}

function deleteCategory(req, res) {
    const categoryId = req.params.id;

    Category.find({'_id': categoryId}).remove(err => {
        if(err) return res.status(500).send({message: 'Error al borrar la categoria'});

        return res.status(200).send({message: 'Categoria eliminada'});
    });
}

module.exports = {
    pruebas,
    saveCategory,
    getCategories,
    deleteCategory
}