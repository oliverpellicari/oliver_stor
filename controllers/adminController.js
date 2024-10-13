const db = require('../models/database');
const { validationResult } = require('express-validator');

// Renderizar el panel de administración
exports.panelAdmin = (req, res) => {
  res.render('adminPanel');
};

// Renderizar la vista de agregar un nuevo skin
exports.agregarSkin = (req, res) => {
  res.render('agregarSkin');
};

// Manejar la creación de un nuevo skin
exports.agregarSkinPost = (req, res) => {
  const { nombre_skin, descripcion, precio, imagen_url } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('agregarSkin', { errors: errors.array() });
  }
  db.query('INSERT INTO skins SET ?', { nombre_skin, descripcion, precio, imagen_url }, (err) => {
    if (err) {
      console.error('Error al agregar el skin:', err);
      return res.status(500).send('Error al agregar el skin');
    }
    res.redirect('/admin');
  });
};

// Renderizar la vista para modificar un skin
exports.modificarSkin = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM skins WHERE id_skin = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al obtener el skin:', err);
      return res.status(500).send('Error al obtener el skin');
    }
    res.render('modificarSkin', { skin: results[0] });
  });
};

// Manejar la actualización de un skin
exports.modificarSkinPost = (req, res) => {
  const id = req.params.id;
  const { nombre_skin, descripcion, precio, imagen_url } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('modificarSkin', { errors: errors.array(), skin: { id_skin: id, nombre_skin, descripcion, precio, imagen_url } });
  }
  db.query('UPDATE skins SET ? WHERE id_skin = ?', [{ nombre_skin, descripcion, precio, imagen_url }, id], (err) => {
    if (err) {
      console.error('Error al modificar el skin:', err);
      return res.status(500).send('Error al modificar el skin');
    }
    res.redirect('/admin');
  });
};

// Manejar la eliminación de un skin
exports.eliminarSkin = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM skins WHERE id_skin = ?', [id], (err) => {
    if (err) {
      console.error('Error al eliminar el skin:', err);
      return res.status(500).send('Error al eliminar el skin');
    }
    res.redirect('/admin');
  });
};

// Renderizar la vista para gestionar usuarios
exports.gestionarUsuarios = (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error('Error al recuperar usuarios:', err);
      return res.status(500).send('Error al recuperar usuarios');
    }
    res.render('usuarios', { usuarios: results });
  });
};
