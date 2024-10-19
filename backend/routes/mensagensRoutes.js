const express = require('express');
const router = express.Router();
const Mensagens = require('../models/Mensagens');

// POST - Criar uma nova mensagem
router.post('/', async (req, res) => {
    const { nome, email, telefone, cpf, mensagem, customId } = req.body;

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!nome || !email || !telefone || !cpf || !mensagem || !customId) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        const novaMensagem = new Mensagens({
            nome,
            email,
            telefone,
            cpf,
            mensagem,
            customId
        });

        // Salva a nova mensagem no banco de dados
        await novaMensagem.save();
        res.status(201).json(novaMensagem);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao salvar a mensagem', error });
    }
});

// GET - Listar todas as mensagens
router.get('/', async (req, res) => {
    try {
        const mensagens = await Mensagens.find();
        res.status(200).json(mensagens);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar as mensagens', error });
    }
});

router.post('/contato', async (req, res) => {
    const { nome, email, telefone, mensagem } = req.body;

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!nome || !email || !telefone || !mensagem) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        const novaMensagem = new Mensagens({
            nome,
            email,
            telefone,
            mensagem,
        });

        // Salva a nova mensagem no banco de dados
        await novaMensagem.save();
        res.status(201).json(novaMensagem);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao salvar a mensagem', error });
    }
});

// GET - Listar todas as mensagens
router.get('/', async (req, res) => {
    try {
        const mensagens = await Mensagens.find();
        res.status(200).json(mensagens);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar as mensagens', error });
    }
});


// PUT - Atualizar o status de uma mensagem
router.put('/:id', async (req, res) => {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'O campo de status é obrigatório.' });
    }

    if (!['Respondido', 'Não respondido'].includes(status)) {
        return res.status(400).json({ message: 'Status inválido. Deve ser "Respondido" ou "Não respondido".' });
    }

    try {
        const mensagemAtualizada = await Mensagens.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true } // Retorna o documento atualizado
        );

        if (!mensagemAtualizada) {
            return res.status(404).json({ message: 'Mensagem não encontrada.' });
        }

        res.status(200).json(mensagemAtualizada);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o status da mensagem', error });
    }
});

// DELETE - Deletar uma mensagem por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const mensagemDeletada = await Mensagens.findByIdAndDelete(id);

        // Se a mensagem não for encontrada
        if (!mensagemDeletada) {
            return res.status(404).json({ message: 'Mensagem não encontrada' });
        }

        res.status(200).json({ message: 'Mensagem deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar a mensagem', error });
    }
});

module.exports = router;
