import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPhoneAlt, FaWhatsapp, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState(null);
  const router = useRouter();
  const { pathname } = router;

  const navItems = [
    { name: 'ESTOQUE', href: '/estoque' },
    { name: 'FINANCIE', href: '/financiamento' },
    { name: 'SOBRE', href: '/sobre' },
    { name: 'CONTATO', href: '/contato' },
  ];

  // Função para buscar as configurações da API
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

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim() === '') return;

    router.push({
      pathname: '/estoque',
      query: { search: searchQuery },
    });
  };

  const renderNavLinks = (isMobile) => (
    <ul
      className={`${
        isMobile ? 'flex flex-col space-y-4 px-4 py-6' : 'hidden lg:flex space-x-6'
      } font-medium text-gray-700`}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        const linkClassName = `hover:text-blue-600 transition-colors duration-300 ${
          isActive ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''
        }`;

        return (
          <li key={item.href}>
            <Link href={item.href} legacyBehavior>
              <a className={linkClassName}>{item.name}</a>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const renderSearchBar = () => (
    <form onSubmit={handleSearch} className="flex w-full max-w-md mx-auto">
      <label htmlFor="search" className="sr-only">
        Buscar veículos, marcas ou modelos
      </label>
      <div className="relative flex-grow">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar veículos, marcas ou modelos..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="px-4 bg-blue-600 text-white font-medium rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Buscar
      </button>
    </form>
  );

  return (
    <>
      {/* Barra Superior com Informações de Contato */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white py-2 text-xs md:text-sm">
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Horários de atendimento */}
          <div className="hidden sm:flex space-x-4 md:space-x-6">
            <span className="font-semibold">Horário de atendimento:</span>
            <span>{settings?.openingHours || 'Horário não disponível'}</span>
          </div>
          {/* Links de contato */}
          <div className="flex space-x-4 md:space-x-6">
            <a
              href={`tel:${settings?.phoneNumber || '#'}`}
              className="flex items-center hover:text-yellow-400 transition duration-300"
            >
              <FaPhoneAlt className="mr-2" />
              <span className="hidden sm:inline">{settings?.phoneNumber || 'Telefone'}</span>
            </a>
            <a
              href={`https://wa.me/${settings?.whatsappNumber || '#'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-green-400 transition duration-300"
            >
              <FaWhatsapp className="mr-2" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-md z-50 sticky top-0">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          {/* Logo */}
          <Link href="/" legacyBehavior>
            <a className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo da Revenda"
                width={90}
                height={50}
                className="max-h-14 w-auto transform hover:scale-105 transition-transform duration-300 md:max-h-12 md:w-auto sm:max-h-10 sm:w-auto"
              />
            </a>
          </Link>

          {/* Barra de Pesquisa para Desktop */}
          <div className="hidden lg:flex items-center flex-grow px-4">{renderSearchBar()}</div>

          {/* Links de Navegação para Desktop */}
          {renderNavLinks(false)}

          {/* Botão do Menu Móvel */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-800 focus:outline-none"
              aria-label="Alternar menu móvel"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Móvel */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white shadow-md transition-all duration-300">
            {/* Barra de Pesquisa para Mobile */}
            <div className="px-4 py-4">{renderSearchBar()}</div>
            {/* Links de Navegação para Mobile */}
            {renderNavLinks(true)}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
