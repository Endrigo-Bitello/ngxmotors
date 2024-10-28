import { useState } from 'react';
import axios from 'axios';
import { FaChevronDown, FaCouch, FaImages, FaLock, FaMotorcycle, FaStepBackward, FaStepForward, FaTimes, FaWrench } from 'react-icons/fa';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import Image from 'next/image';
import AddVehicle from './AddVehicle';

const NewMotorcycle = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Informações principais
        marca: '',
        modelo: '',
        tipoDeMoto: '',
        anoFabricacao: '',
        anoModelo: '',
        transmissao: '',
        cor: '',

        // Ficha técnica
        quilometragem: '',
        combustivel: '',
        direcao: '',
        potencia: '',
        cilindrada: '',
        torque: '',
        numeroDeMarchas: '',
        freios: '',
        capacidadeTanque: '',
        peso: '',

        // Documentação e regularização
        placa: '',
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

        // Opcionais da moto
        opcionais: {
            freiosABS: false,
            controleTracao: false,
            controleEstabilidade: false,
            computadorBordo: false,
            cameraRe: false,
            conexaoUSB: false,
            sistemaNavegacao: false,
            faroisLED: false,
            manoplasAquecidas: false,
            alarme: false,
            protetorMotor: false,
            bolhaAerodinamica: false,
            malasLaterais: false,
            bancoAquecido: false,
            suspensaoAjustavel: false,
        },

        // Informações financeiras
        valorCompra: '',
        valorVenda: '',
        valorFIPE: '',

        // Imagens da moto (URLs)
        imagens: []
    });

    const marcas = [
        'Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'BMW', 'Ducati', 'Harley-Davidson', 'Triumph',
        'KTM', 'Royal Enfield', 'Haojue', 'Dafra', 'Shineray', 'MV Agusta'
    ];

    const tiposDeMoto = [
        'Street', 'Esportiva', 'Naked', 'Custom', 'Trail', 'Big Trail', 'Touring',
        'Scooter', 'Crossover', 'Motocross', 'Enduro'
    ];

    const transmissoes = ['Manual', 'Automático', 'CVT'];

    const combustiveis = ['Gasolina', 'Etanol', 'Flex', 'Elétrico'];

    const direcoes = ['Convencional', 'Assistida'];

    const freiosOptions = ['Freios a disco', 'ABS', 'CBS'];

    const dpvatOptions = ['Pago', 'Pendente'];

    const ipvaOptions = ['Pago', 'Pendente'];

    const cilindradaOptions = ['50', '100', '110', '125', '150', '155', '160', '190', '200',
        '250', '300', '350', '400', '420', '450', '500', '550', '600',
        '650', '700', '750', '800', '850', '900', '950', '1000',
        'Acima de 1.000'];

    // Estados para os dropdowns
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [tipoDeMotoOpen, setTipoDeMotoOpen] = useState(false);
    const [cilindradaOpen, setCilindradaOpen] = useState(false);
    const [transmissaoOpen, setTransmissaoOpen] = useState(false);
    const [combustivelOpen, setCombustivelOpen] = useState(false);
    const [direcaoOpen, setDirecaoOpen] = useState(false);
    const [freiosOpen, setFreiosOpen] = useState(false);
    const [ipvaOpen, setIpvaOpen] = useState(false);
    const [dpvatOpen, setDpvatOpen] = useState(false);
    const [showStock, setShowStock] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
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


    const handleKilometragemChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setFormData({
            ...formData,
            quilometragem: value
        });
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

    const toggleDropdown = (dropdown) => {
        if (openDropdown === dropdown) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(dropdown);
        }
    };

    const handlePotenciaChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setFormData({
            ...formData,
            potencia: value
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

    const handleTorqueChange = (e) => {
        const value = e.target.value.replace(/[^0-9,.]/g, '');
        setFormData({
            ...formData,
            torque: value
        });
    };

    const handleCilindradaSelect = (option) => {
        setFormData({ ...formData, cilindrada: option });
        setCilindradaOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/motos`, formData);
            const customId = response.data.customId;

            // Se houver imagens para enviar, faça o upload delas
            if (formData.imagens.length > 0) {
                const formDataImagens = new FormData();

                // Adiciona as imagens ao FormData
                Array.from(formData.imagens).forEach((file, index) => {
                    formDataImagens.append('imagens', file);
                });

                // Segunda requisição: enviar as imagens
                const uploadResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/motos/upload/${customId}`, formDataImagens, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            setShowStock(true);
            alert('Veículo adicionado com sucesso!');

        } catch (error) {
            console.error('Erro ao adicionar carro ou enviar imagens:', error.response ? error.response.data : error.message);
        }
    };

    if (showStock) {
        return <AddVehicle />;
    }


    const renderButton = () => {
        const isStepValid = () => {
            switch (step) {
                case 1:
                    // Campos obrigatórios da etapa 1
                    return formData.marca &&
                        formData.modelo &&
                        formData.tipoDeMoto &&
                        formData.anoFabricacao &&
                        formData.anoModelo &&
                        formData.transmissao &&
                        formData.cor;
                case 2:
                    // Campos obrigatórios da etapa 2
                    return formData.quilometragem &&
                        formData.combustivel &&
                        formData.direcao &&
                        formData.potencia &&
                        formData.cilindrada &&
                        formData.torque &&
                        formData.numeroDeMarchas &&
                        formData.freios &&
                        formData.capacidadeTanque &&
                        formData.peso;
                case 3:
                    // Campos obrigatórios da etapa 3
                    return formData.placa &&
                        formData.ipva &&
                        formData.dpvat;
                case 4:
                    // Nenhum campo obrigatório nesta etapa, então retorna true
                    return true;
                case 5:
                    // Campos obrigatórios da etapa 5
                    return formData.valorCompra &&
                        formData.valorVenda &&
                        formData.valorFIPE &&
                        formData.imagens.length > 0;
                default:
                    return true;
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
                                // Exibe uma mensagem personalizada ao usuário
                                alert('Por favor, preencha todos os campos obrigatórios antes de avançar.');
                            }
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                    >
                        Próxima Etapa <FaStepForward className="inline-block ml-2" />
                    </button>
                )}
                {step === 5 && (
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                    >
                        Enviar
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
                        {/* Marca */}
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
                                                    className="mr-3"
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

                        {/* Modelo */}
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

                        {/* Tipo de Moto */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Tipo de Moto</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    className="w-full bg-white flex items-center justify-between border border-gray-300 p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                    onClick={() => toggleDropdown('tipoDeMoto')}
                                >
                                    {formData.tipoDeMoto ? (
                                        <span>{formData.tipoDeMoto}</span>
                                    ) : (
                                        <span className="text-gray-500">Selecione o tipo de moto</span>
                                    )}
                                    <FaChevronDown className="text-gray-400" />
                                </button>
                                {openDropdown === 'tipoDeMoto' && (
                                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {tiposDeMoto.map((tipo) => (
                                            <li
                                                key={tipo}
                                                onClick={() => {
                                                    setFormData({ ...formData, tipoDeMoto: tipo });
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

                        {/* Ano de Fabricação e Ano do Modelo */}
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

                        {/* Transmissão */}
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

                        {/* Cor */}
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

                        {renderButton()} {/* Próxima Etapa */}
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
                                    className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 w-full pr-16"
                                />
                                <span className="absolute right-4 text-gray-500">KM</span>
                            </div>
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

                        {/* Potência e Cilindrada */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium mb-2">Potência (CV)</label>
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        name="potencia"
                                        value={formData.potencia.replace(/\D/g, '')}
                                        onChange={handlePotenciaChange}
                                        placeholder="Digite a potência da moto"
                                        className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 w-full pr-16"
                                    />
                                    <span className="absolute right-4 text-gray-500">CV</span>
                                </div>
                            </div>

                            <div className="relative flex flex-col">
                                <label className="text-gray-700 font-medium mb-2">Cilindrada</label>
                                <button
                                    type="button"
                                    onClick={() => toggleDropdown('cilindrada')}
                                    className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 flex justify-between items-center"
                                >
                                    {formData.cilindrada || 'Selecione a cilindrada'}
                                    <FaChevronDown className="text-gray-400" />
                                </button>

                                {openDropdown === 'cilindrada' && (
                                    <ul
                                        className="absolute z-20 left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                                        style={{ top: '100%', marginTop: '0.5rem' }}
                                    >
                                        {cilindradaOptions.map((option) => (
                                            <li
                                                key={option}
                                                onClick={() => {
                                                    handleCilindradaSelect(option);
                                                    toggleDropdown(null);
                                                }}
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

                        {/* Número de Marchas */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Número de Marchas</label>
                            <input
                                type="number"
                                name="numeroDeMarchas"
                                value={formData.numeroDeMarchas}
                                onChange={handleChange}
                                placeholder="Digite o número de marchas"
                                className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                            />
                        </div>

                        {/* Freios */}
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

                        {/* Capacidade do Tanque e Peso */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium mb-2">Capacidade do Tanque (L)</label>
                                <div className="relative flex items-center">
                                    <input
                                        type="number"
                                        name="capacidadeTanque"
                                        value={formData.capacidadeTanque}
                                        onChange={handleChange}
                                        placeholder="Capacidade em litros"
                                        className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 w-full pr-16"
                                    />
                                    <span className="absolute right-4 text-gray-500">L</span>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium mb-2">Peso (kg)</label>
                                <div className="relative flex items-center">
                                    <input
                                        type="number"
                                        name="peso"
                                        value={formData.peso}
                                        onChange={handleChange}
                                        placeholder="Peso da moto em kg"
                                        className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 w-full pr-16"
                                    />
                                    <span className="absolute right-4 text-gray-500">kg</span>
                                </div>
                            </div>
                        </div>

                        {renderButton()} {/* Próxima Etapa */}
                    </form>
                </div>
            );


        case 3:
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
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    {/* Ícone da placa */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        width="40px"
                                        viewBox="0 0 512 512"
                                        className="text-gray-400"
                                    >
                                        <path
                                            style={{ fill: '#F1F1F1' }}
                                            d="M483.46,381.459H28.54c-15.762,0-28.54-12.778-28.54-28.54V159.081  
                       c0-15.762,12.778-28.54,28.54-28.54H483.46c15.762,0,28.54,12.778,28.54,28.54v193.838
                       C512,368.681,499.222,381.459,483.46,381.459z"
                                        />
                                        <path
                                            style={{ fill: '#D7D7D7' }}
                                            d="M483.46,130.541H256v250.917h227.46c15.762,0,28.54-12.778,28.54-28.54V159.081
                       C512,143.319,499.222,130.541,483.46,130.541z"
                                        />
                                        <path
                                            style={{ fill: '#67B5F8' }}
                                            d="M512,159.081c0-15.762-12.778-28.54-28.54-28.54H28.54c-15.762,0-28.54,12.778-28.54,28.54v27.354
                       h512V159.081z"
                                        />
                                        <path
                                            style={{ fill: '#3D6DFA' }}
                                            d="M512,159.081c0-15.762-12.778-28.54-28.54-28.54H256v55.894h256V159.081z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Mensagem sobre o formato da placa */}
                            {formData.placa && (
                                <span className="text-gray-500 mt-1">
                                    {placaFormat === 'mercosul'
                                        ? 'Formato da placa: Mercosul'
                                        : placaFormat === 'antigo'
                                            ? 'Formato da placa: Antigo'
                                            : null}
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
                                className="p-3 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                            />
                            {formData.chassi && (
                                <span className="text-gray-500 mt-1">
                                    {formData.chassi.length === 17
                                        ? 'Formato válido: Chassi com 17 caracteres'
                                        : 'Formato inválido: O chassi deve conter 17 caracteres'}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium mb-2">RENAVAM</label>
                                <input
                                    type="text"
                                    name="renavam"
                                    value={formData.renavam}
                                    onChange={handleChange}
                                    placeholder="Digite o RENAVAM"
                                    className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                />
                                {formData.renavam && (
                                    <span className="text-gray-500 mt-1">
                                        {formData.renavam.length === 11
                                            ? 'Formato válido: RENAVAM com 11 dígitos'
                                            : 'Formato inválido: O RENAVAM deve conter 11 dígitos'}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium mb-2">CRLV</label>
                                <input
                                    type="text"
                                    name="crlv"
                                    value={formData.crlv}
                                    onChange={handleChange}
                                    placeholder="Digite o CRLV"
                                    className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                />
                                {formData.crlv && (
                                    <span className="text-gray-500 mt-1">
                                        {formData.crlv.length === 12
                                            ? 'Formato válido: CRLV com 12 dígitos'
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
                                    className="w-full bg-white flex items-center border border-gray-300 p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                    onClick={() => setIpvaOpen(!ipvaOpen)}
                                >
                                    {formData.ipva ? (
                                        <span>{formData.ipva}</span>
                                    ) : (
                                        <span className="text-gray-500">Selecione o status do IPVA</span>
                                    )}
                                </button>
                                {ipvaOpen && (
                                    <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {ipvaOptions.map((ipva) => (
                                            <li
                                                key={ipva}
                                                onClick={() => {
                                                    setFormData({ ...formData, ipva });
                                                    setIpvaOpen(false);
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
                                    className="w-full bg-white flex items-center border border-gray-300 p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                    onClick={() => setDpvatOpen(!dpvatOpen)}
                                >
                                    {formData.dpvat ? (
                                        <span>{formData.dpvat}</span>
                                    ) : (
                                        <span className="text-gray-500">Selecione o status do DPVAT</span>
                                    )}
                                </button>
                                {dpvatOpen && (
                                    <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {dpvatOptions.map((dpvat) => (
                                            <li
                                                key={dpvat}
                                                onClick={() => {
                                                    setFormData({ ...formData, dpvat });
                                                    setDpvatOpen(false);
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

                        {/* Com Multas e De Leilão */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center space-x-3">
                                <label className="text-gray-700 font-medium">Com Multas?</label>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                    <input
                                        type="checkbox"
                                        name="comMultas"
                                        id="toggleComMultas"
                                        checked={formData.comMultas}
                                        onChange={handleCheckboxChange}
                                        className="sr-only"
                                    />
                                    <label
                                        htmlFor="toggleComMultas"
                                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${formData.comMultas ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    ></label>
                                    <span
                                        className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${formData.comMultas ? 'translate-x-6' : ''}`}
                                    ></span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <label className="text-gray-700 font-medium">Veículo de Leilão?</label>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                    <input
                                        type="checkbox"
                                        name="deLeilao"
                                        id="toggleDeLeilao"
                                        checked={formData.deLeilao}
                                        onChange={handleCheckboxChange}
                                        className="sr-only"
                                    />
                                    <label
                                        htmlFor="toggleDeLeilao"
                                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${formData.deLeilao ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    ></label>
                                    <span
                                        className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${formData.deLeilao ? 'translate-x-6' : ''}`}
                                    ></span>
                                </div>
                            </div>
                        </div>

                        {renderButton()} {/* Próxima Etapa */}
                    </form>
                </div>
            );


        case 3:
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
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    {/* Ícone da placa */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        width="40px"
                                        viewBox="0 0 512 512"
                                        className="text-gray-400"
                                    >
                                        <path
                                            style={{ fill: '#F1F1F1' }}
                                            d="M483.46,381.459H28.54c-15.762,0-28.54-12.778-28.54-28.54V159.081
                       c0-15.762,12.778-28.54,28.54-28.54H483.46c15.762,0,28.54,12.778,28.54,28.54v193.838
                       C512,368.681,499.222,381.459,483.46,381.459z"
                                        />
                                        <path
                                            style={{ fill: '#D7D7D7' }}
                                            d="M483.46,130.541H256v250.917h227.46c15.762,0,28.54-12.778,28.54-28.54V159.081
                       C512,143.319,499.222,130.541,483.46,130.541z"
                                        />
                                        <path
                                            style={{ fill: '#67B5F8' }}
                                            d="M512,159.081c0-15.762-12.778-28.54-28.54-28.54H28.54c-15.762,0-28.54,12.778-28.54,28.54v27.354
                       h512V159.081z"
                                        />
                                        <path
                                            style={{ fill: '#3D6DFA' }}
                                            d="M512,159.081c0-15.762-12.778-28.54-28.54-28.54H256v55.894h256V159.081z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Mensagem sobre o formato da placa */}
                            {formData.placa && (
                                <span className="text-gray-500 mt-1">
                                    {placaFormat === 'mercosul'
                                        ? 'Formato da placa: Mercosul'
                                        : placaFormat === 'antigo'
                                            ? 'Formato da placa: Antigo'
                                            : null}
                                </span>
                            )}
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

                        {renderButton()} {/* Próxima Etapa */}
                    </form>
                </div>
            );


        case 4:
            return (
                <div className="p-8 bg-gray-50 rounded-lg shadow-md max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Opcionais da Moto</h2>

                    {/* Segurança */}
                    <div className="mb-6 border-b border-gray-300 pb-4">
                        <div className="flex items-center mb-4">
                            <FaLock className="text-xl text-gray-500 mr-2" />
                            <h3 className="text-xl font-semibold text-gray-700">Segurança</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                            {[
                                { key: 'freiosABS', label: 'Freios ABS' },
                                { key: 'controleTracao', label: 'Controle de Tração' },
                                { key: 'controleEstabilidade', label: 'Controle de Estabilidade' },
                                { key: 'alarme', label: 'Alarme' }
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
                            <FaMotorcycle className="text-xl text-gray-500 mr-2" />
                            <h3 className="text-xl font-semibold text-gray-700">Tecnologia</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                            {[
                                { key: 'computadorBordo', label: 'Computador de Bordo' },
                                { key: 'cameraRe', label: 'Câmera de Ré' },
                                { key: 'conexaoUSB', label: 'Conexão USB' },
                                { key: 'sistemaNavegacao', label: 'Sistema de Navegação' }
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

                    {/* Conforto */}
                    <div className="mb-6 border-b border-gray-300 pb-4">
                        <div className="flex items-center mb-4">
                            <FaCouch className="text-xl text-gray-500 mr-2" />
                            <h3 className="text-xl font-semibold text-gray-700">Conforto</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                            {[
                                { key: 'bancoAquecido', label: 'Banco Aquecido' },
                                { key: 'manoplasAquecidas', label: 'Manoplas Aquecidas' },
                                { key: 'faroisLED', label: 'Faróis LED' },
                                { key: 'suspensaoAjustavel', label: 'Suspensão Ajustável' }
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
                            <FaWrench className="text-xl text-gray-500 mr-2" />
                            <h3 className="text-xl font-semibold text-gray-700">Estética e Outros</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                            {[
                                { key: 'protetorMotor', label: 'Protetor de Motor' },
                                { key: 'bolhaAerodinamica', label: 'Bolha Aerodinâmica' },
                                { key: 'malasLaterais', label: 'Malas Laterais' }
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

                    {renderButton()} {/* Próxima Etapa */}
                </div>
            );


        case 5:
            return (
                <div className="p-8 bg-gray-50 rounded-lg shadow-md max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Valores e Imagens da Moto</h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Valor de Compra */}
                        <div className="flex flex-col relative">
                            <label className="text-gray-700 font-medium mb-2 flex items-center">
                                Valor de Compra (R$)
                                <span className="ml-2 text-gray-500 relative group">
                                    <HiOutlineQuestionMarkCircle className="text-xl" />
                                    <div className="absolute left-0 -top-12 w-56 p-2 bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Este é o valor pelo qual a moto foi adquirida.
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
                                        Este é o valor pelo qual a moto será vendida.
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
                            <label className="text-gray-700 font-medium mb-2">Imagens da Moto</label>
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
                                Voltar
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

export default NewMotorcycle;