import { useState, useEffect, Fragment } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Menu, Transition } from '@headlessui/react';
import 'react-datepicker/dist/react-datepicker.css';
import CountUp from 'react-countup';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { addDays } from 'date-fns';
const NavbarButtons = dynamic(() => import('./NavbarButtons'));

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const Overview = () => {
  const [carrosDisponiveis, setCarrosDisponiveis] = useState(0);
  const [carrosReservados, setCarrosReservados] = useState(0);
  const [carrosVendidos, setCarrosVendidos] = useState(0);
  const [faturamentoBruto, setFaturamentoBruto] = useState(0);
  const [graficoDados, setGraficoDados] = useState([]);
  const [simulacoesFinanciamento, setSimulacoesFinanciamento] = useState([]);
  const [dataInicial, setDataInicial] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState('Intervalo personalizado');

  useEffect(() => {
    fetchCarros();
    fetchSimulacoesFinanciamento();
  }, [dataInicial, dataFinal]);

  const fetchCarros = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/vehicles`);
      const carros = response.data;
      const disponiveis = carros.filter((carro) => carro.status === 'Disponível').length;
      const reservados = carros.filter((carro) => carro.status === 'Reservado').length;
      const vendidos = carros.filter((carro) => carro.status === 'Vendido');

      const vendidosNoPeriodo = vendidos.filter((carro) => {
        const dataVenda = new Date(carro.updatedAt);
        return dataVenda >= dataInicial && dataVenda <= dataFinal;
      });

      const faturamento = vendidosNoPeriodo.reduce((total, carro) => total + carro.valorVenda, 0);

      const dadosGrafico = vendidosNoPeriodo.map((carro) => ({
        date: new Date(carro.updatedAt).toLocaleDateString('pt-BR'),
        amount: carro.valorVenda,
      }));

      setCarrosDisponiveis(disponiveis);
      setCarrosReservados(reservados);
      setCarrosVendidos(vendidosNoPeriodo.length);
      setFaturamentoBruto(faturamento);
      setGraficoDados(dadosGrafico);
    } catch (error) {
      console.error('Erro ao buscar os carros:', error);
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

  const handleDateShortcut = (option) => {
    const today = new Date();
    switch (option) {
      case 'Hoje':
        setDataInicial(today);
        setDataFinal(today);
        break;
      case 'Ontem':
        setDataInicial(addDays(today, -1));
        setDataFinal(addDays(today, -1));
        break;
      case 'Últimos 7 dias':
        setDataInicial(addDays(today, -7));
        setDataFinal(today);
        break;
      case 'Últimos 14 dias':
        setDataInicial(addDays(today, -14));
        setDataFinal(today);
        break;
      case 'Esse mês':
        setDataInicial(new Date(today.getFullYear(), today.getMonth(), 1));
        setDataFinal(today);
        break;
      case 'Mês passado':
        setDataInicial(new Date(today.getFullYear(), today.getMonth() - 1, 1));
        setDataFinal(new Date(today.getFullYear(), today.getMonth(), 0));
        break;
      case 'Todo o período':
        setDataInicial(new Date(0));
        setDataFinal(today);
        break;
      default:
        break;
    }
    setSelectedRange(option);
  };

  const handleDownloadCSV = () => {
    const csvData = graficoDados.map((data) => ({
      Data: data.date,
      Faturamento: data.amount,
    }));
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vendas');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `vendas-${new Date().toLocaleDateString()}.xlsx`);
  };

  const salesChartOptions = {
    chart: {
      type: 'area',
      height: 300,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: graficoDados.map((data) => data.date),
      labels: {
        style: {
          colors: '#6B7280',
          fontFamily: 'Montserrat',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `R$ ${value.toFixed(2)}`,
        style: {
          colors: '#6B7280',
          fontFamily: 'Montserrat',
        },
      },
    },
    colors: ['#4A90E2'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
      },
    },
    tooltip: {
      theme: 'dark',
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
  };

  const salesChartData = [{
    name: 'Faturamento',
    data: graficoDados.map((data) => data.amount),
  }];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Visão Geral de Vendas</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-lg p-6 rounded-lg flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div>
            <h5 className="text-3xl font-bold text-gray-900">
              {carrosDisponiveis}
            </h5>
            <p className="text-base font-normal text-gray-500">Carros Disponíveis</p>
          </div>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 4H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v13a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div>
            <h5 className="text-3xl font-bold text-gray-900">
              {carrosReservados}
            </h5>
            <p className="text-base font-normal text-gray-500">Carros Reservados</p>
          </div>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <h5 className="text-3xl font-bold text-gray-900">
              {carrosVendidos}
            </h5>
            <p className="text-base font-normal text-gray-500">Carros Vendidos</p>
          </div>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c.637 0 1.254.095 1.842.273m-3.684-.546a9.003 9.003 0 1111.31 11.31m-1.454-5.72A5.002 5.002 0 007 13h4v4a5.002 5.002 0 005.31-4.31m-5.31 1.454A5.002 5.002 0 017 13v1m0 8a9 9 0 100-18"></path>
            </svg>
          </div>
          <div>
            <h5 className="text-3xl font-bold text-gray-900">
              <CountUp start={0} end={faturamentoBruto} duration={1.5} separator="," decimals={2} decimal="," prefix="R$ " />
            </h5>
            <p className="text-base font-normal text-gray-500">Faturamento</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Faturamento por Período</h2>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                  {selectedRange}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {['Hoje', 'Ontem', 'Últimos 7 dias', 'Últimos 14 dias', 'Esse mês', 'Mês passado', 'Todo o período'].map((option) => (
                      <Menu.Item key={option}>
                        {({ active }) => (
                          <button
                            onClick={() => handleDateShortcut(option)}
                            className={`${
                              active ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
                            } block w-full text-left px-4 py-2 text-sm`}
                          >
                            {option}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          <ApexCharts options={salesChartOptions} series={salesChartData} type="area" height={300} />
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Simulações de Financiamento</h2>
          <div className="flex justify-between items-center mb-6">
            <p className="text-3xl font-bold text-gray-900">
              <CountUp start={0} end={simulacoesFinanciamento.length} duration={1.5} separator="," />
            </p>
            <div className="text-sm text-gray-500">
              Últimas Simulações
            </div>
          </div>
          <div className="space-y-4">
            {simulacoesFinanciamento.slice(0, 3).map((simulacao, index) => (
              <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">Cliente: {simulacao.nome}</p>
                  <p className="text-sm text-gray-600">Entrada: R$ {simulacao.entrada ? simulacao.entrada.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : 'N/A'}</p>
                  <p className="text-sm text-gray-600">Parcelas: {simulacao.parcelas}x de R$ {simulacao.parcelaEstimada ? simulacao.parcelaEstimada.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : 'N/A'}</p>
                  <p className="text-sm text-gray-500">Horário: {new Date(simulacao.createdAt).toLocaleTimeString('pt-BR')}</p>
                </div>
                <div className="ml-4 text-sm text-gray-400">
                  {new Date(simulacao.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleDownloadCSV}
        className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
      >
        <svg fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2a1 1 0 011 1v12.586l3.707-3.707a1 1 0 011.414 1.414l-5.414 5.414a1 1 0 01-1.414 0l-5.414-5.414a1 1 0 011.414-1.414L11 15.586V3a1 1 0 011-1z"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5 20a1 1 0 011-1h12a1 1 0 110 2H6a1 1 0 01-1-1z"
          ></path>
        </svg>
        <span>Baixar Relatório CSV</span>
      </button>
      <NavbarButtons />
    </div>
  );
};

export default Overview;