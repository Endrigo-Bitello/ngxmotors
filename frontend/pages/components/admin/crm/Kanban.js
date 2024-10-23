import { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaPlus } from 'react-icons/fa'; // Ícone de "+"
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import Modal from 'react-modal';

// Definir tipos para os itens de arrastar
const ItemTypes = {
  CARD: 'card',
};

const estadosBrasileiros = [
  'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás',
  'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco',
  'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina',
  'São Paulo', 'Sergipe', 'Tocantins'
];

const fontesLeads = [
  'Mensagem no site', 'Simulação', 'Instagram', 'Facebook', 'LinkedIn', 'Círculo pessoal', 'Indicação'
];

// Definir cores e nomes para as etapas
const etapaColors = ['bg-green-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-gray-500'];
const etapaNames = ['Novo Lead', 'Qualificação', 'Em Negociação', 'Fechamento', 'Pós Venda', 'Perdidos'];

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

// Componente de Card individual (arrastável)
const DraggableCard = ({ lead, index, moveCard, colunaOrigem }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { index, lead, colunaOrigem },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const fonteLeadColors = {
    'Mensagem no site': 'bg-blue-100 text-blue-800 border-blue-400',
    'Simulação': 'bg-green-100 text-green-800 border-green-400',
    'Instagram': 'bg-pink-100 text-pink-800 border-pink-400',
    'Facebook': 'bg-blue-100 text-blue-800 border-blue-400',
    'LinkedIn': 'bg-indigo-100 text-indigo-800 border-indigo-400',
    'Círculo pessoal': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Indicação': 'bg-purple-100 text-purple-800 border-purple-400',
    'Indefinido': 'bg-gray-100 text-gray-800 border-gray-500',
  };

  const customIdColors = {
    carro: 'bg-red-100 text-red-800 border-red-400',
    moto: 'bg-blue-100 text-blue-800 border-blue-400',
  };

  // Função para determinar se o veículo é carro ou moto baseado no customId
  const getCustomIdType = (customId) => {
    if (!customId) return 'Indefinido';
    return customId.startsWith('c') ? 'carro' : customId.startsWith('m') ? 'moto' : 'Indefinido';
  };

  const [veiculo, setVeiculo] = useState(null);

  // Função para buscar o veículo baseado no customId
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

  return (
    <div
      ref={drag}
      className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between space-y-4"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">{lead.nome}</h3>
        <div className="text-sm text-gray-600 flex items-center">
          <FaEnvelope className="mr-2" /> {lead.email}
        </div>
        <div className="text-sm text-gray-600 flex items-center">
          <FaPhone className="mr-2" /> {lead.telefone}
        </div>
  
        {/* Mostra o nome do veículo se ele existir */}
        {veiculo ? (
          <p className="text-sm text-gray-600">
            Veículo de interesse: {veiculo.marca} {veiculo.modelo}
          </p>
        ) : (
          lead.customId && (
            <p className="text-sm itelic text-red-600">
              Veículo de interesse: {lead.customId}
            </p>
          )
        )}
  
        <p className="text-xs text-gray-400 mt-2">Criado em: {new Date(lead.dataCriacao).toLocaleDateString()}</p>
        <p className="text-xs text-gray-400">Última modificação: {new Date(lead.ultimaInteracao).toLocaleDateString()}</p>
      </div>
  
      <div className="flex justify-start mt-2 space-x-2">
        {/* Etiqueta da fonte do lead */}
        <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded ${fonteLeadColors[lead.fonteLead]}`}>
          {lead.fonteLead}
        </span>
  
        {/* Etiqueta para carro ou moto com base no customId */}
        {lead.customId && (
          <span
            className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded ${ 
              lead.customId.startsWith('c') ? customIdColors.carro : customIdColors.moto
            }`}
          >
           Cód. {lead.customId}
          </span>
        )}
      </div>
    </div>
  );
};



// Componente de Coluna (soltável)
const DroppableColumn = ({ etapa, leads, index, moveCard }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item) => moveCard(item.colunaOrigem, index, item.lead._id),
  });

  return (
    <div
      ref={drop}
      className={`bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-h-[500px] flex flex-col`}
    >
      <div className={`text-white rounded-t-lg p-2 text-center font-semibold mb-4 ${etapaColors[index]}`}>
        {etapa} ({leads.length})
      </div>
      <div className="flex-1 overflow-auto space-y-4">
        {leads.length === 0 ? (
          <p className="text-gray-500 italic text-center mt-6">Nenhum lead nesta etapa.</p>
        ) : (
          leads.map((lead, i) => (
            <DraggableCard key={lead._id} lead={lead} index={i} moveCard={moveCard} colunaOrigem={index} />
          ))
        )}
      </div>
    </div>
  );
};

const Kanban = () => {
  const [leads, setLeads] = useState([[], [], [], [], [], []]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ nome: '', telefone: '', email: '', estado: '' });

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes`);
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

  useEffect(() => {
    fetchLeads();
  }, []);

  const moveCard = async (sourceIndex, destinationIndex, leadId) => {
    setLeads((prevLeads) => {
      const newLeads = [...prevLeads];
      const [movedLead] = newLeads[sourceIndex].splice(
        newLeads[sourceIndex].findIndex((lead) => lead._id === leadId),
        1
      );
      movedLead.ultimaInteracao = new Date();
      newLeads[destinationIndex].push(movedLead);
      return newLeads;
    });

    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${leadId}/mover-etapa`, {
        etapa: etapaNames[destinationIndex],
        ultimaInteracao: new Date(),
      });
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
    }
  };

  const handleAddLead = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes`, newLead);
      fetchLeads();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar lead:', error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mb-4 flex justify-start">
          <button
            onClick={() => setIsModalOpen(true)}
            className="border border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors rounded-full px-4 py-2 flex items-center space-x-2 shadow-sm"
          >
            <FaPlus className="text-blue-500" />
            <span>Adicionar Lead</span>
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Adicionar Lead"
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        >
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto relative">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Adicionar Novo Lead</h2>

            {/* Campos para adicionar novo lead */}
            {/* ... campos de entrada aqui ... */}

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddLead}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Adicionar Lead
              </button>
            </div>
          </div>
        </Modal>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {leads.map((columnLeads, index) => (
            <DroppableColumn
              key={index}
              index={index}
              etapa={etapaNames[index]}
              leads={columnLeads}
              moveCard={moveCard}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Kanban;
