import { useState, useEffect } from 'react';
import {
    faBars,
    faHome,
    faClipboardList,
    faPlusCircle,
    faUsers,
    faMessage,
    faSearch,
    faSignOutAlt,
    faChevronDown,
    faBank,
    faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { setSEO } from '../../utils/seo';
import withAuth from '../../utils/withAuth';

import Stock from '../components/admin/Stock';
import Mensagens from '../components/admin/Mensagens';
import Financiamentos from '../components/admin/Financiamentos';
import Overview from '../components/admin/Overview';
import ConsultaFipe from '../components/admin/ConsultaFipe';
import AddVehicle from '../components/admin/AddVehicle';
import CRM from '../components/admin/CRM';

function Dashboard() {
    const [view, setView] = useState('overview');
    const [openDropdown, setOpenDropdown] = useState(null); // Estado para controlar qual dropdown está aberto
    const router = useRouter();

    useEffect(() => {
        setSEO({ title: `${process.env.NEXT_PUBLIC_NAME} - Painel Administrativo` });
    }, []);

    // Função de logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/admin/login');
    };

    const navigationItems = [
        { name: 'Visão Geral', view: 'overview', icon: faHome },
        { name: 'CRM', view: 'crm', icon: faLightbulb},
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
        { name: 'Consulta Fipe', view: 'consultafipe', icon: faSearch },
    ];

    // Função para alternar o dropdown aberto
    const toggleDropdown = (dropdownName) => {
        // Fecha o dropdown anterior e abre o novo
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbar para Desktop */}
            <header className="hidden md:flex items-center justify-between bg-zinc-900 text-white px-8 py-4 z-50 sticky top-0">
                <div className="flex items-center">
                    <Image src="/logo-light.png" alt="Logo" width={120} height={40} />
                </div>
                <nav className="flex space-x-8 relative">
                    {navigationItems.map((item) =>
                        item.items ? (
                            <div key={item.name} className="relative">
                                {/* Botão principal que abre o dropdown */}
                                <button
                                    onClick={() => toggleDropdown(item.name)} // Chama a função para alternar o dropdown
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
                                {/* Dropdown que abre ao clicar */}
                                {openDropdown === item.name && (
                                    <div className="absolute left-0 mt-2 w-48 bg-zinc-800 text-white shadow-lg rounded-md z-50">
                                        {item.items.map((subItem) => (
                                            <button
                                                key={subItem.name}
                                                onClick={() => {
                                                    setView(subItem.view);
                                                    setOpenDropdown(null); // Fechar o dropdown ao clicar em um item
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
                                    setOpenDropdown(null); // Fechar dropdown ao clicar em outro item
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
                {/* Botão de Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 hover:text-red-500 transition duration-300"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
                    <span className="font-medium">Sair</span>
                </button>
            </header>

            {/* Conteúdo principal */}
            <main className="flex-1 p-8">
                {view === 'overview' && <Overview />}
                {view === 'crm' && <CRM />}
                {view === 'stock' && <Stock />}
                {view === 'newvehicle' && <AddVehicle />}
                {view === 'mensagens' && <Mensagens />}
                {view === 'financiamentos' && <Financiamentos />}
                {view === 'consultafipe' && <ConsultaFipe />}
            </main>

            {/* Navbar inferior para dispositivos móveis */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-gray-700 shadow-lg flex justify-around py-2">
                <button
                    onClick={() => setView('overview')}
                    className={`text-center transition-transform transform hover:scale-110 ${view === 'overview' ? 'text-blue-500' : 'text-gray-400'
                        }`}
                >
                    <FontAwesomeIcon icon={faHome} className="h-6 w-6" />
                    <p className="text-xs">Visão Geral</p>
                </button>
                <button
                    onClick={() => setView('stock')}
                    className={`text-center transition-transform transform hover:scale-110 ${view === 'stock' ? 'text-blue-500' : 'text-gray-400'
                        }`}
                >
                    <FontAwesomeIcon icon={faClipboardList} className="h-6 w-6" />
                    <p className="text-xs">Estoque</p>
                </button>
                <button
                    onClick={() => setView('financiamentos')}
                    className={`text-center transition-transform transform hover:scale-110 ${view === 'financiamentos' ? 'text-blue-500' : 'text-gray-400'
                        }`}
                >
                    <FontAwesomeIcon icon={faBank} className="h-6 w-6" />
                    <p className="text-xs">Simulações</p>
                </button>
                <button
                    onClick={() => setView('mensagens')}
                    className={`text-center transition-transform transform hover:scale-110 ${view === 'mensagens' ? 'text-blue-500' : 'text-gray-400'
                        }`}
                >
                    <FontAwesomeIcon icon={faMessage} className="h-6 w-6" />
                    <p className="text-xs">Mensagens</p>
                </button>
                <button
                    onClick={() => setView('consultafipe')}
                    className={`text-center transition-transform transform hover:scale-110 ${view === 'consultafipe' ? 'text-blue-500' : 'text-gray-400'
                        }`}
                >
                    <FontAwesomeIcon icon={faSearch} className="h-6 w-6" />
                    <p className="text-xs">Consulta FIPE</p>
                </button>
            </div>
            <footer className="hidden md:block bg-zinc-900 text-gray-400 text-sm py-4 text-center">
                <p>Desenvolvido por EMX Softwares</p>
                <p className="mt-2 italic text-gray-500">EMX Motors vAlpha 1.0.0</p>
            </footer>

        </div>

    );

}

// Exporta com proteção da rota
export default withAuth(Dashboard); // Protege a rota com autenticação
