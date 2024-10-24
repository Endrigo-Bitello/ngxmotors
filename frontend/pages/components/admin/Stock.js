import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaBolt,
  FaCarAlt,
  FaCheck,
  FaMotorcycle,
  FaPencilAlt,
  FaSearch,
  FaTrash,
} from 'react-icons/fa';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const Details = dynamic(() => import('./Details'));

const VehicleCard = ({
  vehicle,
  onEdit,
  onDelete,
  onBoost,
  onUnboost,
}) => {
  const getImagePath = () => {
    return vehicle.imagens && vehicle.imagens.length > 0 ? vehicle.imagens[0] : '';
  };

  return (
    <div className="relative bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Imagem do veículo */}
      {vehicle.imagens && vehicle.imagens.length > 0 ? (
        <div className="relative h-72 w-full">
          <Image
            src={getImagePath()}
            alt={vehicle.modelo}
            layout="fill"
            objectFit="cover"
            className="z-1 relative"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          Sem imagem
        </div>
      )}

      {/* Informações do Veículo */}
      <div className="p-4">
        <div className="flex items-center mb-1">
          <Image
            src={`/icons/${vehicle.marca.toLowerCase().replace(/ /g, '-')}.png`}
            alt={vehicle.marca}
            width={24}
            height={24}
            className="mr-2"
          />
          <h2 className="text-xl font-bold text-gray-800">
            {vehicle.modelo}
          </h2>
        </div>

        <p className="text-sm text-gray-600 mb-2">
          {vehicle.anoFabricacao}/{vehicle.anoModelo} • {vehicle.transmissao}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-blue-600">
              R$ {vehicle.valorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500">Preço de Venda</p>
          </div>
          <p className="text-xs text-gray-500">ID: {vehicle.customId}</p>
        </div>

        <div className="flex justify-between items-center mt-4 space-x-4">
          {/* Botão Editar */}
          <button
            className="flex items-center justify-center w-full bg-transparent text-blue-600 border border-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition-all focus:outline-none focus:ring focus:ring-blue-300"
            onClick={() => onEdit(vehicle)}
          >
            <FaPencilAlt className="mr-2" />
            Editar
          </button>

          {/* Botão de Impulsionar ou Remover Impulso */}
          {vehicle.destaque ? (
            <button
              className="flex items-center justify-center w-full bg-transparent text-green-600 border border-green-600 py-2 px-4 rounded-md hover:bg-green-50 transition-all focus:outline-none focus:ring focus:ring-green-300"
              onClick={() => onUnboost(vehicle)}
            >
              <FaCheck className="mr-2" />
              Impulsionado
            </button>
          ) : (
            <button
              className="flex items-center justify-center w-full bg-transparent text-yellow-500 border border-yellow-500 py-2 px-4 rounded-md hover:bg-yellow-50 transition-all focus:outline-none focus:ring focus:ring-yellow-300"
              onClick={() => onBoost(vehicle)}
            >
              <FaBolt className="mr-2" />
              Impulsionar
            </button>
          )}

          {/* Botão Remover */}
          <button
            onClick={() => onDelete(vehicle)}
            className="ml-4 text-gray-500 hover:text-red-500 transition-all focus:outline-none focus:ring focus:ring-red-300"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  confirmButtonColor,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-50 max-w-sm w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            {cancelText || 'Cancelar'}
          </button>
          <button
            onClick={onConfirm}
            className={`${confirmButtonColor} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity`}
          >
            {confirmText || 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Stock() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vehicleToBoost, setVehicleToBoost] = useState(null);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [boostAction, setBoostAction] = useState(''); // 'boost' or 'unboost'

  const fetchVehicles = async () => {
    try {
      const [carRes, motoRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/carros`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/motos`),
      ]);

      const allVehicles = [
        ...carRes.data.map((car) => ({ ...car, tipo: 'carro' })),
        ...motoRes.data.map((moto) => ({ ...moto, tipo: 'moto' })),
      ];

      setVehicles(allVehicles);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      alert('Erro ao buscar veículos. Tente novamente mais tarde.');
    }
  };


  const handleVehicleUpdate = () => {
    fetchVehicles(); // Recarrega os veículos
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDeleteClick = (vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteModalOpen(true);
  };

  const handleBoostClick = (vehicle) => {
    setVehicleToBoost(vehicle);
    setBoostAction('boost');
    setBoostModalOpen(true);
  };

  const handleUnboostClick = (vehicle) => {
    setVehicleToBoost(vehicle);
    setBoostAction('unboost');
    setBoostModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const { customId, tipo } = vehicleToDelete;
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/${tipo === 'carro' ? 'carros' : 'motos'}/customId/${customId}`
      );
      setVehicles((prev) => prev.filter((v) => v.customId !== customId));
      alert('Veículo removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover veículo:', error);
      alert('Erro ao remover o veículo. Tente novamente.');
    } finally {
      setDeleteModalOpen(false);
      setVehicleToDelete(null);
    }
  };

  const handleConfirmBoost = async () => {
    try {
      const route = vehicleToBoost.tipo === 'carro' ? 'carros' : 'motos';
      const updatedVehicle = {
        ...vehicleToBoost,
        destaque: boostAction === 'boost',
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/${route}/${vehicleToBoost.customId}`,
        updatedVehicle
      );

      alert(
        boostAction === 'boost'
          ? 'Veículo impulsionado com sucesso!'
          : 'Destaque removido com sucesso!'
      );
      fetchVehicles();
    } catch (error) {
      console.error('Erro ao atualizar o destaque do veículo:', error);
      alert('Erro ao atualizar o destaque do veículo. Tente novamente.');
    } finally {
      setBoostModalOpen(false);
      setVehicleToBoost(null);
      setBoostAction('');
    }
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleCloseDetails = () => {
    setSelectedVehicle(null);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesFilter =
      filter === 'todos' ||
      (filter === 'carro' && vehicle.tipo === 'carro') ||
      (filter === 'moto' && vehicle.tipo === 'moto');

    const search = searchTerm.toLowerCase();
    const matchesSearch =
      vehicle.marca?.toLowerCase().includes(search) ||
      vehicle.modelo?.toLowerCase().includes(search) ||
      vehicle.customId?.toString().toLowerCase().includes(search);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4 md:px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Veículos em Estoque</h1>

      {/* Barra de Ferramentas */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        {/* Botões de Filtro */}
        <div className="flex space-x-2">
          {['todos', 'carro', 'moto'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {type === 'carro' && <FaCarAlt className="mr-2" />}
              {type === 'moto' && <FaMotorcycle className="mr-2" />}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar por marca ou modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Listagem de Veículos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle._id}
            vehicle={vehicle}
            onEdit={handleEditVehicle}
            onDelete={handleDeleteClick}
            onBoost={handleBoostClick}
            onUnboost={handleUnboostClick}
          />
        ))}
      </div>

      {/* Caso não haja veículos */}
      {filteredVehicles.length === 0 && (
        <div className="text-center text-gray-500 mt-12">
          <p>Nenhum veículo encontrado.</p>
        </div>
      )}

      {/* Modal de Detalhes do Veículo */}
      {selectedVehicle && (
        <Details
          vehicle={selectedVehicle}
          onClose={handleCloseDetails}
          onSave={handleVehicleUpdate}
        />
      )}

      {/* Modal de Confirmação de Remoção */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Deseja remover este veículo?"
        message="Esta ação não pode ser desfeita."
        confirmText="Confirmar"
        cancelText="Cancelar"
        confirmButtonColor="bg-red-600"
      />

      {/* Modal de Impulsionar/Remover Impulso */}
      <ConfirmationModal
        isOpen={boostModalOpen}
        onClose={() => setBoostModalOpen(false)}
        onConfirm={handleConfirmBoost}
        title={
          boostAction === 'boost'
            ? 'Deseja realmente impulsionar este veículo?'
            : 'Deseja remover o destaque deste veículo?'
        }
        message={
          boostAction === 'boost'
            ? 'Esta ação destacará o veículo para todos os usuários.'
            : 'Esta ação removerá o destaque deste veículo.'
        }
        confirmText="Confirmar"
        cancelText="Cancelar"
        confirmButtonColor={boostAction === 'boost' ? 'bg-green-600' : 'bg-red-600'}
      />
    </div>
  );
}
