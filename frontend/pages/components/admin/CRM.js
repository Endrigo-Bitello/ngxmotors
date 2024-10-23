import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import format from 'date-fns/format';

const CRM = () => {
  // Estado para armazenar os leads de cada etapa
  const [leads, setLeads] = useState({
    novoLead: [],
    qualificacao: [],
    negociacao: [],
    fechamento: [],
    posVenda: [],
    perdido: [], // Coluna para leads perdidos
  });

  // Função para simular a busca de leads (futuramente será integrado ao backend)
  useEffect(() => {
    const mockLeads = {
      novoLead: [
        { id: '1', nome: 'João Silva', status: 'Novo Lead', veiculo: 'Honda Civic', ultimaModificacao: '2024-10-01', responsavel: 'Pedro Ferreira' },
        { id: '2', nome: 'Maria Souza', status: 'Novo Lead', veiculo: 'Toyota Corolla', ultimaModificacao: '2024-10-03', responsavel: 'Ana Costa' },
      ],
      qualificacao: [
        { id: '3', nome: 'Carlos Pereira', status: 'Qualificação', veiculo: 'Chevrolet Onix', ultimaModificacao: '2024-09-25', responsavel: 'Lucas Martins' },
      ],
      negociacao: [
        { id: '4', nome: 'Ana Lima', status: 'Negociação', veiculo: 'Ford EcoSport', ultimaModificacao: '2024-10-02', responsavel: 'Mariana Silva' },
      ],
      fechamento: [
        { id: '5', nome: 'Paulo Oliveira', status: 'Fechamento', veiculo: 'Jeep Compass', ultimaModificacao: '2024-09-30', responsavel: 'Ricardo Borges' },
      ],
      posVenda: [
        { id: '6', nome: 'Clara Mendes', status: 'Pós-Venda', veiculo: 'Fiat Argo', ultimaModificacao: '2024-09-15', responsavel: 'Julia Neves' },
      ],
      perdido: [
        { id: '7', nome: 'Marcelo Andrade', status: 'Perdido', veiculo: 'Volkswagen Jetta', ultimaModificacao: '2024-09-10', responsavel: 'Carlos Souza' },
      ],
    };

    setLeads(mockLeads);
  }, []);

  // Função para lidar com a movimentação do card entre as etapas
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return; // Se o card for solto fora de uma coluna, não faz nada
    if (destination.droppableId === source.droppableId && destination.index === source.index) return; // Se soltar no mesmo lugar

    const start = source.droppableId;
    const end = destination.droppableId;

    // Movendo dentro da mesma coluna
    if (start === end) {
      const newLeads = Array.from(leads[start]);
      const [movedLead] = newLeads.splice(source.index, 1);
      newLeads.splice(destination.index, 0, movedLead);
      setLeads((prevState) => ({ ...prevState, [start]: newLeads }));
    } else {
      // Movendo para outra coluna
      const startLeads = Array.from(leads[start]);
      const [movedLead] = startLeads.splice(source.index, 1);
      const endLeads = Array.from(leads[end]);
      endLeads.splice(destination.index, 0, movedLead);

      setLeads((prevState) => ({
        ...prevState,
        [start]: startLeads,
        [end]: endLeads,
      }));
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-semibold text-gray-700 mb-6">CRM - Gestão de Leads</h1>

        {/* Grid com 6 colunas, uma para cada etapa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {Object.keys(leads).map((etapa) => (
            <Droppable droppableId={etapa} key={etapa}>
              {(provided) => (
                <div
                  className="bg-white p-4 shadow-lg rounded-lg"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className={`text-xl font-bold mb-4 capitalize flex items-center justify-center bg-${getEtapaColor(etapa)}-100 text-${getEtapaColor(etapa)}-700 rounded-full py-2 px-4`}>
                    {etapa} ({leads[etapa].length})
                  </h2>
                  <div className="space-y-4">
                    {leads[etapa].map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided) => (
                          <div
                            className="bg-blue-100 p-4 rounded-md shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-gray-300"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h3 className="font-semibold text-lg text-gray-800">{lead.nome}</h3>
                            <p className="text-sm text-gray-600">Veículo: {lead.veiculo}</p>
                            <p className="text-xs text-gray-500">
                              Última modificação: {format(new Date(lead.ultimaModificacao), 'dd/MM/yyyy')}
                            </p>
                            <p className="text-xs text-gray-700">Responsável: {lead.responsavel}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

// Função auxiliar para definir a cor de cada etapa
const getEtapaColor = (etapa) => {
  switch (etapa) {
    case 'novoLead':
      return 'blue';
    case 'qualificacao':
      return 'yellow';
    case 'negociacao':
      return 'orange';
    case 'fechamento':
      return 'green';
    case 'posVenda':
      return 'gray';
    case 'perdido':
      return 'red';
    default:
      return 'gray';
  }
};

export default CRM;
