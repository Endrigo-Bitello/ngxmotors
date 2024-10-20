import { useState } from 'react';
import dynamic from 'next/dynamic';
const NewCar = dynamic(() => import('../../components/admin/NewCar'));
const NewMotorcycle = dynamic(() => import('../../components/admin/NewMotorcycle'));


export default function AddVehicle() {
  const [vehicleType, setVehicleType] = useState(null);

  // Função para definir o tipo de veículo a ser adicionado
  const handleVehicleType = (type) => {
    setVehicleType(type);
  };

  // Função para voltar à escolha de veículo
  const handleBack = () => {
    setVehicleType(null); // Reseta o estado para mostrar os botões de escolha
  };

  return (
    <div className="p-6">
      {/* Condicional para mostrar a tela de seleção de veículo ou o componente selecionado */}
      {vehicleType === null ? (
        // Tela de seleção de Carro ou Moto
        <div className="flex justify-around mb-6">
          <button
            onClick={() => handleVehicleType('car')}
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gradient-to-r from-purple-600 to-purple-500 hover:text-white"
          >
            Adicionar Carro
          </button>

          <button
            onClick={() => handleVehicleType('motorcycle')}
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gradient-to-r from-purple-600 to-purple-500 hover:text-white"
          >
            Adicionar Moto
          </button>
        </div>
      ) : (
        // Renderizar o componente selecionado com a opção de "Voltar"
        <div>
          {/* Botão Voltar */}
          <button
            onClick={handleBack}
            className="mb-6 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gradient-to-r from-purple-600 to-purple-500 hover:text-white"
          >
            Voltar
          </button>

          {/* Renderizar NewCar ou NewMotorcycle com base na seleção */}
          {vehicleType === 'car' && <NewCar />}
          {vehicleType === 'motorcycle' && <NewMotorcycle />}
        </div>
      )}
    </div>
  );
}
