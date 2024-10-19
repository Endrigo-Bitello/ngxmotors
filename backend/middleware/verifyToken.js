const jwt = require('jsonwebtoken');

// Middleware para verificar o token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido.' });
  }

  try {
    // Remove "Bearer" do token se existir
    const tokenWithoutBearer = token.split(' ')[1];

    // Verifica o token
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = decoded; // Salva as informações do usuário no req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
}

module.exports = verifyToken;
