const express = require('express');
const router = express.Router();
const Carros = require('../models/Carros'); // Modelo de carros
const Motos = require('../models/Motos'); // Modelo de motos

// GET - Listar todos os veículos (carros e motos)
router.get('/', async (req, res) => {
    try {
        const carros = await Carros.find().lean(); // Lean para evitar dados extras desnecessários
        const motos = await Motos.find().lean();

        // Adiciona o tipo de veículo explicitamente
        const veiculos = [
            ...carros.map(car => ({ ...car, tipo: 'carros' })),
            ...motos.map(moto => ({ ...moto, tipo: 'motos' }))
        ];

        res.json(veiculos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar veículos', error: error.message });
    }
});


router.get('/', async (req, res) => {
    const { search } = req.query; // Pegando a query de busca

    try {
        const searchQuery = search
            ? {
                $or: [
                    { modelo: { $regex: search, $options: 'i' } },
                    { marca: { $regex: search, $options: 'i' } },
                    { tipoDeCarro: { $regex: search, $options: 'i' } },
                    { tipoDeMoto: { $regex: search, $options: 'i' } }
                ]
            }
            : {}; // Caso não tenha busca, retorna todos os veículos

        const carros = await Carros.find(searchQuery).lean();
        const motos = await Motos.find(searchQuery).lean();

        const veiculos = [
            ...carros.map(car => ({ ...car, tipo: 'carros' })),
            ...motos.map(moto => ({ ...moto, tipo: 'motos' }))
        ];

        res.json(veiculos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar veículos', error: error.message });
    }
});

router.get('/:customId', async (req, res) => {
    const { customId } = req.params;

    try {
        let vehicle;

        // Verifica se o customId começa com 'm' (moto) ou 'c' (carro)
        if (customId.startsWith('m')) {
            vehicle = await Motos.findOne({ customId });
        } else if (customId.startsWith('c')) {
            vehicle = await Carros.findOne({ customId });
        } else {
            return res.status(400).json({ message: 'Invalid customId format' });
        }

        // Verifica se o veículo foi encontrado
        if (!vehicle) {
            return res.status(404).json({ message: 'Veículo não encontrado' });
        }

        // Adiciona o tipo ao veículo encontrado
        const vehicleWithTipo = {
            ...vehicle.toObject(),
            tipo: customId.startsWith('m') ? 'motos' : 'carros'
        };

        // Retorna o veículo encontrado
        res.json(vehicleWithTipo);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar veículo', error: error.message });
    }
});

module.exports = router;
