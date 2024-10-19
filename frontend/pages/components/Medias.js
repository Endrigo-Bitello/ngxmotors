import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Medias = () => {
  return (
    <div className="fixed top-[22%] right-0 flex flex-col items-end z-50">
      {/* Container de Ícones */}
      <div className="flex flex-col items-center gap-0">
        {/* Ícone do Instagram */}
        <a
          href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Acesse Instagram"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 hover:scale-110 transition-transform duration-200 ease-in-out"
        >
          <FontAwesomeIcon icon={faInstagram} className="text-white text-2xl sm:text-3xl" />
        </a>

        {/* Ícone do Facebook */}
        <a
          href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Acesse Facebook"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 hover:scale-110 transition-transform duration-200 ease-in-out"
        >
          <FontAwesomeIcon icon={faFacebook} className="text-white text-2xl sm:text-3xl" />
        </a>

        {/* Ícone do WhatsApp */}
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
            process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE
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
          href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
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
