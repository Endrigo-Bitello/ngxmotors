import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Image from 'next/image';
import 'react-datepicker/dist/react-datepicker.css';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const Overview = () => {
  const [carrosPorMarca, setCarrosPorMarca] = useState({});
  const [motosPorMarca, setMotosPorMarca] = useState({});
  const [totalCarros, setTotalCarros] = useState(0);
  const [totalMotos, setTotalMotos] = useState(0);
  const [simulacoesFinanciamento, setSimulacoesFinanciamento] = useState([]);
  const [mensagensRecebidas, setMensagensRecebidas] = useState([]);

  useEffect(() => {
    fetchDadosVeiculos();
    fetchSimulacoesFinanciamento();
    fetchMensagensRecebidas();
  }, []);

  const fetchDadosVeiculos = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/vehicles`);
      const veiculos = response.data;

      const carros = veiculos.filter((veiculo) => veiculo.tipo === 'carros');
      const motos = veiculos.filter((veiculo) => veiculo.tipo === 'motos');

      const carrosAgrupados = carros.reduce((acc, carro) => {
        acc[carro.marca] = acc[carro.marca] ? acc[carro.marca] + 1 : 1;
        return acc;
      }, {});

      const motosAgrupadas = motos.reduce((acc, moto) => {
        acc[moto.marca] = acc[moto.marca] ? acc[moto.marca] + 1 : 1;
        return acc;
      }, {});

      setCarrosPorMarca(carrosAgrupados);
      setMotosPorMarca(motosAgrupadas);
      setTotalCarros(carros.length);
      setTotalMotos(motos.length);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    }
  };

  const fetchSimulacoesFinanciamento = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/financiamentos`);
      setSimulacoesFinanciamento(response.data);
    } catch (error) {
      console.error('Erro ao buscar simulações de financiamento:', error);
    }
  };

  const fetchMensagensRecebidas = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/mensagens`);
      setMensagensRecebidas(response.data);
    } catch (error) {
      console.error('Erro ao buscar mensagens recebidas:', error);
    }
  };

  const totalVeiculos = totalCarros + totalMotos;
  const proporcaoCarrosParaMotos = totalMotos > 0 ? (totalCarros / totalMotos).toFixed(2) : 'N/A';
  const chartOptions = {
    chart: {
      type: 'pie',
    },
    labels: ['Carros', 'Motos'],
    colors: ['#4A90E2', '#E74C3C'], // Azul para Carros, Vermelho para Motos
    fill: {
      type: 'gradient',
    },
    responsive: [
      {
        breakpoint: 768, // Responsivo para mobile
        options: {
          chart: {
            width: 280,
          },
        },
      },
    ],
  };

  const chartSeries = [totalCarros, totalMotos];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Visão Geral</h1>

      {/* Seção de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white shadow-xl rounded-lg p-6 text-center hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-500">Veículos Totais</h3>
          <p className="text-5xl font-bold text-gray-800 mt-4">{totalVeiculos}</p>
        </div>
        <div className="bg-white shadow-xl rounded-lg p-6 text-center hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-500">Carros</h3>
          <p className="text-5xl font-bold text-blue-600 mt-4">{totalCarros}</p>
        </div>
        <div className="bg-white shadow-xl rounded-lg p-6 text-center hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-500">Motos</h3>
          <p className="text-5xl font-bold text-red-600 mt-4">{totalMotos}</p>
        </div>
      </div>

      {/* Gráfico de proporção de veículos */}
      <div className="bg-white shadow-xl rounded-lg p-6 mb-12">
        <h3 className="text-lg font-semibold text-gray-500 text-center mb-6">Proporção Carros para Motos</h3>
        <div className="flex justify-center">
          <ApexCharts options={chartOptions} series={chartSeries} type="pie" width={360} />
        </div>
      </div>

      {/* Listagem de Carros e Motos por marca */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white shadow-xl rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-6">Carros Disponíveis por Marca</h2>
          <div className="space-y-4">
            {Object.entries(carrosPorMarca).map(([marca, quantidade]) => (
              <div key={marca} className="flex items-center">
                <Image src={`/icons/${marca.toLowerCase()}.png`} alt={marca} width={40} height={40} className="mr-4" />
                <p className="text-gray-700 font-medium">{marca}</p>
                <span className="ml-auto text-lg font-bold text-gray-900">{quantidade}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-6">Motos Disponíveis por Marca</h2>
          <div className="space-y-4">
            {Object.entries(motosPorMarca).map(([marca, quantidade]) => (
              <div key={marca} className="flex items-center">
                <Image src={`/icons/${marca.toLowerCase()}.png`} alt={marca} width={40} height={40} className="mr-4" />
                <p className="text-gray-700 font-medium">{marca}</p>
                <span className="ml-auto text-lg font-bold text-gray-900">{quantidade}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Últimas simulações de financiamento */}
      <div className="bg-white shadow-xl rounded-lg p-6 mb-12">
        <h2 className="text-xl font-semibold text-gray-600 mb-6">Últimas Simulações de Financiamento</h2>
        <div className="space-y-6">
          {simulacoesFinanciamento.slice(0, 3).map((simulacao, index) => (
            <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-800 font-semibold">{simulacao.nome}</p>
                  <p className="text-gray-500">Entrada: R$ {simulacao.entrada?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p className="text-gray-500">Parcelas: {simulacao.parcelas}x de R$ {simulacao.parcelaEstimada?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(simulacao.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Últimas mensagens recebidas */}
      <div className="bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-xl font-semibold text-yellow-600 mb-6">Últimas Mensagens</h2>
        <div className="space-y-6">
          {mensagensRecebidas.slice(0, 3).map((mensagem, index) => (
            <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-800 font-semibold">De: {mensagem.nome}</p>
                  <p className="text-gray-500">{mensagem.mensagem}</p>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(mensagem.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
