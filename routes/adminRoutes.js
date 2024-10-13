// Importación de dependencias y configuración del router
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');

// Rutas de administración (protegidas por middleware)
router.get('/', auth.isAdmin, adminController.panelAdmin);
router.get('/agregar-skin', auth.isAdmin, adminController.agregarSkin);
router.post('/agregar-skin', auth.isAdmin, [
  body('nombre_skin').isLength({ min: 3 }).withMessage('El nombre del skin debe tener al menos 3 caracteres'),
  body('precio').isNumeric().withMessage('El precio debe ser un número')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('agregarSkin', { errors: errors.array() });
  }
  adminController.agregarSkinPost(req, res);
});
router.get('/modificar-skin/:id', auth.isAdmin, adminController.modificarSkin);
router.post('/modificar-skin/:id', auth.isAdmin, [
  body('nombre_skin').isLength({ min: 3 }).withMessage('El nombre del skin debe tener al menos 3 caracteres'),
  body('precio').isNumeric().withMessage('El precio debe ser un número')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('modificarSkin', { errors: errors.array(), skin: req.body });
  }
  adminController.modificarSkinPost(req, res);
});
router.get('/eliminar-skin/:id', auth.isAdmin, adminController.eliminarSkin);
router.get('/usuarios', auth.isAdmin, adminController.gestionarUsuarios);

router.get('/admin', (req, res) => {
  res.render('adminPanel');
});

console.log(router);
module.exports = router;
