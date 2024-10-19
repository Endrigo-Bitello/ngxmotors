import { useState } from 'react';
import { FaImages, FaStepBackward, FaStepForward, FaChevronDown, FaTimes, FaCouch, FaCar, FaLock, FaWrench, FaQuestionCircle } from 'react-icons/fa';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';



import axios from 'axios';
import NavbarButtons from './NavbarButtons';
import Image from 'next/image';

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
        'Honda', 'Nissan', 'Ford', 'Peugeot', 'Citroën', 'Mitsubishi', 'Kia',
        'BMW', 'Mercedes-Benz', 'Audi', 'Volvo', 'Land Rover', 'Suzuki', 'Subaru',
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

    const [dropdownOpen, setDropdownOpen] = useState(false); // Controle para dropdown de marcas
    const [tipoDeCarroOpen, setTipoDeCarroOpen] = useState(false); // Controle para dropdown de tipo de carro
    const [motorOpen, setMotorOpen] = useState(false);
    const [transmissaoOpen, setTransmissaoOpen] = useState(false); // Controle para dropdown de transmissão
    const [combustivelOpen, setCombustivelOpen] = useState(false); // Controle para dropdown de combustível
    const [direcaoOpen, setDirecaoOpen] = useState(false); // Controle para dropdown de direção
    const [tracaoOpen, setTracaoOpen] = useState(false); // Controle para dropdown de tração
    const [freiosOpen, setFreiosOpen] = useState(false); // Controle para dropdown de freios
    const [ipvaOpen, setIpvaOpen] = useState(false); // Controle para dropdown de IPVA
    const [dpvatOpen, setDpvatOpen] = useState(false); // Controle para dropdown de DPVAT

    const handleMotorSelect = (option) => {
        setFormData({ ...formData, motor: option });
        setMotorOpen(false);
    };

    const handleKilometragemChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
        setFormData({
            ...formData,
            quilometragem: value
        });
    };

    const [placaFormat, setPlacaFormat] = useState('');

    // Função para detectar o formato da placa
    const detectPlacaFormat = (placa) => {
        const mercosulRegex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
        const antigoRegex = /^[A-Z]{3}-[0-9]{4}$/;

        if (mercosulRegex.test(placa)) {
            return 'mercosul';
        } else if (antigoRegex.test(placa)) {
            return 'antigo';
        } else {
            return '';
        }
    };

    // Modifique a função handleChange para detectar o formato da placa ao alterar o valor
    const handleChangePlaca = (e) => {
        const { name, value } = e.target;

        // Detecta o formato da placa se o campo de placa for modificado
        if (name === 'placa') {
            setPlacaFormat(detectPlacaFormat(value));
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePotenciaChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
        setFormData({
            ...formData,
            potencia: value
        });
    };

    const handleTorqueChange = (e) => {
        const value = e.target.value.replace(/[^0-9,.]/g, ''); // Remove tudo que não for número ou ponto/vírgula
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
        const key = name.split('.')[1]; // Pega a chave específica dos opcionais

        setFormData((prevData) => ({
            ...prevData,
            opcionais: {
                ...prevData.opcionais,
                [key]: checked,
            }
        }));
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
            const customId = response.data.customId; // Supondo que o backend retorne o customId

            console.log('Carro adicionado com sucesso:', response.data);

            // Se houver imagens para enviar, faça o upload delas
            if (formData.imagens.length > 0) {
                const formDataImagens = new FormData();

                // Adiciona as imagens ao FormData
                Array.from(formData.imagens).forEach((file, index) => {
                    formDataImagens.append('imagens', file); // 'imagens' é a chave usada para múltiplos arquivos
                });

                // Segunda requisição: enviar as imagens
                const uploadResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/carros/upload/${customId}`, formDataImagens, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log('Imagens enviadas com sucesso:', uploadResponse.data);
            }

        } catch (error) {
            console.error('Erro ao adicionar carro ou enviar imagens:', error.response ? error.response.data : error.message);
        }
    };

    const renderButton = () => (
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
                    onClick={nextStep}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                >
                    Próxima Etapa <FaStepForward className="inline-block ml-2" />
                </button>
            )}
        </div>
    );

    // Layout para cada etapa
    switch (step) {


        case 1:
            return (
                <div className="p-8 bg-gray-50 rounded-lg shadow-md max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Informações Básicas</h2>
                    <form className="space-y-6">

                        {/* Marca (com ícones de marca no dropdown) */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Marca</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-between bg-white border border-gray-300 p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    {formData.marca ? (
                                        <div className="flex items-center">
                                            <div className="w-6 h-6 mr-3 relative">
                                                <Image
                                                    src={`/icons/${formData.marca.toLowerCase().replace(/ /g, '-')}.png`}
                                                    alt={formData.marca}
                                                    layout="fill" // Preenche o contêiner pai
                                                    objectFit="contain" // Garante que a imagem mantenha seu conteúdo
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
                                {dropdownOpen && (
                                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {marcas.map((marca) => (
                                            <li
                                                key={marca}
                                                onClick={() => {
                                                    setFormData({ ...formData, marca });
                                                    setDropdownOpen(false);
                                                }}
                                                className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                                            >
                                                <div className="w-6 h-6 mr-3 relative">
                                                    <Image
                                                        src={`/icons/${marca.toLowerCase().replace(/ /g, '-')}.png`}
                                                        alt={marca}
                                                        layout="fill" // Preenche o contêiner pai
                                                        objectFit="contain" // Mantém o conteúdo dentro do contêiner sem distorção
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

                        {/* Tipo de Carro */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Tipo de Carro</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    className="w-full bg-white flex items-center justify-between border border-gray-300 p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                    onClick={() => setTipoDeCarroOpen(!tipoDeCarroOpen)}
                                >
                                    {formData.tipoDeCarro ? (
                                        <span>{formData.tipoDeCarro}</span>
                                    ) : (
                                        <span className="text-gray-500">Selecione o tipo de carro</span>
                                    )}
                                    <FaChevronDown className="text-gray-400" />
                                </button>
                                {tipoDeCarroOpen && (
                                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {tiposDeCarro.map((tipo) => (
                                            <li
                                                key={tipo}
                                                onClick={() => {
                                                    setFormData({ ...formData, tipoDeCarro: tipo });
                                                    setTipoDeCarroOpen(false);
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
                                    onClick={() => setTransmissaoOpen(!transmissaoOpen)}
                                >
                                    {formData.transmissao ? (
                                        <span>{formData.transmissao}</span>
                                    ) : (
                                        <span className="text-gray-500">Selecione a transmissão</span>
                                    )}
                                    <FaChevronDown className="text-gray-400" />
                                </button>
                                {transmissaoOpen && (
                                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {transmissoes.map((transmissao) => (
                                            <li
                                                key={transmissao}
                                                onClick={() => {
                                                    setFormData({ ...formData, transmissao });
                                                    setTransmissaoOpen(false);
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
                                    value={formData.quilometragem.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} // Formatação com separadores
                                    onChange={(e) => handleKilometragemChange(e)} // Manipulador personalizado
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
                                    onClick={() => setCombustivelOpen(!combustivelOpen)}
                                >
                                    {formData.combustivel ? (
                                        <span>{formData.combustivel}</span>
                                    ) : (
                                        <span className="text-gray-500">Selecione o tipo de combustível</span>
                                    )}
                                    <FaChevronDown className="text-gray-400" />
                                </button>
                                {combustivelOpen && (
                                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {combustiveis.map((combustivel) => (
                                            <li
                                                key={combustivel}
                                                onClick={() => {
                                                    setFormData({ ...formData, combustivel });
                                                    setCombustivelOpen(false);
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
                                    onClick={() => setDirecaoOpen(!direcaoOpen)}
                                >
                                    {formData.direcao ? (
                                        <span>{formData.direcao}</span>
                                    ) : (
                                        <span className="text-gray-500">Selecione o tipo de direção</span>
                                    )}
                                    <FaChevronDown className="text-gray-400" />
                                </button>
                                {direcaoOpen && (
                                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {direcoes.map((direcao) => (
                                            <li
                                                key={direcao}
                                                onClick={() => {
                                                    setFormData({ ...formData, direcao });
                                                    setDirecaoOpen(false);
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
                                        value={formData.potencia.replace(/\D/g, '')} // Mantém apenas números
                                        onChange={handlePotenciaChange} // Função personalizada
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
                                    onClick={() => setMotorOpen(!motorOpen)} // Abre/fecha o dropdown
                                    className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 flex justify-between items-center"
                                >
                                    {formData.motor || 'Selecione o motor'}
                                    <FaChevronDown className="text-gray-400" />
                                </button>

                                {/* Dropdown de opções de motor */}
                                {motorOpen && (
                                    <ul
                                        className="absolute z-20 left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                                        style={{ top: '100%', marginTop: '0.5rem' }} // Evita sobreposição e dá espaço entre o botão e o dropdown
                                    >
                                        {motorOptions.map((option) => (
                                            <li
                                                key={option}
                                                onClick={() => handleMotorSelect(option)} // Seleciona o motor
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
                                    value={formData.torque.replace(/[^0-9,.]/g, '')} // Mantém apenas números e vírgulas/pontos decimais
                                    onChange={handleTorqueChange} // Função personalizada
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
                                        onClick={() => setTracaoOpen(!tracaoOpen)}
                                    >
                                        {formData.tracao ? (
                                            <span>{formData.tracao}</span>
                                        ) : (
                                            <span className="text-gray-500">Selecione a tração</span>
                                        )}
                                        <FaChevronDown className="text-gray-400" />
                                    </button>
                                    {tracaoOpen && (
                                        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {tracoes.map((tracao) => (
                                                <li
                                                    key={tracao}
                                                    onClick={() => {
                                                        setFormData({ ...formData, tracao });
                                                        setTracaoOpen(false);
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
                                        onClick={() => setFreiosOpen(!freiosOpen)}
                                    >
                                        {formData.freios ? (
                                            <span>{formData.freios}</span>
                                        ) : (
                                            <span className="text-gray-500">Selecione o tipo de freios</span>
                                        )}
                                        <FaChevronDown className="text-gray-400" />
                                    </button>
                                    {freiosOpen && (
                                        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {freiosOptions.map((freios) => (
                                                <li
                                                    key={freios}
                                                    onClick={() => {
                                                        setFormData({ ...formData, freios });
                                                        setFreiosOpen(false);
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
            );


        case 3:
            return (
                <div className="p-8 bg-gray-50 rounded-lg shadow-md max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Documentação e Regularização</h2>
                    <form className="space-y-6">

                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">Placa</label>
                            <div className="relative">
                                {/* Campo de entrada com largura maior */}
                                <input
                                    type="text"
                                    name="placa"
                                    value={formData.placa}
                                    onChange={handleChange}
                                    placeholder="Digite a placa"
                                    className="p-3 pr-12 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                                />
                                {/* Ícone da placa posicionado dentro do input, à direita */}
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
                            {/* Campo de entrada para chassi */}
                            <input
                                type="text"
                                name="chassi"
                                value={formData.chassi}
                                onChange={handleChange}
                                placeholder="Digite o número do chassi"
                                className="p-3 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                            />

                            {/* Mensagem sobre o formato do chassi */}
                            {formData.chassi && (
                                <span className="text-gray-500 mt-1">
                                    {formData.chassi.length === 17
                                        ? 'Formato válido: Chassi com 17 caracteres'
                                        : 'Formato inválido: O chassi deve conter 17 caracteres'}
                                </span>
                            )}
                        </div>


                        {/* RENAVAM e CRLV */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Campo de entrada para RENAVAM */}
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

                                {/* Mensagem sobre o formato do RENAVAM */}
                                {formData.renavam && (
                                    <span className="text-gray-500 mt-1">
                                        {formData.renavam.length === 11
                                            ? 'Formato válido: RENAVAM com 11 dígitos'
                                            : 'Formato inválido: O RENAVAM deve conter 11 dígitos'}
                                    </span>
                                )}
                            </div>

                            {/* Campo de entrada para CRLV */}
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

                                {/* Mensagem sobre o formato do CRLV */}
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

                                    {/* Ícone SVG no extremo direito do input */}
                                    <div className="absolute right-3 flex items-center">
                                        {formData.ipva === 'Pago' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-6 w-6">
                                                <rect x="76.988" y="15.272" style={{ fill: '#CFF09E' }} width="358.002" height="120.448" />
                                                <g>
                                                    <path style={{ fill: '#507C5C' }} d="M435.005,0H76.995C68.56,0,61.723,6.839,61.723,15.272v452.691c0,13.834,8.258,26.191,21.038,31.484   c12.78,5.29,27.356,2.393,37.137-7.389c4.296-4.296,10.01-6.663,16.086-6.663c6.077,0,11.79,2.367,16.086,6.663   C165.365,505.353,182.827,512,200.291,512s34.927-6.647,48.221-19.941c5.964-5.964,5.964-15.634,0-21.6   c-5.964-5.962-15.634-5.962-21.6,0c-14.678,14.678-38.564,14.678-53.243,0c-20.78-20.778-54.591-20.78-75.371,0.002   c-1.11,1.106-2.407,1.364-3.85,0.765c-1.448-0.6-2.181-1.697-2.181-3.264V150.991h327.464v316.972c0,1.565-0.733,2.664-2.181,3.264   c-1.449,0.599-2.741,0.344-3.85-0.767c-20.778-20.777-54.59-20.778-75.371,0l-12.096,12.096c-5.964,5.964-5.964,15.634,0,21.6   c5.964,5.962,15.634,5.962,21.6,0l12.096-12.096c4.296-4.296,10.01-6.663,16.086-6.663c6.077,0,11.789,2.367,16.086,6.663   c9.782,9.782,24.361,12.682,37.138,7.387c12.778-5.293,21.036-17.652,21.036-31.483V15.272C450.277,6.839,443.44,0,435.005,0z    M92.268,120.446V30.545h327.464v89.901L92.268,120.446L92.268,120.446z" />
                                                </g>
                                            </svg>
                                        ) : formData.ipva === 'Pendente' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-6 w-6">
                                                <rect x="76.988" y="15.272" style={{ fill: '#F4B2B0' }} width="358.002" height="120.448" />
                                                <g>
                                                    <path style={{ fill: '#B3404A' }} d="M435.005,0H76.995C68.56,0,61.723,6.839,61.723,15.272v452.691c0,13.834,8.258,26.191,21.038,31.484   c12.78,5.29,27.356,2.393,37.137-7.389c4.296-4.296,10.01-6.663,16.086-6.663c6.077,0,11.79,2.367,16.086,6.663   C165.365,505.353,182.827,512,200.291,512s34.927-6.647,48.221-19.941c5.964-5.964,5.964-15.634,0-21.6   c-5.964-5.962-15.634-5.962-21.6,0c-14.678,14.678-38.564,14.678-53.243,0c-20.78-20.778-54.591-20.78-75.371,0.002   c-1.11,1.106-2.407,1.364-3.85,0.765c-1.448-0.6-2.181-1.697-2.181-3.264V150.991h327.464v316.972c0,1.565-0.733,2.664-2.181,3.264   c-1.449,0.599-2.741,0.344-3.85-0.767c-20.778-20.777-54.59-20.778-75.371,0l-12.096,12.096c-5.964,5.964-5.964,15.634,0,21.6   c5.964,5.962,15.634,5.962,21.6,0l12.096-12.096c4.296-4.296,10.01-6.663,16.086-6.663c6.077,0,11.789,2.367,16.086,6.663   c9.782,9.782,24.361,12.682,37.138,7.387c12.778-5.293,21.036-17.652,21.036-31.483V15.272C450.277,6.839,443.44,0,435.005,0z    M92.268,120.446V30.545h327.464v89.901L92.268,120.446L92.268,120.446z" />
                                                </g>
                                            </svg>
                                        ) : null}
                                    </div>
                                </button>

                                {/* Dropdown para selecionar o status do IPVA */}
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

                                    {/* Ícone SVG no extremo direito do input */}
                                    <div className="absolute right-3 flex items-center">
                                        {formData.dpvat === 'Pago' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-6 w-6">
                                                <rect x="76.988" y="15.272" style={{ fill: '#CFF09E' }} width="358.002" height="120.448" />
                                                <g>
                                                    <path style={{ fill: '#507C5C' }} d="M435.005,0H76.995C68.56,0,61.723,6.839,61.723,15.272v452.691c0,13.834,8.258,26.191,21.038,31.484   c12.78,5.29,27.356,2.393,37.137-7.389c4.296-4.296,10.01-6.663,16.086-6.663c6.077,0,11.79,2.367,16.086,6.663   C165.365,505.353,182.827,512,200.291,512s34.927-6.647,48.221-19.941c5.964-5.964,5.964-15.634,0-21.6   c-5.964-5.962-15.634-5.962-21.6,0c-14.678,14.678-38.564,14.678-53.243,0c-20.78-20.778-54.591-20.78-75.371,0.002   c-1.11,1.106-2.407,1.364-3.85,0.765c-1.448-0.6-2.181-1.697-2.181-3.264V150.991h327.464v316.972c0,1.565-0.733,2.664-2.181,3.264   c-1.449,0.599-2.741,0.344-3.85-0.767c-20.778-20.777-54.59-20.778-75.371,0l-12.096,12.096c-5.964,5.964-5.964,15.634,0,21.6   c5.964,5.962,15.634,5.962,21.6,0l12.096-12.096c4.296-4.296,10.01-6.663,16.086-6.663c6.077,0,11.789,2.367,16.086,6.663   c9.782,9.782,24.361,12.682,37.138,7.387c12.778-5.293,21.036-17.652,21.036-31.483V15.272C450.277,6.839,443.44,0,435.005,0z    M92.268,120.446V30.545h327.464v89.901L92.268,120.446L92.268,120.446z" />
                                                </g>
                                            </svg>
                                        ) : formData.dpvat === 'Pendente' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-6 w-6">
                                                <rect x="76.988" y="15.272" style={{ fill: '#F4B2B0' }} width="358.002" height="120.448" />
                                                <g>
                                                    <path style={{ fill: '#B3404A' }} d="M435.005,0H76.995C68.56,0,61.723,6.839,61.723,15.272v452.691c0,13.834,8.258,26.191,21.038,31.484   c12.78,5.29,27.356,2.393,37.137-7.389c4.296-4.296,10.01-6.663,16.086-6.663c6.077,0,11.79,2.367,16.086,6.663   C165.365,505.353,182.827,512,200.291,512s34.927-6.647,48.221-19.941c5.964-5.964,5.964-15.634,0-21.6   c-5.964-5.962-15.634-5.962-21.6,0c-14.678,14.678-38.564,14.678-53.243,0c-20.78-20.778-54.591-20.78-75.371,0.002   c-1.11,1.106-2.407,1.364-3.85,0.765c-1.448-0.6-2.181-1.697-2.181-3.264V150.991h327.464v316.972c0,1.565-0.733,2.664-2.181,3.264   c-1.449,0.599-2.741,0.344-3.85-0.767c-20.778-20.777-54.59-20.778-75.371,0l-12.096,12.096c-5.964,5.964-5.964,15.634,0,21.6   c5.964,5.962,15.634,5.962,21.6,0l12.096-12.096c4.296-4.296,10.01-6.663,16.086-6.663c6.077,0,11.789,2.367,16.086,6.663   c9.782,9.782,24.361,12.682,37.138,7.387c12.778-5.293,21.036-17.652,21.036-31.483V15.272C450.277,6.839,443.44,0,435.005,0z    M92.268,120.446V30.545h327.464v89.901L92.268,120.446L92.268,120.446z" />
                                                </g>
                                            </svg>
                                        ) : null}
                                    </div>
                                </button>

                                {/* Dropdown para selecionar o status do DPVAT */}
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
                            {/* Toggle para Com Multas */}
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
                                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${formData.comMultas ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}
                                    ></label>
                                    <span
                                        className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${formData.comMultas ? 'translate-x-6' : ''
                                            }`}
                                    ></span>
                                </div>
                            </div>

                            {/* Toggle para Veículo de Leilão */}
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
                                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${formData.deLeilao ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}
                                    ></label>
                                    <span
                                        className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${formData.deLeilao ? 'translate-x-6' : ''
                                            }`}
                                    ></span>
                                </div>
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
                            <FaCouch className="text-xl text-gray-500 mr-2" />
                            <h3 className="text-xl font-semibold text-gray-700">Conforto</h3>
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
                            <FaCar className="text-xl text-gray-500 mr-2" />
                            <h3 className="text-xl font-semibold text-gray-700">Tecnologia</h3>
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
                            <FaLock className="text-xl text-gray-500 mr-2" />
                            <h3 className="text-xl font-semibold text-gray-700">Segurança</h3>
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
                            <FaWrench className="text-xl text-gray-500 mr-2" />
                            <h3 className="text-xl font-semibold text-gray-700">Estética e Outros</h3>
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
                                    {/* Tooltip */}
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
                                    {/* Tooltip */}
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
                                FaStepForward >
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

        default:
            return null;
    }
};

export default NewCar;
