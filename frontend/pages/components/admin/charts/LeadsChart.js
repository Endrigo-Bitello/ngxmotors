import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import styles from './LeadsChart.module.css';

const COLORS = [
  '#f1b04c', // Círculo pessoal
  '#2f55a4', // Facebook
  '#32CD32', // Simulação
  '#0e76a8', // LinkedIn
  '#E1306C', // Instagram
  '#f7d888', // Mensagem no site
  '#bc90db', // Página do veículo
  '#a3a3a3', // Outros
];

const LeadsChart = () => {
  const [chartData, setChartData] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeadsData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes`);
        const data = await response.json();

        const formattedData = data.reduce((acc, lead) => {
          const fonteLead = lead.fonteLead || 'Outros';
          acc[fonteLead] = acc[fonteLead] ? acc[fonteLead] + 1 : 1;
          return acc;
        }, {});

        const pieChartData = Object.entries(formattedData).map(([name, value]) => ({
          name,
          value,
        }));

        setChartData(pieChartData);
        setTotalLeads(data.length);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar os dados dos leads.');
        setLoading(false);
      }
    };

    fetchLeadsData();
  }, []);

  if (loading) {
    return <p>Carregando dados do gráfico...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const calculatePercentage = (value) => ((value / totalLeads) * 100).toFixed(2);

  return (
    <Card className={styles.card}>
      <div className={styles.chartContainer}>
        {/* Gráfico à esquerda */}
        <div className={styles.chartWrapper}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>Leads por Origem</CardTitle>
            <CardDescription className={styles.cardDescription}>
              Distribuição dos leads por diferentes origens
            </CardDescription>
          </CardHeader>

          <CardContent className={styles.chart}>
            <ResponsiveContainer width="100%" height={450}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={200}
                  fill="#8884d8"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
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
          <h3 className="text-xl font-bold text-gray-800 mb-6">Relatório de Leads</h3>

          <div className="space-y-6">
            <div className={styles.reportItem}>
              <span className={styles.reportLabel}>Leads: </span>
              <span className={styles.reportValue}>{totalLeads}</span>
            </div>

            {chartData.map((entry, index) => (
              <div key={index} className={styles.reportItem}>
                <div className="flex justify-between items-center mb-2">
                  <span className={styles.reportLabel}>{entry.name}</span>
                  <span className={styles.reportValue}>{entry.value} leads</span>
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
              A maior parte dos leads vem da origem{' '}
              <strong>{chartData.length > 0 ? chartData[0].name : 'N/A'}</strong>, representando{' '}
              {chartData.length > 0 ? calculatePercentage(chartData[0].value) : '0'}% do total.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LeadsChart;
