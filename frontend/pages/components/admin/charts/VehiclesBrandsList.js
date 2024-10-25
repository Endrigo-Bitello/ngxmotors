import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './VehiclesBrandsList.module.css'; // Importando o CSS

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
      <ul className={styles.brandList}>
        {brands.map(([marca, quantidade]) => (
          <li key={marca} className={styles.brandItem}>
            <div className={styles.brandInfo}>
              <img
                src={`/icons/${marca.toLowerCase().replace(/ /g, '-')}.png`}
                alt={marca}
                className={styles.brandIcon}
              />
              <span className={styles.brandName}>{marca}</span>
            </div>
            <span className={vehicleType === 'carro' ? styles.carCount : styles.motoCount}>
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
    <div className={styles.container}>
      {/* Relatório de Carros */}
      <div className={styles.reportWrapper}>
        <h2 className={styles.reportTitle}>Carros por Marca</h2>
        {carBrands.length > 0 ? (
          renderBrandList(carBrands, 'carro')
        ) : (
          <p className={styles.emptyMessage}>Não há carros cadastrados no momento.</p>
        )}
      </div>

      {/* Relatório de Motos */}
      <div className={styles.reportWrapper}>
        <h2 className={styles.reportTitle}>Motos por Marca</h2>
        {motoBrands.length > 0 ? (
          renderBrandList(motoBrands, 'moto')
        ) : (
          <p className={styles.emptyMessage}>Não há motos cadastradas no momento.</p>
        )}
      </div>
    </div>
  );
};

export default VehiclesBrandsList;
