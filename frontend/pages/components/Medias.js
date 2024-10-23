import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Medias = () => {
  const [settings, setSettings] = useState(null); // Estado para armazenar as configurações

  // Função para buscar as configurações da API
  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/get-settings`);
      setSettings(data);
    } catch (error) {
      console.error('Erro ao buscar as configurações:', error);
    }
  };

  // useEffect para buscar as configurações quando o componente é montado
  useEffect(() => {
    fetchSettings();
  }, []);

  // Se as configurações ainda não foram carregadas, exibe um estado de carregamento
  if (!settings) {
    return null; // Ou exiba um loader, por exemplo, <p>Carregando...</p>
  }

  return (
    <div className="fixed top-[22%] right-0 flex flex-col items-end z-50">
      {/* Container de Ícones */}
      <div className="flex flex-col items-center gap-0">
        {/* Ícone do Instagram */}
        <a
          href={settings.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Acesse Instagram"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 hover:scale-110 transition-transform duration-200 ease-in-out"
        >
          <FontAwesomeIcon icon={faInstagram} className="text-white text-2xl sm:text-3xl" />
        </a>

        {/* Ícone do Facebook */}
        <a
          href={settings.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Acesse Facebook"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 hover:scale-110 transition-transform duration-200 ease-in-out"
        >
          <FontAwesomeIcon icon={faFacebook} className="text-white text-2xl sm:text-3xl" />
        </a>

        {/* Ícone do WhatsApp */}
        <a
          href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
            settings.whatsappMessage
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Fale pelo WhatsApp"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-600 hover:scale-110 transition-transform duration-200 ease-in-out"
        >
          <FontAwesomeIcon icon={faWhatsapp} className="text-white text-2xl sm:text-3xl" />
        </a>

        {/* Ícone do Email */}
        <a
          href={`mailto:${settings.email}`}
          aria-label="Envie um email"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 hover:scale-110 transition-transform duration-200 ease-in-out"
        >
          <FontAwesomeIcon icon={faEnvelope} className="text-white text-2xl sm:text-3xl" />
        </a>
      </div>
    </div>
  );
};

export default Medias;
