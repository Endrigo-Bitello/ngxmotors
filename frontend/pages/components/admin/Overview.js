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
  const proporcaoMarcas = Object.keys(carrosPorMarca).length + Object.keys(motosPorMarca).length;

  // Configurações do gráfico de pizza com cores vibrantes
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

  const chartSeries = [totalCarros, totalMotos]; // Quantidade de Carros e Motos

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Visão geral</h1>

      {/* Grid com métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-100 shadow-lg p-6 rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-green-800">Veículos Totais</h3>
          <p className="text-4xl font-bold text-green-900">{totalVeiculos}</p>
        </div>
        <div className="bg-blue-100 shadow-lg p-6 rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-blue-800">Carros</h3>
          <p className="text-4xl font-bold text-blue-900">{totalCarros}</p>
        </div>
        <div className="bg-red-100 shadow-lg p-6 rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-red-800">Motos</h3>
          <p className="text-4xl font-bold text-red-900">{totalMotos}</p>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-700">Proporção Carros para Motos</h3>
          {/* Gráfico de Pizza */}
          <div className="flex justify-center mt-4">
            <ApexCharts options={chartOptions} series={chartSeries} type="pie" width={320} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Informações de Carros */}
        <div className="bg-blue-50 shadow-lg p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">Carros Disponíveis por Marca</h2>
          <div className="space-y-4">
            {Object.entries(carrosPorMarca).map(([marca, quantidade]) => (
              <div key={marca} className="flex items-center">
                <Image src={`/icons/${marca.toLowerCase()}.png`} alt={marca} width={40} height={40} className="mr-4" />
                <p className="text-gray-700 text-base font-medium">{marca}</p>
                <span className="ml-auto text-lg font-semibold text-gray-900">{quantidade}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Informações de Motos */}
        <div className="bg-red-50 shadow-lg p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 mb-4">Motos Disponíveis por Marca</h2>
          <div className="space-y-4">
            {Object.entries(motosPorMarca).map(([marca, quantidade]) => (
              <div key={marca} className="flex items-center">
                <Image src={`/icons/${marca.toLowerCase()}.png`} alt={marca} width={40} height={40} className="mr-4" />
                <p className="text-gray-700 text-base font-medium">{marca}</p>
                <span className="ml-auto text-lg font-semibold text-gray-900">{quantidade}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simulações de Financiamento */}
      <div className="bg-white shadow-lg p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Últimas simulações de financiamento</h2>
        <div className="space-y-4">
          {simulacoesFinanciamento.slice(0, 3).map((simulacao, index) => (
            <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg flex items-center">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700">Cliente: {simulacao.nome}</p>
                <p className="text-sm text-gray-600">Entrada: R$ {simulacao.entrada?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-sm text-gray-600">Parcelas: {simulacao.parcelas}x de R$ {simulacao.parcelaEstimada?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="ml-4 text-sm text-gray-400">
                {new Date(simulacao.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mensagens Recebidas */}
      <div className="bg-yellow-50 shadow-lg p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-yellow-800 mb-4">Últimas mensagens</h2>
        <div className="space-y-4">
          {mensagensRecebidas.slice(0, 3).map((mensagem, index) => (
            <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg flex items-center">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700">De: {mensagem.nome}</p>
                <p className="text-sm text-gray-600">{mensagem.mensagem}</p>
              </div>
              <div className="ml-4 text-sm text-gray-400">
                {new Date(mensagem.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
