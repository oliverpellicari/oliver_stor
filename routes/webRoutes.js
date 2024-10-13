const express = require('express');
const router = express.Router();
const webController = require('../controllers/webController');
const { body } = require('express-validator');

// Rutas públicas
router.get('/', webController.inicio);
router.get('/catalogo', webController.catalogo);
router.get('/contacto', webController.contacto);
router.post('/contacto', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Debes proporcionar un email válido'),
    body('mensaje').notEmpty().withMessage('El mensaje es obligatorio')
], webController.enviarMensaje);
router.get('/register', webController.register);
router.post('/register', [
    body('nickname').notEmpty().withMessage('El nickname es obligatorio').isLength({ min: 3 }).withMessage('El nickname debe tener al menos 3 caracteres'),
    body('dni').matches(/^[0-9]{8}[A-Za-z]$/).withMessage('El DNI debe tener 8 dígitos seguidos de una letra'),
    body('email').isEmail().withMessage('Debes proporcionar un email válido'),
    body('movil').isLength({ min: 9, max: 9 }).withMessage('El móvil debe tener 9 dígitos').isNumeric().withMessage('El teléfono solo puede contener números'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], webController.registerUser);
router.get('/login', webController.login);
router.post('/login', webController.loginPost);
router.get('/registro-exitoso', (req, res) => {
    const success_msg = req.flash('success_msg');
    res.render('registro-exitoso', { success_msg });
});

module.exports = router;
