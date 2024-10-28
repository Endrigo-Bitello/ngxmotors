const mongoose = require('mongoose');

const generateCarId = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `c${randomNum}`;
};

const carroSchema = new mongoose.Schema({

    customId: {
        type: String,
        default: generateCarId,
        unique: true
    },

    marca: {
        type: String,
        enum: [
            'Fiat', 'Chevrolet', 'Volkswagen', 'Toyota', 'Hyundai', 'Jeep', 'Renault',
            'Honda', 'Nissan', 'Ford', 'Dodge', 'Peugeot', 'Citroën', 'Mitsubishi', 'Kia',
            'BMW', 'RAM', 'Mercedes-Benz', 'Mini', 'Audi', 'Volvo', 'Land Rover', 'Suzuki', 'Subaru',
            'Lexus', 'Porsche', 'Jaguar', 'Caoa Chery', 'BYD', 'Troller', 'Ferrari',
            'Lamborghini', 'Bentley'
        ],
        required: true
    },
    modelo: {type: String, required: true},
    tipoDeCarro: {
        type: String,
        enum: [
            'Sedan', 'Hatchback', 'SUV', 'CUV', 'Coupé', 'Conversível', 'Picape',
            'Minivan', 'Esportivo', 'Roadster', 'Buggy'
        ],
        required: true
    },
    anoFabricacao: {type: Number, required: true},
    anoModelo: {type: Number, required: true},
    transmissao: {
        type: String,
        enum: ['Manual', 'Automático', 'Automatizado', 'CVT', 'Dual Clutch'],
        required: true
    },
    cor: {type: String, required: true},


    quilometragem: {type: Number, required: true},
    combustivel: {
        type: String,
        enum: ['Gasolina', 'Etanol', 'Álcool', 'Flex', 'Diesel', 'Biodiesel', 'Elétrico', 'Híbrido'],
        required: true
    },
    direcao: {
        type: String,
        enum: ['Hidráulica', 'Elétrica', 'Mecânica', 'Eletro-hidráulica'],
        required: true
    },
    potencia: {type: String, required: true},
    motor: {type: String, required: true},
    torque: {type: String, required: true},
    numeroDePortas: {type: Number, required: true},
    tracao: {
        type: String,
        enum: ['Dianteira', 'Traseira', '4x4', 'AWD'],
        required: true
    },
    freios: {type: String, enum: ['Freios a disco', 'Freios ABS'], required: true},
    capacidadePortaMalas: {type: Number, required: true},

    placa: {type: String, required: true},
    chassi: {type: String, required: false},
    renavam: {type: String, required: false},
    crlv: {type: String, required: false},
    ipva: {type: String, enum: ['Pago', 'Pendente'], required: true},
    comMultas: {type: Boolean, required: true},
    deLeilao: {type: Boolean, required: true},
    dpvat: {type: String, enum: ['Pago', 'Pendente'], required: true},


    unicoDono: {type: Boolean, default: false},
    comManual: {type: Boolean, default: false},
    chaveReserva: {type: Boolean, default: false},
    revisoesConcessionaria: {type: Boolean, default: false},
    comGarantia: {type: Boolean, default: false},
    aceitaTroca: {type: Boolean, default: false},


    opcionais: {
        tetoSolar: {type: Boolean, default: false},
        pilotoAutomatico: {type: Boolean, default: false},
        bancosCouro: {type: Boolean, default: false},
        cameraRe: {type: Boolean, default: false},
        kitGNV: {type: Boolean, default: false},
        sensorEstacionamento: {type: Boolean, default: false},
        chavePresencial: {type: Boolean, default: false},
        sistemaNavegacao: {type: Boolean, default: false},
        centralMultimidia: {type: Boolean, default: false},
        controleTracao: {type: Boolean, default: false},
        assistenteRampa: {type: Boolean, default: false},
        rodasLigaLeve: {type: Boolean, default: false},
        faroisNeblina: {type: Boolean, default: false},
        assistenteEstacionamento: {type: Boolean, default: false},
        freioEstacionamentoEletrico: {type: Boolean, default: false},
        airbag: {type: Boolean, default: false},
        arCondicionado: {type: Boolean, default: false},
        alarme: {type: Boolean, default: false},
        blindado: {type: Boolean, default: false},
        computadorBordo: {type: Boolean, default: false},
        conexaoUSB: {type: Boolean, default: false},
        bluetooth: {type: Boolean, default: false},
        som: {type: Boolean, default: false},
        tracao4x4: {type: Boolean, default: false},
        travaEletrica: {type: Boolean, default: false},
        vidroEletrico: {type: Boolean, default: false},
        volanteMultifuncional: {type: Boolean, default: false}
    },


    destaque: {type: Boolean, default: false},
    status: {type: String, enum: ['Disponível', 'Reservado', 'Vendido'], default: 'Disponível'},
    valorCompra: {type: Number, required: true},
    valorVenda: {type: Number, required: true},
    valorFIPE: {type: Number, required: true},

    imagens: [{type: String, required: true}],

    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Carro', carroSchema);
