// Cargar las variables de entorno desde .env
require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override'); // Requerir method-override

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar method-override
app.use(methodOverride('_method')); // Esto permitirá sobreescribir métodos como DELETE y PUT en formularios

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

// Middleware para sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret', // Asegúrate de configurar esto en .env
  resave: false, // No vuelve a guardar la sesión si no se ha modificado
  saveUninitialized: false, // No guarda sesiones vacías
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Solo en producción con HTTPS
    httpOnly: true, // Protege la cookie de ser accedida desde JavaScript
    maxAge: 24 * 60 * 60 * 1000 // 1 día de duración para la sesión
  }
}));

// Middleware para pasar el nickname a todas las vistas
app.use((req, res, next) => {
 res.locals.nickname = req.session.nickname || ''; // Si no existe, asigna una cadena vacía
 next();
});

// Middleware para flash messages
app.use(flash());

// Middleware para pasar mensajes flash a las vistas
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.errors = req.flash('errors');
  next();
});

// Importar y usar las rutas
const admin = require('./routes/admin');
const usuario = require('./routes/usuario'); // Asegúrate que este archivo exista y esté bien nombrado
app.use('/', admin);
app.use('/', usuario);

// Middleware para manejar rutas no encontradas (404)
app.use((req, res) => {
  const nickname = req.session.nickname || ''; // Evita errores si no hay sesión activa
  res.status(404).render('404', { url: req.originalUrl, nickname });
});

// Middleware para manejar errores internos del servidor (500)
app.use((err, req, res, next) => {
  const nickname = req.session.nickname || ''; // Evita errores si no hay sesión activa
  console.error(err.stack);
  res.status(500).render('500', { nickname });
});

// Inicia el servidor de la aplicación en el puerto 3000
app.listen(PORT, () => {
  console.log(`Servidor ejecutando en el puerto ${PORT}`);
});

