import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Image from 'next/image';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

// Componentes auxiliares
const MetricCard = ({ title, value, color }) => (
  <div className="bg-white shadow rounded-lg p-4 text-center">
    <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
    <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

const VehicleChart = ({ totalCarros, totalMotos }) => {
  const chartOptions = {
    chart: {
      type: 'pie',
    },
    labels: ['Carros', 'Motos'],
    colors: ['#4A90E2', '#E74C3C'],
    fill: {
      type: 'gradient',
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: '100%',
          },
        },
      },
    ],
  };

  const chartSeries = [totalCarros, totalMotos];

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-500 text-center mb-4">Proporção Carros para Motos</h3>
      <div className="flex justify-center">
        <ApexCharts options={chartOptions} series={chartSeries} type="pie" width={360} />
      </div>
    </div>
  );
};

const BrandList = ({ title, data, color }) => (
  <div className="bg-white shadow rounded-lg p-4">
    <h2 className={`text-lg font-semibold mb-4 ${color}`}>{title}</h2>
    <div className="space-y-3">
      {Object.entries(data).map(([marca, quantidade]) => (
        <div key={marca} className="flex items-center">
          <Image src={`/icons/${marca.toLowerCase()}.png`} alt={marca} width={30} height={30} className="mr-3" />
          <p className="text-sm text-gray-700">{marca}</p>
          <span className="ml-auto text-lg font-bold text-gray-900">{quantidade}</span>
        </div>
      ))}
    </div>
  </div>
);

const FinancingSimulation = ({ simulacoes }) => (
  <div className="bg-white shadow rounded-lg p-4">
    <h2 className="text-lg font-semibold text-gray-600 mb-4">Últimas Simulações de Financiamento</h2>
    <div className="space-y-4">
      {simulacoes.slice(0, 3).map((simulacao, index) => (
        <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-800 font-semibold">{simulacao.nome}</p>
              <p className="text-gray-500">
                Entrada: R$ {simulacao.entrada?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-gray-500">
                Parcelas: {simulacao.parcelas}x de R${' '}
                {simulacao.parcelaEstimada?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-sm text-gray-400">
              {new Date(simulacao.createdAt).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MessageList = ({ mensagens }) => (
  <div className="bg-white shadow rounded-lg p-4">
    <h2 className="text-lg font-semibold text-yellow-600 mb-4">Últimas Mensagens</h2>
    <div className="space-y-4">
      {mensagens.slice(0, 3).map((mensagem, index) => (
        <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
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
);

const Overview = () => {
  const [carrosPorMarca, setCarrosPorMarca] = useState({});
  const [motosPorMarca, setMotosPorMarca] = useState({});
  const [totalCarros, setTotalCarros] = useState(0);
  const [totalMotos, setTotalMotos] = useState(0);
  const [simulacoesFinanciamento, setSimulacoesFinanciamento] = useState([]);
  const [mensagensRecebidas, setMensagensRecebidas] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [leadsAtribuidos, setLeadsAtribuidos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtém o token do localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado. Por favor, faça login.');
        }

        // Configura os cabeçalhos com o token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [veiculosRes, financiamentosRes, mensagensRes, usuarioRes, leadsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/vehicles`, config),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/financiamentos`, config),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/mensagens`, config),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, config), // Substitua pela rota correta
        ]);

        const veiculos = veiculosRes.data;
        const carros = veiculos.filter((veiculo) => veiculo.tipo === 'carros');
        const motos = veiculos.filter((veiculo) => veiculo.tipo === 'motos');

        const agruparPorMarca = (veiculos) =>
          veiculos.reduce((acc, veiculo) => {
            acc[veiculo.marca] = acc[veiculo.marca] ? acc[veiculo.marca] + 1 : 1;
            return acc;
          }, {});

        setCarrosPorMarca(agruparPorMarca(carros));
        setMotosPorMarca(agruparPorMarca(motos));
        setTotalCarros(carros.length);
        setTotalMotos(motos.length);
        setSimulacoesFinanciamento(financiamentosRes.data);
        setMensagensRecebidas(mensagensRes.data);
        setUsuario(usuarioRes.data); // Definir o usuário logado
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Ocorreu um erro ao carregar os dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalVeiculos = totalCarros + totalMotos;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bem-vindo, {usuario.nome}!</h1>
      <p className="text-lg text-gray-600 mb-8">Leads atribuídos a você: {usuario.leadsAtribuidos}</p>

      {/* Seção de métricas principais e gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-1 gap-4">
          <MetricCard title="Veículos Totais" value={totalVeiculos} color="text-gray-800" />
          <MetricCard title="Carros" value={totalCarros} color="text-blue-600" />
          <MetricCard title="Motos" value={totalMotos} color="text-red-600" />
        </div>
        <div className="lg:col-span-3">
          <VehicleChart totalCarros={totalCarros} totalMotos={totalMotos} />
        </div>
      </div>

      {/* Listagem de Carros e Motos por marca */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <BrandList title="Carros Disponíveis por Marca" data={carrosPorMarca} color="text-blue-600" />
        <BrandList title="Motos Disponíveis por Marca" data={motosPorMarca} color="text-red-600" />
      </div>

      {/* Últimas simulações e mensagens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FinancingSimulation simulacoes={simulacoesFinanciamento} />
        <MessageList mensagens={mensagensRecebidas} />
      </div>
    </div>
  );
};

export default Overview;
