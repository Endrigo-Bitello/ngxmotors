import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPhoneAlt, FaWhatsapp, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false); // Estado de loading
  const [settings, setSettings] = useState(null); // Estado para armazenar as configurações
  const router = useRouter();

  // Função para buscar as configurações da API
  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/get-settings`);
      setSettings(data); // Armazena os dados das configurações no estado
    } catch (error) {
      console.error('Erro ao buscar as configurações:', error);
    }
  };

  // useEffect para buscar as configurações quando o componente é montado
  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (searchQuery.trim() === '') return; // Não faz a busca se o campo estiver vazio

    setLoading(true); // Inicia o loading

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/search`, {
        params: { search: searchQuery },
      });

      // Redireciona para a página de resultados da pesquisa
      router.push({
        pathname: '/estoque',
        query: { search: searchQuery }
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert(`Nenhum resultado encontrado para: ${searchQuery}`);
        router.push('/estoque'); // Redireciona para a página de estoque normalmente
      } else {
        console.error('Erro ao buscar veículos:', error);
      }
    } finally {
      setLoading(false); // Finaliza o loading
    }
  };

  // Enquanto as configurações estão sendo carregadas
  if (!settings) {
    return null; // Retorna null ou um loader enquanto espera os dados
  }

  return (
    <>
      {/* Barra Superior com Informações de Contato */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white py-2 text-xs md:text-sm">
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Horários de atendimento */}
          <div className="hidden sm:flex space-x-4 md:space-x-6">
            <span className="font-semibold">Horário de atendimento:</span>
            <span>{settings.openingHours}</span>
          </div>
          {/* Links de contato */}
          <div className="flex space-x-4 md:space-x-6">
            <a
              href={`tel:${settings.phoneNumber}`}
              className="flex items-center hover:text-yellow-400 transition duration-300"
            >
              <FaPhoneAlt className="mr-2" />
              <span className="hidden sm:inline">{settings.phoneNumber}</span>
            </a>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
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
          <div className="hidden lg:flex items-center flex-grow px-4">
            <form onSubmit={handleSearch} className="w-full max-w-md mx-auto">
              <div className="flex">
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
              </div>
            </form>
          </div>

          {/* Links de Navegação para Desktop */}
          <ul className="hidden lg:flex space-x-6 font-medium text-gray-700">
            <li>
              <Link href="/estoque" legacyBehavior>
                <a className="hover:text-blue-600 transition-colors duration-300">ESTOQUE</a>
              </Link>
            </li>
            <li>
              <Link href="/financiamento" legacyBehavior>
                <a className="hover:text-blue-600 transition-colors duration-300">FINANCIE</a>
              </Link>
            </li>
            <li>
              <Link href="/sobre" legacyBehavior>
                <a className="hover:text-blue-600 transition-colors duration-300">SOBRE</a>
              </Link>
            </li>
            <li>
              <Link href="/contato" legacyBehavior>
                <a className="hover:text-blue-600 transition-colors duration-300">CONTATO</a>
              </Link>
            </li>
          </ul>

          {/* Botão do Menu Móvel */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-800 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Móvel */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white shadow-md transition-all duration-300">
            {/* Barra de Pesquisa para Mobile */}
            <div className="px-4 py-4">
              <form onSubmit={handleSearch} className="flex">
                <div className="relative flex-grow">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    id="search-mobile"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar veículos, modelos..."
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
            </div>
            <ul className="flex flex-col space-y-4 px-4 py-6 text-gray-700 font-medium">
              <li>
                <Link href="/estoque" legacyBehavior>
                  <a className="hover:text-blue-600 transition-colors duration-300">ESTOQUE</a>
                </Link>
              </li>
              <li>
                <Link href="/financiamento" legacyBehavior>
                  <a className="hover:text-blue-600 transition-colors duration-300">FINANCIE</a>
                </Link>
              </li>
              <li>
                <Link href="/sobre" legacyBehavior>
                  <a className="hover:text-blue-600 transition-colors duration-300">SOBRE</a>
                </Link>
              </li>
              <li>
                <Link href="/contato" legacyBehavior>
                  <a className="hover:text-blue-600 transition-colors duration-300">CONTATO</a>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
