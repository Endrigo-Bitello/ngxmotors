const express = require('express');
const router = express.Router();
const Carros = require('../models/Carros'); // Certifique-se de ajustar o caminho conforme sua estrutura
const Motos = require('../models/Motos');   // Certifique-se de ajustar o caminho conforme sua estrutura

// Endpoint de busca por marca ou modelo em carros e motos
router.get('/search', async (req, res) => {
  const { search } = req.query; // Captura o termo de pesquisa enviado pelo frontend

  try {
    // Busca carros que correspondam à marca ou modelo fornecido
    const carros = await Carros.find({
      $or: [
        { marca: { $regex: search, $options: 'i' } },  // Busca ignorando caixa alta/baixa
        { modelo: { $regex: search, $options: 'i' } }, // Busca ignorando caixa alta/baixa
      ],
    });

    // Busca motos que correspondam à marca ou modelo fornecido
    const motos = await Motos.find({
      $or: [
        { marca: { $regex: search, $options: 'i' } },
        { modelo: { $regex: search, $options: 'i' } },
      ],
    });

    // Combina os resultados de carros e motos em um array
    const vehicles = [...carros, ...motos];

    // Se não encontrar veículos, retorna uma mensagem informativa
    if (vehicles.length === 0) {
      return res.status(404).json({ message: 'Nenhum veículo encontrado com esse termo de pesquisa' });
    }

    // Retorna os veículos encontrados
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
    res.status(500).json({ message: 'Erro ao buscar veículos' });
  }
});

module.exports = router;
