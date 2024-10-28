import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

const Demo = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se a variável de ambiente está definida como true
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative text-center">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <FaTimes size={20} />
        </button>

        <div className="flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="mb-4"
          />

          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Site de Demonstração
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            Este site é apenas uma demonstração de como é o sistema. Seu site será totalmente personalizado!
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Todos os veículos listados são demonstrativos e não estão à venda.
          </p>

          <a
            href="https://wa.me/5197852819"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full inline-flex items-center justify-center w-full"
          >
            <FaWhatsapp className="mr-2" />
            Chamar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default Demo;
