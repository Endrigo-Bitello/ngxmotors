import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';

const Banner = () => {
  // Detectar se o dispositivo é mobile (largura da tela menor que 768px)
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <div className={`relative w-full ${isMobile ? 'h-[260px]' : 'h-[650px]'}`}> {/* Altura ajustada para cada dispositivo */}
      <Image
        src={isMobile ? '/banner-mobile.webp' : '/banner-desktop.png'} // Imagem condicional baseada no dispositivo
        alt="Banner"
        layout="fill" // Preencher o container
        objectFit="cover" // Mostrar a imagem inteira sem cortar
        quality={100}
        priority // Carregar a imagem com prioridade
      />
    </div>
  );
};

export default Banner;
