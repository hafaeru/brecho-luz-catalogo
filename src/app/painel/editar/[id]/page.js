import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import AddPieceForm from '../../AddPieceForm.js';
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
        <Link href="/painel/catalogo" className="text-amber-900 hover:underline mb-6 inline-block" style={{ fontFamily: 'var(--font-poppins)' }}>
            &larr; Voltar para o Catálogo
        </Link>
      {peca ? (
        // Passamos a propriedade `pecaInicial` para o formulário
        <AddPieceForm pecaInicial={peca} />
      ) : (
        <p className="text-stone-500" style={{ fontFamily: 'var(--font-nunito)' }}>Peça não encontrada.</p>
      )}
    </div>
  );
}