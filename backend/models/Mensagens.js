const mongoose = require('mongoose');

const MensagensSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
    },
    mensagem: {
        type: String,
        required: true
    },
    status: { type: String, 
        enum: ['Não respondido', 'Respondido',], 
        default: 'Não respondido'  },

    customId: {
        type: String, 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Mensagens', MensagensSchema);
