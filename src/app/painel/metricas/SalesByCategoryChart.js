'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

// Formata os números do eixo Y para o formato de moeda (R$)
const formatCurrency = (value) => `R$${value.toFixed(0)}`;

export default function SalesByCategoryChart({ data }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 h-96">
      <h3 className="text-lg font-semibold text-amber-900 mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
        Faturamento por Categoria
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 40 }} // Aumenta a margem inferior para os nomes
          layout="vertical" // Gráfico de barras na horizontal
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis type="number" tickFormatter={formatCurrency} />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={120} // Espaço para os nomes das categorias
            tick={{ fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: 'rgba(244, 114, 182, 0.1)' }}
            formatter={(value) => [`R$${value.toFixed(2)}`, 'Faturamento']}
          />
          <Bar dataKey="faturamento" name="Faturamento" fill="#f472b6" /> {/* Cor rose-400 */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}