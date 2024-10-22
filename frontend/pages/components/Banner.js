import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false); // Estado para verificar se o dispositivo é mobile

  // Detectar o tamanho da janela e definir se é mobile ou desktop
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768); // Definir como mobile se a largura da tela for <= 768px
  };

  // Carregar banners do diretório public/banners
  const loadBanners = () => {
    const bannerList = [
      {
        desktopBannerUrl: '/banner-desktop.png',
        mobileBannerUrl: '/banner-mobile.png',
      }
      // Adicione quantos banners forem necessários
    ];

    setBanners(bannerList);
  };

  useEffect(() => {
    loadBanners(); // Carrega os banners do diretório local
    handleResize(); // Chama a função quando o componente monta
    window.addEventListener('resize', handleResize); // Adiciona listener para o resize da janela

    return () => {
      window.removeEventListener('resize', handleResize); // Remove o listener quando o componente desmonta
    };
  }, []);

  return (
<div className="relative w-full" style={{ height: isMobile ? '450px' : '650px' }}>
      {banners.length > 0 && banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Renderiza o banner correto com base no dispositivo */}
          <Image
            src={isMobile ? banner.mobileBannerUrl : banner.desktopBannerUrl}
            alt={`Banner ${index + 1}`}
            layout="fill"
            objectFit="cover"
            priority
            quality={100}
            className="w-full h-full"
            sizes="(max-width: 768px) 100vw, 1920px"
          />
        </div>
      ))}

      {/* Indicadores de controle de slides */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <div
            key={index}
          ></div>
        ))}
      </div>
    </div>
  );
}
