import { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaEdit } from 'react-icons/fa';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios'; // Importando axios

// Definir tipos para os items de arrastar
const ItemTypes = {
  CARD: 'card',
};

// Definir cores e nomes para as etapas
const etapaColors = ['bg-green-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-gray-500'];
const etapaNames = ['Novo Lead', 'Qualificação', 'Em Negociação', 'Fechamento', 'Pós Venda', 'Perdidos'];

// Componente de Card individual (arrastável)
const DraggableCard = ({ lead, index, moveCard, colunaOrigem }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { index, lead, colunaOrigem }, // Passando a coluna de origem
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="bg-white border border-gray-200 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col space-y-2"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">{lead.nome}</h3>
      </div>
      <div className="text-sm text-gray-600 flex items-center">
        <FaEnvelope className="mr-2" /> {lead.email}
      </div>
      <div className="text-sm text-gray-600 flex items-center">
        <FaPhone className="mr-2" /> {lead.telefone}
      </div>
      <p className="text-xs text-gray-400 mt-2">Criado em: {new Date(lead.dataCriacao).toLocaleDateString()}</p>
    </div>
  );
};

// Componente de Coluna (soltável)
const DroppableColumn = ({ etapa, leads, index, moveCard }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item) => moveCard(item.colunaOrigem, index, item.lead._id), // Passar a coluna de origem e destino
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
        {leads.map((lead, i) => (
          <DraggableCard key={lead._id} lead={lead} index={i} moveCard={moveCard} colunaOrigem={index} />
        ))}
      </div>
    </div>
  );
};

const Kanban = () => {
  const [leads, setLeads] = useState([[], [], [], [], [], []]); // Arrays numéricos para representar as colunas

  // Função para buscar os leads do servidor e organizar por etapas
  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes`);
      const clientes = response.data;

      const leadsPorEtapa = [[], [], [], [], [], []]; // Inicializando arrays para cada coluna
      clientes.forEach((cliente) => {
        const etapaIndex = etapaNames.indexOf(cliente.etapa); // Identifica o índice da etapa
        if (etapaIndex !== -1) {
          leadsPorEtapa[etapaIndex].push(cliente); // Adiciona o cliente na etapa correspondente
        }
      });

      setLeads(leadsPorEtapa);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    }
  };

  useEffect(() => {
    fetchLeads(); // Buscar leads ao carregar o componente
  }, []);

  // Função para mover o card de uma coluna para outra e atualizar a etapa no MongoDB
  const moveCard = async (sourceIndex, destinationIndex, leadId) => {
    setLeads((prevLeads) => {
      const newLeads = [...prevLeads];
      const [movedLead] = newLeads[sourceIndex].splice(
        newLeads[sourceIndex].findIndex((lead) => lead._id === leadId),
        1
      ); // Remove o card da coluna de origem
      newLeads[destinationIndex].push(movedLead); // Adiciona o card na coluna de destino
      return newLeads;
    });

    // Atualizar a etapa no MongoDB
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${leadId}/mover-etapa`, {
        etapa: etapaNames[destinationIndex],
      });
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">CRM - Painel de Leads</h1>
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
