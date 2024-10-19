const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const multer = require('multer'); // Para o upload de arquivos
const path = require('path');
const router = express.Router();

// Configuração do multer para salvar as imagens de perfil
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/perfis')); // Salva em public/perfis
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Rota para registrar um novo usuário
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe com este e-mail' });
    }

    const user = new User({
      username,
      email,
      password,
      role: role || 'Vendedor' // Define o papel padrão como 'Vendedor'
    });

    await user.save();

    return res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});

// Rota para login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// Rota para obter o perfil do usuário logado
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao obter perfil' });
  }
});

// Rota para upload da foto de perfil
router.post('/profile/upload', authenticate, upload.single('profileImage'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.profileImage = `/perfis/${req.file.filename}`;
    await user.save();

    return res.status(200).json({ message: 'Imagem de perfil atualizada com sucesso', profileImage: user.profileImage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar a imagem de perfil' });
  }
});

// Rota protegida para listar todos os usuários (Apenas para Administradores)
router.get('/users', authenticate, authorize(['Administrador']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao listar usuários' });
  }
});

// Rota protegida para deletar um usuário (Apenas para Administradores)
router.delete('/user/:id', authenticate, authorize(['Administrador']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
});

router.get('/verify-token', authenticate, (req, res) => {
  res.status(200).json({ message: 'Token válido', user: req.user });
});

module.exports = router;
