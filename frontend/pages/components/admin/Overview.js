// components/Overview.js

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Image from 'next/image';
import {
  FaCar,
  FaMotorcycle,
  FaUsers,
  FaChartBar,
  FaDollarSign,
  FaClock,
  FaMapMarkerAlt,
} from 'react-icons/fa'; // Importação de ícones

import styles from './Overview.module.css'; // Importação do CSS module

// Importação dinâmica do ApexCharts para evitar problemas de SSR
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

// Componentes auxiliares

// Card de Métricas Aprimorado com Estilos Personalizados
const MetricCard = ({ title, value, color, icon }) => (
  <div
    className={`bg-gradient-to-r from-white via-gray-100 to-white shadow-lg rounded-lg p-6 flex items-center transition transform hover:scale-105 hover:shadow-2xl ${styles.metricCard}`}
  >
    <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
      {icon}
    </div>
    <div className="ml-4">
      <h3 className={`text-sm font-semibold text-gray-500 ${styles.metricTitle}`}>{title}</h3>
      <p className={`text-3xl font-bold mt-1 ${color} ${styles.metricValue}`}>{value}</p>
    </div>
  </div>
);

// Gráfico de Proporção de Veículos (Carros vs Motos) com Estilos Personalizados
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
    legend: {
      position: 'bottom',
      fontSize: '14px',
      labels: {
        colors: '#333',
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: '100%',
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  const chartSeries = [totalCarros, totalMotos];

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${styles.chartContainer}`}>
      <h3 className="text-sm font-semibold text-gray-500 text-center mb-4">Proporção de Veículos</h3>
      <div className="flex justify-center">
        <ApexCharts options={chartOptions} series={chartSeries} type="pie" width={360} />
      </div>
    </div>
  );
};

// Radar Chart para Comparação de Marcas de Carros e Motos
const RadarChart = ({ carBrands, motoBrands }) => {
  const chartOptions = {
    chart: {
      type: 'radar',
      toolbar: {
        show: false,
      },
      animations: {
        easing: 'easeinout',
        speed: 800,
      },
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColor: '#e0e0e0',
          fill: {
            colors: ['#f5f5f5', '#ffffff'],
          },
        },
      },
    },
    xaxis: {
      categories: ['Popularidade', 'Vendas', 'Satisfação', 'Inovação', 'Confiabilidade'],
      labels: {
        style: {
          colors: '#6B7280',
        },
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        style: {
          colors: '#6B7280',
        },
      },
    },
    colors: ['#4A90E2', '#E74C3C'],
    tooltip: {
      theme: 'dark',
    },
  };

  const chartSeries = [
    {
      name: 'Carros',
      data: [
        carBrands.popularity || 0,
        carBrands.sales || 0,
        carBrands.satisfaction || 0,
        carBrands.innovation || 0,
        carBrands.reliability || 0,
      ],
    },
    {
      name: 'Motos',
      data: [
        motoBrands.popularity || 0,
        motoBrands.sales || 0,
        motoBrands.satisfaction || 0,
        motoBrands.innovation || 0,
        motoBrands.reliability || 0,
      ],
    },
  ];

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${styles.radarChart}`}>
      <h3 className="text-sm font-semibold text-gray-500 text-center mb-4">Comparação de Marcas de Carros e Motos</h3>
      <div className="flex justify-center">
        <ApexCharts options={chartOptions} series={chartSeries} type="radar" height={350} />
      </div>
    </div>
  );
};

// Gráfico de Leads por Origem com Estilos Personalizados
const LeadsByOriginChart = ({ leadsPorOrigem }) => {
  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
      animations: {
        easing: 'easeinout',
        speed: 800,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: Object.keys(leadsPorOrigem),
      title: {
        text: 'Origem do Lead',
      },
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px',
          colors: '#6B7280',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Quantidade de Leads',
      },
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6B7280',
        },
      },
    },
    colors: ['#1E90FF'],
    grid: {
      borderColor: '#E5E7EB',
    },
    tooltip: {
      theme: 'dark',
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

  const chartSeries = [
    {
      name: 'Leads',
      data: Object.values(leadsPorOrigem),
    },
  ];

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${styles.chartContainer}`}>
      <h3 className="text-sm font-semibold text-gray-500 text-center mb-4">Leads por Origem</h3>
      <div className="flex justify-center">
        <ApexCharts options={chartOptions} series={chartSeries} type="bar" width={500} />
      </div>
    </div>
  );
};

// Gráfico de Distribuição de Etapas por Origem com Estilos Personalizados
const LeadsStageDistributionChart = ({ leadsPorOrigemEtapa }) => {
  const origins = Object.keys(leadsPorOrigemEtapa);
  const etapas = [
    'Novo Lead',
    'Qualificação',
    'Em Negociação',
    'Fechamento',
    'Pós Venda',
    'Perdidos',
  ];

  const series = etapas.map((etapa) => ({
    name: etapa,
    data: origins.map((origem) => leadsPorOrigemEtapa[origem][etapa] || 0),
  }));

  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      },
      animations: {
        easing: 'easeinout',
        speed: 800,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '50%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: origins,
      title: {
        text: 'Origem do Lead',
      },
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px',
          colors: '#6B7280',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Quantidade de Leads',
      },
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6B7280',
        },
      },
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: '#6B7280',
      },
    },
    colors: [
      '#4CAF50',
      '#FFC107',
      '#2196F3',
      '#9C27B0',
      '#FF5722',
      '#F44336',
    ],
    grid: {
      borderColor: '#E5E7EB',
    },
    tooltip: {
      theme: 'dark',
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: '100%',
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${styles.chartContainer}`}>
      <h3 className="text-sm font-semibold text-gray-500 text-center mb-4">Distribuição de Etapas por Origem</h3>
      <div className="flex justify-center">
        <ApexCharts options={chartOptions} series={series} type="bar" width={600} />
      </div>
    </div>
  );
};

// Gráfico de Tendência de Leads ao Longo do Tempo com Estilos Personalizados
const LeadsTrendChart = ({ leads }) => {
  // Processamento dos dados para o gráfico de linha
  const leadsByDate = leads.reduce((acc, lead) => {
    const date = new Date(lead.dataCriacao).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    acc[date] = acc[date] ? acc[date] + 1 : 1;
    return acc;
  }, {});

  const sortedDates = Object.keys(leadsByDate).sort(
    (a, b) => new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-'))
  );

  const chartOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
      animations: {
        easing: 'easeinout',
        speed: 800,
      },
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      categories: sortedDates,
      title: {
        text: 'Data de Criação',
      },
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px',
          colors: '#6B7280',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Quantidade de Leads',
      },
      min: 0,
      forceNiceScale: true,
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6B7280',
        },
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      size: 4,
      colors: ['#FF6384'],
      strokeColor: '#fff',
      strokeWidth: 2,
    },
    colors: ['#FF6384'],
    grid: {
      borderColor: '#E5E7EB',
    },
    tooltip: {
      theme: 'dark',
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

  const chartSeries = [
    {
      name: 'Leads',
      data: sortedDates.map((date) => leadsByDate[date]),
    },
  ];

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${styles.chartContainer}`}>
      <h3 className="text-sm font-semibold text-gray-500 text-center mb-4">Evolução de Leads ao Longo do Tempo</h3>
      <div className="flex justify-center">
        <ApexCharts options={chartOptions} series={chartSeries} type="line" width={500} />
      </div>
    </div>
  );
};

// Gráfico de Distribuição Geográfica dos Leads com Estilos Personalizados
const LeadsGeographicalChart = ({ leads }) => {
  // Processamento dos dados para o heatmap
  const leadsByCity = leads.reduce((acc, lead) => {
    const cidade = lead.cidade || 'Desconhecida';
    acc[cidade] = acc[cidade] ? acc[cidade] + 1 : 1;
    return acc;
  }, {});

  const chartOptions = {
    chart: {
      type: 'heatmap',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 5,
              color: '#E0F7FA',
              name: '0-5 Leads',
            },
            {
              from: 6,
              to: 10,
              color: '#4DD0E1',
              name: '6-10 Leads',
            },
            {
              from: 11,
              to: 20,
              color: '#00ACC1',
              name: '11-20 Leads',
            },
            {
              from: 21,
              to: 30,
              color: '#00838F',
              name: '21-30 Leads',
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'],
      },
    },
    xaxis: {
      categories: ['Cidade'],
      labels: {
        show: false,
      },
      title: {
        text: 'Cidade',
      },
    },
    yaxis: {
      categories: Object.keys(leadsByCity),
      title: {
        text: 'Quantidade de Leads',
      },
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6B7280',
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      labels: {
        colors: '#6B7280',
      },
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${val} Leads`,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: '100%',
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  const chartSeries = [
    {
      name: 'Leads',
      data: Object.values(leadsByCity),
    },
  ];

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${styles.chartContainer}`}>
      <h3 className="text-sm font-semibold text-gray-500 text-center mb-4">Distribuição Geográfica dos Leads</h3>
      <div className="flex justify-center">
        <ApexCharts options={chartOptions} series={chartSeries} type="heatmap" width={500} />
      </div>
    </div>
  );
};

// Lista de Marcas com Estilos Personalizados
const BrandList = ({ title, data, color }) => (
  <div className={`bg-white shadow rounded-lg p-6 ${styles.brandList}`}>
    <h2 className={`text-lg font-semibold mb-4 ${color} ${styles.brandTitle}`}>{title}</h2>
    <div className="space-y-3">
      {Object.entries(data).map(([marca, quantidade]) => (
        <div key={marca} className={`flex items-center ${styles.brandItem}`}>
          <Image src={`/icons/${marca.toLowerCase()}.png`} alt={marca} width={30} height={30} className="mr-3" />
          <p className="text-sm text-gray-700">{marca}</p>
          <span className="ml-auto text-lg font-bold text-gray-900">{quantidade}</span>
        </div>
      ))}
    </div>
  </div>
);

// Lista de Simulações de Financiamento com Estilos Personalizados
const FinancingSimulation = ({ simulacoes }) => (
  <div className={`bg-white shadow rounded-lg p-6 ${styles.simulationList}`}>
    <h2 className="text-lg font-semibold text-gray-600 mb-4">Últimas Simulações de Financiamento</h2>
    <div className="space-y-4">
      {simulacoes.slice(0, 3).map((simulacao, index) => (
        <div key={index} className={`bg-blue-50 border-l-4 border-blue-400 p-4 rounded ${styles.simulationItem}`}>
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

// Lista de Mensagens com Estilos Personalizados
const MessageList = ({ mensagens }) => (
  <div className={`bg-white shadow rounded-lg p-6 ${styles.messageList}`}>
    <h2 className="text-lg font-semibold text-yellow-600 mb-4">Últimas Mensagens</h2>
    <div className="space-y-4">
      {mensagens.slice(0, 3).map((mensagem, index) => (
        <div key={index} className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded ${styles.messageItem}`}>
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

// Componente Principal Overview com Estilos Personalizados
const Overview = () => {
  const [carrosPorMarca, setCarrosPorMarca] = useState({});
  const [motosPorMarca, setMotosPorMarca] = useState({});
  const [totalCarros, setTotalCarros] = useState(0);
  const [totalMotos, setTotalMotos] = useState(0);
  const [simulacoesFinanciamento, setSimulacoesFinanciamento] = useState([]);
  const [mensagensRecebidas, setMensagensRecebidas] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [leadsAtribuidos, setLeadsAtribuidos] = useState(0);
  const [leads, setLeads] = useState([]);
  const [leadsPorOrigem, setLeadsPorOrigem] = useState({});
  const [leadsPorOrigemEtapa, setLeadsPorOrigemEtapa] = useState({});
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

        // Realiza múltiplas requisições simultâneas
        const [
          veiculosRes,
          financiamentosRes,
          mensagensRes,
          usuarioRes,
          leadsRes,
        ] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/vehicles`, config),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/financiamentos`, config),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/mensagens`, config),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, config), // Rota para perfil do usuário
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes`, config), // Rota para leads
        ]);

        // Processamento de Veículos
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

        // Processamento de Simulações de Financiamento e Mensagens
        setSimulacoesFinanciamento(financiamentosRes.data);
        setMensagensRecebidas(mensagensRes.data);

        // Processamento do Usuário
        setUsuario(usuarioRes.data); // Definir o usuário logado

        // Processamento de Leads
        const leadsData = leadsRes.data;
        setLeads(leadsData);
        setLeadsAtribuidos(usuarioRes.data.leadsAtribuidos || 0);

        // Agrupar Leads por Origem
        const agrupadosPorOrigem = leadsData.reduce((acc, lead) => {
          const origem = lead.fonteLead || 'Desconhecida';
          acc[origem] = acc[origem] ? acc[origem] + 1 : 1;
          return acc;
        }, {});
        setLeadsPorOrigem(agrupadosPorOrigem);

        // Agrupar Leads por Origem e Etapa
        const agrupadosPorOrigemEtapa = leadsData.reduce((acc, lead) => {
          const origem = lead.fonteLead || 'Desconhecida';
          const etapa = lead.etapa || 'Desconhecida';
          if (!acc[origem]) {
            acc[origem] = {};
          }
          acc[origem][etapa] = acc[origem][etapa] ? acc[origem][etapa] + 1 : 1;
          return acc;
        }, {});
        setLeadsPorOrigemEtapa(agrupadosPorOrigemEtapa);
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

  // Dados para o RadarChart (exemplo)
  // Supondo que temos dados agregados para cada marca
  const carBrandsData = {
    popularity: 80,
    sales: 70,
    satisfaction: 85,
    innovation: 75,
    reliability: 90,
  };

  const motoBrandsData = {
    popularity: 75,
    sales: 65,
    satisfaction: 80,
    innovation: 70,
    reliability: 85,
  };

  return (
    <div className={`p-8 bg-gradient-to-tr from-gray-100 via-gray-200 to-gray-100 min-h-screen ${styles.dashboardContainer}`}>
      {/* Título e Saudação */}
      <div className={`mb-8 ${styles.header}`}>
        <h1 className="text-5xl font-extrabold text-gray-800 mb-2">Olá, {usuario.nome}</h1>
        <p className="text-xl text-gray-600">
          Há <span className="text-blue-600 font-semibold">{leadsAtribuidos}</span> leads atribuídos à você!
        </p>
      </div>

      {/* Seção de Métricas Principais */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 ${styles.metricsSection}`}>
        <MetricCard
          title="Veículos Totais"
          value={totalVeiculos}
          color="text-gray-800"
          icon={<FaChartBar className="text-gray-800" size={24} />}
        />
        <MetricCard
          title="Carros"
          value={totalCarros}
          color="text-blue-600"
          icon={<FaCar className="text-blue-600" size={24} />}
        />
        <MetricCard
          title="Motos"
          value={totalMotos}
          color="text-red-600"
          icon={<FaMotorcycle className="text-red-600" size={24} />}
        />
        <MetricCard
          title="Leads por Origem"
          value={Object.keys(leadsPorOrigem).length}
          color="text-green-600"
          icon={<FaUsers className="text-green-600" size={24} />}
        />
      </div>

      {/* Blocos de Gráficos */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 ${styles.chartsSection}`}>
        {/* Bloco Radar Chart */}
        <RadarChart carBrands={carBrandsData} motoBrands={motoBrandsData} />

        {/* Bloco Line Chart */}
        <LeadsTrendChart leads={leads} />
      </div>

      {/* Blocos Adicionais de Gráficos */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 ${styles.additionalChartsSection}`}>
        {/* Gráfico de Leads por Origem */}
        <LeadsByOriginChart leadsPorOrigem={leadsPorOrigem} />

        {/* Gráfico de Distribuição de Etapas por Origem */}
        <LeadsStageDistributionChart leadsPorOrigemEtapa={leadsPorOrigemEtapa} />
      </div>

      {/* Gráfico de Proporção de Veículos */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 ${styles.vehicleChartsSection}`}>
        <VehicleChart totalCarros={totalCarros} totalMotos={totalMotos} />
        <div className={`bg-white shadow rounded-lg p-6 ${styles.radialChart}`}>
          <h3 className="text-sm font-semibold text-gray-500 text-center mb-4">Total de Veículos por Tipo</h3>
          <div className="flex justify-center">
            <ApexCharts
              options={{
                chart: {
                  type: 'radialBar',
                },
                plotOptions: {
                  radialBar: {
                    hollow: {
                      size: '60%',
                    },
                    dataLabels: {
                      name: {
                        show: true,
                        fontSize: '16px',
                        color: '#374151',
                      },
                      value: {
                        show: true,
                        fontSize: '14px',
                        color: '#374151',
                      },
                    },
                  },
                },
                labels: ['Carros', 'Motos'],
                colors: ['#4A90E2', '#E74C3C'],
                tooltip: {
                  theme: 'dark',
                },
              }}
              series={[totalCarros, totalMotos]}
              type="radialBar"
              height={350}
            />
          </div>
        </div>
      </div>

      {/* Listagem de Carros e Motos por Marca */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 ${styles.brandListsSection}`}>
        <BrandList title="Carros Disponíveis por Marca" data={carrosPorMarca} color="text-blue-600" />
        <BrandList title="Motos Disponíveis por Marca" data={motosPorMarca} color="text-red-600" />
      </div>

      {/* Últimas Simulações e Mensagens */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${styles.simulationsMessagesSection}`}>
        <FinancingSimulation simulacoes={simulacoesFinanciamento} />
        <MessageList mensagens={mensagensRecebidas} />
      </div>
    </div>
  );
};

export default Overview;
