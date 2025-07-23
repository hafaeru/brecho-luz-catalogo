'use client'; 

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';

export default function PecaDetalhe({ params }) {
  const [peca, setPeca] = useState(null);
  const [imagemAtiva, setImagemAtiva] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPeca() {
      //... (lógica de busca da peça)
    }
    getPeca();
  }, [params.id]);

  if (loading) { /* ... */ }
  if (!peca) { /* ... */ }

  const linkWhatsApp = `https://wa.me/SEUNUMERODOTELEFONE?text=...`;

  return (
    <div className="container mx-auto p-4 sm:p-8">
      {/* ... (código da galeria de fotos) ... */}
      <div className="flex flex-col">
        {/* ... (código de título, preço, botão whats) ... */}
        
        {peca.descricao && <p>{peca.descricao}</p>}

        {/* Seção de Detalhes */}
        <div className="border-t pt-4">
          <h3 className="text-xl font-semibold mb-2">Detalhes</h3>
          <ul className="space-y-2 text-gray-600">
            {/* ... (lis com os detalhes) ... */}
          </ul>
        </div>
        
        {/* Seção de Modelagem */}
        {peca.modelagem && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-xl font-semibold mb-2">Modelagem e Detalhes</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{peca.modelagem}</p>
          </div>
        )}

        {/* Seção de Medidas */}
        <div className="mt-4 border-t pt-4">
            <h3 className="text-xl font-semibold mb-2">Medidas</h3>
            <ul className="space-y-2 text-gray-600">
                {/* ... (lis com as medidas) ... */}
            </ul>
        </div>
      </div>
    </div>
  );
}