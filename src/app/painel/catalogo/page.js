'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { deletePiece, updatePieceStatus } from '../actions.js';

export default function CatalogoPage() {
  const [pecas, setPecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function getPecas() {
      setLoading(true);
      const { data, error } = await supabase
        .from('pecas')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) {
        setPecas(data);
      }
      setLoading(false);
    }
    getPecas();
  }, [supabase]);

  if (loading) {
    return <div className="p-8 text-center" style={{ fontFamily: 'var(--font-nunito)', color: 'var(--text-stone-500)' }}>Carregando inventário...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Link href="/painel" className="text-amber-900 hover:underline mb-6 inline-block" style={{ fontFamily: 'var(--font-poppins)' }}>
        &larr; Voltar para o Painel
      </Link>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-900" style={{ fontFamily: 'var(--font-lato)' }}>Gerenciar Catálogo</h1>
        <div className="flex space-x-2">
          {/* BOTÕES COM A COR ATUALIZADA */}
          <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${viewMode === 'list' ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            Lista
          </button>
          <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${viewMode === 'grid' ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            Grade
          </button>
        </div>
      </div>

      {viewMode === 'list' ? <ListView pecas={pecas} /> : <GridView pecas={pecas} />}
    </div>
  );
}

// --- Componente para a Ação de Status ---
function StatusUpdater({ peca }) {
  return (
    <form action={updatePieceStatus} className="flex items-center gap-2">
      <input type="hidden" name="id" value={peca.id} />
      <select name="status" defaultValue={peca.status || 'Disponível'} className="text-xs p-1 border border-gray-300 rounded" style={{ fontFamily: 'var(--font-nunito)' }}>
        <option>Disponível</option>
        <option>Reservado</option>
        <option>Vendido</option>
      </select>
      {/* BOTÃO COM A COR ATUALIZADA */}
      <button type="submit" className="text-xs bg-rose-500 text-white px-2 py-1 rounded hover:bg-rose-600 transition-colors">Salvar</button>
    </form>
  );
}

// --- Componente para a Visualização em Lista ---
function ListView({ pecas }) {
  const handleDelete = (e) => { if (!window.confirm('Tem certeza?')) e.preventDefault(); };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-stone-500" style={{ fontFamily: 'var(--font-poppins)' }}>Peça</th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-stone-500" style={{ fontFamily: 'var(--font-poppins)' }}>Status</th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-stone-500" style={{ fontFamily: 'var(--font-poppins)' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pecas.map((peca) => (
            <tr key={peca.id} className={`hover:bg-gray-50 ${peca.status !== 'Disponível' ? 'bg-gray-100 opacity-60' : ''}`}>
              <td className="px-4 py-2 border-b">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image src={peca.imagens?.[0] || '/placeholder.jpg'} alt={peca.nome} fill style={{objectFit: 'cover'}} className="rounded-md" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900" style={{ fontFamily: 'var(--font-lato)' }}>{peca.nome}</p>
                    <p className="text-xs text-orange-500" style={{ fontFamily: 'var(--font-space-grotesk)' }}>R$ {peca.preco}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2 border-b">
                <StatusUpdater peca={peca} />
              </td>
              <td className="px-4 py-2 border-b">
                <div className="flex items-center gap-4 text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
                  <Link href={`/painel/editar/${peca.id}`} className="text-cyan-800 hover:underline">Editar</Link>
                  <form action={deletePiece} onSubmit={handleDelete} className="inline">
                      <input type="hidden" name="id" value={peca.id} />
                      <button type="submit" className="text-rose-500 hover:underline">Excluir</button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Componente para a Visualização em Grade ---
function GridView({ pecas }) {
    const handleDelete = (e) => { if (!window.confirm('Tem certeza?')) e.preventDefault(); };

    return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {pecas.map((peca) => (
        <div key={peca.id} className={`border rounded-lg overflow-hidden shadow-sm relative group ${peca.status !== 'Disponível' ? 'opacity-50' : ''}`}>
          <div className="relative w-full aspect-square">
            <Image src={peca.imagens?.[0] || '/placeholder.jpg'} alt={peca.nome} fill style={{objectFit: 'cover'}} />
          </div>
          <div className="p-2 text-sm">
            <p className="font-bold truncate text-amber-900" style={{ fontFamily: 'var(--font-lato)' }}>{peca.nome}</p>
            <div className="mt-2">
                <StatusUpdater peca={peca} />
            </div>
          </div>
          {/* Botões de Ação na Grade */}
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: 'var(--font-poppins)' }}>
             <Link href={`/painel/editar/${peca.id}`} className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 text-cyan-800">✏️</Link>
             <form action={deletePiece} onSubmit={handleDelete} className="inline">
                <input type="hidden" name="id" value={peca.id} />
                <button type="submit" className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 text-rose-500">❌</button>
             </form>
          </div>
        </div>
      ))}
    </div>
  );
}