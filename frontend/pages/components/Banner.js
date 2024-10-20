import Image from 'next/image';

const Banner = () => {
  return (
    <div className="relative w-full h-[650px]"> {/* Ajuste para altura de 650px */}
      <Image
        src="/2.png"
        alt="Banner"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
      />
    </div>
  );
};

export default Banner;
