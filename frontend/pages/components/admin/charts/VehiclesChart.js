import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

import styles from './VehiclesChart.module.css';

const COLORS = ['#4A90E2', '#E74C3C']; // Cores para Carros e Motos

const VehiclesChart = () => {
  const [vehiclesData, setVehiclesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalVehicles, setTotalVehicles] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, motosRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carros`), // Ajustar conforme a rota
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/motos`), // Ajustar conforme a rota
        ]);

        const carsData = await carsRes.json();
        const motosData = await motosRes.json();

        const totalCars = carsData.length;
        const totalMotos = motosData.length;
        const total = totalCars + totalMotos;

        const chartData = [
          { name: 'Carros', value: totalCars },
          { name: 'Motos', value: totalMotos },
        ];

        setVehiclesData(chartData);
        setTotalVehicles(total);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados dos veículos.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Carregando dados...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const calculatePercentage = (value) => ((value / totalVehicles) * 100).toFixed(2);

  return (
    <Card className="p-6">
      <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
        {/* Gráfico de Pizza */}
        <div className="lg:w-1/2 w-full">
          <CardHeader>
            <CardTitle className="text-lg lg:text-2xl font-bold">Proporção de Veículos</CardTitle>
            <CardDescription className="text-gray-600">Quantidade de Carros e Motos</CardDescription>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={vehiclesData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={window.innerWidth < 768 ? 80 : 150} // Ajusta o tamanho para mobile
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  labelLine={false}
                >
                  {vehiclesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </div>

        {/* Relatório */}
        <div className="lg:w-1/2 w-full">
          <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Relatório de Veículos</h3>
          <div className="space-y-6">
            {vehiclesData.map((entry, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-medium">{entry.name}</span>
                  <span className="font-bold text-gray-800">{entry.value} veículos</span>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                    style={{ width: `${calculatePercentage(entry.value)}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 mt-1 block">
                  {calculatePercentage(entry.value)}%
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-100 rounded-lg">
            <h4 className="text-blue-600 text-lg font-semibold">Insight</h4>
            <p className="text-gray-700 mt-2">
              A maior parte dos veículos cadastrados são{' '}
              <strong>{vehiclesData.length > 0 ? vehiclesData[0].name : 'N/A'}</strong>, representando{' '}
              {vehiclesData.length > 0 ? calculatePercentage(vehiclesData[0].value) : '0'}% do total.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VehiclesChart;
