const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

// Rotas protegidas
router.get('/admin/dashboard', authenticate, (req, res) => {
  res.status(200).json({ message: 'Bem-vindo ao Dashboard!' });
});

router.get('/admin', authenticate, (req, res) => {
  res.status(200).json({ message: 'Bem-vindo ao Dashboard!' });
});


module.exports = router;

