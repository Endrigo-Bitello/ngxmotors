import { useState, useEffect } from 'react';
import {
    faHome,
    faClipboardList,
    faPlusCircle,
    faMessage,
    faSearch,
    faSignOutAlt,
    faChevronDown,
    faBank,
    faLightbulb,
    faGear,
    faBars,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { setSEO } from '../../utils/seo';
import withAuth from '../../utils/withAuth';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Loading from '../components/Loading';

const Stock = dynamic(() => import('../components/admin/Stock'));
const Mensagens = dynamic(() => import('../components/admin/Mensagens'));
const Financiamentos = dynamic(() => import('../components/admin/Financiamentos'));
const Overview = dynamic(() => import('../components/admin/Overview'));
const ConsultaFipe = dynamic(() => import('../components/admin/ConsultaFipe'));
const AddVehicle = dynamic(() => import('../components/admin/AddVehicle'));
const Kanban = dynamic(() => import('../components/admin/crm/Kanban'));
const Settings = dynamic(() => import('../components/admin/Settings'));

function Dashboard() {
    const [view, setView] = useState('overview');
    const [openDropdown, setOpenDropdown] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const [settings, setSettings] = useState(null);

    // Função para buscar as configurações
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
        if (settings) {
            setSEO({ title: `${settings.name} - Painel Administrativo` });
        }
    }, [settings]);

    // Função para logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/admin/login');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };


    // Função para verificar a expiração do token
    const checkTokenExpiration = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleLogout(); // Se o token não existir, redireciona para login
            return;
        }

        const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do token
        const expirationTime = tokenPayload.exp * 1000; // Tempo de expiração do token em ms

        const currentTime = Date.now(); // Tempo atual em ms

        if (currentTime >= expirationTime) {
            handleLogout(); // Se o token já expirou, faz logout
        } else {
            // Se o token ainda não expirou, configura um timeout para deslogar quando ele expirar
            const timeUntilExpiration = expirationTime - currentTime;
            setTimeout(() => {
                handleLogout();
            }, timeUntilExpiration);
        }
    };

    useEffect(() => {
        checkTokenExpiration(); // Verifica a expiração do token ao carregar o componente
    }, []);

    const navigationItems = [
        { name: 'Visão Geral', view: 'overview', icon: faHome },
        { name: 'CRM', view: 'kanban', icon: faLightbulb },
        {
            name: 'Estoque',
            items: [
                { name: 'Veículos', view: 'stock', icon: faClipboardList },
                { name: 'Adicionar Veículo', view: 'newvehicle', icon: faPlusCircle },
            ],
        },
        {
            name: 'Clientes',
            items: [
                { name: 'Mensagens', view: 'mensagens', icon: faMessage },
                { name: 'Simulações', view: 'financiamentos', icon: faBank },
            ],
        },
        { name: 'Consultar Fipe', view: 'consultafipe', icon: faSearch },
        { name: 'Configurações', view: 'settings', icon: faGear },
    ];

    const toggleDropdown = (dropdownName) => {
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };

    if (!settings) {
        return (
          <div>
            <Loading />  
          </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbar para Desktop */}
            <header className="hidden md:flex items-center justify-between bg-zinc-900 text-white px-8 py-4 z-50 sticky top-0">
                <div className="flex items-center">
                    <Image src="/logo-light.png" alt="Logo" width={120} height={40} />
                </div>
                <nav className="flex space-x-8 relative">
                    {[
                        { name: 'Visão Geral', view: 'overview', icon: faHome },
                        {
                            name: 'Estoque',
                            items: [
                                { name: 'Veículos', view: 'stock', icon: faClipboardList },
                                { name: 'Adicionar Veículo', view: 'newvehicle', icon: faPlusCircle },
                            ],
                        },
                        {
                            name: 'Clientes',
                            items: [
                                { name: 'Mensagens', view: 'mensagens', icon: faMessage },
                                { name: 'Simulações', view: 'financiamentos', icon: faBank },
                            ],
                        },
                        { name: 'Consultar Fipe', view: 'consultafipe', icon: faSearch },
                        { name: 'Configurações', view: 'settings', icon: faGear },
                    ].map((item) =>
                        item.items ? (
                            <div key={item.name} className="relative">
                                <button
                                    onClick={() => toggleDropdown(item.name)}
                                    className="flex items-center space-x-3 hover:text-blue-500 transition duration-300"
                                >
                                    <FontAwesomeIcon icon={item.items[0].icon} className="h-5 w-5" />
                                    <span className="font-medium">{item.name}</span>
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`ml-2 h-4 w-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                {openDropdown === item.name && (
                                    <div className="absolute left-0 mt-2 w-48 bg-zinc-800 text-white shadow-lg rounded-md z-50">
                                        {item.items.map((subItem) => (
                                            <button
                                                key={subItem.name}
                                                onClick={() => {
                                                    setView(subItem.view);
                                                    setOpenDropdown(null);
                                                }}
                                                className={`block px-4 py-2 text-sm hover:bg-blue-500 hover:text-white w-full text-left ${view === subItem.view ? 'bg-blue-600' : 'text-gray-400'
                                                    }`}
                                            >
                                                <FontAwesomeIcon icon={subItem.icon} className="mr-2 h-4 w-4" />
                                                {subItem.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                key={item.name}
                                onClick={() => {
                                    setView(item.view);
                                    setOpenDropdown(null);
                                }}
                                className={`flex items-center space-x-3 hover:text-blue-500 transition duration-300 ${view === item.view ? 'text-blue-500' : 'text-gray-400'
                                    }`}
                            >
                                <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
                                <span className="font-medium">{item.name}</span>
                            </button>
                        )
                    )}
                </nav>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 hover:text-red-500 transition duration-300"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
                    <span className="font-medium">Sair</span>
                </button>
            </header>

            {/* Navbar para Mobile */}
            <header className="md:hidden flex items-center justify-between bg-zinc-900 text-white px-4 py-3 sticky top-0 z-50">
                <div className="flex items-center">
                    <Image src="/logo-light.png" alt="Logo" width={120} height={40} />
                </div>
                <button onClick={toggleSidebar} className="text-white focus:outline-none">
                    <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} className="h-6 w-6" />
                </button>
            </header>

            {/* Sidebar para Mobile */}
            {sidebarOpen && (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleSidebar}>
        <div
            className="fixed top-0 left-0 w-64 bg-zinc-900 text-white h-full p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
        >
            <nav className="space-y-4">
                {/* Visão Geral */}
                <button
                    onClick={() => {
                        setView('overview');
                        toggleSidebar();
                    }}
                    className={`flex items-center space-x-3 hover:text-blue-500 transition duration-300 ${view === 'overview' ? 'text-blue-500' : 'text-gray-400'}`}
                >
                    <FontAwesomeIcon icon={faHome} className="h-5 w-5" />
                    <span>Visão Geral</span>
                </button>

                {/* Estoque com dropdown */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('Estoque')}
                        className="flex items-center space-x-3 hover:text-blue-500 transition duration-300 text-gray-400"
                    >
                        <FontAwesomeIcon icon={faClipboardList} className="h-5 w-5" />
                        <span>Estoque</span>
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            className={`ml-2 h-4 w-4 transition-transform ${openDropdown === 'Estoque' ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {openDropdown === 'Estoque' && (
                        <div className="pl-6 mt-2 space-y-2">
                            <button
                                onClick={() => {
                                    setView('stock');
                                    toggleSidebar();
                                }}
                                className={`block text-sm hover:text-blue-500 ${view === 'stock' ? 'text-blue-500' : 'text-gray-400'}`}
                            >
                                Veículos
                            </button>
                            <button
                                onClick={() => {
                                    setView('newvehicle');
                                    toggleSidebar();
                                }}
                                className="block text-sm text-gray-400 hover:text-blue-500"
                            >
                                Adicionar Veículo
                            </button>
                        </div>
                    )}
                </div>

                {/* Clientes com dropdown */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('Clientes')}
                        className="flex items-center space-x-3 hover:text-blue-500 transition duration-300 text-gray-400"
                    >
                        <FontAwesomeIcon icon={faMessage} className="h-5 w-5" />
                        <span>Clientes</span>
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            className={`ml-2 h-4 w-4 transition-transform ${openDropdown === 'Clientes' ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {openDropdown === 'Clientes' && (
                        <div className="pl-6 mt-2 space-y-2">
                            <button
                                onClick={() => {
                                    setView('mensagens');
                                    toggleSidebar();
                                }}
                                className={`block text-sm hover:text-blue-500 ${view === 'mensagens' ? 'text-blue-500' : 'text-gray-400'}`}
                            >
                                Mensagens
                            </button>
                            <button
                                onClick={() => {
                                    setView('financiamentos');
                                    toggleSidebar();
                                }}
                                className={`block text-sm hover:text-blue-500 ${view === 'financiamentos' ? 'text-blue-500' : 'text-gray-400'}`}
                            >
                                Simulações
                            </button>
                        </div>
                    )}
                </div>

                {/* Consulta FIPE */}
                <button
                    onClick={() => {
                        setView('consultafipe');
                        toggleSidebar();
                    }}
                    className={`flex items-center space-x-3 hover:text-blue-500 transition duration-300 ${view === 'consultafipe' ? 'text-blue-500' : 'text-gray-400'}`}
                >
                    <FontAwesomeIcon icon={faSearch} className="h-5 w-5" />
                    <span>Consulta FIPE</span>
                </button>

                {/* Configurações */}
                <button
                    onClick={() => {
                        setView('settings');
                        toggleSidebar();
                    }}
                    className={`flex items-center space-x-3 hover:text-blue-500 transition duration-300 ${view === 'settings' ? 'text-blue-500' : 'text-gray-400'}`}
                >
                    <FontAwesomeIcon icon={faGear} className="h-5 w-5" />
                    <span>Configurações</span>
                </button>

                {/* Sair */}
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-red-500 hover:text-red-700 transition duration-300"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
                    <span>Sair</span>
                </button>
            </nav>
        </div>
    </div>
)}

            {/* Conteúdo principal */}
            <main className="flex-1 p-8">
                {view === 'overview' && <Overview />}
                {view === 'stock' && <Stock />}
                {view === 'newvehicle' && <AddVehicle />}
                {view === 'mensagens' && <Mensagens />}
                {view === 'financiamentos' && <Financiamentos />}
                {view === 'consultafipe' && <ConsultaFipe />}
                {view === 'settings' && <Settings />}
            </main>
        </div>
    );
}

// Exporta com proteção da rota
export default withAuth(Dashboard);