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
    default: 'contato@emxsoftwares.com.br',
  },
  name: {
    type: String,
    default: 'EMX Motors',
  },
  instagramUrl: {
    type: String,
    default: 'https://instagram.com/endrigobitello',
  },
  facebookUrl: {
    type: String,
    default: 'https://facebook.com/endrigo.bitello',
  },
  twitterUrl: {
    type: String,
    default: 'https://x.com/endrigobit3llo',
  },
  linkedinUrl: {
    type: String,
    default: '',
  },
  tiktokUrl: {
    type: String,
    default: 'https://tiktok.com/@endrigobitello',
  },
  openingHours: {
    type: String,
    default: 'Segunda à Sexta: 9h - 18h, Sábado: 10h - 16h',
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
    default: 'https://emxsoftwares.com.br',
  },
  slogan: {
    type: String,
    default: 'https://emxsofthouse.com.br',
  },
  about: {
    type: String,
    default: 'A EMX Motors está empenhada em transformar a maneira como as revendas de veículos alcançam seus clientes e aumentam suas vendas pela internet. Com soluções inovadoras e tecnologia de ponta, oferecemos ferramentas que facilitam a gestão de estoque, a visibilidade online e o atendimento aos clientes de forma eficiente e moderna. Nosso objetivo é capacitar revendedores a expandir seus negócios, conectando-os a uma audiência maior e oferecendo uma experiência de compra fluida e otimizada. Acreditamos que a tecnologia pode ser a principal aliada para potencializar as vendas e criar novas oportunidades no mercado automotivo.',
  },
});

// Se já houver um modelo 'Settings', usá-lo, caso contrário, criar um novo.
module.exports = mongoose.model('Settings', SettingsSchema);