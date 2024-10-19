import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaTiktok } from 'react-icons/fa';
import Image from 'next/image';

const formatPhoneNumber = (phoneNumber) => {
  const ddd = phoneNumber.slice(0, 2);
  const firstPart = phoneNumber.slice(2, 7);
  const secondPart = phoneNumber.slice(7);
  return `(${ddd}) ${firstPart}-${secondPart}`;
};

const Footer = () => {
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
              Conectando você ao futuro da revenda de veículos online, com confiança e inovação.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Ajuda</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-sm text-gray-400 hover:text-white transition">
                  Início
                </a>
              </li>
              <li>
                <a href="/estoque" className="text-sm text-gray-400 hover:text-white transition">
                  Estoque
                </a>
              </li>
              <li>
                <a href="/contato" className="text-sm text-gray-400 hover:text-white transition">
                  Contato
                </a>
              </li>
              <li>
                <a href="/sobre" className="text-sm text-gray-400 hover:text-white transition">
                  Sobre Nós
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Termos & Privacidade</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/politica-de-privacidade"
                  className="text-sm text-gray-400 hover:text-white transition"
                >
                  Políticas de Privacidade
                </a>
              </li>
              <li>
                <a
                  href="/termos-de-uso"
                  className="text-sm text-gray-400 hover:text-white transition"
                >
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Fale Conosco</h3>
            <ul className="space-y-3">
              <li className="text-sm text-gray-400">
                Telefone:{' '}
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  className="hover:text-white transition"
                >
                  {formatPhoneNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)}
                </a>
              </li>
              <li className="text-sm text-gray-400">
                Email:{' '}
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
                  className="hover:text-white transition"
                >
                  {process.env.NEXT_PUBLIC_EMAIL}
                </a>
              </li>
              <li className="text-sm text-gray-400">
                Endereço: {process.env.NEXT_PUBLIC_ADDRESS}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex justify-center space-x-6">
            <a
              href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-500 transition"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-700 transition"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_TIKTOK_URL}
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
      <div className="bg-gray-800 p-4 text-center text-gray-500 text-sm">
        © 2024 {process.env.NEXT_PUBLIC_NAME}. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
