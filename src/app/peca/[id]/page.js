'use client'; 

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
// ... (resto das importações)

export default function PecaDetalhe({ params }) {
  // ... (toda a lógica de busca e estados que já tínhamos)

  return (
    <div className="container ...">
      {/* ... */}
      <div className="flex flex-col">
        {/* ... */}
        {/* Seção de Detalhes */}
        <div className="border-t pt-4">
          <h3 className="text-xl font-semibold mb-2">Detalhes</h3>
          {/* ... (ul com os detalhes da peça) */}
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
            {/* ... (ul com as medidas) */}
        </div>
      </div>
    </div>
  );
}