import { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaTiktok } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link'; // Importe Link
import axios from 'axios';

const formatPhoneNumber = (phoneNumber) => {
  const ddd = phoneNumber.slice(0, 2);
  const firstPart = phoneNumber.slice(2, 7);
  const secondPart = phoneNumber.slice(7);
  return `(${ddd}) ${firstPart}-${secondPart}`;
};

const Footer = () => {
  const [settings, setSettings] = useState(null); // Estado para armazenar as configurações

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

  // Enquanto as configurações estão sendo carregadas
  if (!settings) {
    return null; // Retorna null ou um loader enquanto espera os dados
  }

  return (
    <footer className="bg-gray-900 text-white mt-0">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="flex flex-col">
            <Image
              src="/logo-light.png"
              alt="Logo"
              width={150}
              height={50}
              className="mb-4"
            />
            <p className="text-sm text-gray-400">
              {settings.slogan}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Ajuda</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" legacyBehavior passHref>
                  <a className="text-sm text-gray-400 hover:text-white transition">Início</a>
                </Link>
              </li>
              <li>
                <Link href="/estoque" legacyBehavior passHref>
                  <a className="text-sm text-gray-400 hover:text-white transition">Estoque</a>
                </Link>
              </li>
              <li>
                <Link href="/contato" legacyBehavior passHref>
                  <a className="text-sm text-gray-400 hover:text-white transition">Contato</a>
                </Link>
              </li>
              <li>
                <Link href="/sobre" legacyBehavior passHref>
                  <a className="text-sm text-gray-400 hover:text-white transition">Sobre Nós</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Termos & Privacidade</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/politica-de-privacidade" legacyBehavior passHref>
                  <a className="text-sm text-gray-400 hover:text-white transition">Políticas de Privacidade</a>
                </Link>
              </li>
              <li>
                <Link href="/termos-de-uso" legacyBehavior passHref>
                  <a className="text-sm text-gray-400 hover:text-white transition">Termos de Uso</a>
                </Link>
              </li>
              <li>
                <Link href="/propriedade-intelectual" legacyBehavior passHref>
                  <a className="text-sm text-gray-400 hover:text-white transition">Proteção à Propriedade Intelectual</a>
                </Link>
              </li>
              <li>
                <Link href="/lgpd" legacyBehavior passHref>
                  <a className="text-sm text-gray-400 hover:text-white transition">Lei Geral de Proteção de Dados</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Fale Conosco</h3>
            <ul className="space-y-3">
              <li className="text-sm text-gray-400">
                Telefone:{' '}
                <a
                  href={`tel:${settings.whatsappNumber}`}
                  className="hover:text-white transition"
                >
                  {formatPhoneNumber(settings.whatsappNumber)}
                </a>
              </li>
              <li className="text-sm text-gray-400">
                Email:{' '}
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-white transition"
                >
                  {settings.email}
                </a>
              </li>
              <li className="text-sm text-gray-400">
                Endereço: {settings.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex justify-center space-x-6">
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-500 transition"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href={settings.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href={settings.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-700 transition"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#EE1D52] transition"
            >
              <FaTiktok size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-800 p-6 text-center text-gray-400 text-sm">
        <p>© 2024 {settings.name}. Todos os direitos reservados.</p>
        <p>
          Desenvolvido por <span className="text-white font-semibold">EMX Softwares</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
