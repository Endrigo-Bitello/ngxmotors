import { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import {
  faTrashAlt,
  faWhatsapp,
  faEnvelope,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Loading = dynamic(() => import('../Loading'));
const NavbarButtons = dynamic(() => import('./NavbarButtons'));

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
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/mensagens/${mensagem._id}`, {
        status: newStatus,
      });
      setMensagens(
        mensagens.map((msg) =>
          msg._id === mensagem._id ? { ...msg, status: newStatus } : msg
        )
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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Dashboard Header */}
      <div className="p-6 bg-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mensagens</h1>
            <p className="text-gray-600">Gerencie as mensagens recebidas dos clientes</p>
          </div>
          {/* Refresh Button */}
          <button
            onClick={refreshMensagens}
            className="text-gray-600 hover:text-gray-800 focus:outline-none mt-4 md:mt-0"
            title="Atualizar"
          >
            <FontAwesomeIcon icon={faSyncAlt} size="lg" />
          </button>
        </div>

        {/* Estatísticas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-100 p-6 rounded-lg flex items-center">
            <div className="text-blue-600">
              <FontAwesomeIcon icon={faEnvelope} size="2x" />
            </div>
            <div className="ml-4">
              <p className="text-gray-700">Total de Mensagens</p>
              <h2 className="text-3xl font-bold text-blue-600">{totalMensagens}</h2>
            </div>
          </div>
          <div className="bg-yellow-100 p-6 rounded-lg flex items-center">
            <div className="text-yellow-600">
              <FontAwesomeIcon icon={faEnvelope} size="2x" />
            </div>
            <div className="ml-4">
              <p className="text-gray-700">Não Respondidas</p>
              <h2 className="text-3xl font-bold text-yellow-600">{mensagensNaoRespondidas}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-300 flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-300">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar mensagens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M15 11a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>

          {/* Lista de Mensagens */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loading />
              </div>
            ) : filteredMensagens.length > 0 ? (
              <ul>
                {filteredMensagens.map((mensagem) => (
                  <li
                    key={mensagem._id}
                    className={`flex items-center px-4 py-3 cursor-pointer hover:bg-blue-50 ${
                      selectedMensagem && selectedMensagem._id === mensagem._id
                        ? 'bg-blue-100'
                        : ''
                    }`}
                    onClick={() => {
                      setSelectedMensagem(mensagem);
                    }}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {mensagem.nome.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Prévia da Mensagem */}
                    <div className="flex-grow ml-3 overflow-hidden">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                          {mensagem.nome}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {new Date(mensagem.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{mensagem.mensagem}</p>
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
        <div className="flex-1 bg-white flex flex-col p-4">
          {selectedMensagem ? (
            <>
              {/* Cabeçalho da Mensagem */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedMensagem.nome}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedMensagem.email}</p>
                  {/* Status da Mensagem */}
                  <div className="mt-2 flex items-center">
                    <span className="text-sm mr-2">Status:</span>
                    <button
                      onClick={() => handleStatusToggle(selectedMensagem)}
                      className={`px-3 py-1 rounded-full text-sm font-medium focus:outline-none ${
                        selectedMensagem.status === 'Não respondido'
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      {selectedMensagem.status}
                    </button>
                  </div>
                  {selectedMensagem.customId && (
                    <p className="mt-1 text-sm">
                      Cód. Veículo:{' '}
                      <span className="font-medium text-gray-700">
                        {selectedMensagem.customId}
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  {/* Contato via WhatsApp */}
                  <a
                    href={`https://wa.me/${selectedMensagem.telefone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-600"
                    title="Entrar em contato via WhatsApp"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} size="2x" />
                  </a>

                  {/* Excluir Mensagem */}
                  <button
                    onClick={() => handleDelete(selectedMensagem._id)}
                    className="text-red-500 hover:text-red-600"
                    title="Excluir mensagem"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} size="2x" />
                  </button>
                </div>
              </div>

              {/* Conteúdo da Mensagem */}
              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedMensagem.mensagem}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Selecione uma mensagem para visualizar os detalhes.</p>
            </div>
          )}
                      <NavbarButtons />
        </div>
      </div>
    </div>
  );
}
