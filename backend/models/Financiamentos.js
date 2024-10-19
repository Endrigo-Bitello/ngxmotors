const mongoose = require('mongoose');

const FinanciamentoSchema = new mongoose.Schema({
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
        required: true
    },
    entrada: {
        type: Number,
        required: true
    },
    parcelas: {
        type: Number,
        required: true
    },
    parcelaEstimada: {
        type: Number,
        required: true
    },
    customId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Financiamentos', FinanciamentoSchema);
