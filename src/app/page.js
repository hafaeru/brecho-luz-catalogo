'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';


// --- Componente do Card da Peça (com estilo padronizado) ---
function PecaCard({ peca }) {
  const [imagemAtiva, setImagemAtiva] = useState(peca.imagens?.[0] || '/placeholder.jpg');

  const handleMouseEnter = () => {
    if (peca.imagens && peca.imagens.length > 1 && peca.imagens[1]) {
      setImagemAtiva(peca.imagens[1]);
    }
  };

  const handleMouseLeave = () => {
    setImagemAtiva(peca.imagens?.[0] || '/placeholder.jpg');
  };

  return (
    <Link href={`/peca/${peca.id}`} key={peca.id}>
      <div 
        className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group flex flex-col h-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative w-full aspect-square bg-gray-100">
          <Image
            src={imagemAtiva}
            alt={peca.nome}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            style={{ objectFit: 'cover' }}
            className="transition-opacity duration-300"
          />
        </div>
        <div className="p-3 bg-white flex-grow flex flex-col justify-between" style={{ fontFamily: 'var(--font-poppins)' }}>
          <div>
            <h2 className="font-semibold text-cyan-900" title={peca.nome}>
              {peca.nome}
            </h2>
            <p className="text-sm text-sky-300 mt-1">
              {peca.tamanho}
            </p>
          </div>
          <p className="text-lg font-bold text-rose-600 mt-2"style={{ fontFamily: 'var(--font-manrope)' }}>
            R$ {peca.preco}
          </p>
        </div>
      </div>
    </Link>
  );
}


// --- Componente Principal da Página Inicial ---
export default function Home() {
   const { addToCart } = useCart();
  const [pecas, setPecas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [cores, setCores] = useState([]);
  const [estados, setEstados] = useState([]);
  const [composicoes, setComposicoes] = useState([]);
  
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [buscaTexto, setBuscaTexto] = useState('');
  const [ordenacao, setOrdenacao] = useState('recentes');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filtroMarca, setFiltroMarca] = useState('Todas');
  const [filtroCor, setFiltroCor] = useState('Todas');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroComposicao, setFiltroComposicao] = useState('Todas');

  const [buscarPorMedidas, setBuscarPorMedidas] = useState(false);
  const [medidasBusca, setMedidasBusca] = useState({ busto: '', cintura: '', quadril: '' });

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function getInitialData() {
      setLoading(true);
      const { data: pecasData, error } = await supabase
        .from('pecas')
        .select('*')
        .eq('status', 'Disponível')
        .order('created_at', { ascending: false });
      
      if (!error) {
        setPecas(pecasData);
        const getUniqueValues = (key) => [...new Set(pecasData.map(p => p[key]).filter(Boolean))].sort();
        setCategorias(['Todos', ...getUniqueValues('categoria')]);
        setMarcas(['Todas', ...getUniqueValues('marca')]);
        setCores(['Todas', ...getUniqueValues('cor')]);
        setEstados(['Todos', ...getUniqueValues('estado_conservacao')]);
        setComposicoes(['Todas', ...getUniqueValues('composicao_tecido')]);
      } else {
        console.error("Erro ao buscar peças:", error);
      }
      setLoading(false);
    }
    getInitialData();
  }, [supabase]);

  const pecasExibidas = useMemo(() => {
    let pecasFiltradas = [...pecas];

    if (filtroCategoria !== 'Todos') pecasFiltradas = pecasFiltradas.filter(p => p.categoria === filtroCategoria);
    if (filtroMarca !== 'Todas') pecasFiltradas = pecasFiltradas.filter(p => p.marca === filtroMarca);
    if (filtroCor !== 'Todas') pecasFiltradas = pecasFiltradas.filter(p => p.cor === filtroCor);
    if (filtroEstado !== 'Todos') pecasFiltradas = pecasFiltradas.filter(p => p.estado_conservacao === filtroEstado);
    if (filtroComposicao !== 'Todas') pecasFiltradas = pecasFiltradas.filter(p => p.composicao_tecido === filtroComposicao);
    if (buscaTexto) pecasFiltradas = pecasFiltradas.filter(p => p.nome.toLowerCase().includes(buscaTexto.toLowerCase()));
    if (buscarPorMedidas) {
        pecasFiltradas = pecasFiltradas.filter(p => {
            const { busto, cintura, quadril } = medidasBusca;
            const tolerancia = 4;
            const atendeBusto = !busto || !p.medida_busto || (p.medida_busto >= busto && p.medida_busto <= (parseFloat(busto) + tolerancia));
            const atendeCintura = !cintura || !p.medida_cintura || (p.medida_cintura >= cintura && p.medida_cintura <= (parseFloat(cintura) + tolerancia));
            const atendeQuadril = !quadril || !p.medida_quadril || (p.medida_quadril >= quadril && p.medida_quadril <= (parseFloat(quadril) + tolerancia));
            return atendeBusto && atendeCintura && atendeQuadril;
        });
    }

    switch (ordenacao) {
      case 'menor-preco': pecasFiltradas.sort((a, b) => a.preco - b.preco); break;
      case 'maior-preco': pecasFiltradas.sort((a, b) => b.preco - a.preco); break;
      default: break;
    }

    return pecasFiltradas;
  }, [pecas, filtroCategoria, buscaTexto, ordenacao, showAdvanced, filtroMarca, filtroCor, filtroEstado, filtroComposicao, buscarPorMedidas, medidasBusca]);

  return (
    <main className="container mx-auto p-4 sm:p-8 relative">
        <div className="text-center mb-8">
            <h1 className="text-8xl sm:text-9xl font-normal text-amber-800" style={{ fontFamily: 'var(--font-great-vibes)' }}>
              Brechó Luz
            </h1>
            <p className="text-lg text-cyan-800 mt-2" style={{ fontFamily: 'var(--font-playfair-display)' }}>
              Peças com História, Luz para seu Estilo.
            </p>
        </div>

        <div className="flex items-center gap-2 mb-4">
            <input id="busca" type="text" placeholder="Buscar por nome..." onChange={(e) => setBuscaTexto(e.target.value)}
                   className="flex-grow w-full px-4 py-2 border border-stone-300 rounded-md shadow-sm"/>
                   
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-200 rounded-md hover:bg-stone-300"style={{ fontFamily: 'var(--font-quicksand)' }}>
                Filtros {showAdvanced ? '▲' : '▼'}
            </button>
        </div>

        {showAdvanced && (
            <div className="mb-12 p-4 bg-gray-50 rounded-lg border animate-fade-in-down space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <select onChange={(e) => setFiltroMarca(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"><option value="Todas">Todas as Marcas</option>{marcas.map(m => <option key={m} value={m}>{m}</option>)}</select>
                    <select onChange={(e) => setFiltroCor(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"><option value="Todas">Todas as Cores</option>{cores.map(c => <option key={c} value={c}>{c}</option>)}</select>
                    <select onChange={(e) => setFiltroEstado(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"><option value="Todos">Todos os Estados</option>{estados.map(e => <option key={e} value={e}>{e}</option>)}</select>
                    <select onChange={(e) => setFiltroComposicao(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"><option value="Todas">Todas as Composições</option>{composicoes.map(c => <option key={c} value={c}>{c}</option>)}</select>
                </div>
                <div className="pt-4 border-t">
                    <div className="flex items-center">
                        <input type="checkbox" id="buscar-medidas" checked={buscarPorMedidas} onChange={(e) => setBuscarPorMedidas(e.target.checked)} className="h-4 w-4 text-yellow-600 border-gray-300 rounded"/>
                        <label htmlFor="buscar-medidas" className="ml-3 font-medium text-gray-800"style={{ fontFamily: 'var(--font-quicksand)' }}>Buscar por medidas do corpo</label>
                    </div>
                    {buscarPorMedidas && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="number" placeholder="Busto (cm)" onChange={(e) => setMedidasBusca({...medidasBusca, busto: e.target.value})} className="px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                            <input type="number" placeholder="Cintura (cm)" onChange={(e) => setMedidasBusca({...medidasBusca, cintura: e.target.value})} className="px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                            <input type="number" placeholder="Quadril (cm)" onChange={(e) => setMedidasBusca({...medidasBusca, quadril: e.target.value})} className="px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                        </div>
                    )}
                </div>
            </div>
        )}
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
                {categorias.map(cat => (
                    <button key={cat} onClick={() => setFiltroCategoria(cat)} className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${filtroCategoria === cat ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}style={{ fontFamily: 'var(--font-nunito)' }}`}>{cat}</button>
                ))}
            </div>
            <div className="flex-shrink-0">
                <select onChange={(e) => setOrdenacao(e.target.value)} className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm">
                    <option value="recentes">Ordenar por: Mais Recentes</option>
                    <option value="menor-preco">Ordenar por: Menor Preço</option>
                    <option value="maior-preco">Ordenar por: Maior Preço</option>
                </select>
            </div>
        </div>

        {loading ? (
            <p className="text-center text-stone-500">Carregando peças...</p>
        ) : pecasExibidas.length === 0 ? (
            <p className="text-center text-stone-500">Nenhuma peça encontrada com os filtros selecionados.</p>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {pecasExibidas.map((peca) => <PecaCard key={peca.id} peca={peca} />)}
            </div>
        )}

        <a href="https://chat.whatsapp.com/DRKWqlxvFDCFaun2aZCiiB" target="_blank" rel="noopener noreferrer" 
           className="fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-110 flex items-center z-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6 fill-current"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.8 0-67.6-9.5-97.8-26.7l-7-4.1-72.5 19 19.3-70.9-4.5-7.4c-19.5-32.3-30.1-69.5-30.1-108.5 0-108.9 88.5-197.3 197.3-197.3 52.9 0 102.8 20.5 139.5 57.2 36.7 36.7 57.2 86.6 57.2 139.5 0 108.9-88.5 197.3-197.3 197.3zm88.6-111.9c-3.8-2-22.5-11.1-26-12.5-3.5-1.4-6-1.9-8.6 1.9s-9.9 12.5-12.1 15c-2.3 2.5-4.5 2.8-8.3 1.4-3.8-1.4-16.1-5.9-30.7-19-11.4-10.1-19-22.5-21.3-26.2-2.3-3.8-..2-5.9 1.4-7.8s3.5-4.5 5.2-6.7c1.7-2.2 2.3-3.8 3.5-6.2 1.2-2.5.6-4.9-.3-6.8-1-1.9-8.6-20.5-11.7-28-3.1-7.5-6.2-6.5-8.6-6.5-2.3 0-5 0-7.6.1-2.5.1-6.5 1-9.9 4.9-3.4 3.9-13.1 12.8-13.1 31.1 0 18.2 13.4 36 15.3 38.5 1.9 2.5 26.1 39.6 63.1 55.7 37 16.2 37 10.8 43.4 10.1 6.5-.7 20.5-8.4 23.4-16.5 2.8-8.1 2.8-15 1.9-16.5-..9-1.4-3.4-2.3-7.1-4.2z"/></svg>
            <span className="ml-2 text-sm font-semibold hidden sm:inline">Grupo VIP</span>
        </a>
    </main>
  );
}