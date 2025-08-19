import Link from 'next/link';
import { getDashboardMetrics } from '../actions'; // Importa a Server Action que criamos
import AnalyticsChart from './AnalyticsChart';
import { getStagnantStock } from '../actions';
import StagnantStockTable from './StagnantStockTable';


// Componente para um card individual de métrica
function MetricCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
      <div className="flex items-center">
        <div className="bg-rose-100 text-rose-600 rounded-full p-3 mr-4">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-stone-500" style={{ fontFamily: 'var(--font-poppins)' }}>
            {title}
          </h3>
          <p className="text-3xl font-bold text-amber-900" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

// A página de Métricas é um Componente de Servidor, o que é ótimo para performance
export default async function MetricasPage() {
  const metrics = await getDashboardMetrics();
  const stagnantStock = await getStagnantStock();
  

  if (!metrics) {
    return (
      <div className="container mx-auto p-8">
        <p className="text-red-500">Não foi possível carregar as métricas. Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Link href="/painel" className="inline-flex items-center gap-2 mb-8 text-sm font-semibold text-stone-600 hover:text-amber-800">
        &larr; Voltar para o Painel
      </Link>

      <header className="mb-10">
        <h1 className="text-4xl font-bold text-amber-900" style={{ fontFamily: 'var(--font-lato)' }}>
          Métricas
        </h1>
        <p className="mt-2 text-stone-500" style={{ fontFamily: 'var(--font-nunito)' }}>
          Acompanhe o desempenho do Brechó Luz.
        </p>
      </header>

      {/* --- SEÇÃO 1: PAINEL RÁPIDO (KPIs) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Faturamento Total"
          value={`R$ ${metrics.faturamentoTotal.toFixed(2)}`}
          icon={"💰"}
        />
        <MetricCard 
          title="Peças Vendidas"
          value={metrics.totalVendido}
          icon={"✨"}
        />
        <MetricCard 
          title="Ticket Médio"
          value={`R$ ${metrics.ticketMedio.toFixed(2)}`}
          icon={"💸"}
        />
        <MetricCard 
          title="Peças em Estoque"
          value={metrics.pecasEmEstoque}
          icon={"📦"}
        />
      </div>

      {/* Espaço reservado para as próximas seções */}
<div className="mt-12 space-y-8">
  {/* --- SEÇÃO 2: GRÁFICOS DE DESEMPENHO --- */}
  <AnalyticsChart />

  {/* --- SEÇÃO 3: TABELAS DE INSIGHTS --- */}
  <StagnantStockTable pecas={stagnantStock} />
</div>
    </div>
    
  );
}