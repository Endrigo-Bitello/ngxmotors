import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';;
import { setSEO } from './../utils/seo';
import Image from 'next/image';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const GoogleMaps = dynamic(() => import('./components/GoogleMaps'), { ssr: false });
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { whatsappWhite } from '@/utils/share';
const Loading = dynamic(() => import('./components/Loading'), { ssr: false });


export default function FinanciamentoPage() {
  const router = useRouter();
  const { id } = router.query; // Obtém o customId do veículo pela URL
  const [vehicleData, setVehicleData] = useState(null); // Armazena os dados do veículo
  const [vehicles, setVehicles] = useState([]); // Lista de veículos
  const [loading, setLoading] = useState(true); // Controla o estado de loading
  const [etapa, setEtapa] = useState(1); // Controla a etapa do processo
  const [entrada, setEntrada] = useState(''); // Valor da entrada
  const [parcelas, setParcelas] = useState(48); // Parcelas selecionadas
  const [parcelaEstimada, setParcelaEstimada] = useState(0); // Estimativa da parcela
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('');
  const [isEntradaValida, setIsEntradaValida] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [settings, setSettings] = useState(null);
  const [mensagem, setMensagem] = useState(null);


  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/get-settings`);
      setSettings(data);
    } catch (error) {
      console.error('Erro ao buscar as configurações:', error);
    }
  };

  useEffect(() => {
    fetchSettings(); // Busca as configurações quando o componente é montado
  }, []);

  useEffect(() => {
    if (settings) {
      setSEO({
        title: `${settings.name} - Conheça nosso estoque de Veículos Novos, Seminovos e Usados!`,
        metaDescription: `Bem-vindo à ${settings.name}, sua referência em veículos de qualidade. 
        Localizados em ${settings.address}, oferecemos um atendimento personalizado para ajudá-lo a encontrar o carro ideal. 
        Fale conosco pelo WhatsApp ${settings.whatsappNumber} e visite-nos durante nosso 
        horário de funcionamento: ${settings.openingHours}. 
        Conquiste seu próximo veículo com confiança e segurança.`
      });
    }
  }, [settings]);

  const fetchVehicleData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/vehicles/${id}`); // Busca pelo customId
      setVehicleData(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar o veículo:', error);
      setLoading(false);
    }
  };

  // Função para ordenar os veículos
  const handleSortOrder = (order) => {
    setSortOrder(order);

    // Clona a lista de veículos antes de ordenar
    let sortedVehicles = [...vehicles];

    if (order === 'menor') {
      // Ordena por menor preço
      sortedVehicles.sort((a, b) => a.valorVenda - b.valorVenda);
    } else if (order === 'maior') {
      // Ordena por maior preço
      sortedVehicles.sort((a, b) => b.valorVenda - a.valorVenda);
    }

    // Atualiza o estado com a lista ordenada
    setVehicles(sortedVehicles);
  };

  const getImagePath = (vehicle) => {
    if (vehicle.imagens && vehicle.imagens.length > 0) {
      return vehicle.imagens[0]; // Supondo que seja a URL completa
    }
    return '/images/placeholder.png'; // Imagem placeholder caso não haja fotos
  };

  // Funções de formatação
  const formatCurrency = (value) => {
    if (!value) return '';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os primeiros 3 dígitos
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os próximos 3 dígitos
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona hífen antes dos últimos 2 dígitos
  };

  const formatPhone = (value) => {
    return value
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/^(\d{2})(\d)/g, '($1) $2') // Adiciona parênteses no DDD
      .replace(/(\d{5})(\d{4})$/, '$1-$2'); // Adiciona hífen no número
  };

  const handleCPFChange = (e) => {
    setCpf(formatCPF(e.target.value));
  };

  const handleTelefoneChange = (e) => {
    setTelefone(formatPhone(e.target.value));
  };

  // Função para listar todos os veículos
  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/vehicles`);
      setVehicles(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      setLoading(false);
    }
  };

  // Função para calcular a parcela estimada do financiamento
  const calcularParcela = () => {
    if (vehicleData) {
      const valorFinanciado = vehicleData.valorVenda - parseFloat(entrada);
      const taxaJuros = 0.022; // Exemplo de taxa de juros de 2,2% ao mês
      const valorParcela = (valorFinanciado * taxaJuros) / (1 - Math.pow(1 + taxaJuros, -parcelas));
      setParcelaEstimada(valorParcela);
    } else {
      alert('Por favor, preencha o valor de entrada corretamente.');
    }
  };

  const prosseguirParaDados = () => {
    setEtapa(2);
  };



  const enviarSimulacao = async () => {
    try {
      // Faz a requisição POST para enviar os dados do formulário de simulação
      const resSimulacao = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/financiamentos`, {
        nome,
        email,
        telefone,
        cpf,
        entrada: parseFloat(entrada),
        parcelas,
        parcelaEstimada,
        customId: vehicleData?.customId || '', // Inclui o customId do veículo se disponível
      });

      // Verifica a resposta da API de simulação
      if (resSimulacao.status === 201) {
        // Agora, faz o envio do lead com a customId
        const resLead = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes/simulacao`, {
          nome,
          email,
          telefone,
          etapa: 'Novo Lead', // Definindo como "Novo Lead"
          fonteLead: 'Simulação', // Fonte do lead é a simulação
          customId: vehicleData?.customId || '', // Inclui o customId do veículo se disponível
        });

        // Verifica a resposta da API de lead e exibe mensagem de sucesso
        if (resLead.status === 201) {
          setMensagem({
            tipo: 'sucesso',
            texto: 'Simulação enviada com sucesso!',
          });

          // Limpa os campos do formulário após o envio
          setNome('');
          setEmail('');
          setTelefone('');
          setCpf('');
          setEntrada('');
          setParcelas(12); // Volta para 12 parcelas como padrão
          setParcelaEstimada(0);
          setEtapa(1); // Volta para a primeira etapa
        }
      }
    } catch (error) {
      console.error('Erro ao enviar a simulação ou criar lead:', error);

      // Exibe uma mensagem de erro ao usuário
      setMensagem({
        tipo: 'erro',
        texto: 'Erro ao enviar a simulação ou criar lead. Por favor, tente novamente.',
      });
    }
  };



  useEffect(() => {
    if (id) {
      fetchVehicleData(); // Busca o veículo se houver ID (customId)
    } else {
      fetchVehicles(); // Busca todos os veículos se não houver ID
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }


  if (!id) {
    // Renderiza a listagem de veículos se não houver ID
    return (
      <>
        <div className="bg-gray-100 min-h-screen flex flex-col">
          {/* Navbar */}
          <Navbar />
          <section className="text-center mb-10 px-4 lg:px-16 py-8">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800 mb-4">
              Simule o Financiamento do Seu Próximo Veículo!
            </h1>
            <p className="text-base lg:text-lg text-gray-600 mb-2">
              Aqui na nossa empresa, oferecemos as melhores soluções de financiamento para você adquirir seu veículo de forma rápida e fácil.
            </p>
            <p className="text-base lg:text-lg text-gray-600 mb-4">
              Escolha um veículo abaixo e descubra como é simples simular seu financiamento. Garantimos uma experiência sem complicações, com as melhores condições do mercado.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-start gap-4 sm:gap-6 mb-6">
              <div className="flex items-center text-green-600">
                <FontAwesomeIcon icon={faCheckCircle} className="text-2xl mr-2 align-middle" />
                <span className="text-base lg:text-lg">Soluções rápidas</span>
              </div>
              <div className="flex items-center text-green-600">
                <FontAwesomeIcon icon={faCheckCircle} className="text-2xl mr-2 align-middle" />
                <span className="text-base lg:text-lg">Sem burocracia</span>
              </div>
              <div className="flex items-center text-green-600">
                <FontAwesomeIcon icon={faCheckCircle} className="text-2xl mr-2 align-middle" />
                <span className="text-base lg:text-lg">Condições especiais</span>
              </div>
            </div>

          </section>



          {/* Conteúdo principal */}
          <main className="container mx-auto p-6 flex-grow">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Veículos Usados, seminovos e Novos à venda</h1>
                <p className="text-lg text-gray-600">
                  {vehicles.length} {vehicles.length === 1 ? 'veículo disponível' : 'veículos disponíveis'}
                </p>
              </div>
              {/* Colocar o botão de ordenar aqui */}
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="border border-gray-400 rounded-md px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Ordenar
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M21.63 14.75C21.63 15.64 21.38 16.48 20.94 17.2C20.12 18.58 18.61 19.5 16.88 19.5C15.15 19.5 13.64 18.57 12.82 17.2C12.38 16.49 12.13 15.64 12.13 14.75C12.13 12.13 14.26 10 16.88 10C19.5 10 21.63 12.13 21.63 14.75Z"
                        stroke="#000000"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M18.66 14.73H15.11"
                        stroke="#000000"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M16.88 13V16.55"
                        stroke="#000000"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M20.6901 4.02002V6.23999C20.6901 7.04999 20.1801 8.06001 19.6801 8.57001L17.9201 10.12C17.5901 10.04 17.2401 10 16.8801 10C14.2601 10 12.1301 12.13 12.1301 14.75C12.1301 15.64 12.3801 16.48 12.8201 17.2C13.1901 17.82 13.7001 18.35 14.3201 18.73V19.07C14.3201 19.68 13.9201 20.49 13.4101 20.79L12.0001 21.7C10.6901 22.51 8.87006 21.6 8.87006 19.98V14.63C8.87006 13.92 8.46006 13.01 8.06006 12.51L4.22006 8.46997C3.72006 7.95997 3.31006 7.05001 3.31006 6.45001V4.12C3.31006 2.91 4.22006 2 5.33006 2H18.6701C19.7801 2 20.6901 2.91002 20.6901 4.02002Z"
                        stroke="#000000"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </g>
                  </svg>
                </button>

                {/* Dropdown de opções */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <button
                        onClick={() => handleSortOrder('menor')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                          <g id="SVGRepo_iconCarrier">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M17 3.25C17.4142 3.25 17.75 3.58579 17.75 4V17.75L19.4 15.55C19.6485 15.2186 20.1186 15.1515 20.45 15.4C20.7814 15.6485 20.8485 16.1186 20.6 16.45L17.6 20.45C17.4063 20.7083 17.0691 20.8136 16.7628 20.7115C16.4566 20.6094 16.25 20.3228 16.25 20V4C16.25 3.58579 16.5858 3.25 17 3.25Z"
                              fill="#1C274C"
                            ></path>
                            <path d="M3.25 16C3.25 15.5858 3.58579 15.25 4 15.25H13C13.4142 15.25 13.75 15.5858 13.75 16C13.75 16.4142 13.4142 16.75 13 16.75H4C3.58579 16.75 3.25 16.4142 3.25 16Z" fill="#1C274C"></path>
                            <path
                              opacity="0.7"
                              d="M5.25 11C5.25 10.5858 5.58579 10.25 6 10.25H13C13.4142 10.25 13.75 10.5858 13.75 11C13.75 11.4142 13.4142 11.75 13 11.75H6C5.58579 11.75 5.25 11.4142 5.25 11Z"
                              fill="#1C274C"
                            ></path>
                            <path
                              opacity="0.4"
                              d="M7.25 6C7.25 5.58579 7.58579 5.25 8 5.25H13C13.4142 5.25 13.75 5.58579 13.75 6C13.75 6.41421 13.4142 6.75 13 6.75H8C7.58579 6.75 7.25 6.41421 7.25 6Z"
                              fill="#1C274C"
                            ></path>
                          </g>
                        </svg>
                        Menor preço
                      </button>

                      <button
                        onClick={() => handleSortOrder('maior')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                          <g id="SVGRepo_iconCarrier">
                            <path d="M4 8H13" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></path>
                            <path opacity="0.7" d="M6 13H13" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></path>
                            <path opacity="0.4" d="M8 18H13" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></path>
                            <path
                              d="M17 20V4L20 8"
                              stroke="#1C274C"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </g>
                        </svg>
                        Maior preço
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {loading && <Loading />}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <div key={vehicle.customId} className="flex flex-col gap-4 group hover:bg-gray-50">
                    <Link
                      key={vehicle.customId}
                      href={`/${vehicle.tipo === 'motos' ? 'motos' : 'carros'}/${vehicle.marca.toLowerCase()}/${vehicle.modelo.toLowerCase().replace(/\s+/g, '-')}-${vehicle.customId}`} // Verifica o tipo de veículo
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
                                className="rounded-sm"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                              Sem imagem
                            </div>
                          )}
                          {/* Etiqueta de destaque ou blindado */}
                          {vehicle.destaque ? (
                            <figcaption className="absolute bg-custom-linear-gradient -rotate-45 bg-yellow-500 text-white text-xs font-bold px-10 py-[0.20rem] top-6 -left-9 uppercase">
                              Destaque
                            </figcaption>
                          ) : (
                            vehicle.opcionais?.blindado && (
                              <figcaption className="absolute bg-custom-blindado-gradient -rotate-45 bg-slate-900 text-white text-xs font-bold px-10 py-[0.20rem] top-6 -left-9 uppercase">
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
                            {vehicle.quilometragem.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Km
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
                        title={`Chame no WhatsApp para saber mais sobre ${vehicle.modelo} ${vehicle.modelo} ${vehicle.anoFabricacao}`}
                        onClick={() => window.open(`https://wa.me/${settings.whatsappNumber}?text=Quero mais informações sobre o veículo ${vehicle.marca.toUpperCase()} ${vehicle.modelo.toUpperCase()}`, '_blank')}
                        className="w-full py-4 grow flex justify-center items-center gap-3 font-bold uppercase text-white bg-green-700 cursor-pointer hover:bg-green-500 transition-all ease-out duration-150"
                      >
                        {whatsappWhite}
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
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto p-6">

        {mensagem && (
          <div
            className={`${mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              } border ${mensagem.tipo === 'sucesso' ? 'border-green-500' : 'border-red-500'
              } px-4 py-3 rounded mb-6`}
          >
            {mensagem.texto}
          </div>
        )}

        {vehicleData && etapa === 1 && (
          <div className="bg-white p-6 shadow-lg rounded-lg mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-center gap-6 mb-6 border border-gray-200">
              <div className="w-full sm:w-56 h-40 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                <div className="relative w-full h-full">
                  <Image
                    src={getImagePath(vehicleData)}
                    alt={`${vehicleData.marca} ${vehicleData.modelo}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
              <div className="text-center sm:text-left flex flex-col justify-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {vehicleData.marca} {vehicleData.modelo} ({vehicleData.anoModelo})
                </h2>
                <p className="text-gray-600 text-base mt-2">
                  {vehicleData.tipoCombustivel} • {vehicleData.transmissao}
                </p>
                <p className="text-blue-500 font-semibold text-lg mt-4">
                  {formatCurrency(vehicleData.valorVenda)}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Simule o seu Financiamento</h3>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-gray-700 mb-2">
                      Valor de Entrada (mínimo de {settings.taxaString}):
                    </label>
                    <input
                      type="text"
                      value={entrada !== '' ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(entrada) : ''}
                      onChange={(e) => {
                        const numericValue = parseFloat(e.target.value.replace(/\D/g, '')) / 100;
                        const formattedValue = isNaN(numericValue) ? '' : numericValue.toFixed(2);
                        setEntrada(formattedValue);

                        // Validação: verifica se o valor de entrada é maior ou igual ao valor da taxa configurada no .env
                        const taxaEntrada = parseFloat(settings.taxaValue) / 100;
                        const valorMinimoEntrada = vehicleData.valorVenda * taxaEntrada;

                        // Verifica se o valor de entrada é válido
                        if (numericValue >= valorMinimoEntrada && numericValue <= vehicleData.valorVenda) {
                          setIsEntradaValida(true); // Entrada é válida
                        } else {
                          setIsEntradaValida(false); // Entrada é inválida (menor que o mínimo ou maior que o valor do carro)
                        }
                      }}
                      placeholder={`Mínimo: ${formatCurrency(vehicleData.valorVenda * (parseFloat(settings.taxaValue) / 100))}`}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${isEntradaValida ? 'border-green-500 focus:ring-green-200' : 'border-red-500 focus:ring-red-200'
                        }`}
                    />

                    {/* Exibição de mensagem de erro se a entrada for maior que o valor do carro */}
                    {entrada > vehicleData.valorVenda && (
                      <p className="text-red-500 text-sm mt-2">
                        O valor de entrada não pode ser maior que o valor de venda do veículo.
                      </p>
                    )}


                    {/* Ícone de feedback visual */}
                    {entrada && (
                      <span className="absolute right-4 top-10">
                        <FontAwesomeIcon
                          icon={isEntradaValida ? faCheckCircle : faTimesCircle}
                          className={`text-2xl ${isEntradaValida ? 'text-green-500' : 'text-red-500'}`}
                        />
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Quantidade de Parcelas</label>
                    <select
                      value={parcelas}
                      onChange={(e) => setParcelas(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={12}>12x</option>
                      <option value={24}>24x</option>
                      <option value={36}>36x</option>
                      <option value={48}>48x</option>
                      <option value={60}>60x</option>
                    </select>
                  </div>
                </div>

                {/* Botão desabilitado se o valor de entrada não for válido */}
                <button
                  type="button"
                  onClick={calcularParcela}
                  disabled={!isEntradaValida}
                  className={`mt-6 w-full font-semibold py-3 rounded-lg transition-colors ${isEntradaValida ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  Calcular Financiamento
                </button>
              </form>
            </div>

            {parcelaEstimada > 0 && (
              <div className="bg-gray-100 p-6 shadow-lg rounded-lg mt-8">
                <h3 className="text-xl font-bold mb-4">Resultado da Simulação</h3>
                <p className="text-gray-700 mb-2">
                  Valor Financiado: <strong>{formatCurrency(vehicleData.valorVenda - entrada)}</strong>
                </p>
                <p className="text-gray-700 mb-2">
                  Parcelas de {parcelas}x: <strong>{formatCurrency(parcelaEstimada)}</strong>
                </p>
                <p className="text-sm text-gray-600 mt-4">
                  * Os valores apresentados são estimativas aproximadas. Para dados precisos, continue o processo de simulação.
                </p>
                <button
                  className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  onClick={prosseguirParaDados}
                >
                  Prosseguir com a Simulação
                </button>
              </div>
            )}
          </div>
        )}

        {etapa === 2 && (
          <div className="bg-white p-6 shadow-lg rounded-lg mb-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Informe seus dados para continuar</h2>
            <form className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Nome completo</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={telefone}
                    onChange={handleTelefoneChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="(99) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">CPF</label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={handleCPFChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="123.456.789-10"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setEtapa(1)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={enviarSimulacao}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Enviar Simulação
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
      <GoogleMaps />
      <Footer />
    </>
  );
}