import { useState, useEffect } from 'react';

const CRM = () => {
  // Estado para armazenar os leads de cada etapa
  const [leads, setLeads] = useState({
    novoLead: [],
    qualificacao: [],
    negociacao: [],
    fechamento: [],
    posVenda: [],
  });

  // Função para simular a busca de leads (futuramente será integrado ao backend)
  useEffect(() => {
    // Aqui você pode fazer uma chamada à API para buscar os leads no backend
    // Exemplo de estrutura de dados para cada lead
    const mockLeads = {
      novoLead: [
        { id: 1, nome: 'João Silva', status: 'Novo Lead', veiculo: 'Honda Civic' },
        { id: 2, nome: 'Maria Souza', status: 'Novo Lead', veiculo: 'Toyota Corolla' },
      ],
      qualificacao: [
        { id: 3, nome: 'Carlos Pereira', status: 'Qualificação', veiculo: 'Chevrolet Onix' },
      ],
      negociacao: [
        { id: 4, nome: 'Ana Lima', status: 'Negociação', veiculo: 'Ford EcoSport' },
      ],
      fechamento: [
        { id: 5, nome: 'Paulo Oliveira', status: 'Fechamento', veiculo: 'Jeep Compass' },
      ],
      posVenda: [
        { id: 6, nome: 'Clara Mendes', status: 'Pós-Venda', veiculo: 'Fiat Argo' },
      ],
    };

    setLeads(mockLeads);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-700 mb-6">CRM - Gestão de Leads</h1>

      {/* Grid com 5 colunas, uma para cada etapa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Coluna de Novo Lead */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h2 className="text-xl font-bold text-blue-600 mb-4">Novo Lead</h2>
          <div className="space-y-4">
            {leads.novoLead.map((lead) => (
              <div key={lead.id} className="bg-blue-100 p-4 rounded-md shadow-sm">
                <h3 className="font-semibold">{lead.nome}</h3>
                <p className="text-sm text-gray-600">{lead.veiculo}</p>
                <p className="text-xs text-blue-600">{lead.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna de Qualificação */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h2 className="text-xl font-bold text-yellow-600 mb-4">Qualificação</h2>
          <div className="space-y-4">
            {leads.qualificacao.map((lead) => (
              <div key={lead.id} className="bg-yellow-100 p-4 rounded-md shadow-sm">
                <h3 className="font-semibold">{lead.nome}</h3>
                <p className="text-sm text-gray-600">{lead.veiculo}</p>
                <p className="text-xs text-yellow-600">{lead.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna de Negociação */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h2 className="text-xl font-bold text-orange-600 mb-4">Negociação</h2>
          <div className="space-y-4">
            {leads.negociacao.map((lead) => (
              <div key={lead.id} className="bg-orange-100 p-4 rounded-md shadow-sm">
                <h3 className="font-semibold">{lead.nome}</h3>
                <p className="text-sm text-gray-600">{lead.veiculo}</p>
                <p className="text-xs text-orange-600">{lead.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna de Fechamento */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h2 className="text-xl font-bold text-green-600 mb-4">Fechamento</h2>
          <div className="space-y-4">
            {leads.fechamento.map((lead) => (
              <div key={lead.id} className="bg-green-100 p-4 rounded-md shadow-sm">
                <h3 className="font-semibold">{lead.nome}</h3>
                <p className="text-sm text-gray-600">{lead.veiculo}</p>
                <p className="text-xs text-green-600">{lead.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna de Pós-Venda */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h2 className="text-xl font-bold text-gray-600 mb-4">Pós-Venda</h2>
          <div className="space-y-4">
            {leads.posVenda.map((lead) => (
              <div key={lead.id} className="bg-gray-100 p-4 rounded-md shadow-sm">
                <h3 className="font-semibold">{lead.nome}</h3>
                <p className="text-sm text-gray-600">{lead.veiculo}</p>
                <p className="text-xs text-gray-600">{lead.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRM;
