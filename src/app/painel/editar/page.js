// Em: src/app/painel/editar/[id]/page.js

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import AddPieceForm from '../../AddPieceForm.js'; // Importamos nosso formulário
import Link from 'next/link';

// Função para buscar os dados de uma peça específica
async function getPeca(id) {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from('pecas')
    .select('*')
    .eq('id', id)
    .single();
  if (error) console.error('Erro ao buscar peça para edição:', error);
  return data;
}

export default async function EditPage({ params }) {
  const peca = await getPeca(params.id);

  return (
    <div className="container mx-auto p-4 sm:p-8">
        <Link href="/painel/catalogo" className="text-yellow-600 hover:underline mb-6 inline-block">
            &larr; Voltar para o Catálogo
        </Link>
      {peca ? (
        <AddPieceForm pecaInicial={peca} />
      ) : (
        <p>Peça não encontrada.</p>
      )}
    </div>
  );
}