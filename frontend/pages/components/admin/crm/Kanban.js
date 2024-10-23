// components/admin/crm/Kanban.js

import { useState, useEffect } from 'react';
import {
  FaPhone,
  FaEnvelope,
  FaPlus,
  FaEdit,
  FaSearch,
  FaTrashAlt,
  FaInfoCircle,
} from 'react-icons/fa';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import Modal from 'react-modal';

// Definir tipos para os itens de arrastar
const ItemTypes = {
  CARD: 'card',
};

const estadosBrasileiros = [
  'Acre',
  'Alagoas',
  'Amapá',
  'Amazonas',
  'Bahia',
  'Ceará',
  'Distrito Federal',
  'Espírito Santo',
  'Goiás',
  'Maranhão',
  'Mato Grosso',
  'Mato Grosso do Sul',
  'Minas Gerais',
  'Pará',
  'Paraíba',
  'Paraná',
  'Pernambuco',
  'Piauí',
  'Rio de Janeiro',
  'Rio Grande do Norte',
  'Rio Grande do Sul',
  'Rondônia',
  'Roraima',
  'Santa Catarina',
  'São Paulo',
  'Sergipe',
  'Tocantins',
];

const fontesLeads = [
  'Mensagem no site',
  'Simulação',
  'Instagram',
  'Facebook',
  'LinkedIn',
  'Círculo pessoal',
  'Indicação',
  'Indefinido',
];

// Definir cores e nomes para as etapas
const etapaColors = [
  'bg-green-500',
  'bg-yellow-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-red-500',
];
const etapaNames = [
  'Novo Lead',
  'Qualificação',
  'Em Negociação',
  'Fechamento',
  'Pós Venda',
  'Perdidos',
];

const fetchVeiculo = async (customId) => {
  try {
    let response;
    if (customId.startsWith('c')) {
      response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/carros/${customId}`
      );
    } else if (customId.startsWith('m')) {
      response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/motos/${customId}`
      );
    } else {
      return null;
    }
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar o veículo ${customId}:`, error);
    return null;
  }
};

// Componente de Card individual (arrastável)
const DraggableCard = ({
  lead,
  index,
  moveCard,
  colunaOrigem,
  fetchLeads,
  colunaIndex,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { index, lead, colunaOrigem },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const fonteLeadColors = {
    'Mensagem no site': 'bg-blue-100 text-blue-800 border-blue-400',
    Simulação: 'bg-green-100 text-green-800 border-green-400',
    Instagram: 'bg-pink-100 text-pink-800 border-pink-400',
    Facebook: 'bg-blue-100 text-blue-800 border-blue-400',
    LinkedIn: 'bg-indigo-100 text-indigo-800 border-indigo-400',
    'Círculo pessoal': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Indicação: 'bg-purple-100 text-purple-800 border-purple-400',
    Indefinido: 'bg-gray-100 text-gray-800 border-gray-500',
  };

  const customIdColors = {
    carro: 'bg-red-100 text-red-800 border-red-400',
    moto: 'bg-blue-100 text-blue-800 border-blue-400',
  };

  const getCustomIdType = (customId) => {
    if (!customId) return 'Indefinido';
    return customId.startsWith('c')
      ? 'carro'
      : customId.startsWith('m')
        ? 'moto'
        : 'Indefinido';
  };

  const [veiculo, setVeiculo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedLead, setEditedLead] = useState(lead);

  useEffect(() => {
    const loadVehicleData = async () => {
      if (lead.customId) {
        const veiculoData = await fetchVeiculo(lead.customId);
        setVeiculo(veiculoData);
      }
    };
    loadVehicleData();
  }, [lead.customId]);

  const veiculoTipo = getCustomIdType(lead.customId);

  const handleEditLead = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${lead._id}`,
        editedLead
      );
      setIsEditModalOpen(false);
      fetchLeads();
    } catch (error) {
      console.error('Erro ao editar lead:', error);
    }
  };

  const handleDeleteLead = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${lead._id}`
      );
      fetchLeads();
    } catch (error) {
      console.error('Erro ao deletar lead:', error);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
    const formattedTime = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${formattedDate} às ${formattedTime}`;
  };

  return (
    <>
      <div
        ref={drag}
        className={`bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between space-y-4 ${isDragging ? 'opacity-50' : 'opacity-100'
          }`}
      >
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">{lead.nome}</h3>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaEdit />
            </button>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            <FaEnvelope className="mr-2" /> {lead.email}
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            <FaPhone className="mr-2" /> {lead.telefone}
          </div>
          {veiculo ? (
            <p className="text-sm text-gray-600">
              Veículo de interesse: {veiculo.marca} {veiculo.modelo}
            </p>
          ) : (
            lead.customId && (
              <div className="flex items-center space-x-2">
                <FaInfoCircle className="text-red-600" />
                <p className="text-sm italic text-red-600">
                  Veículo removido: {lead.customId}
                </p>
              </div>
            )
          )}
          <p className="text-xs text-gray-400 mt-2">
            Criado em: {formatDateTime(lead.dataCriacao)}
          </p>
          <p className="text-xs text-gray-400">
            Última modificação: {formatDateTime(lead.ultimaInteracao)}
          </p>

          {etapaNames[colunaIndex] === 'Perdidos' && lead.motivoPerda && (
            <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm mt-2">
              <strong>Motivo da perda:</strong><br></br>{lead.motivoPerda}
            </div>
          )}
        </div>
        <div className="flex justify-start mt-2 space-x-2">
          <span
            className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded ${fonteLeadColors[lead.fonteLead]}`}
          >
            {lead.fonteLead}
          </span>
          {lead.customId && (
            <span
              className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded ${lead.customId.startsWith('c')
                  ? customIdColors.carro
                  : customIdColors.moto
                }`}
            >
              Cód. {lead.customId}
            </span>
          )}
        </div>
      </div>

      {/* Modal de Edição do Lead */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Lead"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
      >
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 md:mx-auto relative">
          {/* Botão para fechar o modal */}
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Fechar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Editar Lead
          </h2>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                placeholder="Nome"
                value={editedLead.nome}
                onChange={(e) =>
                  setEditedLead({ ...editedLead, nome: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                value={editedLead.email}
                onChange={(e) =>
                  setEditedLead({ ...editedLead, email: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                type="text"
                placeholder="Telefone"
                value={editedLead.telefone}
                onChange={(e) =>
                  setEditedLead({ ...editedLead, telefone: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Campos adicionais podem ser adicionados aqui */}
          </form>

          <div className="flex flex-col md:flex-row justify-end space-y-3 md:space-y-0 md:space-x-4 mt-8">
            <button
              onClick={handleDeleteLead}
              className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <FaTrashAlt className="mr-2" /> Deletar
            </button>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={handleEditLead}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Salvar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// Componente de Coluna (soltável)
const DroppableColumn = ({
  etapa,
  leads,
  index,
  moveCard,
  fetchLeads,
  children,
}) => {
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item) => moveCard(item.colunaOrigem, index, item.lead._id),
  });

  return (
    <div
      ref={drop}
      className="bg-gray-100 rounded-lg shadow-md p-4 flex flex-col h-full"
    >
      <div
        className={`text-white rounded-t-lg p-2 text-center font-semibold mb-4 ${etapaColors[index]}`}
      >
        {etapa} ({leads.length})
      </div>
      <div className="flex-1 overflow-auto space-y-4">
        {leads.length === 0 ? (
          <p className="text-gray-500 italic text-center mt-6">
            Nenhum lead nesta etapa.
          </p>
        ) : (
          leads.map((lead, i) => (
            <DraggableCard
              key={lead._id}
              lead={lead}
              index={i}
              moveCard={moveCard}
              colunaOrigem={index}
              fetchLeads={fetchLeads}
              colunaIndex={index}
            />
          ))
        )}
      </div>
    </div>
  );
};

const Kanban = () => {
  const [leads, setLeads] = useState([[], [], [], [], [], []]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    nome: '',
    telefone: '',
    email: '',
    estado: '',
    fonteLead: 'Indefinido',
    etapa: 'Novo Lead',
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para modais de motivo de perda e restauração
  const [isMotivoModalOpen, setIsMotivoModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [motivoPerda, setMotivoPerda] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clientes`
      );
      const clientes = response.data;
      const leadsPorEtapa = [[], [], [], [], [], []];
      clientes.forEach((cliente) => {
        const etapaIndex = etapaNames.indexOf(cliente.etapa);
        if (etapaIndex !== -1) {
          leadsPorEtapa[etapaIndex].push(cliente);
        }
      });
      setLeads(leadsPorEtapa);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    }
  };

  const moveCard = (sourceIndex, destinationIndex, leadId) => {
    const etapaDestino = etapaNames[destinationIndex];
    const etapaOrigem = etapaNames[sourceIndex];

    if (etapaDestino === 'Perdidos' && etapaOrigem !== 'Perdidos') {
      // Abrir modal para inserir motivo da perda
      setSelectedLead({ id: leadId, destinationIndex });
      setIsMotivoModalOpen(true);
    } else if (etapaDestino !== 'Perdidos' && etapaOrigem === 'Perdidos') {
      // Abrir modal para confirmar restauração
      setSelectedLead({ id: leadId, destinationIndex });
      setIsRestoreModalOpen(true);
    } else {
      // Movimento normal sem modais
      updateLeadStage(leadId, destinationIndex);
    }
  };

  const updateLeadStage = async (
    leadId,
    destinationIndex,
    motivo = null
  ) => {
    setLeads((prevLeads) => {
      const newLeads = [...prevLeads];
      const sourceIndex = newLeads.findIndex((column) =>
        column.some((lead) => lead._id === leadId)
      );

      const [movedLead] = newLeads[sourceIndex].splice(
        newLeads[sourceIndex].findIndex((lead) => lead._id === leadId),
        1
      );

      movedLead.ultimaInteracao = new Date();
      movedLead.etapa = etapaNames[destinationIndex];
      movedLead.motivoPerda = motivo; // Atualiza o motivoPerda

      newLeads[destinationIndex].push(movedLead);
      return newLeads;
    });

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${leadId}/update-motivo-perda`,
        {
          etapa: etapaNames[destinationIndex],
          motivoPerda: motivo,
          ultimaInteracao: new Date(),
        }
      );
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
    }
  };

  const handleAddLead = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clientes`,
        newLead
      );
      fetchLeads();
      setIsModalOpen(false);
      setNewLead({
        nome: '',
        telefone: '',
        email: '',
        estado: '',
        fonteLead: 'Indefinido',
        etapa: 'Novo Lead',
      });
    } catch (error) {
      console.error('Erro ao adicionar lead:', error);
    }
  };

  const filteredLeads = leads.map((columnLeads) =>
    columnLeads.filter(
      (lead) =>
        lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.telefone.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="border border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors rounded-full px-4 py-2 flex items-center space-x-2 shadow-sm"
            >
              <FaPlus className="text-blue-500" />
              <span>Adicionar Lead</span>
            </button>

            {/* Barra de pesquisa atualizada */}
            <div className="relative">
              <input
                type="search"
                placeholder="Pesquisar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="shadow-lg focus:border-2 border-gray-300 px-5 py-3 rounded-xl w-44 md:w-56 transition-all duration-300 focus:w-64 outline-none"
                name="search"
              />
              <svg
                className="w-6 h-6 absolute top-3 right-3 text-gray-500 pointer-events-none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21L15.803 15.803M15.803 15.803A7.5 7.5 0 105.197 5.197a7.5 7.5 0 0010.606 10.606z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Modal de Adicionar Lead */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Adicionar Lead"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 md:mx-auto relative">
            {/* Botão para fechar o modal */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Fechar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Adicionar Novo Lead
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  placeholder="Nome"
                  value={newLead.nome}
                  onChange={(e) =>
                    setNewLead({ ...newLead, nome: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={newLead.email}
                  onChange={(e) =>
                    setNewLead({ ...newLead, email: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  type="text"
                  placeholder="Telefone"
                  value={newLead.telefone}
                  onChange={(e) =>
                    setNewLead({ ...newLead, telefone: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  value={newLead.estado}
                  onChange={(e) =>
                    setNewLead({ ...newLead, estado: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione o Estado</option>
                  {estadosBrasileiros.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fonte do Lead
                </label>
                <select
                  value={newLead.fonteLead}
                  onChange={(e) =>
                    setNewLead({ ...newLead, fonteLead: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Indefinido">Selecione a Fonte</option>
                  {fontesLeads.map((fonte) => (
                    <option key={fonte} value={fonte}>
                      {fonte}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddLead}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Adicionar Lead
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal para Motivo da Perda */}
        <Modal
          isOpen={isMotivoModalOpen}
          onRequestClose={() => setIsMotivoModalOpen(false)}
          contentLabel="Motivo da Perda"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 md:mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Informe o Motivo da Perda
            </h2>
            <div>
              <select
                value={motivoPerda}
                onChange={(e) => setMotivoPerda(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o motivo</option>
                {[
                  'Não respondeu',
                  'Não atendeu telefone',
                  'Cliente desistiu',
                  'Concorrente ganhou',
                  'Problema de orçamento',
                  'Veículo não atende às necessidades',
                  'Veículo já foi vendido',
                  'Não conseguiu contato',
                  'Lead não qualificado',
                  'Mudança de prioridade do cliente',
                  'Outro',
                ].map((motivo) => (
                  <option key={motivo} value={motivo}>
                    {motivo}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setIsMotivoModalOpen(false);
                  setMotivoPerda('');
                  setSelectedLead(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (selectedLead) {
                    updateLeadStage(
                      selectedLead.id,
                      selectedLead.destinationIndex,
                      motivoPerda
                    );
                    setIsMotivoModalOpen(false);
                    setMotivoPerda('');
                    setSelectedLead(null);
                  }
                }}
                disabled={!motivoPerda}
                className={`px-4 py-2 text-white rounded-md transition-colors focus:outline-none focus:ring-2 ${motivoPerda
                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                    : 'bg-blue-300 cursor-not-allowed'
                  }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal de Confirmação de Restauração */}
        <Modal
          isOpen={isRestoreModalOpen}
          onRequestClose={() => setIsRestoreModalOpen(false)}
          contentLabel="Restaurar Lead"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 md:mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Deseja restaurar este lead?
            </h2>
            <p className="text-center text-gray-600 mb-6">
              O motivo da perda será removido.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsRestoreModalOpen(false);
                  setSelectedLead(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (selectedLead) {
                    updateLeadStage(
                      selectedLead.id,
                      selectedLead.destinationIndex,
                      null
                    );
                    setIsRestoreModalOpen(false);
                    setSelectedLead(null);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Confirmar
              </button>
            </div>
          </div>
        </Modal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {filteredLeads.map((columnLeads, index) => (
            <DroppableColumn
              key={index}
              index={index}
              etapa={etapaNames[index]}
              leads={columnLeads}
              moveCard={moveCard}
              fetchLeads={fetchLeads}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Kanban;
