import Image from 'next/image';

const Banner = () => {
  return (
    <div className="relative w-full h-[480px]">
      <Image
        src="/2.jpg"
        alt="Banner"
        layout="fill" 
        objectFit="cover" 
        quality={100} 
      />
    </div>
  );
};

export default Banner;
