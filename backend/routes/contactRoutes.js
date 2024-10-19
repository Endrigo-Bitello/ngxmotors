const express = require('express');
const router = express.Router();

// Array temporário para armazenar os contatos (apenas para fins de exemplo)
let contacts = [];

// POST - Adiciona um novo contato
router.post('/contact', (req, res) => {
    const { nome, email, telefone, mensagem } = req.body;

    // Cria um novo objeto de contato com a data atual
    const newContact = {
        id: contacts.length + 1, // Gera um ID simples baseado no tamanho do array
        nome,
        email,
        telefone,
        mensagem,
        createdAt: new Date().toISOString() // Adiciona a data e hora do envio
    };

    // Adiciona o contato ao array
    contacts.push(newContact);
    console.log('Novo contato adicionado:', newContact);

    res.status(201).json({ message: 'Contato enviado com sucesso!', contact: newContact });
});

// GET - Retorna todos os contatos
router.get('/contact', (req, res) => {
    res.status(200).json(contacts);
});

// DELETE - Remove um contato pelo ID
router.delete('/contact/:id', (req, res) => {
    const { id } = req.params;

    // Encontra o contato pelo ID e remove
    const contactIndex = contacts.findIndex((contact) => contact.id === parseInt(id));

    if (contactIndex !== -1) {
        const removedContact = contacts.splice(contactIndex, 1);
        console.log('Contato removido:', removedContact);
        res.status(200).json({ message: 'Contato removido com sucesso!', contact: removedContact });
    } else {
        res.status(404).json({ message: 'Contato não encontrado.' });
    }
});

module.exports = router;
