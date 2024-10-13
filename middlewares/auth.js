exports.isAdmin = (req, res, next) => {
    if (req.session.usuario && req.session.usuario.rol === 'admin') {
      return next();
    } else {
      return res.redirect('/login?error=No tienes acceso a esta área');
    }
  };
  