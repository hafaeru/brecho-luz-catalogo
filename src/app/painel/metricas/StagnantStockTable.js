'use client';

import Image from 'next/image';
import Link from 'next/link';

// Função para calcular há quantos dias a peça foi criada
function daysSince(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const differenceInTime = today.getTime() - date.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
  return differenceInDays;
}

export default function StagnantStockTable({ pecas }) {
  if (!pecas || pecas.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
        <h3 className="text-lg font-semibold text-amber-900 mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
          Estoque Antigo (Top 10)
        </h3>
        <p className="text-stone-500 text-sm">Nenhuma peça encontrada.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
      <h3 className="text-lg font-semibold text-amber-900 mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
        Estoque Antigo (Top 10 peças há mais tempo disponíveis)
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left text-sm font-semibold text-stone-500">Peça</th>
              <th className="px-4 py-2 border-b text-left text-sm font-semibold text-stone-500">Preço</th>
              <th className="px-4 py-2 border-b text-left text-sm font-semibold text-stone-500">Em Estoque Há</th>
              <th className="px-4 py-2 border-b text-left text-sm font-semibold text-stone-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pecas.map((peca) => (
              <tr key={peca.id} className="hover:bg-stone-50">
                <td className="px-4 py-2 border-b">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image src={peca.imagens?.[0] || '/placeholder.jpg'} alt={peca.nome} fill style={{objectFit: 'cover'}} className="rounded-md" />
                    </div>
                    <span className="font-medium text-cyan-900 text-sm truncate">{peca.nome}</span>
                  </div>
                </td>
                <td className="px-4 py-2 border-b text-sm text-stone-700">R$ {peca.preco.toFixed(2)}</td>
                <td className="px-4 py-2 border-b text-sm text-stone-700">{daysSince(peca.created_at)} dias</td>
                <td className="px-4 py-2 border-b">
                  <Link href={`/painel/editar/${peca.id}`} className="text-sm font-semibold text-rose-500 hover:underline">
                    Ver / Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}