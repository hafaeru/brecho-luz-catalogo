'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getSalesAnalytics } from '../actions'; // Importa a nossa action dinâmica

// Opções de filtros que vamos oferecer
const filterOptions = [
  { value: 'categoria', label: 'Por Categoria' },
  { value: 'marca', label: 'Por Marca' },
  { value: 'tamanho', label: 'Por Tamanho' },
  { value: 'cor', label: 'Por Cor' },
];

const formatCurrency = (value) => `R$${value.toFixed(0)}`;

export default function AnalyticsChart() {
  const [activeFilter, setActiveFilter] = useState('categoria'); // Filtro inicial
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Este efeito roda sempre que o filtro ativo muda
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getSalesAnalytics(activeFilter);
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, [activeFilter]); // A dependência é o filtro ativo

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-lg font-semibold text-amber-900" style={{ fontFamily: 'var(--font-poppins)' }}>
          Análise de Vendas
        </h3>
        {/* Botões para trocar o tipo de gráfico */}
        <div className="flex space-x-2 mt-3 sm:mt-0">
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${activeFilter === option.value ? 'bg-rose-500 text-white' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exibição do Gráfico */}
      <div className="h-96">
        {loading ? (
          <div className="flex items-center justify-center h-full text-stone-500">Carregando dados...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" tickFormatter={formatCurrency} />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={120} 
                tick={{ fontSize: 12 }} 
                interval={0} // Garante que todos os nomes apareçam
              />
              <Tooltip 
                cursor={{ fill: 'rgba(244, 114, 182, 0.1)' }}
                formatter={(value, name) => {
                    if (name === 'faturamento') return [`R$${value.toFixed(2)}`, 'Faturamento'];
                    if (name === 'quantidade') return [value, 'Peças Vendidas'];
                    return [value, name];
                }}
              />
              <Bar dataKey="faturamento" name="faturamento" fill="#f472b6" />
              <Bar dataKey="quantidade" name="quantidade" fill="#fbbf24" /> {/* Bônus: cor âmbar para a quantidade */}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}