// Importación de módulos necesarios
const express = require('express');
const router = express.Router();
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const db = require('../models/database');
const bcrypt = require('bcryptjs');
const util = require('util');
const query = util.promisify(db.query).bind(db); // Promisificación de consultas a la base de datos

// Constantes para mensajes de error
const ERROR_MSG_NICKNAME_REQUIRED = 'Por favor, ingresa tu nickname.';
const ERROR_MSG_PASSWORD_REQUIRED = 'Por favor, ingresa tu contraseña.';
const ERROR_MSG_USER_NOT_FOUND = 'El usuario no fue encontrado.';
const ERROR_MSG_PASSWORD_INCORRECT = 'Contraseña incorrecta.';
const ERROR_MSG_SERVER_ERROR = 'Error en el servidor. Por favor, intenta más tarde.';


// *******************************************************************************
// *************************** RUTAS PÚBLICAS ***********************************
// *******************************************************************************

// Ruta para la página de inicio
router.get('/', (req, res) => {
  const nickname = req.session.nickname || ''; // Se obtiene el nickname de la sesión si está disponible
  res.render('inicio', { nickname }); // Renderiza la vista inicio.ejs con el nickname del usuario
});

// Ruta para el perfil de usuario (Panel de Admin)
router.get('/panelAdmin', cors(), async (req, res) => {
  try {
    // Consultas a la base de datos para obtener usuarios y skins
    const usuarios = await query('SELECT id_usuario, nickname, email FROM usuarios');
    const results = await query('SELECT * FROM skins');
    const { tipoUsuario, nickname, email } = req.session;

    // Verificar si el tipo de usuario está presente en la sesión
    if (!tipoUsuario) {
      return res.redirect('/login'); // Redirige al login si no hay tipo de usuario
    }

    // Renderizar la vista del panel admin con los datos obtenidos
    res.render('panelAdmin', { tipoUsuario, skins: results, nickname, usuarios, email });
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).send('Error al obtener los datos');
  }
});

// Ruta para el catálogo de productos
router.get('/catalogo', async (req, res) => {
  const nickname = req.session.nickname || ''; // Obtener nickname de la sesión
  try {
    const results = await query('SELECT * FROM skins'); // Consulta para obtener skins
    res.render('catalogo', { skins: results, nickname }); // Renderiza la vista catálogo
  } catch (error) {
    console.error('Error al obtener el catálogo:', error);
    res.status(500).send('Error al obtener el catálogo');
  }
});

// *************************************************************************
// *************************** CONTACTO ************************************
// *************************************************************************

// Ruta para la página de contacto
router.get('/contacto', (req, res) => {
  const nickname = req.session.nickname || ''; // Obtener nickname de la sesión
  const errors = req.flash('errors'); // Recuperar errores de la sesión
  res.render('contacto', { errors, nickname });
});

// Ruta para el envío del formulario de contacto
router.post('/contactoform', cors(), [
  // Validaciones del formulario de contacto
  body('nickname').notEmpty().withMessage('El nickname es obligatorio'),
  body('dni').matches(/^[0-9]{8}[A-Za-z]$/).withMessage('El DNI debe tener 8 dígitos seguidos de una letra'),
  body('email').isEmail().withMessage('Debes proporcionar un email válido'),
  body('movil').isLength({ min: 9, max: 9 }).withMessage('El móvil debe tener 9 dígitos').isNumeric().withMessage('El móvil solo puede contener números'),
  body('mensaje').isLength({ min: 10 }).withMessage('El mensaje debe tener al menos 10 caracteres')
], async (req, res) => {
  try {
    const { nickname, dni, email, movil, mensaje } = req.body;
    const errors = validationResult(req);

    // Si hay errores en las validaciones, redirige y muestra los errores
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect('/contacto');
    }

    // Inserta los datos del formulario de contacto en la base de datos
    await query('INSERT INTO mensajes (nickname, dni, email, movil, mensaje) VALUES (?, ?, ?, ?, ?)', [nickname, dni, email, movil, mensaje]);
    req.flash('success_msg', 'Mensaje enviado exitosamente.');
    res.redirect('/mensaje'); // Redirige a la página de confirmación
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    req.flash('errors', [{ msg: 'Error al enviar el mensaje' }]);
    res.redirect('/contacto');
  }
});

// Renderizar la vista de mensajes
router.get('/mensaje', (req, res) => {
  const nickname = req.session.nickname || '';
  const errors = req.flash('errors');
  res.render('mensaje', { errors, nickname });
});


// *************************************************************************
// *************************** REGISTRO ************************************
// *************************************************************************

// Ruta para la página de registro
router.get('/register', (req, res) => {
  const nickname = req.session.nickname || '';
  const errors = req.flash('errors');
  res.render('register', { errors, nickname });
});

// Ruta para el proceso de registro exitoso
router.get('/registroExitoso', (req, res) => {
  const nickname = req.session.nickname;
  const errors = req.flash('errors');
  res.render('registroExitoso', { errors, nickname });
});

// Ruta para el proceso de registro de usuario
router.post('/registerPost', cors(), [
  body('nickname').notEmpty().withMessage('El nickname es obligatorio').isLength({ min: 3 }).withMessage('El nickname debe tener al menos 3 caracteres'),
  body('dni').matches(/^[0-9]{8}[A-Za-z]$/).withMessage('El DNI debe tener 8 dígitos seguidos de una letra'),
  body('email').isEmail().withMessage('Debes proporcionar un email válido'),
  body('movil').isLength({ min: 9, max: 9 }).withMessage('El móvil debe tener 9 dígitos').isNumeric().withMessage('El móvil solo puede contener números'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
  const { nickname, dni, email, movil, password } = req.body;
  const errors = validationResult(req);

  // Si hay errores en la validación, redirige y muestra los errores
  if (!errors.isEmpty()) {
    req.flash('errors', errors.array());
    return res.redirect('/register');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hasheo de la contraseña
    await query('INSERT INTO usuarios (nickname, dni, email, movil, password) VALUES (?, ?, ?, ?, ?)', [nickname, dni, email, movil, hashedPassword]);
    req.flash('success_msg', 'Registro exitoso.');
    res.redirect('/registroExitoso');
  } catch (error) {
    console.error('Error al registrar al usuario:', error);
    req.flash('errors', [{ msg: 'Error al registrar el usuario' }]);
    res.redirect('/register');
  }
});

// *************************************************************************
// *************************** LOGIN ***************************************
// *************************************************************************

// Ruta para la página de login
router.get('/login', (req, res) => {
  const nickname = req.session.nickname || '';
  const error_msg = req.session.error_msg || null;
  req.session.error_msg = null; // Reiniciar el mensaje de error
  res.render('login', { error_msg, nickname });
});

// Ruta para el proceso de login
router.post('/loginUsers', cors(), [
  body('nickname').notEmpty().withMessage(ERROR_MSG_NICKNAME_REQUIRED),
  body('password').notEmpty().withMessage(ERROR_MSG_PASSWORD_REQUIRED)
], async (req, res) => {
  const { nickname, password } = req.body;

  try {
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
      req.session.tipoUsuario = user.rol === 'admin' ? 'admin' : 'usuario';
      req.flash('success_msg', 'Inicio de sesión exitoso.');
      return res.redirect('/panelAdmin');
    } else {
      req.flash('error_msg', ERROR_MSG_PASSWORD_INCORRECT);
      return res.redirect('/login');
    }
  } catch (error) {
    console.error('Error en el proceso de inicio de sesión:', error);
    req.flash('error_msg', ERROR_MSG_SERVER_ERROR);
    return res.redirect('/login');
  }
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).send("Error al cerrar sesión");
    }
    res.redirect('/');
  });
});

// *************************************************************************
// *************************** ACTUALIZAR PERFIL ***************************
// *************************************************************************

// Ruta para actualizar perfil
router.post('/actualizar-perfil', (req, res) => {
  const { nickname, email } = req.body;
  const userId = req.session.userId;

  // Actualizar perfil en la base de datos
  db.query('UPDATE usuarios SET nickname = ?, email = ? WHERE id_usuario = ?', [nickname, email, userId], (err) => {
    if (err) {
      return res.status(500).send('Error al actualizar el perfil');
    }
    req.session.nickname = nickname;
    req.session.email = email;
    res.redirect('/panelAdmin?success=true');
  });
});

// Exporta el router para ser utilizado en otros archivos
module.exports = router;
