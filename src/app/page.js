'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { FaWhatsapp } from 'react-icons/fa';
import CartSidebar from '@/components/CartSidebar';
import CardSkeleton from '@/components/CardSkeleton';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 20;

 useEffect(() => {
  const getPecas = async () => {
    setLoading(true);

    let query = supabase
      .from('pecas')
      .select('*', { count: 'exact' });

    // 1. Aplica os filtros na consulta ANTES de buscar os dados
    query = query.eq('status', 'Disponível');
    if (filtroCategoria !== 'Todos') query = query.eq('categoria', filtroCategoria);
    if (filtroMarca !== 'Todas') query = query.eq('marca', filtroMarca);
    if (filtroCor !== 'Todas') query = query.eq('cor', filtroCor);
    if (filtroEstado !== 'Todos') query = query.eq('estado_conservacao', filtroEstado);
    if (filtroComposicao !== 'Todas') query = query.eq('composicao_tecido', filtroComposicao);
    if (buscaTexto) query = query.ilike('nome', `%${buscaTexto}%`);

    // 2. Aplica a ordenação
    if (ordenacao === 'menor-preco') {
      query = query.order('preco', { ascending: true });
    } else if (ordenacao === 'maior-preco') {
      query = query.order('preco', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // 3. Aplica a paginação
    const from = (currentPage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
    
    // 4. Executa a consulta final
    const { data, error, count } = await query;

    if (!error) {
      setPecas(data || []);
      setTotalPages(Math.ceil((count || 0) / PAGE_SIZE));
    } else {
      console.error("Erro ao buscar peças:", error);
      setPecas([]);
    }
    setLoading(false);
  };

  getPecas();
  // A busca agora depende da página atual e de todos os filtros
}, [supabase, currentPage, filtroCategoria, filtroMarca, filtroCor, filtroEstado, filtroComposicao, buscaTexto, ordenacao]);

 
  const total = cart.reduce((acc, item) => acc + item.preco, 0);
  const mensagemWhatsApp = encodeURIComponent(
    `Olá! Gostaria de reservar as seguintes peças do meu carrinho:\n\n${cart.map(p => `- ${p.nome} (R$ ${p.preco})`).join('\n')}\n\nTotal: R$ ${total.toFixed(2)}`
  );
  const linkWhatsApp = `https://wa.me/SEUNUMERODOTELEFONE?text=${mensagemWhatsApp}`;

  return (
    <main className="container mx-auto p-4 sm:p-8 relative">
      <div className="text-center mb-8">
        <h1 className="text-8xl sm:text-8xl font-normal text-amber-800" style={{ fontFamily: 'var(--font-great-vibes)' }}>
          Brechó Luz
        </h1>
        <p className="text-lg text-cyan-800 mt-2" style={{ fontFamily: 'var(--font-playfair-display)' }}>
          Peças com História, Luz para seu Estilo.
        </p>
      </div>

{/* COLE ESTE BLOCO COMPLETO PARA RESTAURAR TODA A SEÇÃO DE FILTROS */}
<div className="mb-8 space-y-4">
  {/* Barra de Busca e Botão de Filtros Avançados */}
  <div className="flex items-center gap-2">
    <input
      type="text"
      placeholder="Buscar por nome..."
      value={buscaTexto}
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

  {/* Painel de Filtros Avançados (com a busca por medidas restaurada) */}
  {showAdvanced && (
    <div className="p-4 bg-stone-100 rounded-lg border space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <select onChange={(e) => setFiltroMarca(e.target.value)} className="px-3 py-2 border rounded-md w-full">
          <option value="Todas">Todas as Marcas</option>
          {marcas.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select onChange={(e) => setFiltroCor(e.target.value)} className="px-3 py-2 border rounded-md w-full">
          <option value="Todas">Todas as Cores</option>
          {cores.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select onChange={(e) => setFiltroEstado(e.target.value)} className="px-3 py-2 border rounded-md w-full">
          <option value="Todos">Todos os Estados</option>
          {estados.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <select onChange={(e) => setFiltroComposicao(e.target.value)} className="px-3 py-2 border rounded-md w-full">
          <option value="Todas">Todas as Composições</option>
          {composicoes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="pt-4 border-t">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={buscarPorMedidas}
            onChange={(e) => setBuscarPorMedidas(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
          />
          <span className="text-sm font-medium text-stone-700">Buscar por medidas (cm)</span>
        </label>
        {buscarPorMedidas && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
            <input type="number" placeholder="Busto" value={medidasBusca.busto} onChange={(e) => setMedidasBusca(m => ({...m, busto: e.target.value}))} className="px-3 py-2 border rounded-md w-full text-sm" />
            <input type="number" placeholder="Cintura" value={medidasBusca.cintura} onChange={(e) => setMedidasBusca(m => ({...m, cintura: e.target.value}))} className="px-3 py-2 border rounded-md w-full text-sm" />
            <input type="number" placeholder="Quadril" value={medidasBusca.quadril} onChange={(e) => setMedidasBusca(m => ({...m, quadril: e.target.value}))} className="px-3 py-2 border rounded-md w-full text-sm" />
          </div>
          
        )}
      </div>
    </div>
  )}

  {/* Botões de Categoria e Ordenação */}
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
    <div className="flex flex-wrap gap-2">
      {categorias.map(cat => (
        <button 
          key={cat} 
          onClick={() => setFiltroCategoria(cat)} 
          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${filtroCategoria === cat ? 'bg-rose-500 text-white' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'}`}
        >
          {cat}
        </button>
      ))}
    </div>
    
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
  </div>
</div>

        
      {loading ? (
  // Enquanto carrega, exibe uma grade de 10 esqueletos
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    {Array.from({ length: 10 }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
      </div>
) : (
<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
  {pecas.map(peca => (
    // CARD ATUALIZADO:
    // 1. Removido p-2 e adicionado overflow-hidden para a imagem preencher o espaço.
    // 2. A imagem agora usa w-full e object-cover para se ajustar ao card.
    <div key={peca.id} className="border border-rose-200 rounded-lg shadow-sm flex flex-col bg-amber-100 overflow-hidden">
      
      {/* Link envolvendo a imagem, que agora ocupa toda a largura */}
<Link href={`/peca/${peca.id}`} className="block w-full aspect-[3/4] overflow-hidden rounded-t-lg">
  <Image
    src={peca.imagens?.[0]}
    alt={peca.nome}
    width={400}
    height={533}
    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
<Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      {/* Botão flutuante para abrir carrinho */}
<button 
  onClick={() => setShowCarrinho(true)} 
  className="fixed bottom-5 right-5 bg-orange-600 text-white w-16 h-16 rounded-full shadow-lg hover:scale-110 transition z-50 flex items-center justify-center"
>
  <span className="text-2xl">🛒</span>
  {cart.length > 0 && (
    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {cart.length}
    </span>
  )}
</button>

{/* BOTÃO FLUTUANTE: Grupo VIP (WhatsApp) */}
<a
  href="https://chat.whatsapp.com/DRKWqlxvFDCFaun2aZCiiB" // Lembre-se de verificar se este link está correto
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Fale Conosco pelo WhatsApp"
  className="fixed bottom-24 right-5 bg-green-600 text-white w-16 h-16 rounded-full shadow-lg hover:scale-110 transition z-50 flex items-center justify-center"
>
  <FaWhatsapp size={32} />
</a>


    <main className="container mx-auto p-4 sm:p-8 relative">
      {/* ... todo o seu conteúdo da página ... */}

      {/* Botões flutuantes */}
      <button onClick={() => setShowCarrinho(true)} className="...">
        {/* ... */}
      </button>
      <a href="..." className="...">
        {/* ... */}
      </a>

      {/* ADICIONE O COMPONENTE AQUI */}
      <CartSidebar isOpen={showCarrinho} onClose={() => setShowCarrinho(false)} />
    </main>

    </main>
  );
}
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    const visiblePages = 5; // Número de páginas a serem exibidas diretamente
    if (totalPages <= visiblePages) {
      return pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${currentPage === number ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          {number}
        </button>
      ));
    } else {
      const firstPage = 1;
      const lastPage = totalPages;
      const pagesToShow = new Set([firstPage, currentPage, lastPage]);

      for (let i = Math.max(firstPage, currentPage - 1); i <= Math.min(lastPage, currentPage + 1); i++) {
        pagesToShow.add(i);
      }

      const sortedPages = Array.from(pagesToShow).sort((a, b) => a - b);
      const renderedPages = [];
      let previousPage = 0;

      for (const page of sortedPages) {
        if (page - previousPage > 1) {
          renderedPages.push(<span key={`ellipsis-${previousPage}`} className="px-3 py-2 text-sm text-gray-500">...</span>);
        }
        renderedPages.push(
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${currentPage === page ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {page}
          </button>
        );
        previousPage = page;
      }
      return renderedPages;
    }
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-md text-sm font-semibold transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-md text-sm font-semibold transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Próxima
      </button>
    </div>
  );
}