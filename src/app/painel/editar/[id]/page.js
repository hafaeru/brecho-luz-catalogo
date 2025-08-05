import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import AddPieceForm from '../../AddPieceForm.js';
import Link from 'next/link';

async function getPeca(id) {
  // CORREÇÃO: Passamos a função `cookies` diretamente, como a biblioteca espera.
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from('pecas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    // Este log ainda é útil para diagnosticar problemas de RLS ou IDs não encontrados.
    console.error('Erro na consulta ao Supabase:', JSON.stringify(error, null, 2));
  }
  
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
        <AddPieceForm pecaInicial={peca} />
      ) : (
        <p className="text-stone-500" style={{ fontFamily: 'var(--font-nunito)' }}>
          Peça não encontrada. Verifique o ID ou as permissões (RLS) no Supabase.
        </p>
      )}
    </div>
  );
}