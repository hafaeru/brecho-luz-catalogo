'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Home() {
  const supabase = createClientComponentClient();
  const { cart, addToCart, removeFromCart } = useCart();

  const [pecas, setPecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCarrinho, setShowCarrinho] = useState(false);

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
    }
    return pecasFiltradas;
  }, [pecas, filtroCategoria, buscaTexto, ordenacao, showAdvanced, filtroMarca, filtroCor, filtroEstado, filtroComposicao, buscarPorMedidas, medidasBusca]);

  const total = cart.reduce((acc, item) => acc + item.preco, 0);
  const mensagemWhatsApp = encodeURIComponent(
    `Olá! Gostaria de reservar as seguintes peças do meu carrinho:\n\n${cart.map(p => `- ${p.nome} (R$ ${p.preco})`).join('\n')}\n\nTotal: R$ ${total.toFixed(2)}`
  );
  const linkWhatsApp = `https://wa.me/SEUNUMERODOTELEFONE?text=${mensagemWhatsApp}`;

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
        <input
          type="text"
          placeholder="Buscar por nome..."
          onChange={(e) => setBuscaTexto(e.target.value)}
          className="flex-grow w-full px-4 py-2 border border-stone-300 rounded-md shadow-sm"
        />
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-200 rounded-md hover:bg-stone-300"
        >
          Filtros {showAdvanced ? '▲' : '▼'}
        </button>
      </div>

      {showAdvanced && (
        <div className="mb-12 p-4 bg-gray-50 rounded-lg border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <select onChange={(e) => setFiltroMarca(e.target.value)} className="px-3 py-2 border rounded-md"><option value="Todas">Todas as Marcas</option>{marcas.map(m => <option key={m}>{m}</option>)}</select>
            <select onChange={(e) => setFiltroCor(e.target.value)} className="px-3 py-2 border rounded-md"><option value="Todas">Todas as Cores</option>{cores.map(c => <option key={c}>{c}</option>)}</select>
            <select onChange={(e) => setFiltroEstado(e.target.value)} className="px-3 py-2 border rounded-md"><option value="Todos">Todos os Estados</option>{estados.map(e => <option key={e}>{e}</option>)}</select>
            <select onChange={(e) => setFiltroComposicao(e.target.value)} className="px-3 py-2 border rounded-md"><option value="Todas">Todas as Composições</option>{composicoes.map(c => <option key={c}>{c}</option>)}</select>
          </div>
        </div>
      )}
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
                {categorias.map(cat => (
                    <button key={cat} onClick={() => setFiltroCategoria(cat)} className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${filtroCategoria === cat ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{cat}</button>
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
      ) : (
<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
  {pecasExibidas.map(peca => (
    // CARD ATUALIZADO:
    // 1. Removido p-2 e adicionado overflow-hidden para a imagem preencher o espaço.
    // 2. A imagem agora usa w-full e object-cover para se ajustar ao card.
    <div key={peca.id} className="border border-rose-200 rounded-lg shadow-sm flex flex-col bg-amber-100 overflow-hidden">
      
      {/* Link envolvendo a imagem, que agora ocupa toda a largura */}
      <Link href={`/peca/${peca.id}`}>
        <Image 
          src={peca.imagens?.[0]} 
          alt={peca.nome} 
          width={400} 
          height={400} 
          className="w-full h-auto object-cover " // aspect-square para manter a imagem quadrada
        />
      </Link>
      
      {/* 3. Nova div criada para conter o texto, com seu próprio padding e alinhamento. */}
      <div className="p-3 text-center">
        <Link href={`/peca/${peca.id}`}>
          <h2 className="font-semibold text-cyan-800 truncate">{peca.nome}</h2>
        </Link>
        <p className="text-rose-600 font-bold mt-1">R$ {peca.preco.toFixed(2)}</p>
      </div>

    </div>
  ))}
</div>
      )}

      {/* Botão flutuante para abrir carrinho */}
      <button onClick={() => setShowCarrinho(true)} className="fixed bottom-5 right-5 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition z-50">
        🛒 {cart.length}
      </button>

{/* BOTÃO FLUTUANTE: Grupo VIP (WhatsApp) */}
<a
  href="https://chat.whatsapp.com/DRKWqlxvFDCFaun2aZCiiB"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-24 right-5 bg-green-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition z-50"
>
  🟢
</a>
    </main>
  );
}
