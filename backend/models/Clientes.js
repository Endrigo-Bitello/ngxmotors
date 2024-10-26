const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    telefone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cpf: {
        type: String,
        required: false,
    },
    etapa: {
        type: String,
        enum: ['Novo Lead', 'Qualificação', 'Em Negociação', 'Fechamento', 'Pós Venda', 'Perdidos'],
        default: 'Novo Lead',
    },
    dataCriacao: {
        type: Date,
        default: Date.now,
    },
    ultimaInteracao: {
        type: Date,
        default: Date.now,
    },
    comentarios: {
        type: String,
        default: '',
    },
    fonteLead: {
        type: String,
        enum: ['Mensagem no site', 'Pág. Veículo', 'Simulação', 'Instagram', 'Facebook', 'LinkedIn', 'Círculo pessoal', 'Indicação'],
    },
    dataEtapa: {
        type: Date,
        default: Date.now,
    },
    responsavelLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    preferenciaContato: {
        type: String,
        enum: ['Telefone', 'Email', 'WhatsApp'],
        default: 'Telefone',
    },
    customId: {
        type: String,
    },
    motivoPerda: {
        type: String,
        required: false,
    },
    obteveResposta: {
        type: String,
        enum: ['Sim', 'Não'],
        required: false,
    },
    possuiUrgencia: {
        type: Boolean,
        required: false
    },
    tentativasContato: {
        type: Number,
        min: 1,
        max: 7,
        default: 1,
    },
    estado: {
        type: String,
    },
    cidade: {
        type: String,
        required: false
    }

});

module.exports = mongoose.model('Cliente', clienteSchema);
