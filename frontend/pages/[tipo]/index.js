import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { setSEO } from '../../utils/seo';
import Image from 'next/image';

const Navbar = dynamic(() => import('../components/Navbar'));
const Medias = dynamic(() => import('../components/Medias'));
const Loading = dynamic(() => import('../components/Loading'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'));

export default function VehicleTypePage() {
  const router = useRouter();
  const { tipo } = router.query;

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true); // Adiciona o estado de loading

  useEffect(() => {
    setSEO(
      { title: `${process.env.NEXT_PUBLIC_NAME} - Veículos disponíveis` });
  }, []);

  // Função para obter a rota correta da imagem com a URL completa
  const getImagePath = (vehicle) => {
    if (vehicle.imagens && vehicle.imagens.length > 0) {
      return vehicle.imagens[0]; // Supondo que seja a URL completa
    }
    return ''; // Caso não haja fotos ou ocorra algum erro
  };

  // Tipos válidos de veículos
  const validTypes = ['carros', 'motos'];

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      if (tipo === 'carros') {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/carros`);
        setVehicles(res.data);
        console.log(`Número de veículos do tipo carro: ${res.data.length}`);
      } else if (tipo === 'motos') {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/motos`);
        setVehicles(res.data);
        console.log(`Número de veículos do tipo moto: ${res.data.length}`);
      }
    } catch (error) {
      console.error('Erro ao buscar os veículos:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // Se o tipo não for válido, redireciona para a página 404
    if (tipo && !validTypes.includes(tipo)) {
      router.replace('/404'); // Redireciona para a página de erro 404
      return;
    }

    if (tipo) {
      fetchVehicles();
    }
  }, [tipo]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />
      <Medias />

      {/* Conteúdo principal */}
      <main className="container mx-auto p-6 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Veículos Usados, seminovos e Novos à venda</h1>
            <p className="text-lg text-gray-600">
              {vehicles.length} {vehicles.length === 1 ? 'veículo disponível' : 'veículos disponíveis'}
            </p>
          </div>
          <button className="border border-gray-400 rounded-md px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M21.63 14.75C21.63 15.64 21.38 16.48 20.94 17.2C20.12 18.58 18.61 19.5 16.88 19.5C15.15 19.5 13.64 18.57 12.82 17.2C12.38 16.49 12.13 15.64 12.13 14.75C12.13 12.13 14.26 10 16.88 10C19.5 10 21.63 12.13 21.63 14.75Z" stroke="#000000" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M18.66 14.73H15.11" stroke="#000000" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M16.88 13V16.55" stroke="#000000" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M20.6901 4.02002V6.23999C20.6901 7.04999 20.1801 8.06001 19.6801 8.57001L17.9201 10.12C17.5901 10.04 17.2401 10 16.8801 10C14.2601 10 12.1301 12.13 12.1301 14.75C12.1301 15.64 12.3801 16.48 12.8201 17.2C13.1901 17.82 13.7001 18.35 14.3201 18.73V19.07C14.3201 19.68 13.9201 20.49 13.4101 20.79L12.0001 21.7C10.6901 22.51 8.87006 21.6 8.87006 19.98V14.63C8.87006 13.92 8.46006 13.01 8.06006 12.51L4.22006 8.46997C3.72006 7.95997 3.31006 7.05001 3.31006 6.45001V4.12C3.31006 2.91 4.22006 2 5.33006 2H18.6701C19.7801 2 20.6901 2.91002 20.6901 4.02002Z" stroke="#000000" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
              </g>
            </svg>
            Filtrar
          </button>
        </div>



        {loading && <Loading />}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <div key={vehicle.customId} className="flex flex-col gap-4 group hover:bg-gray-50">

                <Link
                  href={`/${tipo}/${vehicle.marca.toLowerCase()}/${vehicle.modelo
                    .toLowerCase()
                    .replace(/\s+/g, '-')}-${vehicle.customId}`} // Usando customId corretamente
                  legacyBehavior
                >
                  <a className="flex flex-col gap-4">
                    {/* Imagem e overlay */}
                    <figure className="w-full relative flex overflow-hidden">
                      {!vehicle.imagens || vehicle.imagens.length === 0 ? (
                        // Elemento de loading
                        <div className="flex justify-center items-center absolute inset-0 z-[0]">
                          <div className="relative inline-flex">
                            <div className="w-8 h-8 bg-neutral-500 rounded-full"></div>
                            <div className="w-8 h-8 bg-neutral-500 rounded-full absolute top-0 left-0 animate-ping"></div>
                            <div className="w-8 h-8 bg-neutral-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
                          </div>
                        </div>
                      ) : null}
                      {/* Imagem do veículo */}
                      {vehicle.imagens && vehicle.imagens.length > 0 ? (
                        <div className="relative h-64 w-full">
                          <Image
                            src={getImagePath(vehicle)}
                            alt={vehicle.modelo}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-sm group-hover:scale-110 transition-all ease-in-out duration-100"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                          Sem imagem
                        </div>
                      )}
                      {/* Etiqueta de destaque ou blindado */}
                      {vehicle.destaque ? (
                        <figcaption className="absolute -rotate-45 bg-yellow-500 text-white text-xs font-bold px-10 py-[0.20rem] top-6 -left-9 uppercase">
                          Destaque
                        </figcaption>
                      ) : (
                        vehicle.opcionais?.blindado && (
                          <figcaption className="absolute -rotate-45 bg-slate-900 text-white text-xs font-bold px-10 py-[0.20rem] top-6 -left-9 uppercase">
                            Blindado
                          </figcaption>
                        )
                      )}
                      {vehicle.imagens && vehicle.imagens.length > 0 && (
                        <div className="absolute flex gap-1 justify-center items-center bottom-2 right-2 rounded-xl font-bold text-white bg-black/[0.5] text-sm py-[0.10rem] px-2">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="!w-[18px] !h-[18px]">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                              <path fillRule="evenodd" clipRule="evenodd" d="M9.77778 21H14.2222C17.3433 21 18.9038 21 20.0248 20.2646C20.51 19.9462 20.9267 19.5371 21.251 19.0607C22 17.9601 22 16.4279 22 13.3636C22 10.2994 22 8.76721 21.251 7.6666C20.9267 7.19014 20.51 6.78104 20.0248 6.46268C19.3044 5.99013 18.4027 5.82123 17.022 5.76086C16.3631 5.76086 15.7959 5.27068 15.6667 4.63636C15.4728 3.68489 14.6219 3 13.6337 3H10.3663C9.37805 3 8.52715 3.68489 8.33333 4.63636C8.20412 5.27068 7.63685 5.76086 6.978 5.76086C5.59733 5.82123 4.69555 5.99013 3.97524 6.46268C3.48995 6.78104 3.07328 7.19014 2.74902 7.6666C2 8.76721 2 10.2994 2 13.3636C2 16.4279 2 17.9601 2.74902 19.0607C3.07328 19.5371 3.48995 19.9462 3.97524 20.2646C5.09624 21 6.65675 21 9.77778 21ZM12 9.27273C9.69881 9.27273 7.83333 11.1043 7.83333 13.3636C7.83333 15.623 9.69881 17.4545 12 17.4545C14.3012 17.4545 16.1667 15.623 16.1667 13.3636C16.1667 11.1043 14.3012 9.27273 12 9.27273ZM12 10.9091C10.6193 10.9091 9.5 12.008 9.5 13.3636C9.5 14.7192 10.6193 15.8182 12 15.8182C13.3807 15.8182 14.5 14.7192 14.5 13.3636C14.5 12.008 13.3807 10.9091 12 10.9091ZM16.7222 10.0909C16.7222 9.63904 17.0953 9.27273 17.5556 9.27273H18.6667C19.1269 9.27273 19.5 9.63904 19.5 10.0909C19.5 10.5428 19.1269 10.9091 18.6667 10.9091H17.5556C17.0953 10.9091 16.7222 10.5428 16.7222 10.0909Z" fill="#ffffff"></path>
                            </g>
                          </svg>
                          <span>{vehicle.imagens.length}</span>
                        </div>
                      )}
                    </figure>

                    {/* Título com hover laranja */}
                    <h3 className="group-hover:text-orange-500 uppercase font-bold text-lg leading-5 text-neutral-700 md:min-h-[80px]">
                      {vehicle.marca} {vehicle.modelo} {vehicle.anoFabricacao}
                    </h3>

                    {/* Detalhes adicionais */}
                    <div className="flex items-center gap-2 h-[35px]">
                      <div className="grow">
                        <figure>
                          <Image
                            src={`/icons/${vehicle.marca.toLowerCase().replace(/ /g, '-')}.png`}
                            alt={vehicle.marca}
                            width={40}
                            height={40}
                            className="mr-2"
                          />
                        </figure>
                      </div>
                      <div className="flex justify-end flex-col">
                        <div className="text-sm text-right">
                          Ano: <strong>{vehicle.anoFabricacao}/{vehicle.anoModelo}</strong>
                        </div>
                        <div className="text-sm text-right">
                          Câmbio: <strong>{vehicle.transmissao}</strong>
                        </div>
                      </div>
                    </div>

                    <hr className="border-b w-full" />

                    {/* Quilometragem e Combustível */}
                    <div className="flex justify-between items-center gap-2">
                      <div className="text-gray-600 text-sm flex gap-1">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="!w-[18px] !h-[18px]">
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                          <g id="SVGRepo_iconCarrier">
                            <path d="M19 19L17.5 17.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path>
                            <path d="M19 5L17.5 6.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path>
                            <path d="M5 19L6.5 17.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path>
                            <path d="M5 5L6.5 6.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path>
                            <path d="M2 12H4" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path>
                            <path d="M19.9998 12L21.9998 12" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path>
                            <path d="M12 4.00021L12 2.00021" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path>
                            <path d="M13.7781 14.364C14.9497 13.1924 14.9497 11.2929 13.7781 10.1214C12.6065 8.94978 10.707 8.94978 9.53545 10.1214C9.0898 10.567 8.77857 11.4921 8.56396 12.4675C8.24305 13.926 8.08259 14.6553 8.66339 15.2361C9.24419 15.8169 9.97346 15.6564 11.432 15.3355C12.4073 15.1209 13.3324 14.8096 13.7781 14.364Z" stroke="#000000" strokeWidth="1.5"></path>
                            <path d="M9 21.5422C4.94289 20.2679 2 16.4776 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 16.4776 19.0571 20.2679 15 21.5422" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path>
                          </g>
                        </svg>
                        {vehicle.quilometragem} Km
                      </div>
                      <div className="text-gray-600 text-sm flex gap-1">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="!w-[18px] !h-[18px]">
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                          <g id="SVGRepo_iconCarrier">
                            <path d="M15.2683 18.2287C13.2889 20.9067 12.2992 22.2458 11.3758 21.9628C10.4525 21.6798 10.4525 20.0375 10.4525 16.7528L10.4526 16.4433C10.4526 15.2585 10.4526 14.6662 10.074 14.2946L10.054 14.2754C9.6673 13.9117 9.05079 13.9117 7.81775 13.9117C5.59888 13.9117 4.48945 13.9117 4.1145 13.2387C4.10829 13.2276 4.10225 13.2164 4.09639 13.205C3.74244 12.5217 4.3848 11.6526 5.66953 9.91436L8.73167 5.77133C10.711 3.09327 11.7007 1.75425 12.6241 2.03721C13.5474 2.32018 13.5474 3.96249 13.5474 7.24712V7.55682C13.5474 8.74151 13.5474 9.33386 13.926 9.70541L13.946 9.72466C14.3327 10.0884 14.9492 10.0884 16.1822 10.0884C18.4011 10.0884 19.5106 10.0884 19.8855 10.7613C19.8917 10.7724 19.8977 10.7837 19.9036 10.795C20.2576 11.4784 19.6152 12.3475 18.3304 14.0857" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"></path>
                          </g>
                        </svg>
                        {vehicle.combustivel}
                      </div>
                    </div>
                  </a>
                </Link>

                {/* Preço e Botões de Ação */}
                <div className="flex flex-wrap w-full">
                  <div className="flex grow justify-center items-baseline py-3 bg-gray-200 text-neutral-700 font-extrabold text-2xl">
                    <small className="text-xs font-bold">R$</small>
                    {parseFloat(vehicle.valorVenda).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                  <button
                    title={`Chame no WhatsApp para saber mais sobre ${vehicle.marca} ${vehicle.modelo} ${vehicle.anoFabricacao}`}
                    className="w-full py-4 grow flex justify-center items-center gap-3 font-bold uppercase text-white bg-green-700 cursor-pointer hover:bg-green-500 transition-all ease-out duration-150"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="text-[22px]" />
                    Chame no WhatsApp
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-700">Nenhum veículo encontrado.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
