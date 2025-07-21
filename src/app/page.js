import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link'; // 1. Adicionamos a importação do Link

export default async function Home() {
  const { data: pecas, error } = await supabase
    .from('pecas')
    .select('*')
    .eq('disponivel', true);

  if (error) {
    return <p>Ocorreu um erro ao buscar as peças. Tente novamente.</p>;
  }

  return (
    <main className="container mx-auto p-4 sm:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">Brechó Luz</h1>
        <p className="text-lg text-gray-600 mt-2">Peças com História, Luz para seu Estilo!</p>
      </div>

      {pecas.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma peça disponível no momento. Volte em breve!</p>
      ) : (
        // Container do Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Mapeando cada peça para um "Card" */}
          {pecas.map((peca) => (
            // 2. Envolvemos todo o card com o componente Link
            // A 'key' passa do 'div' para o 'Link', que é o elemento pai agora.
            <Link href={`/peca/${peca.id}`} key={peca.id}>
              <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                {/* Imagem do Produto */}
                <div className="relative w-full h-80">
                  <Image
                    src={peca.imagem_url}
                    alt={peca.nome}
                    fill // 'fill' faz a imagem preencher o container
                    style={{ objectFit: 'cover' }} // Garante que a imagem cubra o espaço sem distorcer
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
                
                {/* Informações do Produto */}
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