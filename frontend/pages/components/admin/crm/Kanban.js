import { useState, useEffect } from 'react';
import {
  FaPhone,
  FaEnvelope,
  FaPlus,
  FaEdit,
  FaSearch,
  FaTrashAlt,
  FaInfoCircle,
  FaUser,
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
  'Pág. Veículo',
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

const fetchVeiculos = async (customId) => {
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

const fetchVeiculosList = async () => {
  try {
    const [carrosResponse, motosResponse] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/carros`),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/motos`),
    ]);

    const carros = carrosResponse.data.map((carro) => ({
      ...carro,
      tipo: 'carros',
    }));

    const motos = motosResponse.data.map((moto) => ({
      ...moto,
      tipo: 'motos',
    }));

    const veiculos = [...carros, ...motos];

    return veiculos;
  } catch (error) {
    console.error('Erro ao buscar lista de veículos:', error);
    return [];
  }
};

const siglasEstados = {
  'Acre': 'AC',
  'Alagoas': 'AL',
  'Amapá': 'AP',
  'Amazonas': 'AM',
  'Bahia': 'BA',
  'Ceará': 'CE',
  'Distrito Federal': 'DF',
  'Espírito Santo': 'ES',
  'Goiás': 'GO',
  'Maranhão': 'MA',
  'Mato Grosso': 'MT',
  'Mato Grosso do Sul': 'MS',
  'Minas Gerais': 'MG',
  'Pará': 'PA',
  'Paraíba': 'PB',
  'Paraná': 'PR',
  'Pernambuco': 'PE',
  'Piauí': 'PI',
  'Rio de Janeiro': 'RJ',
  'Rio Grande do Norte': 'RN',
  'Rio Grande do Sul': 'RS',
  'Rondônia': 'RO',
  'Roraima': 'RR',
  'Santa Catarina': 'SC',
  'São Paulo': 'SP',
  'Sergipe': 'SE',
  'Tocantins': 'TO',
};

const formatarEstado = (estado) => {
  return siglasEstados[estado] || estado; // Se o estado não for encontrado, retorna o nome original
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
    'Mensagem no site': 'bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300',
    Simulação: 'bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400',
    Instagram: 'bg-pink-100 text-pink-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-pink-400 border border-pink-400',
    Facebook: 'bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400',
    LinkedIn: 'bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400',
    'Círculo pessoal': 'bg-orange-100 text-orange-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-orange-300 border border-orange-300',
    Indicação: 'bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-purple-400 border border-purple-400',
    Indefinido: 'bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500',
    'Pág. Veículo': 'bg-fuchsia-100 text-fuchsia-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-fuchsia-400 border border-fuchsia-400',
  };

  const customIdColors = {
    carro: 'bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400',
    moto: 'bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400',
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
  const [veiculosDisponiveis, setVeiculosDisponiveis] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const [selectedResponsavel, setSelectedResponsavel] = useState('');
  const [isResponsavelModalOpen, setIsResponsavelModalOpen] = useState(false);

  useEffect(() => {
    const loadVehicleData = async () => {
      if (lead.customId) {
        const veiculoData = await fetchVeiculos(lead.customId);
        setVeiculo(veiculoData);
      }
    };
    loadVehicleData();
  }, [lead.customId]);

  const veiculoTipo = getCustomIdType(lead.customId);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem('token'); // Certifique-se de ter o token armazenado
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users`, {
          headers: {
            Authorization: `Bearer ${token}`, // Inclua o token JWT no cabeçalho
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    }

    if (assignModalOpen) {
      fetchUsers();
    }
  }, [assignModalOpen]);

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

  const onAssignLead = (lead) => {
    setSelectedLead(lead); // Define o lead selecionado
    setAssignModalOpen(true); // Abre o modal
  };


  const handleOpenAssignModal = () => {
    setAssignModalOpen(true);
    setUsers();
  };

  const handleCloseAssignModal = () => {
    setAssignModalOpen(false);
  };

  const handleConfirmResponsavel = async () => {
    if (selectedResponsavel) {
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${selectedLead}/assign`, {
          responsavelLead: selectedResponsavel,
        });
        fetchLeads(); // Atualiza a lista de leads
        setIsResponsavelModalOpen(false); // Fecha o modal
      } catch (error) {
        console.error('Erro ao atribuir responsável:', error);
      }
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

          {lead.obteveResposta !== undefined && (
            <p className="text-sm text-gray-600">
              Obteve Resposta: {lead.obteveResposta ? 'Sim' : 'Não'}
            </p>
          )}

          {(lead.estado || lead.cidade) && (
            <p className="text-sm text-gray-600">
              Localização:{' '}
              {lead.cidade && lead.estado
                ? `${lead.cidade}/${formatarEstado(lead.estado)}`
                : lead.cidade
                  ? `${lead.cidade}`
                  : `${lead.estado}`}
            </p>
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
            {lead.fonteLead === 'Pág. Veículo' ? lead.fonteLead : lead.fonteLead}
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

        <div className="text-sm text-gray-600 flex items-center">
          {lead.responsavelLead ? (
            <div className="flex items-center">
              <FaUser className="mr-2" />
              <p>{lead.responsavelLead.username}</p>
            </div>
          ) : (
            <button
              onClick={() => onAssignLead(lead)} // Agora a função existe e está disponível
              className="text-blue-500 underline"
            >
              Atribuir responsável
            </button>
          )}
        </div>
      </div>


      <Modal
        isOpen={assignModalOpen}
        onRequestClose={() => setAssignModalOpen(false)} // Função para fechar o modal
        contentLabel="Atribuir Responsável"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
      >
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 md:mx-auto relative">
          {/* Botão para fechar o modal */}
          <button
            onClick={() => setAssignModalOpen(false)} // Fecha o modal ao clicar no botão de fechar
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
            Atribuir Responsável
          </h2>

          {/* Seleção do responsável */}
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Selecione um responsável
              </label>
              <select
                value={editedLead.responsavelLead}
                onChange={(e) => setEditedLead({ ...editedLead, responsavelLead: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um Responsável</option>
                {users.length > 0 ? (
                  users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))
                ) : (
                  <option disabled>Carregando usuários...</option>
                )}
              </select>
            </div>
          </form>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={() => setAssignModalOpen(false)} // Fecha o modal
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmResponsavel} // Função para confirmar a atribuição do responsável
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Atribuir
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Edição do Lead */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Lead"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
      >
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 md:mx-auto relative">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
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

              {/* Email */}
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

              {/* Telefone */}
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

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <input
                  type="text"
                  placeholder="Digite o estado"
                  value={editedLead.estado}
                  onChange={(e) =>
                    setEditedLead({ ...editedLead, estado: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cidade */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <input
                  type="text"
                  placeholder="Digite a cidade"
                  value={editedLead.cidade}
                  onChange={(e) =>
                    setEditedLead({ ...editedLead, cidade: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>


              {/* Fonte do Lead */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fonte do Lead
                </label>
                <select
                  value={editedLead.fonteLead}
                  onChange={(e) =>
                    setEditedLead({ ...editedLead, fonteLead: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {fontesLeads.map((fonte) => (
                    <option key={fonte} value={fonte}>
                      {fonte}
                    </option>
                  ))}
                </select>
              </div>

              {/* Veículo de Interesse */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Veículo de Interesse
                </label>
                <select
                  value={editedLead.customId || ''}
                  onChange={(e) =>
                    setEditedLead({ ...editedLead, customId: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um veículo</option>
                  {veiculosDisponiveis.map((veiculo) => (
                    <option key={veiculo.customId} value={veiculo.customId}>
                      [{veiculo.customId}] {veiculo.marca} {veiculo.modelo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Motivo da Perda */}
              {editedLead.etapa === 'Perdidos' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Motivo da Perda
                  </label>
                  <input
                    type="text"
                    placeholder="Motivo da Perda"
                    value={editedLead.motivoPerda || ''}
                    onChange={(e) =>
                      setEditedLead({ ...editedLead, motivoPerda: e.target.value })
                    }
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
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
  onAssignLead = { onAssignLead },
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
      <div className="flex-1 overflow-y-auto max-h-[80vh] space-y-4 no-scrollbar">
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
  const [users, setUsers] = useState([]);
  const [newLead, setNewLead] = useState({
    nome: '',
    telefone: '',
    email: '',
    estado: '',
    cidade: '',
    fonteLead: 'Indefinido',
    etapa: 'Novo Lead',
    responsavelLead: '',
  });
  const [searchTerm, setSearchTerm] = useState('');


  const onAssignLead = (lead) => {
    setSelectedLead(lead); // Define o lead selecionado
    setAssignModalOpen(true); // Abre o modal
  };

  // Estados para modais de motivo de perda e restauração
  const [isMotivoModalOpen, setIsMotivoModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [motivoPerda, setMotivoPerda] = useState('');
  const [isSelectVehicleModalOpen, setIsSelectVehicleModalOpen] = useState(false);
  const [veiculosDisponiveis, setVeiculosDisponiveis] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [motivoPerdaOutro, setMotivoPerdaOutro] = useState('');
  const [isObteveRespostaModalOpen, setIsObteveRespostaModalOpen] = useState(false);
  const [obteveResposta, setObteveResposta] = useState('');
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const [selectedResponsavel, setSelectedResponsavel] = useState('');
  const [isResponsavelModalOpen, setIsResponsavelModalOpen] = useState(false);




  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem('token'); // Certifique-se de ter o token armazenado
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users`, {
          headers: {
            Authorization: `Bearer ${token}`, // Inclua o token JWT no cabeçalho
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    }

    if (isModalOpen) {
      fetchUsers();
    }
  }, [isModalOpen]);

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

  const moveCard = async (sourceIndex, destinationIndex, leadId) => {
    const etapaDestino = etapaNames[destinationIndex];
    const etapaOrigem = etapaNames[sourceIndex];

    const lead = leads[sourceIndex].find((l) => l._id === leadId);

    if (etapaDestino === 'Qualificação' && (!lead.obteveResposta || lead.obteveResposta === '')) {
      setSelectedLead({ id: leadId, destinationIndex });
      setIsObteveRespostaModalOpen(true);

    } else if (etapaDestino === 'Em Negociação' && !lead.customId) {
      // Impede o movimento e abre o modal para selecionar veículo
      setSelectedLead({ id: leadId, destinationIndex });
      const veiculos = await fetchVeiculosList();
      setVeiculosDisponiveis(veiculos);
      setIsSelectVehicleModalOpen(true);

    } else if (etapaDestino === 'Perdidos' && etapaOrigem !== 'Perdidos') {
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
    motivo = null,
    customId = null,
    obteveResposta = null

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
      movedLead.motivoPerda = motivo;
      if (customId) {
        movedLead.customId = customId;
      }

      if (obteveResposta !== null) {
        movedLead.obteveResposta = obteveResposta;
      }

      newLeads[destinationIndex].push(movedLead);
      return newLeads;
    });

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${leadId}/update-etapa`,
        {
          etapa: etapaNames[destinationIndex],
          motivoPerda: motivo,
          customId: customId,
          ...(obteveResposta !== null && { obteveResposta }),
          ultimaInteracao: new Date(),
        }
      );
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
    }
  };

  const handleAddLead = async () => {
    try {
      // Cria o lead no banco de dados com o responsável incluído
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clientes`,
        newLead
      );

      // Atualiza a lista de leads
      fetchLeads();

      // Fecha o modal após a adição do lead
      setIsModalOpen(false);

      // Limpa os campos do formulário
      setNewLead({
        nome: '',
        telefone: '',
        email: '',
        estado: '',
        cidade: '',
        fonteLead: '',
        etapa: 'Novo Lead',
        responsavelLead: '', // Limpa o campo de responsável após a adição
      });
    } catch (error) {
      console.error('Erro ao adicionar lead:', error);
    }
  };


  const handleOpenAssignModal = () => {
    setAssignModalOpen(true);
    setUsers();
  };

  const handleCloseAssignModal = () => {
    setAssignModalOpen(false);
  };

  const handleConfirmResponsavel = async () => {
    if (selectedResponsavel) {
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${selectedLead}/assign`, {
          responsavelLead: selectedResponsavel,
        });
        fetchLeads(); // Atualiza a lista de leads
        setIsResponsavelModalOpen(false); // Fecha o modal
      } catch (error) {
        console.error('Erro ao atribuir responsável:', error);
      }
    }
  };



  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewLead({
      nome: '',
      telefone: '',
      email: '',
      estado: '',
      cidade: '',
      fonteLead: '',
      etapa: 'Novo Lead',
      responsavelLead: '',
    });
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


        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleModalClose}
          contentLabel="Adicionar Lead"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 md:mx-auto relative">
            {/* Botão para fechar o modal */}
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Fechar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Adicionar Novo Lead
            </h2>

            <div className="space-y-5">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  placeholder="Nome"
                  value={newLead.nome}
                  onChange={(e) => setNewLead({ ...newLead, nome: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <input
                  type="tel"
                  placeholder="Telefone"
                  value={newLead.telefone}
                  onChange={(e) => {
                    let telefone = e.target.value.replace(/\D/g, '');
                    if (telefone.length > 11) telefone = telefone.slice(0, 11);
                    telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d{5})(\d{4})$/, '$1-$2');
                    setNewLead({ ...newLead, telefone });
                  }}
                  maxLength={15}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <input
                  type="text"
                  placeholder="Digite o estado"
                  value={newLead.estado}
                  onChange={(e) => setNewLead({ ...newLead, estado: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Cidade</label>
                <input
                  type="text"
                  placeholder="Digite a cidade"
                  value={newLead.cidade}
                  onChange={(e) => setNewLead({ ...newLead, cidade: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Fonte do Lead */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Fonte do Lead</label>
                <select
                  value={newLead.fonteLead}
                  onChange={(e) => setNewLead({ ...newLead, fonteLead: e.target.value })}
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

              {/* Responsável */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Atribuir Responsável</label>
                <select
                  value={newLead.responsavelLead}
                  onChange={(e) => setNewLead({ ...newLead, responsavelLead: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um Responsável</option>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.username}
                      </option>
                    ))
                  ) : (
                    <option disabled>Carregando usuários...</option>
                  )}
                </select>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleModalClose}
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


        <Modal
          isOpen={assignModalOpen}
          onRequestClose={() => setAssignModalOpen(false)} // Função para fechar o modal
          contentLabel="Atribuir Responsável"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 md:mx-auto relative">
            {/* Botão para fechar o modal */}
            <button
              onClick={() => setAssignModalOpen(false)} // Fecha o modal ao clicar no botão de fechar
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
              Atribuir Responsável
            </h2>

            {/* Seleção do responsável */}
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Selecione um responsável
                </label>
                <select
                  value={newLead.responsavelLead}
                  onChange={(e) => setNewLead({ ...newLead, responsavelLead: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um Responsável</option>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.username}
                      </option>
                    ))
                  ) : (
                    <option disabled>Carregando usuários...</option>
                  )}
                </select>
              </div>
            </form>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setAssignModalOpen(false)} // Fecha o modal
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmResponsavel} // Função para confirmar a atribuição do responsável
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Atribuir
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal para Obteve Resposta */}
        <Modal
          isOpen={isObteveRespostaModalOpen}
          onRequestClose={() => {
            setIsObteveRespostaModalOpen(false);
            setObteveResposta('');
            setSelectedLead(null);
          }}
          contentLabel="Obteve Resposta"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-4 md:mx-auto relative">
            {/* Botão para fechar o modal */}
            <button
              onClick={() => {
                setIsObteveRespostaModalOpen(false);
                setObteveResposta('');
                setSelectedLead(null);
              }}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Obteve Resposta do Lead?
              </h2>
              <p className="text-gray-600 mb-6">
                Por favor, indique se obteve resposta do lead antes de prosseguir.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center space-x-6">
                <button
                  onClick={() => setObteveResposta('Sim')}
                  className={`px-5 py-2 rounded-md focus:outline-none focus:ring-2 ${obteveResposta === 'Sim'
                    ? 'bg-blue-600 text-white focus:ring-blue-500'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                  Sim
                </button>
                <button
                  onClick={() => setObteveResposta('Não')}
                  className={`px-5 py-2 rounded-md focus:outline-none focus:ring-2 ${obteveResposta === 'Não'
                    ? 'bg-blue-600 text-white focus:ring-blue-500'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                  Não
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setIsObteveRespostaModalOpen(false);
                  setObteveResposta('');
                  setSelectedLead(null);
                }}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (selectedLead && obteveResposta) {
                    updateLeadStage(
                      selectedLead.id,
                      selectedLead.destinationIndex,
                      null,
                      null,
                      obteveResposta
                    );
                    setIsObteveRespostaModalOpen(false);
                    setObteveResposta('');
                    setSelectedLead(null);
                  }
                }}
                disabled={!obteveResposta}
                className={`px-5 py-2 text-white rounded-md transition-colors focus:outline-none focus:ring-2 ${obteveResposta
                  ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  : 'bg-blue-300 cursor-not-allowed'
                  }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </Modal>


        {/* Modal para Motivo da Perda */}
        <Modal
          isOpen={isMotivoModalOpen}
          onRequestClose={() => {
            setIsMotivoModalOpen(false);
            setMotivoPerda('');
            setMotivoPerdaOutro('');
            setSelectedLead(null);
          }}
          contentLabel="Motivo da Perda"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-4 md:mx-auto relative">
            {/* Botão para fechar o modal */}
            <button
              onClick={() => {
                setIsMotivoModalOpen(false);
                setMotivoPerda('');
                setMotivoPerdaOutro('');
                setSelectedLead(null);
              }}
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

            {/* Cabeçalho */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Motivo da Perda do Lead
              </h2>
              <p className="text-gray-600 mb-6">
                Por favor, informe o motivo da perda do lead.
              </p>
            </div>

            {/* Formulário de seleção do motivo */}
            <div className="space-y-4">
              <select
                value={motivoPerda}
                onChange={(e) => setMotivoPerda(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o motivo</option>
                {[
                  'Não respondeu',
                  'Parou de responder',
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

              {/* Campo de texto para "Outro" */}
              {motivoPerda === 'Outro' && (
                <textarea
                  value={motivoPerdaOutro}
                  onChange={(e) => setMotivoPerdaOutro(e.target.value)}
                  placeholder="Por favor, especifique o motivo"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              )}
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setIsMotivoModalOpen(false);
                  setMotivoPerda('');
                  setMotivoPerdaOutro('');
                  setSelectedLead(null);
                }}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (selectedLead) {
                    const motivo = motivoPerda === 'Outro' ? motivoPerdaOutro : motivoPerda;
                    updateLeadStage(selectedLead.id, selectedLead.destinationIndex, motivo);
                    setIsMotivoModalOpen(false);
                    setMotivoPerda('');
                    setMotivoPerdaOutro('');
                    setSelectedLead(null);
                  }
                }}
                disabled={!motivoPerda || (motivoPerda === 'Outro' && !motivoPerdaOutro)}
                className={`px-5 py-2 text-white rounded-md transition-colors focus:outline-none focus:ring-2 ${motivoPerda && (motivoPerda !== 'Outro' || motivoPerdaOutro)
                  ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  : 'bg-blue-300 cursor-not-allowed'
                  }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </Modal>



        {/* Modal para Obteve Resposta */}
        <Modal
          isOpen={isObteveRespostaModalOpen}
          onRequestClose={() => {
            setIsObteveRespostaModalOpen(false);
            setObteveResposta('');
            setSelectedLead(null);
          }}
          contentLabel="Obteve Resposta"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-4 md:mx-auto relative">
            {/* Botão para fechar o modal */}
            <button
              onClick={() => {
                setIsObteveRespostaModalOpen(false);
                setObteveResposta('');
                setSelectedLead(null);
              }}
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

            {/* Cabeçalho */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Obteve Resposta do Lead?
              </h2>
              <p className="text-gray-600 mb-6">
                Por favor, indique se obteve resposta do lead antes de prosseguir.
              </p>
            </div>

            {/* Botões de seleção */}
            <div className="space-y-4">
              <div className="flex justify-center space-x-6">
                <button
                  onClick={() => setObteveResposta('Sim')}
                  className={`px-5 py-2 rounded-md focus:outline-none focus:ring-2 ${obteveResposta === 'Sim'
                    ? 'bg-blue-600 text-white focus:ring-blue-500'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                  Sim
                </button>
                <button
                  onClick={() => setObteveResposta('Não')}
                  className={`px-5 py-2 rounded-md focus:outline-none focus:ring-2 ${obteveResposta === 'Não'
                    ? 'bg-blue-600 text-white focus:ring-blue-500'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                  Não
                </button>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setIsObteveRespostaModalOpen(false);
                  setObteveResposta('');
                  setSelectedLead(null);
                }}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (selectedLead && obteveResposta) {
                    updateLeadStage(
                      selectedLead.id,
                      selectedLead.destinationIndex,
                      null,
                      null,
                      obteveResposta
                    );
                    setIsObteveRespostaModalOpen(false);
                    setObteveResposta('');
                    setSelectedLead(null);
                  }
                }}
                disabled={!obteveResposta}
                className={`px-5 py-2 text-white rounded-md transition-colors focus:outline-none focus:ring-2 ${obteveResposta
                  ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  : 'bg-blue-300 cursor-not-allowed'
                  }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal de Restauração do Lead */}
        <Modal
          isOpen={isRestoreModalOpen}
          onRequestClose={() => {
            setIsRestoreModalOpen(false);
            setSelectedLead(null);
          }}
          contentLabel="Restaurar Lead"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-4 md:mx-auto relative">
            {/* Botão para fechar o modal */}
            <button
              onClick={() => {
                setIsRestoreModalOpen(false);
                setSelectedLead(null);
              }}
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

            {/* Cabeçalho */}
            <div className="text-center">
              <h2
                id="modal-title"
                className="text-2xl font-semibold mb-4 text-gray-800"
              >
                Deseja restaurar esse lead?
              </h2>
              <p
                id="modal-description"
                className="text-gray-600 mb-6"
              >
                Esse lead foi marcado como <span className="font-semibold">perdido</span>. Ao movê-lo para outra coluna, o motivo da perda será removido e ele voltará para a lista de leads ativos.
              </p>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => {
                  setIsRestoreModalOpen(false);
                  setSelectedLead(null);
                }}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
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
                className="px-5 py-2 bg-green-500 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Restaurar Lead
              </button>
            </div>
          </div>
        </Modal>



        {/* Modal para Selecionar Veículo */}
        <Modal
          isOpen={isSelectVehicleModalOpen}
          onRequestClose={() => {
            setIsSelectVehicleModalOpen(false);
            setSelectedLead(null);
            setSelectedVehicle('');
          }}
          contentLabel="Selecionar Veículo"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 md:mx-auto relative">
            {/* Botão para fechar o modal */}
            <button
              onClick={() => {
                setIsSelectVehicleModalOpen(false);
                setSelectedLead(null);
                setSelectedVehicle('');
              }}
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

            {/* Cabeçalho do modal */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Selecionar Veículo
              </h2>
              <p className="text-gray-600 mb-6">
                Por favor, selecione o veículo da negociação.
              </p>
            </div>

            {/* Seleção de veículo */}
            <div className="space-y-4">
              <div className="relative">
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um veículo</option>
                  {veiculosDisponiveis.map((veiculo) => (
                    <option key={veiculo.customId} value={veiculo.customId}>
                      [{veiculo.customId}] {veiculo.marca} {veiculo.modelo}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12l-5-5h10l-5 5z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => {
                  setIsSelectVehicleModalOpen(false);
                  setSelectedLead(null);
                  setSelectedVehicle('');
                }}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (selectedLead && selectedVehicle) {
                    updateLeadStage(
                      selectedLead.id,
                      selectedLead.destinationIndex,
                      null,
                      selectedVehicle
                    );
                    setIsSelectVehicleModalOpen(false);
                    setSelectedLead(null);
                    setSelectedVehicle('');
                  }
                }}
                disabled={!selectedVehicle}
                className={`px-5 py-2 text-white rounded-md transition-colors focus:outline-none focus:ring-2 ${selectedVehicle
                  ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  : 'bg-blue-300 cursor-not-allowed'
                  }`}
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
              onAssignLead={onAssignLead}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Kanban;
