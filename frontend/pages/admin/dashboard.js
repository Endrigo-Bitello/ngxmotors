import { useState, useEffect } from 'react';
import {
    faBars,
    faHome,
    faClipboardList,
    faPlusCircle,
    faUsers,
    faMoneyBill,
    faMessage,
    faSearch,
    faSignOutAlt,
    faChevronDown,
    faBank,
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


function Dashboard() {
    const [view, setView] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const router = useRouter();


    useEffect(() => {
        setSEO({ title: `${process.env.NEXT_PUBLIC_NAME} - Painel Administrativo` });
    }, []);


    // Função de logout
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove o token do localStorage
        router.push('/admin/login'); // Redireciona para a página de login
    };

    const navigationItems = [
        { name: 'Visão Geral', view: 'overview', icon: faHome },
        {
            name: 'Estoque',
            icon: faClipboardList,
            items: [
                { name: 'Veículos', view: 'stock', icon: faClipboardList },
                { name: 'Adicionar Veículo', view: 'newvehicle', icon: faPlusCircle },
            ],
        },
        {
            name: 'Clientes',
            icon: faUsers,
            items: [
                { name: 'Mensagens', view: 'mensagens', icon: faMessage },
                { name: 'Simulações', view: 'financiamentos', icon: faBank },
            ],
        },
        { name: 'Consulta Fipe', view: 'consultafipe', icon: faSearch },
    ];


    const toggleDropdown = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };


    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Cabeçalho móvel */}
            <div className="bg-zinc-900 text-white p-4 md:hidden flex justify-between items-center border-b border-gray-700">
                <Image src="/logo-light.png" alt="Logo" width={100} height={30} />
                <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
                    <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
                </button>
            </div>

            <div className="flex flex-1">
                {/* Sidebar para desktop */}
                <aside className="hidden md:block bg-zinc-900 text-white w-64 space-y-6 py-7 px-4 shadow-lg">
                    <div className="flex justify-center mb-6">
                        <Image src="/logo-light.png" alt="Logo" width={120} height={40} />
                    </div>
                    <nav className="space-y-2">
                        {navigationItems.map((item) => (
                            <div key={item.name}>
                                {item.items ? (
                                    <div>
                                        <button
                                            onClick={() => toggleDropdown(item.name)}
                                            className="flex items-center justify-between w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-300"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <FontAwesomeIcon icon={item.icon} className="h-5 w-5 text-gray-400" />
                                                <span className="text-gray-200 font-medium">{item.name}</span>
                                            </div>
                                            <FontAwesomeIcon
                                                icon={faChevronDown}
                                                className={`h-5 w-5 text-gray-400 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        {openDropdown === item.name && (
                                            <ul className="ml-6 mt-2 space-y-1">
                                                {item.items.map((subItem) => (
                                                    <li key={subItem.name}>
                                                        <button
                                                            onClick={() => setView(subItem.view)}
                                                            className={`block w-full text-left px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-700 ${view === subItem.view ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' : 'text-gray-300'
                                                                }`}
                                                        >
                                                            <FontAwesomeIcon icon={subItem.icon} className="mr-2 h-4 w-4" />
                                                            {subItem.name}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setView(item.view)}
                                        className={`flex items-center w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 ${view === item.view ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' : 'text-gray-300'
                                            }`}
                                    >
                                        <FontAwesomeIcon icon={item.icon} className="h-5 w-5 mr-3" />
                                        <span className="font-medium">{item.name}</span>
                                    </button>
                                )}
                            </div>
                        ))}
                    </nav>
                    {/* Botão de Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-3 rounded-lg hover:bg-red-600 transition-all duration-300 text-gray-300"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5 mr-3" />
                        <span className="font-medium">Sair</span>
                    </button>
                </aside>

                {/* Conteúdo principal */}
                <main className="flex-1 p-8">
                    {view === 'overview' && <Overview />}
                    {view === 'stock' && <Stock />}
                    {view === 'newvehicle' && <AddVehicle />}
                    {view === 'mensagens' && <Mensagens />}
                    {view === 'financiamentos' && <Financiamentos />}
                    {view === 'consultafipe' && <ConsultaFipe />}
                </main>

                {/* Navbar inferior para dispositivos móveis */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-gray-700 shadow-lg flex justify-around py-2">
                    <button onClick={() => setView('overview')} className={`text-center transition-transform transform hover:scale-110 ${view === 'overview' ? 'text-blue-500' : 'text-gray-400'}`}>
                        <FontAwesomeIcon icon={faHome} className="h-6 w-6" />
                        <p className="text-xs">Visão Geral</p>
                    </button>
                    <button onClick={() => setView('stock')} className={`text-center transition-transform transform hover:scale-110 ${view === 'stock' ? 'text-blue-500' : 'text-gray-400'}`}>
                        <FontAwesomeIcon icon={faClipboardList} className="h-6 w-6" />
                        <p className="text-xs">Estoque</p>
                    </button>
                    <button onClick={() => setView('financiamentos')} className={`text-center transition-transform transform hover:scale-110 ${view === 'financiamentos' ? 'text-blue-500' : 'text-gray-400'}`}>
                        <FontAwesomeIcon icon={faBank} className="h-6 w-6" />
                        <p className="text-xs">Simulações</p>
                    </button>
                    <button onClick={() => setView('mensagens')} className={`text-center transition-transform transform hover:scale-110 ${view === 'mensagens' ? 'text-blue-500' : 'text-gray-400'}`}>
                        <FontAwesomeIcon icon={faMessage} className="h-6 w-6" />
                        <p className="text-xs">Mensagens</p>
                    </button>
                    <button onClick={() => setView('consultafipe')} className={`text-center transition-transform transform hover:scale-110 ${view === 'consultafipe' ? 'text-blue-500' : 'text-gray-400'}`}>
                        <FontAwesomeIcon icon={faSearch} className="h-6 w-6" />
                        <p className="text-xs">Consulta FIPE</p>
                    </button>
                </div>


            </div>
        </div>
    );
}

// Exporta com proteção da rota
export default withAuth(Dashboard); // Protege a rota com autenticação
