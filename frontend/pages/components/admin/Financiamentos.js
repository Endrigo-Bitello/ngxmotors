import { useState, useEffect } from 'react';
import axios from 'axios';
import { generateFinanciamentoPDF } from '../../../utils/pdfGenerator';
import { faFilePdf, faUser, faMoneyBillAlt } from '@fortawesome/free-regular-svg-icons';
import { faCar, faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Financiamentos = () => {
  const [financiamentos, setFinanciamentos] = useState([]);
  const [veiculos, setVeiculos] = useState({});
  const [selectedFinanciamento, setSelectedFinanciamento] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFinanciamentos = async () => {
    setLoading(true); // Mostra o carregamento
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/financiamentos`);
      setFinanciamentos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erro ao buscar os financiamentos:', error);
    } finally {
      setLoading(false); // Oculta o carregamento
    }
  };

  const fetchVeiculo = async (customId) => {
    try {
      let response;
      if (customId.startsWith('c')) {
        response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/carros/${customId}`);
      } else if (customId.startsWith('m')) {
        response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/motos/${customId}`);
      } else {
        return null;
      }
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar o veículo ${customId}:`, error);
      return null;
    }
  };

  const loadVehicleData = async () => {
    if (Array.isArray(financiamentos) && financiamentos.length > 0) {
      const validFinanciamentos = [];
      const vehiclesMap = {};

      for (const financiamento of financiamentos) {
        const veiculo = await fetchVeiculo(financiamento.customId);
        if (veiculo) {
          validFinanciamentos.push(financiamento);
          vehiclesMap[financiamento.customId] = veiculo;
        } else {
          await deleteFinanciamento(financiamento._id);
        }
      }

      setFinanciamentos(validFinanciamentos);
      setVeiculos(vehiclesMap);
    }
  };

  const deleteFinanciamento = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/financiamentos/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir a simulação ${id}:`, error);
    }
  };

  useEffect(() => {
    fetchFinanciamentos();
  }, []);

  useEffect(() => {
    if (financiamentos.length > 0) {
      loadVehicleData();
    }
  }, [financiamentos]);

  const generatePDF = (financiamento) => {
    const veiculo = veiculos[financiamento.customId];
    generateFinanciamentoPDF(financiamento, veiculo);
  };

  const filteredFinanciamentos = financiamentos.filter((financiamento) => {
    const matchTerm =
      financiamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      financiamento.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      financiamento.telefone.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTerm;
  });

  // Função para formatar valores em BRL
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const avatarColors = [
    'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
  ];

  const getRandomColor = (nome) => {
    const index = nome.charCodeAt(0) % avatarColors.length;
    return avatarColors[index];
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${selectedFinanciamento ? 'hidden' : 'flex'} md:flex flex-col w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">Simulações</h1>
          <button onClick={fetchFinanciamentos} className="text-blue-600 hover:text-blue-800 focus:outline-none" title="Atualizar">
            <FontAwesomeIcon icon={faRedo} />
          </button>
        </div>

        {/* Barra de Busca */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar simulações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>

          {/* Lista de Simulações */}
          <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
            </div>
          ) : filteredFinanciamentos.length > 0 ? (
            <ul className="space-y-2">
              {filteredFinanciamentos.map((financiamento) => (
                <li
                  key={financiamento._id}
                  className={`flex items-center px-4 py-3 cursor-pointer hover:bg-blue-50 transition ${selectedFinanciamento && selectedFinanciamento._id === financiamento._id ? 'bg-blue-100' : ''} border rounded-lg shadow-sm`}
                  onClick={() => {
                    setSelectedFinanciamento(financiamento);
                  }}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 ${getRandomColor(financiamento.nome)} text-white rounded-full flex items-center justify-center font-semibold`}>
                      {financiamento.nome.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Prévia da Simulação */}
                  <div className="flex-grow ml-3 overflow-hidden">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-gray-800 truncate">{financiamento.nome}</h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {new Date(financiamento.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {veiculos[financiamento.customId] ? `${veiculos[financiamento.customId].marca} ${veiculos[financiamento.customId].modelo}` : 'Veículo não encontrado'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Nenhuma simulação encontrada.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detalhes da Simulação */}
      <div className={`${selectedFinanciamento ? 'flex' : 'hidden'} md:flex flex-col flex-1`}>
        {selectedFinanciamento ? (
          <>
            {/* Botão Voltar (Mobile) */}
            <div className="md:hidden p-4">
              <button onClick={() => setSelectedFinanciamento(null)} className="text-blue-600 hover:text-blue-800 flex items-center">
                &larr; Voltar
              </button>
            </div>

            {/* Cabeçalho da Simulação */}
            <div className="bg-white shadow p-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-semibold text-gray-800">Detalhes da Simulação</h2>
                <p className="text-sm text-gray-500 mt-1">Visualize as informações da simulação selecionada</p>
              </div>
              {/* Gerar PDF */}
              <button
                onClick={() => generatePDF(selectedFinanciamento)}
                className="hidden sm:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none transition"
                title="Download PDF"
              >
                <FontAwesomeIcon icon={faFilePdf} size="lg" />
                Download PDF
              </button>
              {/* Botão de PDF (Mobile) */}
              <button
                onClick={() => generatePDF(selectedFinanciamento)}
                className="sm:hidden flex items-center gap-2 text-red-600 hover:text-red-800 focus:outline-none transition"
                title="Download PDF"
              >
                <FontAwesomeIcon icon={faFilePdf} size="lg" />
              </button>
            </div>

            {/* Conteúdo da Simulação */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Informações Pessoais */}
                <section className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
                    Informações Pessoais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Nome:</span>{' '}
                        <span>{selectedFinanciamento.nome}</span>
                      </p>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Email:</span>{' '}
                        <span>{selectedFinanciamento.email}</span>
                      </p>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Telefone:</span>{' '}
                        <span>{selectedFinanciamento.telefone}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">CPF:</span>{' '}
                        <span>{selectedFinanciamento.cpf}</span>
                      </p>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Data da Simulação:</span>{' '}
                        <span>
                          {new Date(selectedFinanciamento.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </p>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
                    Detalhes do Veículo
                  </h3>
                  {veiculos[selectedFinanciamento.customId] ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-600 mb-2">
                          <span className="font-medium">Marca:</span>{' '}
                          <span>{veiculos[selectedFinanciamento.customId].marca}</span>
                        </p>
                        <p className="text-gray-600 mb-2">
                          <span className="font-medium">Modelo:</span>{' '}
                          <span>{veiculos[selectedFinanciamento.customId].modelo}</span>
                        </p>
                        <p className="text-gray-600 mb-2">
                          <span className="font-medium">Ano:</span>{' '}
                          <span>{veiculos[selectedFinanciamento.customId].anoModelo}</span>
                        </p>
                      </div>
                      <div>
                        {veiculos[selectedFinanciamento.customId].valorVenda !== undefined ? (
                          <p className="text-gray-600 mb-2">
                            <span className="font-medium">Preço:</span>{' '}
                            <span>{formatCurrency(veiculos[selectedFinanciamento.customId].valorVenda)}</span>
                          </p>
                        ) : (
                          <p className="text-gray-600">Preço: N/A</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Veículo não encontrado ou removido.</p>
                  )}
                </section>

                <section className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
                    Detalhes da Simulação
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Entrada:</span>{' '}
                        <span>{formatCurrency(selectedFinanciamento.entrada)}</span>
                      </p>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Parcelas:</span>{' '}
                        <span>{selectedFinanciamento.parcelas}x</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Valor Estimado da Parcela:</span>{' '}
                        <span>{formatCurrency(selectedFinanciamento.parcelaEstimada)}</span>
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Selecione uma simulação para visualizar os detalhes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Financiamentos;
