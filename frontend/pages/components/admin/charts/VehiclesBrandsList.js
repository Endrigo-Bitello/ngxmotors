import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VehiclesBrandsList = () => {
  const [carBrands, setCarBrands] = useState([]);
  const [motoBrands, setMotoBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const carRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/carros`);
        const motoRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/motos`);

        // Processar os dados para contar a quantidade de veículos por marca
        const processBrands = (vehicles) => {
          return vehicles.reduce((acc, vehicle) => {
            acc[vehicle.marca] = acc[vehicle.marca] ? acc[vehicle.marca] + 1 : 1;
            return acc;
          }, {});
        };

        const carBrandsData = processBrands(carRes.data);
        const motoBrandsData = processBrands(motoRes.data);

        // Ordenar as marcas por quantidade de veículos
        const sortedCarBrands = Object.entries(carBrandsData).sort((a, b) => b[1] - a[1]);
        const sortedMotoBrands = Object.entries(motoBrandsData).sort((a, b) => b[1] - a[1]);

        setCarBrands(sortedCarBrands);
        setMotoBrands(sortedMotoBrands);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar os dados dos veículos.');
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, []);

  if (loading) {
    return <p>Carregando dados dos veículos...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const renderBrandList = (brands, vehicleType) => {
    return (
      <ul className="space-y-4">
        {brands.map(([marca, quantidade]) => (
          <li key={marca} className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <img
                src={`/icons/${marca.toLowerCase().replace(/ /g, '-')}.png`}
                alt={marca}
                className="h-12 w-12 object-contain"
              />
              <span className="text-gray-800 font-medium">{marca}</span>
            </div>
            <span className={vehicleType === 'carro' ? 'text-blue-500' : 'text-red-500'}>
              {quantidade} {vehicleType === 'carro'
                ? quantidade > 1 ? 'carros' : 'carro'
                : quantidade > 1 ? 'motos' : 'moto'}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Relatório de Carros */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Carros por Marca</h2>
          {carBrands.length > 0 ? (
            renderBrandList(carBrands, 'carro')
          ) : (
            <p className="text-gray-500">Não há carros cadastrados no momento.</p>
          )}
        </div>

        {/* Relatório de Motos */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Motos por Marca</h2>
          {motoBrands.length > 0 ? (
            renderBrandList(motoBrands, 'moto')
          ) : (
            <p className="text-gray-500">Não há motos cadastradas no momento.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehiclesBrandsList;
