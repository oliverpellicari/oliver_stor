// Cargar las variables de entorno desde .env
require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const flash = require('connect-flash');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar el motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos desde la carpeta 'public'
app.use('/resources', express.static(path.join(__dirname, 'public')));

// Middleware para parsear el cuerpo de las peticiones
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para habilitar CORS para todos los orígenes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  next();
});

// Inicia el servidor de la aplicación en el puerto 3000 
app.listen(3000, () => {
  console.log('Servidor ejecutando en localhost:3000');
});

// Middleware para sesiones
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Solo en producción
    httpOnly: true, // Protege la cookie de ser accedida desde JavaScript en el cliente
    maxAge: 24 * 60 * 60 * 1000 // 1 día de duración para la sesión
  }
}));

// Middleware para flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Importar y usar las rutas
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);
const webRoutes = require('./routes/webRoutes');
app.use('/', webRoutes);

// Middleware para manejar rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
});

// Middleware para manejar errores internos del servidor (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500');
});




