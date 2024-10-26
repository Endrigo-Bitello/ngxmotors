const mongoose = require('mongoose');

const generateMotoId = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000); 
  return `m${randomNum}`;
};


const motoSchema = new mongoose.Schema({


  customId: {
    type: String,
    default: generateMotoId, 
    unique: true 
  },

  marca: {
    type: String,
    enum: [
      'Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'BMW', 'Ducati', 'Harley-Davidson',
      'Triumph', 'KTM', 'Royal Enfield', 'Haojue', 'Dafra', 'Shineray', 'MV Agusta', 
    ],
    required: true
  },
  modelo: { type: String, required: true }, 
  tipoDeMoto: {
    type: String,
    enum: [
      'Street', 'Esportiva', 'Naked', 'Custom', 'Trail', 'Big Trail', 'Touring', 
      'Scooter', 'Crossover', 'Motocross', 'Enduro'
    ],
    required: true
  },
  anoFabricacao: { type: Number, required: true },
  anoModelo: { type: Number, required: true },
  transmissao: {
    type: String,
    enum: ['Manual', 'Automático', 'CVT'],
    required: true
  },
  cor: { type: String, required: true },

  
  quilometragem: { type: Number, required: true },
  combustivel: {
    type: String,
    enum: ['Gasolina', 'Etanol', 'Flex', 'Elétrico'],
    required: true
  },
  direcao: {
    type: String,
    enum: ['Convencional', 'Assistida'],
    required: true
  },
  potencia: { type: String, required: true }, 
  cilindrada: { 
    type: String, 
    enum: ['50', '100', '110', '125', '150', '155', '160', '190', '200', 
      '250', '300', '350', '400', '420', '450', '500', '550', '600', 
      '650', '700', '750', '800', '850', '900', '950', '1000', 
      'Acima de 1.000'],
    required: true },
  torque: { type: String, required: true }, 
  numeroDeMarchas: { type: Number, required: true }, 
  freios: {
    type: String,
    enum: ['Freios a disco', 'ABS', 'CBS'],
    required: true
  },
  capacidadeTanque: { type: Number, required: true },
  peso: { type: Number, required: true }, 

  
  placa: { type: String, required: true },
  chassi: { type: String, required: false },
  renavam: { type: String, required: false },
  crlv: { type: String, required: false },
  ipva: { type: String, enum: ['Pago', 'Pendente'], required: true },
  comMultas: { type: Boolean, required: true },
  deLeilao: { type: Boolean, required: true },
  dpvat: { type: String, enum: ['Pago', 'Pendente'], required: false },

  unicoDono: { type: Boolean, default: false },
  comManual: { type: Boolean, default: false },
  chaveReserva: { type: Boolean, default: false },
  revisoesConcessionaria: { type: Boolean, default: false },
  comGarantia: { type: Boolean, default: false },
  aceitaTroca: { type: Boolean, default: false },

  opcionais: {
    freiosABS: { type: Boolean, default: false },
    controleTracao: { type: Boolean, default: false },
    controleEstabilidade: { type: Boolean, default: false },
    computadorBordo: { type: Boolean, default: false },
    cameraRe: { type: Boolean, default: false },
    conexaoUSB: { type: Boolean, default: false },
    sistemaNavegacao: { type: Boolean, default: false },
    faroisLED: { type: Boolean, default: false },
    manoplasAquecidas: { type: Boolean, default: false },
    alarme: { type: Boolean, default: false },
    protetorMotor: { type: Boolean, default: false },
    bolhaAerodinamica: { type: Boolean, default: false },
    malasLaterais: { type: Boolean, default: false },
    bancoAquecido: { type: Boolean, default: false },
    suspensaoAjustavel: { type: Boolean, default: false }
  },

  destaque: { type: Boolean, default: false },
  status: { type: String, enum: ['Disponível', 'Reservado', 'Vendido'], default: 'Disponível'  },
  valorCompra: { type: Number, required: true }, 
  valorVenda: { type: Number, required: true },  
  valorFIPE: { type: Number, required: true },  

  imagens: [{ type: String, required: true }],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Moto', motoSchema);
