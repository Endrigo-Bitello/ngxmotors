import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import styles from './StepLeadsRadarChart.module.css';

const COLORS = {
  'Novo Lead': '#48bb78',       // bg-green-500
  'Qualificação': '#ecc94b',    // bg-yellow-500
  'Em Negociação': '#4299e1',   // bg-blue-500
  'Fechamento': '#9f7aea',      // bg-purple-500
  'Pós Venda': '#ed8936',       // bg-orange-500
  'Perdidos': '#f56565',        // bg-red-500
};

const StepLeadsRadarChart = () => {
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
          const etapa = lead.etapa || 'Outros';
          acc[etapa] = acc[etapa] ? acc[etapa] + 1 : 1;
          return acc;
        }, {});

        const radarChartData = Object.entries(formattedData).map(([name, value]) => ({
          name,
          value,
        }));

        setChartData(radarChartData);
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
        {/* Gráfico Radar à esquerda */}
        <div className={styles.chartWrapper}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>Leads por Etapa</CardTitle>
            <CardDescription className={styles.cardDescription}>
              Distribuição de leads por diferentes etapas
            </CardDescription>
          </CardHeader>

          <CardContent className={styles.chart}>
            <ResponsiveContainer width="100%" height={450}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#4a5568', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} tick={false} axisLine={false} />
                <Radar name="Leads" dataKey="value" stroke="#63b3ed" fill="#63b3ed" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </div>

        {/* Relatório à direita */}
        <div className={styles.reportWrapper}>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Relatório de Leads</h3>

          <div className="space-y-6">
            <div className={styles.reportItem}>
              <span className={styles.reportLabel}>Total de Leads: </span>
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

          {/* Insight */}
          <div className={styles.insight}>
            <h4 className="text-lg font-semibold text-blue-600">Insight</h4>
            <p className="text-gray-700 mt-2">
              A maior parte dos leads está na etapa{' '}
              <strong>{chartData.length > 0 ? chartData[0].name : 'N/A'}</strong>, representando{' '}
              {chartData.length > 0 ? calculatePercentage(chartData[0].value) : '0'}% do total.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StepLeadsRadarChart;
