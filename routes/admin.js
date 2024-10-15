// Importación de dependencias y configuración del router
const db = require('../models/database');
const Skin = require('../models/skin'); // Modelo de skins
const User = require('../models/user'); // Modelo de usuarios
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Middleware de autenticación
const { body, validationResult } = require('express-validator');

// *******************************************************************************
// *************************** RUTAS ADMINISTRACIÓN ******************************
// *******************************************************************************

// Ruta POST para agregar una nueva skin
router.post('/agregar-skin', [
  // Validación de los datos del formulario
  body('nombre_skin').notEmpty().withMessage('El nombre del skin es obligatorio'),
  body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número válido y mayor o igual a 0'),
  body('imagen_url').isURL().withMessage('Debe proporcionar una URL válida para la imagen')
], async (req, res) => {
  // Manejo de errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Devuelve errores de validación en formato JSON
  }

  // Obtener los datos del formulario
  const { nombre_skin, descripcion, precio, imagen_url } = req.body;

  // Consulta SQL para insertar los datos en la tabla "skin"
  const query = 'INSERT INTO skins (nombre_skin, descripcion, precio, imagen_url) VALUES (?, ?, ?, ?)';

  try {
    // Ejecución de la consulta para agregar una skin
    await db.query(query, [nombre_skin, descripcion, precio, imagen_url ]);

    // Alerta en la consola para depuración
    console.log(`La skin "${nombre_skin}" se ha subido correctamente.`);

    // Redirigir a panelAdmin con éxito
    res.redirect('/panelAdmin?success=true');
  } catch (error) {
    // Manejo de errores durante la inserción
    console.error('Error al insertar la skin:', error);
    res.status(500).send('Error del servidor');
  }
});

// *******************************************************************************
// *************************** RUTAS DE USUARIO **********************************
// *******************************************************************************

// Ruta para obtener todos los usuarios
router.get('/usuarios', auth.isAdmin, async (req, res) => {
  try {
    const usuarios = await User.getAll(); // Obtener todos los usuarios desde el modelo User
    res.json(usuarios); // Devolver los usuarios en formato JSON
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
  }
});

// Ruta para renderizar el formulario de agregar usuario
router.get('/usuarios/agregar', auth.isAdmin, (req, res) => {
  res.render('agregarUsuario'); // Renderiza la vista para agregar un nuevo usuario
});

// Ruta POST para agregar un nuevo usuario
router.post('/usuarios/agregar', auth.isAdmin, async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;
    // Validar que todos los campos estén presentes
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    // Crear un nuevo usuario utilizando el modelo User
    const usuario = await User.create({ nombre, apellido, email, password });
    res.json({ mensaje: 'Usuario creado con éxito' });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ mensaje: 'Error al crear el usuario' });
  }
});

// Ruta PUT para modificar un usuario existente
router.put('/usuarios/modificar/:id', auth.isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, password } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    // Actualizar el usuario utilizando el modelo User
    const usuario = await User.update(id, { nombre, apellido, email, password });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario actualizado con éxito' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
  }
});

// Ruta DELETE para eliminar un usuario
router.delete('/usuarios/eliminar/:id', auth.isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Eliminar el usuario utilizando el modelo User
    const result = await User.delete(id);
    if (!result) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Redirigir con éxito al panel de administración
    res.redirect('/panelAdmin?success=true');
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
  }
});

module.exports = router; // Exportar el router
