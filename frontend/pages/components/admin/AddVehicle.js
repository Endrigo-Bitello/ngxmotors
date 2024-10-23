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
    setVehicleType(null); // Reseta o estado para mostrar as caixas de escolha
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 p-0"> {/* Removido o padding geral */}
      {vehicleType === null ? (
        <div className="w-full max-w-5xl mx-auto text-center mt-8 flex-grow"> {/* Adicionado flex-grow */}
          <h1 className="text-3xl font-semibold text-gray-700 mb-4">Escolha o tipo de veículo para adicionar</h1> {/* Diminuí a margem inferior */}
          
          {/* Seção de caixas de escolha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> {/* Diminuí o gap entre os cards */}
            
            {/* Caixa para Adicionar Carro */}
            <div
              onClick={() => handleVehicleType('car')}
              className="cursor-pointer bg-white shadow-md rounded-lg p-6 flex flex-col justify-center items-center transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-16 h-16 text-blue-600 mb-4" 
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="text-lg font-bold text-gray-800">Adicionar Carro</h2>
              <p className="text-sm text-gray-500 mt-2">Selecione esta opção para adicionar um novo carro ao estoque</p>
            </div>

            {/* Caixa para Adicionar Moto */}
            <div
              onClick={() => handleVehicleType('motorcycle')}
              className="cursor-pointer bg-white shadow-md rounded-lg p-6 flex flex-col justify-center items-center transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-16 h-16 text-green-600 mb-4" 
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="text-lg font-bold text-gray-800">Adicionar Moto</h2>
              <p className="text-sm text-gray-500 mt-2">Selecione esta opção para adicionar uma nova moto ao estoque</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto mt-6"> {/* Ajustei a margem superior */}
          {/* Botão Voltar */}
          <button
            onClick={handleBack}
            className="mb-4 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 font-medium"
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
