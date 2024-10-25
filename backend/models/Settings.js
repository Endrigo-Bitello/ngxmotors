const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  taxaString: {
    type: String,
    default: '10%',
  },
  taxaValue: {
    type: Number,
    default: 10,
  },
  address: {
    type: String,
    default: 'Rua Marquês do Herval, 688 - Centro, São Leopoldo/RS',
  },
  whatsappNumber: {
    type: String,
    default: '51997852819',
  },
  phoneNumber: {
    type: String,
    default: '5135882819',
  },
  email: {
    type: String,
    default: 'contato@ngxbr.com',
  },
  name: {
    type: String,
    default: 'NGX Motors',
  },
  instagramUrl: {
    type: String,
    default: 'ngxbr',
  },
  facebookUrl: {
    type: String,
    default: 'ngxbr',
  },
  twitterUrl: {
    type: String,
    default: 'ngxbr',
  },
  linkedinUrl: {
    type: String,
    default: 'ngxbr',
  },
  tiktokUrl: {
    type: String,
    default: 'ngxbr',
  },
  openingHours: {
    type: String,
    default: 'Segunda à Sábado: 9h - 18h, Domingo: 10h - 16h',
  },
  whatsappMessage: {
    type: String,
    default: 'Olá, tenho interesse em um veículo do site',
  },
  city: {
    type: String,
    default: 'São Leopoldo',
  },
  googleMaps: {
    type: String,
    default: 'Rua Marquês do Herval, 688 - Centro, São Leopoldo/RS',
  },
  websiteUrl: {
    type: String,
    default: 'https://ngxbr.com',
  },
  slogan: {
    type: String,
    default: 'A nova geração da sua revenda.',
  },
  about: {
    type: String,
    default: 'A NGX Motors está empenhada em transformar a maneira como as revendas de veículos alcançam seus clientes e aumentam suas vendas pela internet. Com soluções inovadoras e tecnologia de ponta, oferecemos ferramentas que facilitam a gestão de estoque, a visibilidade online e o atendimento aos clientes de forma eficiente e moderna. Nosso objetivo é capacitar revendedores a expandir seus negócios, conectando-os a uma audiência maior e oferecendo uma experiência de compra fluida e otimizada. Acreditamos que a tecnologia pode ser a principal aliada para potencializar as vendas e criar novas oportunidades no mercado automotivo.',
  },
});

// Se já houver um modelo 'Settings', usá-lo, caso contrário, criar um novo.
module.exports = mongoose.model('Settings', SettingsSchema);