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
    enum: ['Mensagem no site', 'Página do veículo', 'Simulação', 'Instagram', 'Facebook', 'LinkedIn', 'Círculo pessoal', 'Indicação', 'Indefinido'],
    default: 'Indefinido',
  },
  dataEtapa: {
    type: Date,
    default: Date.now,
  },
  responsavelLead: {
    type: String,
    default: 'Não atribuído',
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
  enum: [
    'Não respondeu',
    'Não atendeu telefone',
    'Cliente desistiu',
    'Concorrente ganhou',
    'Problema de orçamento',
    'Veículo não atende às necessidades',
    'Veículo já foi vendido',
    'Não conseguiu contato',
    'Lead não qualificado',
    'Mudança de prioridade do cliente',
    'Outro',
  ],
  required: false,
},

  estado: {
    type: String,
    enum: [
      'Acre',
      'Alagoas',
      'Amapá',
      'Amazonas',
      'Bahia',
      'Ceará',
      'Distrito Federal',
      'Espírito Santo',
      'Goiás',
      'Maranhão',
      'Mato Grosso',
      'Mato Grosso do Sul',
      'Minas Gerais',
      'Pará',
      'Paraíba',
      'Paraná',
      'Pernambuco',
      'Piauí',
      'Rio de Janeiro',
      'Rio Grande do Norte',
      'Rio Grande do Sul',
      'Rondônia',
      'Roraima',
      'Santa Catarina',
      'São Paulo',
      'Sergipe',
      'Tocantins'
    ]
  }
  

});

module.exports = mongoose.model('Cliente', clienteSchema);
