import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';

const Banner = () => {
  // Detectar se o dispositivo é mobile (largura da tela menor que 768px)
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <div className="relative w-full h-[650px]"> {/* Ajuste para altura de 650px */}
      <Image
        src={isMobile ? '/banner-mobile.png' : '/banner-desktop.png'} // Renderizar diferentes imagens
        alt="Banner"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
      />
    </div>
  );
};

export default Banner;
