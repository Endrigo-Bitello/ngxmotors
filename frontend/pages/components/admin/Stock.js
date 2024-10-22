import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBolt, FaCarAlt, FaCheck, FaMotorcycle, FaPencilAlt, FaSearch, FaTrash } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import Image from 'next/image';
const Details = dynamic(() => import('./Details'));

export default function Stock() {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [filter, setFilter] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [isBoostModalOpen, setBoostModalOpen] = useState(false);
    const [isUnboostModalOpen, setUnboostModalOpen] = useState(false);
    const [vehicleToBoost, setVehicleToBoost] = useState(null);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    // Função para abrir o modal de confirmação de remoção
    const handleDeleteClick = (vehicle) => {
        setVehicleToDelete(vehicle); // Define o veículo que será deletado
        setDeleteModalOpen(true); // Abre o modal de confirmação
    };

    // Função para cancelar a remoção
    const cancelDelete = () => {
        setDeleteModalOpen(false); // Fecha o modal de confirmação
        setVehicleToDelete(null); // Limpa o veículo a ser deletado
    };

    const confirmDelete = async () => {
        if (vehicleToDelete) {
            try {
                const { customId, tipo } = vehicleToDelete;
                const deleteResponse = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/${tipo === 'carro' ? 'carros' : 'motos'}/customId/${customId}`);

                if (deleteResponse.status === 200) {
                    setVehicles((prevVehicles) => prevVehicles.filter((vehicle) => vehicle.customId !== customId));
                    alert('Veículo removido com sucesso!');
                    setDeleteModalOpen(false);
                } else {
                    alert('Erro ao remover o veículo. Tente novamente.');
                }
            } catch (error) {
                console.error('Erro ao remover veículo:', error);
                alert('Erro ao remover o veículo. Tente novamente.');
            }
        }
    };

    const handleViewDetails = (vehicle) => {
        setSelectedVehicle(vehicle);  // Set the vehicle to display its details
    };


    const handleCloseDetails = () => {
        setSelectedVehicle(null);  // Close the modal by setting it to null
    };


    const handleBoostClick = (vehicle) => {
        setVehicleToBoost(vehicle);
        setBoostModalOpen(true);
    };

    // Função para abrir o modal de confirmação de remoção de impulso
    const handleUnboostClick = (vehicle) => {
        setVehicleToBoost(vehicle);
        setUnboostModalOpen(true);
    };

    // Função para cancelar o impulso
    const cancelBoost = () => {
        setBoostModalOpen(false);
    };

    // Função para cancelar a remoção do impulso
    const cancelUnboost = () => {
        setUnboostModalOpen(false);
    };


    const confirmBoost = async () => {
        try {
            const route = vehicleToBoost.tipo === 'carro' ? 'carros' : 'motos';
            const updatedVehicle = { ...vehicleToBoost, destaque: true };

            // Atualiza apenas o campo destaque do veículo
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/${route}/${vehicleToBoost.customId}`, updatedVehicle);

            alert('Veículo impulsionado com sucesso!');
            fetchVehicles(); // Atualiza a lista de veículos após a alteração
        } catch (error) {
            console.error('Erro ao impulsionar o veículo:', error);
            alert('Erro ao impulsionar o veículo. Tente novamente.');
        } finally {
            setBoostModalOpen(false);
        }
    };

    // Função para confirmar a remoção do impulso
    const confirmUnboost = async () => {
        try {
            const route = vehicleToBoost.tipo === 'carro' ? 'carros' : 'motos';
            const updatedVehicle = { ...vehicleToBoost, destaque: false };

            // Atualiza apenas o campo destaque do veículo
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/${route}/${vehicleToBoost.customId}`, updatedVehicle);

            alert('Destaque removido com sucesso!');
            fetchVehicles(); // Atualiza a lista de veículos após a alteração
        } catch (error) {
            console.error('Erro ao remover o destaque do veículo:', error);
            alert('Erro ao remover o destaque do veículo. Tente novamente.');
        } finally {
            setUnboostModalOpen(false);
        }
    };

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
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const filteredVehicles = vehicles.filter((vehicle) => {
        const matchesFilter =
            filter === 'todos' ||
            (filter === 'carro' && vehicle.customId.startsWith('c')) ||
            (filter === 'moto' && vehicle.customId.startsWith('m'));

        const matchesSearch =
            vehicle.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.customId?.toString().toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const getImagePath = (vehicle) => {
        return vehicle.imagens && vehicle.imagens.length > 0 ? vehicle.imagens[0] : '';
    };

    return (
        <div className="bg-gray-100 min-h-screen py-6 px-4 md:px-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Veículos em Estoque</h1>

            {/* Barra de Ferramentas */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                {/* Botões de Filtro */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilter('todos')}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${filter === 'todos'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                            }`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter('carro')}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${filter === 'carro'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                            }`}
                    >
                        <FaCarAlt className="mr-2" />
                        Carros
                    </button>
                    <button
                        onClick={() => setFilter('moto')}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${filter === 'moto'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                            }`}
                    >
                        <FaMotorcycle className="mr-2" />
                        Motos
                    </button>
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
                    <div
                        key={vehicle._id}
                        className="relative bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >

                        {/* Imagem do veículo */}
                        {vehicle.imagens && vehicle.imagens.length > 0 ? (
                            <div className="relative h-64 w-full">
                                <Image
                                    src={getImagePath(vehicle)}
                                    alt={vehicle.modelo}
                                    layout="fill"
                                    objectFit="cover"
                                    className="z-1 relative rounded-sm group-hover:scale-110 transition-all ease-in-out duration-100"
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
                                        R$ {vehicle.valorVenda.toLocaleString('pt-BR') + ",00"}
                                    </p>
                                    <p className="text-xs text-gray-500">Preço de Venda</p>
                                </div>
                                <p className="text-xs text-gray-500">ID: {vehicle.customId}</p>
                            </div>

                            <div className="flex justify-between items-center mt-4 space-x-4">
                                {/* Botão Editar com Ícone */}
                                <button
                                    className="flex items-center justify-center w-full bg-transparent text-blue-600 border border-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition-all focus:outline-none focus:ring focus:ring-blue-300"
                                    onClick={() => handleViewDetails(vehicle)}
                                >
                                    <FaPencilAlt className="mr-2" />
                                    Editar
                                </button>

                                {/* Botão de Impulsionar ou Impulsionado */}
                                {vehicle.destaque ? (
                                    <button
                                        className="flex items-center justify-center w-full bg-transparent text-green-600 border border-green-600 py-2 px-4 rounded-md hover:bg-green-50 transition-all focus:outline-none focus:ring focus:ring-green-300"
                                        onClick={() => handleUnboostClick(vehicle)}
                                    >
                                        <FaCheck className="mr-2" />
                                        Impulsionado
                                    </button>
                                ) : (
                                    <button
                                        className="flex items-center justify-center w-full bg-transparent text-yellow-500 border border-yellow-500 py-2 px-4 rounded-md hover:bg-yellow-50 transition-all focus:outline-none focus:ring focus:ring-yellow-300"
                                        onClick={() => handleBoostClick(vehicle)}
                                    >
                                        <FaBolt className="mr-2" />
                                        Impulsionar
                                    </button>
                                )}

                                {/* Botão Remover com Ícone */}
                                <button
                                    onClick={() => handleDeleteClick(vehicle)}
                                    className="ml-4 text-gray-500 hover:text-red-500 transition-all focus:outline-none focus:ring focus:ring-red-300"
                                >
                                    <FaTrash />
                                </button>
                            </div>

                        </div>
                    </div>
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
                    onSave={fetchVehicles} // Pass the callback function to refresh the vehicles
                />
            )}

            {/* Pop-up de Confirmação de Remoção */}
            {isDeleteModalOpen && vehicleToDelete && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black bg-opacity-50"></div>
                    <div className="bg-white rounded-lg shadow-lg p-6 z-50 max-w-sm w-full">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Deseja remover este veículo?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelDelete}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Outros Modais (Impulsionar e Remover Impulso) */}
            {isBoostModalOpen && vehicleToBoost && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black bg-opacity-50"></div>
                    <div className="bg-white rounded-lg shadow-lg p-6 z-50 max-w-sm w-full">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Deseja realmente impulsionar este veículo?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Esta ação destacará o veículo para todos os usuários.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelBoost}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmBoost}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isUnboostModalOpen && vehicleToBoost && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black bg-opacity-50"></div>
                    <div className="bg-white rounded-lg shadow-lg p-6 z-50 max-w-sm w-full">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Deseja remover o destaque deste veículo?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Esta ação removerá o destaque deste veículo.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelUnboost}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmUnboost}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}    