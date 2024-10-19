const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware de autenticação
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Autenticação necessária' });
  }

  try {
    // Verifica o token JWT
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }
};

// Middleware de autorização
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
