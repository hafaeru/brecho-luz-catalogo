'use client';

import Link from 'next/link';
import { deletePiece } from './actions.js'; // Importamos nossa nova ação

export default function PecasList({ pecas }) {

  const handleDelete = (e) => {
    // Adiciona uma confirmação antes de excluir
    if (!window.confirm('Tem certeza de que deseja excluir esta peça? Esta ação não pode ser desfeita.')) {
      e.preventDefault();
    }
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Nome da Peça</th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Preço</th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Status</th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">Ações</th>
          </tr>
        </thead>
        <tbody>
          {pecas.length > 0 ? (
            pecas.map((peca) => (
              <tr key={peca.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{peca.nome}</td>
                <td className="px-4 py-2 border-b">R$ {peca.preco}</td>
                <td className="px-4 py-2 border-b">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      peca.status === 'Disponível' ? 'bg-green-100 text-green-800' : 
                      peca.status === 'Vendido' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {peca.status}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">
                  <Link href={`/painel/editar/${peca.id}`} className="text-blue-500 hover:underline mr-4">
                    Editar
                  </Link>
                  {/* O botão agora está dentro de um formulário que chama a ação */}
                  <form action={deletePiece} onSubmit={handleDelete} className="inline">
                    <input type="hidden" name="id" value={peca.id} />
                    <button type="submit" className="text-red-500 hover:underline">
                      Excluir
                    </button>
                  </form>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                Nenhuma peça cadastrada ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}