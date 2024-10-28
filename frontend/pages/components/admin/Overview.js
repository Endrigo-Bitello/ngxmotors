import { useState, useEffect } from 'react';
import axios from 'axios';
import VehiclesChart from './charts/VehiclesChart';
import VehiclesBrandsList from './charts/VehiclesBrandsList';

const Overview = () => {
  const [usuario, setUsuario] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('veiculos');
  const [selectedChart, setSelectedChart] = useState('proporcaoVeiculos');
  const [simulacoes, setSimulacoes] = useState(0);
  const [mensagens, setMensagens] = useState(0);
  const [veiculosTotais, setVeiculosTotais] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado. Por favor, faça login.');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [usuarioRes, simulacoesRes, mensagensRes, veiculosRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, config),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/financiamentos`, config),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/mensagens`, config),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/vehicles`, config),
        ]);

        setUsuario(usuarioRes.data);
        setSimulacoes(simulacoesRes.data.length); // Número de simulações de financiamento
        setMensagens(mensagensRes.data.length); // Número de mensagens
        setVeiculosTotais(veiculosRes.data.length); // Número total de veículos

      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Ocorreu um erro ao carregar os dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 w-full text-center">
        {/* Saudação do usuário */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-4">
          Bem-vindo de volta, {usuario.nome}!
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6">
          Estamos felizes em tê-lo novamente. Aqui está uma visão geral da sua revenda.
        </p>
      </div>

      {/* Mini Relatório Geral */}
      <div className="flex justify-center mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-gray-700">Simulações</h3>
            <p className="text-3xl font-extrabold text-blue-600 mt-4">{simulacoes}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-gray-700">Mensagens Recebidas</h3>
            <p className="text-3xl font-extrabold text-green-600 mt-4">{mensagens}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-gray-700">Veículos Totais</h3>
            <p className="text-3xl font-extrabold text-purple-600 mt-4">{veiculosTotais}</p>
          </div>
        </div>
      </div>


      {/* Botões para escolher gráficos de Veículos */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          className={`px-8 py-3 rounded-lg shadow-md font-bold ${selectedCategory === 'veiculos' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'
            }`}
          onClick={() => {
            setSelectedCategory('veiculos');
            setSelectedChart('proporcaoVeiculos');
          }}
        >
          Veículos
        </button>
      </div>

      {/* Exibir botões para gráficos de Veículos */}
      {selectedCategory === 'veiculos' && (
        <div className="flex justify-center mt-8 space-x-4">
          <button
            className={`px-6 py-2 rounded-lg shadow-md font-bold ${selectedChart === 'proporcaoVeiculos' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'
              }`}
            onClick={() => setSelectedChart('proporcaoVeiculos')}
          >
            Proporção de Veículos
          </button>

          <button
            className={`px-6 py-2 rounded-lg shadow-md font-bold ${selectedChart === 'veiculosPorMarca' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'
              }`}
            onClick={() => setSelectedChart('veiculosPorMarca')}
          >
            Veículos por Marca
          </button>
        </div>
      )}

      {/* Renderizando o gráfico selecionado */}
      <div className="mt-12">
        {selectedChart === 'proporcaoVeiculos' && <VehiclesChart />}
        {selectedChart === 'veiculosPorMarca' && <VehiclesBrandsList />}
      </div>
    </div>
  );
};

export default Overview;
