import { useState } from 'react';
import { FaImages, FaStepBackward, FaStepForward, FaChevronDown, FaTimes, FaCouch, FaCar, FaLock, FaWrench, FaQuestionCircle } from 'react-icons/fa';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';

import axios from 'axios';
import Image from 'next/image';
import Stock from './Stock';

const NewCar = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Informações principais
        marca: '',
        modelo: '',
        tipoDeCarro: '',
        anoFabricacao: '',
        anoModelo: '',
        transmissao: '',
        cor: '',

        // Ficha técnica
        quilometragem: '',
        combustivel: '',
        direcao: '',
        potencia: '',
        motor: '',
        torque: '',
        numeroDePortas: '',
        tracao: '',
        freios: '',
        capacidadePortaMalas: '',

        // Documentação e regularização
        placa: '',
        placaFormat: '',
        chassi: '',
        renavam: '',
        crlv: '',
        ipva: '',
        comMultas: false,
        deLeilao: false,
        dpvat: '',

        // Conservação e garantia
        unicoDono: false,
        comManual: false,
        chaveReserva: false,
        revisoesConcessionaria: false,
        comGarantia: false,
        aceitaTroca: false,

        // Opcionais do veículo
        opcionais: {
            tetoSolar: false,
            pilotoAutomatico: false,
            bancosCouro: false,
            cameraRe: false,
            kitGNV: false,
            sensorEstacionamento: false,
            chavePresencial: false,
            sistemaNavegacao: false,
            centralMultimidia: false,
            controleTracao: false,
            assistenteRampa: false,
            rodasLigaLeve: false,
            faroisNeblina: false,
            assistenteEstacionamento: false,
            freioEstacionamentoEletrico: false,
            airbag: false,
            arCondicionado: false,
            alarme: false,
            blindado: false,
            computadorBordo: false,
            conexaoUSB: false,
            bluetooth: false,
            som: false,
            tracao4x4: false,
            travaEletrica: false,
            vidroEletrico: false,
            volanteMultifuncional: false,
        },

        // Informações financeiras
        valorCompra: '',
        valorVenda: '',
        valorFIPE: '',

        // Imagens do veículo (URLs)
        imagens: []
    });

    const marcas = [
        'Fiat', 'Chevrolet', 'Volkswagen', 'Toyota', 'Hyundai', 'Jeep', 'Renault',
        'Honda', 'Nissan', 'Ford', 'Dodge', 'Peugeot', 'Citroën', 'Mitsubishi', 'Kia',
        'BMW', 'RAM', 'Mercedes-Benz', 'Mini', 'Audi', 'Volvo', 'Land Rover', 'Suzuki', 'Subaru',
        'Lexus', 'Porsche', 'Jaguar', 'Caoa Chery', 'BYD', 'Troller', 'Ferrari',
        'Lamborghini', 'Bentley'
    ];

    const tiposDeCarro = [
        'Sedan', 'Hatchback', 'SUV', 'CUV', 'Coupé', 'Conversível', 'Picape',
        'Minivan', 'Esportivo', 'Roadster', 'Buggy'
    ];

    const transmissoes = ['Manual', 'Automático', 'Automatizado', 'CVT', 'Dual Clutch'];

    const combustiveis = ['Gasolina', 'Etanol', 'Álcool', 'Flex', 'Diesel', 'Biodiesel', 'Elétrico', 'Híbrido'];

    const direcoes = ['Hidráulica', 'Elétrica', 'Mecânica', 'Eletro-hidráulica'];

    const tracoes = ['Dianteira', 'Traseira', '4x4', 'AWD'];

    const freiosOptions = ['Freios a disco', 'Freios ABS'];

    const dpvatOptions = ['Pago', 'Pendente'];

    const ipvaOptions = ['Pago', 'Pendente'];

    const motorOptions = ['1.0', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '2.0 - 2.9', '3.0 - 3.9', '4.0 ou mais'];

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [tipoDeCarroOpen, setTipoDeCarroOpen] = useState(false);
    const [motorOpen, setMotorOpen] = useState(false);
    const [transmissaoOpen, setTransmissaoOpen] = useState(false);
    const [combustivelOpen, setCombustivelOpen] = useState(false);
    const [direcaoOpen, setDirecaoOpen] = useState(false);
    const [tracaoOpen, setTracaoOpen] = useState(false);
    const [freiosOpen, setFreiosOpen] = useState(false);
    const [ipvaOpen, setIpvaOpen] = useState(false);
    const [dpvatOpen, setDpvatOpen] = useState(false);
    const [showStock, setShowStock] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (dropdown) => {
        if (openDropdown === dropdown) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(dropdown);
        }
    };

    const handleMotorSelect = (option) => {
        setFormData({ ...formData, motor: option });
        setMotorOpen(false);
    };

    const handleKilometragemChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value > 500000) value = 500000;
        setFormData({ ...formData, quilometragem: value });
    };

    const [placaFormat, setPlacaFormat] = useState('');

    const detectPlacaFormat = (placa) => {
        const mercosulRegex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
        const antigoRegex = /^[A-Z]{3}-[0-9]{4}$/;

        if (mercosulRegex.test(placa)) {
            return 'mercosul';
        } else if (antigoRegex.test(placa)) {
            return 'antiga';
        } else {
            return '';
        }
    };

    const handleChangePlaca = (e) => {
        const { name, value } = e.target;

        if (name === 'placa') {
            setPlacaFormat(detectPlacaFormat(value));
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePotenciaChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setFormData({
            ...formData,
            potencia: value
        });
    };

    const handleTorqueChange = (e) => {
        const value = e.target.value.replace(/[^0-9,.]/g, '');
        setFormData({
            ...formData,
            torque: value
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        if (name.includes('opcionais')) {
            const key = name.split('.')[1];
            setFormData((prevData) => ({
                ...prevData,
                opcionais: {
                    ...prevData.opcionais,
                    [key]: checked,
                }
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: checked,
            }));
        }
    };

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Primeira requisição: criar o veículo no banco de dados
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/carros`, formData);
            const customId = response.data.customId;

            // Se houver imagens para enviar, faça o upload delas
            if (formData.imagens.length > 0) {
                const formDataImagens = new FormData();

                // Adiciona as imagens ao FormData
                Array.from(formData.imagens).forEach((file, index) => {
                    formDataImagens.append('imagens', file);
                });

                // Segunda requisição: enviar as imagens
                const uploadResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/carros/upload/${customId}`, formDataImagens, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            setShowStock(true);

        } catch (error) {
            console.error('Erro ao adicionar carro ou enviar imagens:', error.response ? error.response.data : error.message);
        }
    };

    if (showStock) {
        return <Stock />;
    }

    const renderButton = () => {
        const isStepValid = () => {
            switch (step) {
                case 1:
                    return formData.marca && formData.modelo && formData.tipoDeCarro &&
                        formData.anoFabricacao && formData.anoModelo && formData.transmissao && formData.cor;
                case 2:
                    return formData.quilometragem && formData.combustivel && formData.direcao &&
                        formData.potencia && formData.motor && formData.torque && formData.numeroDePortas && formData.tracao && formData.freios;
                case 3:
                    return formData.placa;
                case 4:
                    return true;
                case 5:
                    return formData.valorCompra && formData.valorVenda && formData.valorFIPE && formData.imagens.length > 0;
                default:
                    return false;
            }
        };

        return (
            <div className="flex justify-between mt-6">
                {step > 1 && (
                    <button
                        type="button"
                        onClick={prevStep}
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all"
                    >
                        <FaStepBackward className="inline-block mr-2" /> Voltar
                    </button>
                )}
                {step < 5 && (
                    <button
                        type="button"
                        onClick={() => {
                            if (isStepValid()) {
                                nextStep();
                            } else {
                                // Mensagem personalizada ao invés de alert padrão do navegador
                                const stepMessages = {
                                    1: 'Preencha todos os campos obrigatórios da etapa "Informações Básicas".',
                                    2: 'Preencha todos os campos obrigatórios da etapa "Ficha Técnica".',
                                    3: 'Preencha todos os campos obrigatórios da etapa "Documentação e Regularização".',
                                    4: 'Selecione ao menos um opcional.',
                                    5: 'Preencha todos os campos obrigatórios e faça o upload de imagens.'
                                };
                                alert(stepMessages[step]);
                            }
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                    >
                        Próxima Etapa <FaStepForward className="inline-block ml-2" />
                    </button>
                )}
            </div>
        );
    };

    switch (step) {
        case 1:
            return (
                <div className="p-8 bg-gray-50 rounded-lg shadow-md max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Informações Básicas</h2>
                    <form className="space-y-6">
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Marca</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-between bg-white border border-gray-300 p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                    onClick={() => toggleDropdown('marca')}
                                >
                                    {formData.marca ? (
                                        <div className="flex items-center">
                                            <div className="w-6 h-6 mr-3 relative">
                                                <Image
                                                    src={`/icons/${formData.marca.toLowerCase().replace(/ /g, '-')}.png`}
                                                    alt={formData.marca}
                                                    layout="fill"
                                                    objectFit="contain"
                                                />
                                            </div>
                                            {formData.marca}
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">Selecione a marca</span>
                                    )}
                                    <FaChevronDown className="text-gray-400" />
                                </button>
                                {openDropdown === 'marca' && (
                                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {marcas.map((marca) => (
                                            <li
                                                key={marca}
                                                onClick={() => {
                                                    setFormData({ ...formData, marca });
                                                    toggleDropdown(null);
                                                }}
                                                className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                                            >
                                                <div className="w-6 h-6 mr-3 relative">
                                                    <Image
                                                        src={`/icons/${marca.toLowerCase().replace(/ /g, '-')}.png`}
                                                        alt={marca}
                                                        layout="fill"
                                                        objectFit="contain"
                                                    />
                                                </div>
                                                {marca}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Modelo</label>
                            <input
                                type="text"
                                name="modelo"
                                value={formData.modelo}
                                onChange={handleChange}
                                placeholder="Digite o modelo"
                                className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Tipo de Carro</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    className="w-full bg-white flex items-center justify-between border border-gray-300 p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                    onClick={() => toggleDropdown('tipoDeCarro')}
                                >
                                    {formData.tipoDeCarro ? (
                                        <span>{formData.tipoDeCarro}</span>
                                    ) : (
                                        <span className="text-gray-500">Selecione o tipo de carro</span>
                                    )}
                                    <FaChevronDown className="text-gray-400" />
                                </button>
                                {openDropdown === 'tipoDeCarro' && (
                                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {tiposDeCarro.map((tipo) => (
                                            <li
                                                key={tipo}
                                                onClick={() => {
                                                    setFormData({ ...formData, tipoDeCarro: tipo });
                                                    toggleDropdown(null);
                                                }}
                                                className="p-3 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {tipo}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium mb-2">Ano de Fabricação</label>
                                <input
                                    type="number"
                                    name="anoFabricacao"
                                    value={formData.anoFabricacao}
                                    onChange={handleChange}
                                    placeholder="Digite o ano de fabricação"
                                    className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium mb-2">Ano do Modelo</label>
                                <input
                                    type="number"
                                    name="anoModelo"
                                    value={formData.anoModelo}
                                    onChange={handleChange}
                                    placeholder="Digite o ano do modelo"
                                    className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Transmissão</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    className="w-full bg-white flex items-center justify-between border border-gray-300 p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                    onClick={() => toggleDropdown('transmissao')}
                                >
                                    {formData.transmissao ? (
                                        <span>{formData.transmissao}</span>
                                    ) : (
                                        <span className="text-gray-500">Selecione a transmissão</span>
                                    )}
                                    <FaChevronDown className="text-gray-400" />
                                </button>
                                {openDropdown === 'transmissao' && (
                                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {transmissoes.map((transmissao) => (
                                            <li
                                                key={transmissao}
                                                onClick={() => {
                                                    setFormData({ ...formData, transmissao });
                                                    toggleDropdown(null);
                                                }}
                                                className="p-3 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {transmissao}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Cor</label>
                            <input
                                type="text"
                                name="cor"
                                value={formData.cor}
                                onChange={handleChange}
                                placeholder="Digite a cor"
                                className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        {renderButton()}
                    </form>
                </div>
            );
        case 2:
            return (
                <div className="p-8 bg-gray-50 rounded-lg shadow-md max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Ficha Técnica</h2>
                    <form className="space-y-6">

                        {/* Quilometragem */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Quilometragem</label>
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    name="quilometragem"
                                    value={formData.quilometragem.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                    onChange={(e) => handleKilometragemChange(e)}
                                    placeholder="Digite a quilometragem"
                                    className={`p-3 bg-white border ${formData.quilometragem > 500000 ? 'border-red-600' : 'border-gray-300'} rounded-lg shadow-sm focus:ring focus:ring-blue-300 w-full pr-16`}
                                />
                                <span className="absolute right-4 text-gray-500">KM</span>
                            </div>
                            {formData.quilometragem > 500000 && (
                                <span className="text-red-500 mt-1">
                                    A quilometragem não pode exceder 500.000 km
                                </span>
                            )}
                        </div>

                        {/* Combustível */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Combustível</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    className="w-full bg-white flex items-center justify-between border border-gray-300 p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                    onClick={() => toggleDropdown('combustivel')}
                                >
                                    {formData.combustivel ? (
                                        <span>{formData.combustivel}</span>
                                    ) : (
                                        <span className="text-gray-500">Selecione o tipo de combustível</span>
                                    )}
                                    <FaChevronDown className="text-gray-400" />
                                </button>
                                {openDropdown === 'combustivel' && (
                                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {combustiveis.map((combustivel) => (
                                            <li
                                                key={combustivel}
                                                onClick={() => {
                                                    setFormData({ ...formData, combustivel });
                                                    toggleDropdown(null);
                                                }}
                                                className="p-3 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {combustivel}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Direção */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Direção</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    className="w-full bg-white flex items-center justify-between border border-gray-300 p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                    onClick={() => toggleDropdown('direcao')}
                                >
                                    {formData.direcao ? (
                                        <span>{formData.direcao}</span>
                                    ) : (
                                        <span className="text-gray-500">Selecione o tipo de direção</span>
                                    )}
                                    <FaChevronDown className="text-gray-400" />
                                </button>
                                {openDropdown === 'direcao' && (
                                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {direcoes.map((direcao) => (
                                            <li
                                                key={direcao}
                                                onClick={() => {
                                                    setFormData({ ...formData, direcao });
                                                    toggleDropdown(null);
                                                }}
                                                className="p-3 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {direcao}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Potência e Motor */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium mb-2">Potência (CV)</label>
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        name="potencia"
                                        value={formData.potencia.replace(/\D/g, '')}
                                        onChange={handlePotenciaChange}
                                        placeholder="Digite a potência do carro"
                                        className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 w-full pr-16"
                                    />
                                    <span className="absolute right-4 text-gray-500">CV</span>
                                </div>
                            </div>

                            <div className="relative flex flex-col">
                                <label className="text-gray-700 font-medium mb-2">Motor</label>
                                <button
                                    type="button"
                                    onClick={() => toggleDropdown('motor')}
                                    className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 flex justify-between items-center"
                                >
                                    {formData.motor || 'Selecione o motor'}
                                    <FaChevronDown className="text-gray-400" />
                                </button>
                                {openDropdown === 'motor' && (
                                    <ul className="absolute z-20 left-0 top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {motorOptions.map((option) => (
                                            <li
                                                key={option}
                                                onClick={() => handleMotorSelect(option)}
                                                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                            >
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>


                        {/* Torque */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Torque (kgfm)</label>
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    name="torque"
                                    value={formData.torque.replace(/[^0-9,.]/g, '')}
                                    onChange={handleTorqueChange}
                                    placeholder="Exemplo: 30 kgfm"
                                    className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 w-full pr-16"
                                />
                                <span className="absolute right-4 text-gray-500">kgfm</span>
                            </div>
                        </div>

                        {/* Número de Portas e Tração */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium mb-2">Número de Portas</label>
                                <input
                                    type="number"
                                    name="numeroDePortas"
                                    value={formData.numeroDePortas}
                                    onChange={handleChange}
                                    placeholder="Digite o número de portas"
                                    className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium mb-2">Tração</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        className="w-full bg-white flex items-center justify-between border border-gray-300 p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                        onClick={() => toggleDropdown('tracao')}
                                    >
                                        {formData.tracao ? (
                                            <span>{formData.tracao}</span>
                                        ) : (
                                            <span className="text-gray-500">Selecione a tração</span>
                                        )}
                                        <FaChevronDown className="text-gray-400" />
                                    </button>
                                    {openDropdown === 'tracao' && (
                                        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {tracoes.map((tracao) => (
                                                <li
                                                    key={tracao}
                                                    onClick={() => {
                                                        setFormData({ ...formData, tracao });
                                                        toggleDropdown(null);
                                                    }}
                                                    className="p-3 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {tracao}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Freios e Capacidade do Porta-Malas */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium mb-2">Freios</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        className="w-full bg-white flex items-center justify-between border border-gray-300 p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                        onClick={() => toggleDropdown('freios')}
                                    >
                                        {formData.freios ? (
                                            <span>{formData.freios}</span>
                                        ) : (
                                            <span className="text-gray-500">Selecione o tipo de freios</span>
                                        )}
                                        <FaChevronDown className="text-gray-400" />
                                    </button>
                                    {openDropdown === 'freios' && (
                                        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {freiosOptions.map((freios) => (
                                                <li
                                                    key={freios}
                                                    onClick={() => {
                                                        setFormData({ ...formData, freios });
                                                        toggleDropdown(null);
                                                    }}
                                                    className="p-3 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {freios}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium mb-2">Capacidade do Porta-Malas</label>
                                <div className="relative flex items-center">
                                    <input
                                        type="number"
                                        name="capacidadePortaMalas"
                                        value={formData.capacidadePortaMalas}
                                        onChange={handleChange}
                                        placeholder="Capacidade em litros"
                                        className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 w-full pr-16"
                                    />
                                    <span className="absolute right-4 text-gray-500">L</span>
                                </div>
                            </div>
                        </div>

                        {renderButton()} {/* Próxima Etapa */}
                    </form>
                </div>
            ); case 3:
            return (
                <div className="p-8 bg-gray-50 rounded-lg shadow-md max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Documentação e Regularização</h2>
                    <form className="space-y-6">

                        {/* Placa */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Placa</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="placa"
                                    value={formData.placa}
                                    onChange={handleChangePlaca}
                                    placeholder="Digite a placa"
                                    className="p-3 pr-12 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                />
                            </div>
                            {formData.placa && (
                                <span className="text-gray-500 mt-1">
                                    {placaFormat === 'mercosul' ? 'Formato da placa: Mercosul' : placaFormat === 'antigo' ? 'Formato da placa: Antigo' : null}
                                </span>
                            )}
                        </div>

                        {/* Chassi */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Chassi (Opcional)</label>
                            <input
                                type="text"
                                name="chassi"
                                value={formData.chassi}
                                onChange={handleChange}
                                placeholder="Digite o número do chassi"
                                maxLength={17} // Limita o input a 17 caracteres
                                className={`p-3 w-full bg-white border 
                                    ${!formData.chassi ? 'border-gray-300' :
                                        formData.chassi.length < 17 ? 'border-red-600' :
                                            'border-green-500'} 
                                    rounded-lg shadow-sm focus:ring focus:ring-blue-300`}
                            />
                            {formData.chassi && (
                                <span className="text-gray-500 mt-1">
                                    {formData.chassi.length === 17
                                        ? null
                                        : 'Formato inválido: O chassi deve conter 17 caracteres'}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* RENAVAM */}
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium mb-2">RENAVAM (Opcional)</label>
                                <input
                                    type="text"
                                    name="renavam"
                                    value={formData.renavam}
                                    onChange={handleChange}
                                    placeholder="Digite o RENAVAM"
                                    maxLength={11}
                                    className={`p-3 bg-white border 
                                        ${!formData.renavam ? 'border-gray-300' :
                                            formData.renavam.length < 11 ? 'border-red-600' :
                                                'border-green-500'} 
                                        rounded-lg shadow-sm focus:ring focus:ring-blue-300`}
                                />
                                {formData.renavam && (
                                    <span className="text-gray-500 mt-1">
                                        {formData.renavam.length === 11
                                            ? null
                                            : 'Formato inválido: O RENAVAM deve conter 11 dígitos'}
                                    </span>
                                )}
                            </div>

                            {/* CRLV */}
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium mb-2">CRLV (Opcional)</label>
                                <input
                                    type="text"
                                    name="crlv"
                                    value={formData.crlv}
                                    onChange={handleChange}
                                    placeholder="Digite o CRLV"
                                    maxLength={12}
                                    className={`p-3 bg-white border 
                                        ${!formData.crlv ? 'border-gray-300' :
                                            formData.crlv.length < 12 ? 'border-red-600' :
                                                'border-green-500'} 
                                        rounded-lg shadow-sm focus:ring focus:ring-blue-300`}
                                />
                                {formData.crlv && (
                                    <span className="text-gray-500 mt-1">
                                        {formData.crlv.length === 12
                                            ? null
                                            : 'Formato inválido: O CRLV deve conter 12 dígitos'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* IPVA */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">IPVA</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    className={`w-full bg-white flex items-center p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-300 
                                        ${formData.ipva === 'Pago' ? 'border border-green-500' : formData.ipva === 'Pendente' ? 'border border-yellow-500' : 'border border-gray-300'}`}
                                    onClick={() => toggleDropdown('ipva')}
                                >
                                    {formData.ipva ? <span>{formData.ipva}</span> : <span className="text-gray-500">Selecione o status do IPVA</span>}
                                </button>
                                {openDropdown === 'ipva' && (
                                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {ipvaOptions.map((ipva) => (
                                            <li
                                                key={ipva}
                                                onClick={() => {
                                                    setFormData({ ...formData, ipva });
                                                    toggleDropdown(null);
                                                }}
                                                className="p-3 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {ipva}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* DPVAT */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">DPVAT</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    className={`w-full bg-white flex items-center p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-300 
                                        ${formData.dpvat === 'Pago' ? 'border border-green-500' : formData.dpvat === 'Pendente' ? 'border border-yellow-500' : 'border border-gray-300'}`}
                                    onClick={() => toggleDropdown('dpvat')}
                                >
                                    {formData.dpvat ? <span>{formData.dpvat}</span> : <span className="text-gray-500">Selecione o status do DPVAT</span>}
                                </button>
                                {openDropdown === 'dpvat' && (
                                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {dpvatOptions.map((dpvat) => (
                                            <li
                                                key={dpvat}
                                                onClick={() => {
                                                    setFormData({ ...formData, dpvat });
                                                    toggleDropdown(null);
                                                }}
                                                className="p-3 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {dpvat}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Com Multas e Veículo de Leilão */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Toggle para Com Multas */}
                            <div className="flex items-center space-x-3">
                                <label className="text-gray-700 font-medium">Com Multas?</label>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="comMultas"
                                        checked={formData.comMultas}
                                        onChange={handleCheckboxChange}
                                        className="sr-only peer"
                                    />
                                    <div className="group peer bg-white rounded-full duration-300 w-12 h-6 ring-2 ring-red-500 after:duration-300 after:bg-red-500 peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-5 after:w-5 after:top-0.5 after:left-0.5 after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-hover:after:scale-95"></div>
                                </label>
                            </div>

                            {/* Toggle para Veículo de Leilão */}
                            <div className="flex items-center space-x-3">
                                <label className="text-gray-700 font-medium">Veículo de Leilão?</label>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="deLeilao"
                                        checked={formData.deLeilao}
                                        onChange={handleCheckboxChange}
                                        className="sr-only peer"
                                    />
                                    <div className="group peer bg-white rounded-full duration-300 w-12 h-6 ring-2 ring-red-500 after:duration-300 after:bg-red-500 peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-5 after:w-5 after:top-0.5 after:left-0.5 after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-hover:after:scale-95"></div>
                                </label>
                            </div>
                        </div>

                        {renderButton()}
                    </form>
                </div>
            );
        case 4:
            return (
                <div className="p-8 bg-gray-50 rounded-lg shadow-md max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Opcionais do Veículo</h2>

                    {/* Conforto */}
                    <div className="mb-6 border-b border-gray-300 pb-4">
                        <div className="flex items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Conforto</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                            {[
                                { key: 'arCondicionado', label: 'Ar Condicionado' },
                                { key: 'bancosCouro', label: 'Bancos de Couro' },
                                { key: 'vidroEletrico', label: 'Vidro Elétrico' },
                                { key: 'volanteMultifuncional', label: 'Volante Multifuncional' }
                            ].map(opcional => (
                                <div className="flex items-center" key={opcional.key}>
                                    <input
                                        type="checkbox"
                                        name={`opcionais.${opcional.key}`}
                                        checked={formData.opcionais[opcional.key]}
                                        onChange={handleCheckboxChange}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <label className="ml-3 text-gray-600">{opcional.label}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tecnologia */}
                    <div className="mb-6 border-b border-gray-300 pb-4">
                        <div className="flex items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Tecnologia</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                            {[
                                { key: 'bluetooth', label: 'Bluetooth' },
                                { key: 'centralMultimidia', label: 'Central Multimídia' },
                                { key: 'sistemaNavegacao', label: 'Sistema de Navegação' },
                                { key: 'conexaoUSB', label: 'Conexão USB' },
                                { key: 'computadorBordo', label: 'Computador de Bordo' }
                            ].map(opcional => (
                                <div className="flex items-center" key={opcional.key}>
                                    <input
                                        type="checkbox"
                                        name={`opcionais.${opcional.key}`}
                                        checked={formData.opcionais[opcional.key]}
                                        onChange={handleCheckboxChange}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <label className="ml-3 text-gray-600">{opcional.label}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Segurança */}
                    <div className="mb-6 border-b border-gray-300 pb-4">
                        <div className="flex items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Segurança</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                            {[
                                { key: 'airbag', label: 'Airbag' },
                                { key: 'alarme', label: 'Alarme' },
                                { key: 'controleTracao', label: 'Controle de Tração' },
                                { key: 'assistenteRampa', label: 'Assistente de Rampa' },
                                { key: 'freioEstacionamentoEletrico', label: 'Freio de Estacionamento Elétrico' }
                            ].map(opcional => (
                                <div className="flex items-center" key={opcional.key}>
                                    <input
                                        type="checkbox"
                                        name={`opcionais.${opcional.key}`}
                                        checked={formData.opcionais[opcional.key]}
                                        onChange={handleCheckboxChange}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <label className="ml-3 text-gray-600">{opcional.label}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Estética e Outros */}
                    <div className="mb-6">
                        <div className="flex items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Estética e Outros</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                            {[
                                { key: 'tetoSolar', label: 'Teto Solar' },
                                { key: 'faroisNeblina', label: 'Faróis de Neblina' },
                                { key: 'rodasLigaLeve', label: 'Rodas de Liga Leve' },
                                { key: 'blindado', label: 'Blindado' },
                                { key: 'tracao4x4', label: 'Tração 4x4' }
                            ].map(opcional => (
                                <div className="flex items-center" key={opcional.key}>
                                    <input
                                        type="checkbox"
                                        name={`opcionais.${opcional.key}`}
                                        checked={formData.opcionais[opcional.key]}
                                        onChange={handleCheckboxChange}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <label className="ml-3 text-gray-600">{opcional.label}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Botão para próxima etapa */}
                    {renderButton()} {/* Próxima Etapa */}
                </div>
            );

        case 5:
            return (
                <div className="p-8 bg-gray-50 rounded-lg shadow-md max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Valores e Imagens</h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Valor de Compra */}
                        <div className="flex flex-col relative">
                            <label className="text-gray-700 font-medium mb-2 flex items-center">
                                Valor de Compra (R$)
                                <span className="ml-2 text-gray-500 relative group">
                                    <HiOutlineQuestionMarkCircle className="text-xl" />
                                    <div className="absolute left-0 -top-12 w-56 p-2 bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Este é o valor pelo qual o veículo foi adquirido.
                                    </div>
                                </span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">R$</span>
                                <input
                                    type="text"
                                    name="valorCompra"
                                    value={formData.valorCompra !== '' ?
                                        new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(formData.valorCompra)
                                        : ''}
                                    onChange={(e) => {
                                        const numericValue = parseFloat(e.target.value.replace(/\D/g, '')) / 100;
                                        setFormData({
                                            ...formData,
                                            valorCompra: isNaN(numericValue) ? '' : numericValue.toFixed(2)
                                        });
                                    }}
                                    placeholder="0,00"
                                    className="w-full pl-12 p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                />
                            </div>
                        </div>

                        {/* Valor de Venda */}
                        <div className="flex flex-col relative">
                            <label className="text-gray-700 font-medium mb-2 flex items-center">
                                Valor de Venda (R$)
                                <span className="ml-2 text-gray-500 relative group">
                                    <HiOutlineQuestionMarkCircle className="text-xl" />
                                    <div className="absolute left-0 -top-12 w-56 p-2 bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Este é o valor pelo qual o veículo será vendido.
                                    </div>
                                </span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">R$</span>
                                <input
                                    type="text"
                                    name="valorVenda"
                                    value={formData.valorVenda !== '' ?
                                        new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(formData.valorVenda)
                                        : ''}
                                    onChange={(e) => {
                                        const numericValue = parseFloat(e.target.value.replace(/\D/g, '')) / 100;
                                        setFormData({
                                            ...formData,
                                            valorVenda: isNaN(numericValue) ? '' : numericValue.toFixed(2)
                                        });
                                    }}
                                    placeholder="0,00"
                                    className="w-full pl-12 p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                />
                            </div>
                        </div>

                        {/* Valor FIPE */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Valor FIPE (R$)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">R$</span>
                                <input
                                    type="text"
                                    name="valorFIPE"
                                    value={formData.valorFIPE !== '' ?
                                        new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(formData.valorFIPE)
                                        : ''}
                                    onChange={(e) => {
                                        const numericValue = parseFloat(e.target.value.replace(/\D/g, '')) / 100;
                                        setFormData({
                                            ...formData,
                                            valorFIPE: isNaN(numericValue) ? '' : numericValue.toFixed(2)
                                        });
                                    }}
                                    placeholder="0,00"
                                    className="w-full pl-12 p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                />
                            </div>
                        </div>

                        {/* Upload de Imagens */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Imagens do Veículo</label>
                            <div
                                className="flex items-center justify-center w-full bg-white border-2 border-dashed border-gray-300 rounded-lg h-48 cursor-pointer hover:bg-gray-50"
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const files = Array.from(e.dataTransfer.files);
                                    setFormData({ ...formData, imagens: [...formData.imagens, ...files] });
                                }}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, imagens: [...formData.imagens, ...e.target.files] })}
                                    className="hidden"
                                    id="upload"
                                />
                                <label htmlFor="upload" className="text-gray-500 flex flex-col items-center justify-center">
                                    <FaImages className="text-4xl mb-2" />
                                    <span className="text-center">Arraste as imagens ou clique para enviar</span>
                                </label>
                            </div>

                            {/* Preview das Imagens */}
                            {formData.imagens.length > 0 && (
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {formData.imagens.map((image, index) => (
                                        <div key={index} className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Imagem ${index + 1}`}
                                                className="object-cover w-full h-full"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updatedImages = formData.imagens.filter((_, i) => i !== index);
                                                    setFormData({ ...formData, imagens: updatedImages });
                                                }}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-sm hover:bg-red-600"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Botões de Envio e Voltar */}
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all"
                            >
                                <FaStepBackward className="inline-block mr-2" /> Voltar
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                            >
                                Enviar
                            </button>
                        </div>

                    </form>
                </div>
            );
    };
};

export default NewCar;


