import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import PecaDetalheClient from './PecaDetalheClient'; // Importa o novo componente de cliente

async function getPeca(id) {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase
    .from('pecas')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}
// --- NOVA FUNÇÃO PARA BUSCAR PEÇAS RELACIONADAS ---
async function getPecasRelacionadas(categoria, pecaIdAtual) {
  if (!categoria) return [];
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase
    .from('pecas')
    .select('*')
    .eq('categoria', categoria)
    .eq('status', 'Disponível')
    .neq('id', pecaIdAtual) // Exclui a peça atual da lista
    .limit(4); // Limita a 4 peças
  return data || [];
}

export async function generateMetadata({ params }) {
  const peca = await getPeca(params.id);

  if (!peca) {
    return { title: 'Peça não encontrada | Brechó Luz' };
  }

  return {
    title: `${peca.nome} | Brechó Luz`,
    description: peca.descricao || `Encontre ${peca.nome} e outras peças únicas no Brechó Luz.`,
    openGraph: {
      title: `${peca.nome} | Brechó Luz`,
      description: peca.descricao || `Peças com História, Luz para seu Estilo.`,
      images: [
        {
          url: peca.imagens?.[0] || '/placeholder.jpg',
          width: 800,
          height: 600,
          alt: peca.nome,
        },
      ],
    },
  };
}

export default async function PecaDetalhePage({ params }) {
  const peca = await getPeca(params.id);
  if (!peca) {
    notFound();
  }
  // Busca as peças relacionadas
  const pecasRelacionadas = await getPecasRelacionadas(peca.categoria, peca.id);
  // Passa os novos dados como uma prop
  return <PecaDetalheClient peca={peca} pecasRelacionadas={pecasRelacionadas} />;
}