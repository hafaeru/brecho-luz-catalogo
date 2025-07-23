import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

async function getPecas() {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from('pecas')
    .select('*')
    .eq('status', 'Disponível')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erro ao buscar peças para a home:", error);
    return [];
  }
  return data;
}

export default async function Home() {
  const pecas = await getPecas();

  return (
    <main className="container mx-auto p-4 sm:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">Brechó Luz</h1>
        <p className="text-lg text-gray-600 mt-2">Peças com História, Luz para seu Estilo!</p>
      </div>

      {pecas.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma peça disponível no momento. Volte em breve!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {pecas.map((peca) => (
            <Link href={`/peca/${peca.id}`} key={peca.id}>
              <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
                <div className="relative w-full h-80">
                  <Image
                    src={peca.imagens?.[0] || '/placeholder.jpg'} 
                    alt={peca.nome}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                <div className="p-4 bg-white">
                  <h2 className="text-xl font-semibold text-gray-800 truncate">{peca.nome}</h2>
                  <p className="text-md text-gray-600 mt-1">Tamanho: {peca.tamanho}</p>
                  <p className="text-xl font-bold text-yellow-600 mt-2">R$ {peca.preco}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}