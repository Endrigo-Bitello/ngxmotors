import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
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
    <Card className={styles.card}>
      <div className={styles.chartContainer}>
        {/* Gráfico de Pizza */}
        <div className={styles.chartWrapper}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>Proporção de Veículos</CardTitle>
            <CardDescription className={styles.cardDescription}>
              Quantidade de Carros e Motos
            </CardDescription>
          </CardHeader>

          <CardContent className={styles.chart}>
            <ResponsiveContainer width="100%" height={450}>
              <PieChart>
                <Pie
                  data={vehiclesData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={200}
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

        {/* Relatório à direita */}
        <div className={styles.reportWrapper}>
          <h3 className="text-xl font-bold text-gray-800 mb-6">Relatório de Veículos</h3>

          <div className="space-y-6">
            {vehiclesData.map((entry, index) => (
              <div key={index} className={styles.reportItem}>
                <div className="flex justify-between items-center mb-2">
                  <span className={styles.reportLabel}>{entry.name}</span>
                  <span className={styles.reportValue}>{entry.value} veículos</span>
                </div>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${calculatePercentage(entry.value)}%` }}
                    ></div>
                  </div>
                  <span className={styles.reportPercentage}>
                    {calculatePercentage(entry.value)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.insight}>
            <h4 className="text-lg font-semibold text-blue-600">Insight</h4>
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
