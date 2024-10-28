import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import axios from 'axios';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { facebookIcon, xIcon, gmailIcon, whatsappNewIcon } from '../../../../utils/share';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { setSEO } from '../../../../utils/seo';

import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { FaWhatsapp } from 'react-icons/fa';
const Loading = dynamic(() => import('../../../components/Loading'), { ssr: false });
const GoogleMaps = dynamic(() => import('@/pages/components/GoogleMaps'), { ssr: false });



export default function VehiclePage() {
    const router = useRouter();
    const { tipo, marca, veiculo } = router.query;
    const [vehicleData, setVehicleData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showAll, setShowAll] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [showSimulacao, setShowSimulacao] = useState(false); // Controla a visibilidade do bloco de simulação


    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [settings, setSettings] = useState(null);


    const fetchSettings = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/get-settings`);
            setSettings(data);
        } catch (error) {
            console.error('Erro ao buscar as configurações:', error);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        if (vehicleData) {
            setSEO(
                {
                    title: `${settings.name} - ${vehicleData.marca} ${vehicleData.modelo} ${vehicleData.anoModelo} ${vehicleData.transmissao}`,
                    metaDescription: `Conheça o ${vehicleData.modelo}, 
                    uma ótima opção da ${vehicleData.marca} disponível na ${settings.name}. 
                    Visite-nos em ${settings.address} ou fale conosco pelo WhatsApp 
                    ${settings.whatsappNumber}. Nosso horário de atendimento é 
                    ${settings.openingHours}. Não perca essa oportunidade!`
                });
        }
    }, [vehicleData, settings]);


    // Função para enviar o formulário de contato
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Faz a requisição POST para enviar os dados da mensagem
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/mensagens`, {
                nome,
                email,
                telefone,
                cpf: '123.456.789-10', // CPF estático, pode ser alterado para ser dinâmico se necessário
                mensagem,
                customId: vehicleData?.customId || '', // Inclui o customId do veículo se disponível
            });

            // Verifica a resposta da API de mensagem
            if (res.status === 201) {
                // Agora, faz o envio do lead com o customId
                const resLead = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes/mensagem-veiculo`, {
                    nome,
                    email,
                    telefone,
                    etapa: 'Novo Lead',
                    fonteLead: 'Pág. Veículo',
                    customId: vehicleData?.customId || '',
                });

                // Verifica a resposta da API de lead e exibe mensagem de sucesso
                if (resLead.status === 201) {
                    alert('Mensagem e lead enviados com sucesso!');

                    // Limpa os campos do formulário após o envio
                    setNome('');
                    setEmail('');
                    setTelefone('');
                    setMensagem('');
                }
            }
        } catch (error) {
            console.error('Erro ao enviar a mensagem ou criar lead:', error);

            // Exibe uma mensagem de erro ao usuário
            alert('Erro ao enviar a mensagem ou criar lead. Por favor, tente novamente.');
        }
    };


    useEffect(() => {
        if (vehicleData) {
            setMensagem(`Quero mais informações sobre o veículo ${vehicleData.marca.toUpperCase()} ${vehicleData.modelo.toUpperCase()} ${vehicleData.anoModelo}`);
        }
    }, [vehicleData]);

    const prosseguirFinanciamento = (id) => {
        router.push(`/financiamento?id=${id}`);
    };


    // Checa se é mobile
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize(); // Checa no carregamento
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    useEffect(() => {
        if (tipo && marca && veiculo) {
            const fetchVehicleData = async () => {
                try {
                    if (tipo === 'carros') {
                        setLoading(true);
                        const customId = veiculo.split('-').pop();
                        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/carros/${customId}`);
                        setVehicleData(res.data);

                    } else if (tipo === 'motos') {
                        setLoading(true);
                        const customId = veiculo.split('-').pop();
                        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/motos/${customId}`);
                        setVehicleData(res.data);
                    }
                } catch (error) {
                    console.error('Erro ao buscar os dados do veículo:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchVehicleData();
        }
    }, [tipo, marca, veiculo]);


    if (loading) {
        return <Loading />;
    }

    if (!vehicleData) {
        return <p>Veículo não encontrado.</p>;
    }


    const formatOpcionaisLabel = (key) => {
        const labelMap = {
            tetoSolar: 'Teto Solar',
            pilotoAutomatico: 'Piloto Automático',
            bancosCouro: 'Bancos de Couro',
            cameraRe: 'Câmera de Ré',
            kitGNV: 'Kit GNV',
            sensorEstacionamento: 'Sensor de Estacionamento',
            chavePresencial: 'Chave Presencial',
            sistemaNavegacao: 'Sistema de Navegação',
            centralMultimidia: 'Central Multimídia',
            controleTracao: 'Controle de Tração',
            assistenteRampa: 'Assistente de Rampa',
            rodasLigaLeve: 'Rodas de Liga Leve',
            faroisNeblina: 'Faróis de Neblina',
            assistenteEstacionamento: 'Assistente de Estacionamento',
            freioEstacionamentoEletrico: 'Freio de Estacionamento Elétrico',
            airbag: 'Airbag',
            arCondicionado: 'Ar Condicionado',
            alarme: 'Alarme',
            blindado: 'Blindado',
            computadorBordo: 'Computador de Bordo',
            conexaoUSB: 'Conexão USB',
            bluetooth: 'Bluetooth',
            tracao4x4: 'Tração 4x4',
            travaEletrica: 'Trava Elétrica',
            volanteMultifuncional: 'Volante Multifuncional',
            vidroEletrico: 'Vidro Elétrico',
            som: 'Som',
            freiosABS: 'Freios ABS',
            controleTracao: 'Controle de Tração',
            controleEstabilidade: 'Controle de Estabilidade',
            computadorBordo: 'Computador de Bordo',
            cameraRe: 'Câmera de Ré',
            sistemaNavegacao: false,
            faroisLED: 'Faróis de LED',
            manoplasAquecidas: 'Manoplas Aquecidas',
            alarme: 'Alarme',
            protetorMotor: 'Protetor de Motor',
            bolhaAerodinamica: 'Bolha Aerodinâmica',
            malasLaterais: 'Malas Laterais',
            bancoAquecido: 'Banco Aquecido',
            suspensaoAjustavel: 'Suspensão Ajustável',
            sistemaNavegacao: 'Sistema de Navegação'

        };

        return labelMap[key] || key;
    };


    const images = vehicleData.imagens.map((imagem) => ({
        original: imagem,
        thumbnail: imagem,
    }));


    const opcionaisList = Object.keys(vehicleData.opcionais).filter(key => vehicleData.opcionais[key] === true);
    const displayedOpcionais = isMobile && !showAll ? opcionaisList.slice(0, 6) : opcionaisList;


    return (
        <>
            <Navbar />
            <main className="container mx-auto p-4 lg:p-6 flex-grow">
                {/* Nome do veículo */}
                <div className="text-left lg:text-left mb-4">
                    <h1 className="text-2xl lg:text-4xl font-bold text-slate-800 transition-colors duration-200 hover:text-orange-500">
                        {vehicleData.marca.toUpperCase()} {vehicleData.modelo.toUpperCase()} {vehicleData.anoFabricacao}
                    </h1>
                </div>

                {/* Galeria de imagens */}
                <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
                    <div className="w-full lg:w-2/3">
                        <div className="mx-auto">
                            <ImageGallery
                                items={images}
                                showPlayButton={false}
                                showFullscreenButton={true}
                                thumbnailPosition="bottom"
                                showNav={true}
                                slideDuration={280}
                                slideInterval={5000}
                                autoPlay={true}
                                showBullets={false}
                            />
                        </div>
                    </div>

                    {/* Características do veículo */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0">
                                    {/* Ícone SVG inserido */}
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6 mr-2"
                                    >
                                        <path d="M12 17V11" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path>
                                        <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 11 9)" fill="#000000"></circle>
                                        <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path>
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-900">Características</h2>
                            </div>
                            <ul>

                                {[
                                    { label: 'Marca', value: vehicleData.marca },
                                    { label: 'Ano de Fabricação', value: vehicleData.anoFabricacao },
                                    { label: 'Ano do Modelo', value: vehicleData.anoModelo },
                                    {
                                        label: 'Categoria',
                                        value: vehicleData.customId.startsWith('m')
                                            ? vehicleData.tipoDeMoto || 'Não especificada'
                                            : vehicleData.tipoDeCarro || 'Não especificada'
                                    },
                                    {
                                        label: 'Câmbio',
                                        value: vehicleData.transmissao
                                    },
                                    {
                                        label: 'Quilometragem',
                                        value: `${vehicleData.quilometragem.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Km`
                                    },
                                    {
                                        label: 'Cor',
                                        value: vehicleData.cor
                                    },
                                    {
                                        label: 'Combustível',
                                        value: vehicleData.combustivel
                                    },
                                    {
                                        label: vehicleData.customId.startsWith('m') ? 'Marchas' : 'Portas',
                                        value: vehicleData.customId.startsWith('m')
                                            ? vehicleData.numeroDeMarchas
                                            : vehicleData.numeroDePortas
                                    },
                                    {
                                        label: vehicleData.customId.startsWith('m') ? 'Freios' : 'Porta-malas',
                                        value: vehicleData.customId.startsWith('m')
                                            ? vehicleData.freios
                                            : `${vehicleData.capacidadePortaMalas}L`
                                    },
                                    {
                                        label: 'Direção',
                                        value: vehicleData.direcao
                                    },
                                    {
                                        label: 'Potência',
                                        value: `${vehicleData.potencia} cv`
                                    },
                                    {
                                        label: vehicleData.customId.startsWith('m') ? 'Cilindrada' : 'Motor',
                                        value: vehicleData.customId.startsWith('m')
                                            ? vehicleData.cilindrada
                                            : vehicleData.motor
                                    },
                                    {
                                        label: 'Torque',
                                        value: `${vehicleData.torque} kgfm`
                                    }
                                ].map((item, index) => (
                                    <li
                                        key={index}
                                        className={`flex justify-between py-3 px-4 ${index % 2 === 0 ? 'bg-slate-200' : 'bg-white'}`}
                                    >
                                        <span className="text-black font-medium">{item.label}:</span>
                                        <span className="text-black font-medium">{item.value}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Preço do veículo */}
                            <div className="mt-6 px-4">
                                <div className="bg-gradient-to-r from-green-100 to-green-300 p-6 rounded-lg shadow-lg flex flex-col items-center lg:flex-row lg:justify-between border border-green-300">
                                    <div className="flex items-center space-x-4">
                                        {/* Novo Ícone SVG sem background */}
                                        <div className="w-10 h-10 flex items-center justify-center">
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <g opacity="0.4">
                                                        <path d="M9.5 13.7502C9.5 14.7202 10.25 15.5002 11.17 15.5002H13.05C13.85 15.5002 14.5 14.8202 14.5 13.9702C14.5 13.0602 14.1 12.7302 13.51 12.5202L10.5 11.4702C9.91 11.2602 9.51001 10.9402 9.51001 10.0202C9.51001 9.18023 10.16 8.49023 10.96 8.49023H12.84C13.76 8.49023 14.51 9.27023 14.51 10.2402" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                        <path d="M12 7.5V16.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                    </g>
                                                    <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                    <path d="M22 6V2H18" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                    <path d="M17 7L22 2" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                                </g>
                                            </svg>
                                        </div>
                                        <div className="flex flex-col text-center lg:text-left">
                                            <span className="text-xs lg:text-sm font-medium text-gray-600 uppercase tracking-wide">Preço do veículo</span>
                                            <span className="text-2xl lg:text-3xl font-bold text-gray-900 whitespace-nowrap">
                                                R$ {vehicleData.valorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>

                {/* Opcionais do veículo */}
                <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                        <div className="flex-shrink-0">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 mr-2"
                            >
                                <circle cx="12" cy="12" r="3" stroke="#000000" strokeWidth="1.5"></circle>
                                <path
                                    d="M3.66122 10.6392C4.13377 10.9361 4.43782 11.4419 4.43782 11.9999C4.43781 12.558 4.13376 13.0638 3.66122 13.3607C3.33966 13.5627 3.13248 13.7242 2.98508 13.9163C2.66217 14.3372 2.51966 14.869 2.5889 15.3949C2.64082 15.7893 2.87379 16.1928 3.33973 16.9999C3.80568 17.8069 4.03865 18.2104 4.35426 18.4526C4.77508 18.7755 5.30694 18.918 5.83284 18.8488C6.07287 18.8172 6.31628 18.7185 6.65196 18.5411C7.14544 18.2803 7.73558 18.2699 8.21895 18.549C8.70227 18.8281 8.98827 19.3443 9.00912 19.902C9.02332 20.2815 9.05958 20.5417 9.15224 20.7654C9.35523 21.2554 9.74458 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8478 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.7811 18.549C16.2644 18.27 16.8545 18.2804 17.3479 18.5412C17.6837 18.7186 17.9271 18.8173 18.1671 18.8489C18.693 18.9182 19.2249 18.7756 19.6457 18.4527C19.9613 18.2106 20.1943 17.807 20.6603 17C20.8677 16.6407 21.029 16.3614 21.1486 16.1272M20.3387 13.3608C19.8662 13.0639 19.5622 12.5581 19.5621 12.0001C19.5621 11.442 19.8662 10.9361 20.3387 10.6392C20.6603 10.4372 20.8674 10.2757 21.0148 10.0836C21.3377 9.66278 21.4802 9.13092 21.411 8.60502C21.3591 8.2106 21.1261 7.80708 20.6601 7.00005C20.1942 6.19301 19.9612 5.7895 19.6456 5.54732C19.2248 5.22441 18.6929 5.0819 18.167 5.15113C17.927 5.18274 17.6836 5.2814 17.3479 5.45883C16.8544 5.71964 16.2643 5.73004 15.781 5.45096C15.2977 5.1719 15.0117 4.6557 14.9909 4.09803C14.9767 3.71852 14.9404 3.45835 14.8478 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74458 2.35523 9.35523 2.74458 9.15224 3.23463C9.05958 3.45833 9.02332 3.71848 9.00912 4.09794C8.98826 4.65566 8.70225 5.17191 8.21891 5.45096C7.73557 5.73002 7.14548 5.71959 6.65205 5.4588C6.31633 5.28136 6.0729 5.18269 5.83285 5.15108C5.30695 5.08185 4.77509 5.22436 4.35427 5.54727"
                                    stroke="#000000"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                ></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900">Opcionais do veículo</h2>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {displayedOpcionais.map((key, index) => (
                            <li key={index} className="flex items-center p-3 bg-slate-100 rounded-md shadow-sm">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 mr-2 text-green-500"
                                >
                                    <path d="M12 17V11" stroke="#43A047" strokeWidth="1.5" strokeLinecap="round"></path>
                                    <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 11 9)" fill="#43A047"></circle>
                                    <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#43A047" strokeWidth="1.5" strokeLinecap="round"></path>
                                </svg>
                                <span className="text-gray-800 text-sm font-medium">{formatOpcionaisLabel(key)}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Botão "Ver todos opcionais" para mobile */}
                    {isMobile && opcionaisList.length > 6 && (
                        <div className="flex justify-center mt-4 relative">
                            {!showAll && (
                                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                            )}
                            <button
                                onClick={toggleShowAll}
                                className="bg-gray-200 px-4 py-2 rounded-md text-gray-700 flex items-center"
                            >
                                {showAll ? "Ver menos" : "Ver todos opcionais"}
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`w-5 h-5 ml-2 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}
                                >
                                    <path d="M19 9L14 14.1599C13.7429 14.4323 13.4329 14.6493 13.089 14.7976C12.7451 14.9459 12.3745 15.0225 12 15.0225C11.6255 15.0225 11.2549 14.9459 10.9109 14.7976C10.567 14.6493 10.2571 14.4323 10 14.1599L5 9" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>


                {/* Bloco de simulação com a opção de abrir e fechar */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 mt-6 rounded-lg shadow-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-blue-800">
                            Precisa financiar? Veja uma simulação agora
                        </h2>
                        <button
                            aria-label="Abrir simulação de financiamento"
                            className="flex items-center bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500 transition-all duration-300 ease-in-out"
                            onClick={() => setShowSimulacao(!showSimulacao)}
                        >
                            {showSimulacao ? (
                                <svg
                                    className="w-6 h-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-6 h-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Bloco de Simulação de Financiamento */}
                    {showSimulacao && (
                        <div className="mt-6">
                            {/* Cálculos */}
                            {(() => {
                                const entrada = vehicleData.valorVenda * 0.3;
                                const valorFinanciado = vehicleData.valorVenda - entrada;
                                const parcelas = 48;
                                const taxaJuros = 0.022; // 2.20% ao mês
                                const parcelaEstimada =
                                    (valorFinanciado * taxaJuros) /
                                    (1 - Math.pow(1 + taxaJuros, -parcelas));

                                return (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Informações do Financiamento */}
                                        <div>
                                            {/* Valor do Veículo */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Valor do Veículo
                                                </label>
                                                <div className="mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm">
                                                    R$ {vehicleData.valorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                            </div>

                                            {/* Valor de Entrada */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Valor de Entrada (30%)
                                                </label>
                                                <div className="mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm">
                                                    R$ {entrada.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                            </div>

                                            {/* Número de Parcelas */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Número de Parcelas
                                                </label>
                                                <div className="mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm">
                                                    {parcelas}x
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            {/* Valor da Parcela Estimada */}
                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Valor da Parcela Estimada
                                                </label>
                                                <div className="mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm">
                                                    R$ {parcelaEstimada.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-4">
                                                * Os valores apresentados são estimativas e podem variar. Para uma simulação mais precisa, clique no botão abaixo.
                                            </p>

                                            <button
                                                className="w-full bg-yellow-500 text-white py-3 rounded-md hover:bg-yellow-400 transition-all duration-300 ease-in-out"
                                                onClick={() => prosseguirFinanciamento(vehicleData.customId)} // customId é o identificador único do veículo
                                            >
                                                Simular Financiamento
                                            </button>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </div>

                <div className="mt-8 px-4">
                    {/* Bloco de Compartilhar */}
                    <div className="flex items-center justify-start space-x-4 overflow-x-auto">
                        <span className="text-lg font-semibold text-gray-800">Compartilhar:</span>

                        {/* Ícone Facebook */}
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 rounded-full transition duration-300"
                        >
                            {facebookIcon}
                        </a>

                        {/* Ícone X (Twitter) */}
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 rounded-full transition duration-300"
                        >
                            {xIcon}
                        </a>

                        {/* Ícone Gmail */}
                        <a
                            href="https://mail.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 rounded-full transition duration-300"
                        >
                            {gmailIcon}
                        </a>

                        {/* Ícone WhatsApp */}
                        <a
                            href="https://wa.me"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 rounded-full transition duration-300"
                        >
                            {whatsappNewIcon}
                        </a>
                    </div>

                    {/* Formulário */}
                    <div className="bg-gray-100 p-4">
                        <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
                            <h2 className="text-xl font-bold mb-4">Se interessou? Entre em contato conosco agora mesmo!</h2>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Nome</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Seu nome"
                                    required
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                                <input
                                    type="email"
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="seuemail@exemplo.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                                <input
                                    type="tel"
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="(99) 99999-9999"
                                    required
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                    maxLength="15"
                                    onInput={(e) => {
                                        e.target.value = e.target.value
                                            .replace(/\D/g, "")
                                            .replace(/^(\d{2})(\d)/g, "($1) $2")
                                            .replace(/(\d{5})(\d)/, "$1-$2")
                                            .replace(/(-\d{4})\d+?$/, "$1");
                                    }}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700">Mensagem</label>
                                <textarea
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    rows="4"
                                    value={mensagem}
                                    onChange={(e) => setMensagem(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white p-3 rounded-md font-semibold text-lg hover:bg-green-700"
                            >
                                Estou interessado
                            </button>

                            <p className="mt-4 text-sm text-gray-500 text-center">
                                * Adotamos medidas rigorosas para proteger suas informações, garantindo privacidade e segurança em cada etapa.
                            </p>
                        </form>
                    </div>
                </div>

                {/* Botão de WhatsApp Flutuante */}
                <button
                    aria-label={`Fale pelo WhatsApp sobre o veículo ${vehicleData.modelo}`}
                    className="fixed bottom-4 right-4 z-50 flex items-center justify-center h-16 w-16 rounded-full bg-green-600 text-white cursor-pointer hover:bg-green-500 transition-transform transform hover:scale-110 shadow-lg animate-bounce"
                    onClick={() => {
                        window.open(
                            `https://wa.me/${settings.whatsappNumber}?text=Quero mais informações sobre o veículo ${vehicleData.marca.toUpperCase()} ${vehicleData.modelo}`,
                            '_blank'
                        );
                    }}
                >
                    <FaWhatsapp className="text-4xl" />
                </button>


            </main >
            <GoogleMaps />
            <Footer />
        </>
    );
}
