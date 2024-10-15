// Middleware para verificar si el usuario es administrador
exports.isAdmin = (req, res, next) => {
  // Verifica si el usuario ha iniciado sesión y es de tipo 'admin'
  if (req.session.nickname && req.session.tipoUsuario === 'admin') {
      return next(); // Si es admin, permite el acceso a la siguiente función
  } else {
      // Si no es admin, redirige al login con un mensaje de error
      return res.redirect('/login?error=No tienes acceso a esta área');
  }
};
