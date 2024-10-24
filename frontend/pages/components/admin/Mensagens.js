import { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { faTrashAlt, faSyncAlt, faCar, faIdBadge } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingPanel from './LoadingPanel';
const Loading = dynamic(() => import('../Loading'));

export default function Mensagens() {
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMensagem, setSelectedMensagem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estatísticas
  const [totalMensagens, setTotalMensagens] = useState(0);
  const [mensagensNaoRespondidas, setMensagensNaoRespondidas] = useState(0);

  useEffect(() => {
    fetchMensagens();
  }, []);

  useEffect(() => {
    calcularEstatisticas();
  }, [mensagens]);

  const fetchMensagens = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/mensagens`);
      setMensagens(res.data);
      setSelectedMensagem(null);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = () => {
    setTotalMensagens(mensagens.length);
    const naoRespondidas = mensagens.filter(
      (mensagem) => mensagem.status === 'Não respondido'
    ).length;
    setMensagensNaoRespondidas(naoRespondidas);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/mensagens/${id}`);
      setMensagens(mensagens.filter((mensagem) => mensagem._id !== id));
      if (selectedMensagem && selectedMensagem._id === id) {
        setSelectedMensagem(null);
      }
    } catch (error) {
      console.error('Erro ao excluir a mensagem:', error);
    }
  };

  const handleStatusToggle = async (mensagem) => {
    const newStatus = mensagem.status === 'Não respondido' ? 'Respondido' : 'Não respondido';
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/mensagens/${mensagem._id}`,
        { status: newStatus }
      );
      setMensagens(
        mensagens.map((msg) => (msg._id === mensagem._id ? { ...msg, status: newStatus } : msg))
      );
      if (selectedMensagem && selectedMensagem._id === mensagem._id) {
        setSelectedMensagem({ ...mensagem, status: newStatus });
      }
    } catch (error) {
      console.error('Erro ao atualizar status da mensagem:', error);
    }
  };

  const refreshMensagens = async () => {
    await fetchMensagens();
  };

  const filteredMensagens = mensagens.filter((mensagem) => {
    const matchTerm =
      mensagem.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mensagem.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mensagem.mensagem.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTerm;
  });

  const avatarColors = [
    'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
  ];

  // Função para selecionar uma cor aleatória
  const getRandomColor = (nome) => {
    const index = nome.charCodeAt(0) % avatarColors.length;
    return avatarColors[index];
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${selectedMensagem ? 'hidden' : 'flex'} md:flex flex-col w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Mensagens</h1>
          <button onClick={refreshMensagens} className="text-blue-600 hover:text-blue-800 focus:outline-none" title="Atualizar">
            <FontAwesomeIcon icon={faSyncAlt} size="lg" />
          </button>
        </div>

        {/* Barra de Busca */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar mensagens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>

        {/* Lista de Mensagens */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingPanel />
            </div>
          ) : filteredMensagens.length > 0 ? (
            <ul>
              {filteredMensagens.map((mensagem, index) => (
                <li
                  key={mensagem._id}
                  className={`flex items-center px-4 py-3 cursor-pointer hover:bg-blue-50 transition ${selectedMensagem && selectedMensagem._id === mensagem._id ? 'bg-blue-100' : ''
                    } ${index !== filteredMensagens.length - 1 ? 'border-b border-gray-200' : ''}`}
                  onClick={() => setSelectedMensagem(mensagem)}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 ${getRandomColor(mensagem.nome)} text-white rounded-full flex items-center justify-center font-semibold`}>
                      {mensagem.nome.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Prévia da Mensagem */}
                  <div className="flex-grow ml-3 overflow-hidden">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">{mensagem.nome}</h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {new Date(mensagem.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1 sm:line-clamp-2">{mensagem.mensagem}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Nenhuma mensagem encontrada.</p>
            </div>
          )}
        </div>


      </div>

      {/* Detalhes da Mensagem */}
      <div className={`${selectedMensagem ? 'flex' : 'hidden'} md:flex flex-col flex-1 bg-white`}>
        {selectedMensagem ? (
          <>
            {/* Botão Voltar (Mobile) */}
            <div className="md:hidden p-4">
              <button onClick={() => setSelectedMensagem(null)} className="text-blue-600 hover:text-blue-800 flex items-center">
                &larr; Voltar
              </button>
            </div>

            {/* Cabeçalho da Mensagem */}
            <div className="bg-white shadow p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Detalhes da Mensagem</h2>
                <p className="text-sm text-gray-500 mt-1">Visualize as informações da mensagem selecionada</p>
              </div>
              {/* Botões de Ação */}
              <div className="flex items-center space-x-4">
                {/* Contato via WhatsApp */}
                <a href={`https://wa.me/${selectedMensagem.telefone}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600" title="Entrar em contato via WhatsApp">
                  <FontAwesomeIcon icon={faWhatsapp} size="lg" />
                </a>

                {/* Excluir Mensagem */}
                <button onClick={() => handleDelete(selectedMensagem._id)} className="text-red-500 hover:text-red-600" title="Excluir mensagem">
                  <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                </button>
              </div>
            </div>

            {/* Conteúdo da Mensagem */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Informações Pessoais */}
                <section className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">Informações do Remetente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-700 mb-2">
                        <span className="font-medium">Nome:</span> <span>{selectedMensagem.nome}</span>
                      </p>
                      <p className="text-gray-700 mb-2">
                        <span className="font-medium">Email:</span> <span>{selectedMensagem.email}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-700 mb-2">
                        <span className="font-medium">Telefone:</span> <span>{selectedMensagem.telefone}</span>
                      </p>
                      <p className="text-gray-700 mb-2">
                        <span className="font-medium">Data:</span> <span>{new Date(selectedMensagem.createdAt).toLocaleDateString('pt-BR')}</span>
                      </p>
                    </div>
                  </div>
                </section>

                {/* Conteúdo da Mensagem */}
                <section className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">Mensagem</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{selectedMensagem.mensagem}</p>
                </section>

                {/* Informações do Veículo (se aplicável) */}
                {selectedMensagem.customId && (
                  <section className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">Detalhes do Veículo</h3>
                    <p className="text-gray-700">Código do Veículo: <span>{selectedMensagem.customId}</span></p>
                  </section>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Selecione uma mensagem para visualizar os detalhes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
