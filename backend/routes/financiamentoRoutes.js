const express = require('express');
const router = express.Router();
const Financiamento = require('../models/Financiamentos');

// POST - Criar um novo financiamento
router.post('/', async (req, res) => {
    const { nome, email, telefone, cpf, entrada, parcelas, parcelaEstimada, customId } = req.body;

    if (!nome || !email || !telefone || !cpf || !entrada || !parcelas || !parcelaEstimada || !customId) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        const novoFinanciamento = new Financiamento({
            nome,
            email,
            telefone,
            cpf,
            entrada,
            parcelas,
            parcelaEstimada,
            customId
        });
        await novoFinanciamento.save();
        res.status(201).json(novoFinanciamento);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao salvar o financiamento', error });
    }
});

// GET - Listar todos os financiamentos
router.get('/', async (req, res) => {
    try {
        const financiamentos = await Financiamento.find();
        res.status(200).json(financiamentos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar financiamentos', error });
    }
});

// DELETE - Deletar um financiamento por ID
router.delete('/:id', async (req, res) => {
    try {
        const financiamento = await Financiamento.findByIdAndDelete(req.params.id);
        if (!financiamento) {
            return res.status(404).json({ message: 'Financiamento não encontrado' });
        }
        res.status(200).json({ message: 'Financiamento deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar o financiamento', error });
    }
});

module.exports = router;
