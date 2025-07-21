'use client'; 

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { deletePiece } from '../actions.js'; // 1. IMPORTAMOS NOSSA AÇÃO DE DELETAR

export default function CatalogoPage() {
  const [pecas, setPecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'grid'
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
      } else {
        console.error('Erro ao buscar peças:', error);
      }
      setLoading(false);
    }

    getPecas();
  }, [supabase]);

  // 2. FUNÇÃO DE CONFIRMAÇÃO PARA A EXCLUSÃO
  const handleDelete = (e) => {
    if (!window.confirm('Tem certeza de que deseja excluir esta peça? Esta ação não pode ser desfeita.')) {
      e.preventDefault();
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando inventário...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Link href="/painel" className="text-yellow-600 hover:underline mb-6 inline-block">
        &larr; Voltar para o Painel
      </Link>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Catálogo</h1>
        <div className="flex space-x-2">
          <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-md text-sm ${viewMode === 'list' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}>
            Lista
          </button>
          <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-md text-sm ${viewMode === 'grid' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}>
            Grade
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <ListView pecas={pecas} handleDelete={handleDelete} />
      ) : (
        <GridView pecas={pecas} handleDelete={handleDelete} />
      )}
    </div>
  );
}

// Componente para a Visualização em Lista
function ListView({ pecas, handleDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Foto</th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Nome da Peça</th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Preço</th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Status</th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Ações</th>
          </tr>
        </thead>
        <tbody>
          {pecas.map((peca) => (
            <tr key={peca.id} className="hover:bg-gray-50">
              <td className="p-2 border-b">
                <div className="relative w-16 h-16">
                  <Image src={peca.imagens?.[0] || '/placeholder.jpg'} alt={peca.nome} fill style={{objectFit: 'cover'}} className="rounded-md" />
                </div>
              </td>
              <td className="px-4 py-2 border-b">{peca.nome}</td>
              <td className="px-4 py-2 border-b">R$ {peca.preco}</td>
              <td className="px-4 py-2 border-b">{peca.status || 'Disponível'}</td>
              <td className="px-4 py-2 border-b">
                <Link href={`/painel/editar/${peca.id}`} className="text-blue-500 hover:underline mr-4">Editar</Link>
                {/* 3. CONECTAMOS O BOTÃO AO FORMULÁRIO E À AÇÃO */}
                <form action={deletePiece} onSubmit={handleDelete} className="inline">
                    <input type="hidden" name="id" value={peca.id} />
                    <button type="submit" className="text-red-500 hover:underline">Excluir</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Componente para a Visualização em Grade
function GridView({ pecas, handleDelete }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {pecas.map((peca) => (
        <div key={peca.id} className="border rounded-lg overflow-hidden shadow-sm relative group">
          <div className="relative w-full aspect-square">
            <Image src={peca.imagens?.[0] || '/placeholder.jpg'} alt={peca.nome} fill style={{objectFit: 'cover'}} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="font-bold truncate">{peca.nome}</p>
            <p>R$ {peca.preco}</p>
          </div>
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
             <Link href={`/painel/editar/${peca.id}`} className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100">✏️</Link>
             {/* 3. CONECTAMOS O ÍCONE AO FORMULÁRIO E À AÇÃO */}
             <form action={deletePiece} onSubmit={handleDelete} className="inline">
                <input type="hidden" name="id" value={peca.id} />
                <button type="submit" className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100">❌</button>
             </form>
          </div>
        </div>
      ))}
    </div>
  );
}