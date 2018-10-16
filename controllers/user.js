'use strict';

var bcrypt = require('bcrypt');
var User = require('../models/user');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var strings = require('../helpers/strings');

function home(req, res) {
  res.status(200).send({
    message: 'Hola mundo'
  });
}

function pruebas(req, res) {
  res.status(200).send({
    message: 'Acción de pruebas en el servidor de nodejs'
  });
}


function saveUser(req, res) {
  const {name, email, password} = req.body;
  if (name && email && password) {
    let user = new User({
      name: name,
      email: email,
      role: strings.roleUser,
      avatar: null,
      created_at: moment().unix(),
      dob: ''
    });
    console.log(user);

    User.find({ email: user.email.toLowerCase() })
    .exec((err, users) => {
      if (err)
        return res
          .status(500)
          .send({ message: 'Error en la petición de usuarios' });

      if (users && users.length >= 1) {
        return res.status(200).send({ message: 'El email ya está en uso' });
      } else {
        const salt = 10;
        bcrypt.hash(password, salt, (err, hash) => {
          user.password = hash;

          user.save((err, userStored) => {
            if (err)
              return res
                .status(500)
                .send({ message: 'Error al guardar el usuario' });

            if (userStored) {
              userStored.password = '';
              res.status(200).send({ user: userStored });
            } else {
              res
                .status(404)
                .send({ message: 'No se ha registrado el usuario' });
            }
          });
        });
      }
    });
  } else {
    res.status(200).send({
      message: 'Envía todos los campos necesarios'
    });
  }
}


function loginUser(req, res) {
  const {email, password, isToken} = req.body;

  User.findOne({ email: email }, (err, user) => {
    if (err) return res.status(500).send({ message: 'Error en la petición' });
    if (user) {
      bcrypt.compare(password, user.password, (err, check) => {
        delete user.password
        if (check) {
          if (isToken) {
            // generar y devoler tokken
            return res.status(200).send({
              token: jwt.createToken(user)
            });
          } else {
            //Devolver datos de usuario
            user.password = undefined;
            return res.status(200).send({ user });
          }
        } else {
          return res.status(404).send({ message: 'Contraseña incorrecta' });

        }
      });
    } else {
      return res
        .status(404)
        .send({ message: 'El usuario no se ha podido identificar!!' });
    }
  });
}

// Conseguir datos de un usuario
function getUser(req, res) {
  const {id} = req.params;

  User.findById(id, (err, user) => {
    if (err) return res.status(500).send({ message: 'Error en la petición' });

    if (!user) return res.status(404).send({ message: 'El usuario no existe' });
    delete user.password
    return res.status(200).send({ user });
  });
}

// Edición datos de usuario
function updateUser(req, res) {
  const {body: user} = req;
  if (user.password) delete user.password;

  User.findByIdAndUpdate(
    req.user.sub,
    user,
    { new: true },
    (err, userUpdated) => {
      if (err) return res.status(500).send({ message: 'Error en la petición' });

      if (!userUpdated)
        return res
          .status(404)
          .send({ message: 'No se ha podido actualizar el usuario' });

      delete userUpdated.password
      return res.status(200).send({ user: userUpdated });
    }
  );
}

function uploadImage(req, res) {
  var userId = req.user.sub;

  if (req.files) {
    var file_path = req.files.avatar.path;
    var file_split = file_path.split('\\');

    var file_name = file_split[2];

    var ext_split = file_name.split('.');
    var file_ext = ext_split[1];

    if (
      file_ext == 'png' ||
      file_ext == 'jpg' ||
      file_ext == 'jpeg' ||
      file_ext == 'gif'
    ) {
      //Actualizar documento de usuario loggeado
      User.findByIdAndUpdate(
        userId,
        { avatar: file_name },
        { new: true },
        (err, userUpdated) => {
          if (err)
            return res.status(500).send({ message: 'Error en la petición' });

          if (!userUpdated)
            return res
              .status(404)
              .send({ message: 'No se ha podido actualizar el usuario' });

          delete userUpdated.password
          return res.status(200).send({ user: userUpdated });
        }
      );
    } else {
      return removeFilesOfUploads(res, file_path, 'Extensión no válida');
    }
  } else {
    return res.status(200).send({ message: 'No se ha subido ningún archivo' });
  }
}

function removeFilesOfUploads(res, file_path, message) {
  fs.unlink(file_path, err => {
    return res.status(200).send({ message });
  });
}

function getImageFile(req, res) {
  const image_file = req.params.avatar;

  const path_file = './uploads/users/' + image_file;

  fs.exists(path_file, exists => {
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({ message: 'No existe la imagen' });
    }
  });
}

function deleteImage(req, res) {
  const userId = req.user.sub;

  User.findByIdAndUpdate(userId, { avatar: '' }, (err, user) => {
    if (err) return res.status(500).send({ message: 'Error en la petición' });

    if (!user)
      return res.status(404).send({ message: 'Usuario no encontrado' });

    fs.unlink('./uploads/users/' + user.avatar, err => {
      return res.status(200).send({ user });
    });
  });
}

function deleteUser(req, res) {
  const userId = req.user.sub;

  User.findByIdAndDelete(userId, (err, user) => {
    if (err) return res.status(500).send({ message: 'Error en la petición' });

    if (!user)
      return res.status(404).send({ message: 'Usuario no encontrado' });
    
    return res.status(200).send({ message: 'Usuario eliminado' });
    
  });
}

module.exports = {
  home,
  pruebas,
  saveUser,
  loginUser,
  getUser,
  updateUser,
  uploadImage,
  getImageFile,
  deleteImage,
  deleteUser
};
