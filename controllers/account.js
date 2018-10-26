'use strict'

var Account = require('../models/account');
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

function saveAccount(req, res) {
    const {name, creator} = req.body;

    if (name && creator) {
      let account = new Account({
        name: name,        
        image: null,
        creator: creator,
        shared: [],
        created_at: moment().unix(),
      });
  
        account.save((err, accountStored) => {
            if (err)
            return res.status(500).send({ message: 'Error al guardar la cuenta' });
    
            if (accountStored) {
                res.status(200).send({ user: accountStored });
            } else {
                res.status(404).send({ message: 'No se ha registrado la cuenta' });
                }           
            });
    } else {
      res.status(200).send({
        message: 'Envía todos los campos necesarios'
      });
    }
}

function getAccounts(req, res) {

    Account.find({creator: req.user.sub}).sort('name').exec((err, accounts) => {
        if(err) return res.status(500).send({message: 'Error devolver las cuentas'});

        return res.status(200).send({accounts});
    });    
}

function updateAccount(req, res) {
    const update = req.body;

    Account.findByIdAndUpdate(update._id, update, {new: true}, (err, accountUpdated) => {
        if (err) return res.status(500).send({message: 'Error en la petición'});

        if(!accountUpdated) return res.status(404).send({message: 'No se ha podido actualizar la cuenta'});
        
        return res.status(200).send({user: accountUpdated});
    });
}

function deleteAccount(req, res) {
    const params = req.params;

    Account.find({'_id': params.id}).remove(err => {
        if(err) return res.status(500).send({message: 'Error al borrar la cuenta'});

        return res.status(200).send({message: 'Cuenta eliminada'});
    });
}

function uploadImage(req, res){
    var userId = req.params.id;
    if(userId != req.user.sub){
        return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario') 
    }
    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');

        var file_name = file_split[2];

        var ext_split = file_name.split('.')
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            //Actualizar documento de usuario loggeado
            User.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, userUpdated) => {
                if(err) return res.status(500).send({message: 'Error en la petición'});

                if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

                return res.status(200).send({user: userUpdated});
            });
        }else{
            return removeFilesOfUploads(res, file_path, 'Extensión no válida')
        }
    }else{
        return res.status(200).send({message: 'No se ha subido ningún archivo'});
    }
}

function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err) => {
        return res.status(200).send({message});
    });
}

function getImageFile(req, res){
    var image_file = req.params.imageFile;

    var path_file = './uploads/users/' + image_file;

    fs.exists(path_file, (exists) => {
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    })
}

module.exports = {
    pruebas,
    saveAccount,  
    getAccounts,
    updateAccount,
    deleteAccount,
    uploadImage,
    removeFilesOfUploads,
    getImageFile
}