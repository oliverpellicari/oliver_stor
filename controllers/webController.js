const db = require('../models/database');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const util = require('util');
const query = util.promisify(db.query).bind(db);

// Constantes para los mensajes de error
const ERROR_MSG_NICKNAME_REQUIRED = 'Por favor, ingresa tu nickname.';
const ERROR_MSG_PASSWORD_REQUIRED = 'Por favor, ingresa tu contraseña.';
const ERROR_MSG_USER_NOT_FOUND = 'El usuario no fue encontrado.';
const ERROR_MSG_PASSWORD_INCORRECT = 'Contraseña incorrecta.';
const ERROR_MSG_SERVER_ERROR = 'Error en el servidor. Por favor, intenta más tarde.';

// Renderizar la vista de inicio
exports.inicio = (req, res) => {
  res.render('inicio');
};

// Renderizar la vista del catálogo
exports.catalogo = async (req, res) => {
  try {
    const results = await query('SELECT * FROM skins');
    res.render('catalogo', { skins: results });
  } catch (error) {
    console.error('Error al obtener el catálogo:', error);
    res.status(500).send('Error al obtener el catálogo');
  }
};

// Renderizar la página de contacto
exports.contacto = (req, res) => {
  const errors = req.flash('errors');
  res.render('contacto', { errors });
};

// Manejar el envío de mensajes desde el formulario de contacto
exports.enviarMensaje = async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect('/contacto');
    }

    const query = 'INSERT INTO mensajes (nombre, email, mensaje) VALUES (?, ?, ?)';
    await query(query, [nombre, email, mensaje]);
    req.flash('success_msg', 'Mensaje enviado exitosamente.');
    res.redirect('/contacto');
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    req.flash('errors', [{ msg: 'Error al enviar el mensaje' }]);
    res.redirect('/contacto');
  }
};

// Renderizar la página de registro
exports.register = (req, res) => {
  const errors = req.flash('errors');
  res.render('register', { errors });
};

// Manejar el registro de un nuevo usuario
exports.registerUser = async (req, res) => {
  try {
    const { nickname, dni, email, movil, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect('/register');
    }

    const query = 'INSERT INTO usuarios (nickname, dni, email, movil, password) VALUES (?, ?, ?, ?, ?)';
    await query(query, [nickname, dni, email, movil, password]);
    req.flash('success_msg', 'Registro exitoso.');
    res.redirect('/login');
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    req.flash('errors', [{ msg: 'Error al registrar el usuario' }]);
    res.redirect('/register');
  }
};

// Renderizar la página de login
exports.login = (req, res) => {
  const error_msg = req.session.error_msg;
  req.session.error_msg = null;
  res.render('login', { error_msg });
};

// Manejar el inicio de sesión
exports.loginPost = async (req, res) => {
  try {
    const { nickname, password } = req.body;

    if (!nickname || !password) {
      req.flash('error_msg', ERROR_MSG_NICKNAME_REQUIRED);
      return res.redirect('/login');
    }

    const userResults = await query('SELECT * FROM usuarios WHERE LOWER(nickname) = LOWER(?)', [nickname]);

    if (userResults.length === 0) {
      req.flash('error_msg', ERROR_MSG_USER_NOT_FOUND);
      return res.redirect('/login');
    }

    const user = userResults[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      req.session.userId = user.id_usuario;
      req.session.nickname = user.nickname;
      req.flash('success_msg', 'Inicio de sesión exitoso.');
      return res.redirect('/catalogo');
    } else {
      req.flash('error_msg', ERROR_MSG_PASSWORD_INCORRECT);
      return res.redirect('/login');
    }
  } catch (error) {
    console.error('Error en el proceso de inicio de sesión:', error);
    req.flash('error_msg', ERROR_MSG_SERVER_ERROR);
    return res.redirect('/login');
  }
};