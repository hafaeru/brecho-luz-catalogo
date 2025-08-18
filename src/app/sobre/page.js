import Image from 'next/image';
import Link from 'next/link';

// Metadados da página para SEO (bom para o Google)
export const metadata = {
  title: 'Sobre Nós | Brechó Luz',
  description: 'Conheça a história, a missão e a alma por trás do Brechó Luz, um sonho de mãe e filho que conecta moda, propósito e carinho.',
};

export default function SobreNosPage() {
  return (
    // Fundo neutro para a página
    <div className="bg-stone-50">
      <div className="container mx-auto max-w-4xl px-6 py-16 md:py-24">

        {/* --- SEÇÃO 1: TÍTULO PRINCIPAL --- */}
        <header className="text-center mb-16">
          <h1 className="text-8xl sm:text-8xl font-normal text-amber-800" style={{ fontFamily: 'var(--font-great-vibes)' }}>
            Nossa História
          </h1>
        </header>

        <main className="space-y-20">

          {/* --- SEÇÃO 2: SOBRE O BRECHÓ LUZ --- */}
          <section className="text-center">
            <h2 className="text-3xl font-semibold text-cyan-900 mb-6" style={{ fontFamily: 'var(--font-poppins)' }}>
              Um Sonho de Mãe e Filho
            </h2>
            <div className="text-base md:text-lg text-stone-700 leading-relaxed space-y-4 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-nunito)' }}>
              <p>
                Seja bem-vindo ao nosso cantinho! O Brechó Luz nasceu de um sonho de mãe e filho para dar nova vida a peças cheias de alma. Aqui, a moda tem propósito e um preço justo.
              </p>
              <p>
                Trazemos atenção e empatia, carinho, diretamente de Minas Gerais para o frio do Sul, com cada achado sendo garimpado com o coração.
              </p>
            </div>
          </section>

          {/* --- SEÇÃO 3: A FUNDADORA --- */}
          <section className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-stone-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1 flex justify-center">
                {/* IMPORTANTE: 
                  1. Crie uma pasta `public/images/` na raiz do seu projeto.
                  2. Coloque a foto da sua mãe lá com o nome 'fundadora.jpg' (ou outro nome).
                  3. Ajuste o `src` abaixo se usar um nome diferente.
                */}
                <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg ring-4 ring-rose-100">
                  <Image
                    src="/images/fundadora.jpg" 
                    alt="Foto da fundadora do Brechó Luz"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
              <div className="md:col-span-2 text-center md:text-left">
                <h2 className="text-3xl font-semibold text-cyan-900" style={{ fontFamily: 'var(--font-poppins)' }}>
                  A Alma por Trás da Luz
                </h2>
                <div className="mt-4 text-stone-700 leading-relaxed space-y-3" style={{ fontFamily: 'var(--font-nunito)' }}>
                  <p>
                    {/* >> COLOQUE AQUI O TEXTO SOBRE SUA MÃE << */}
                    <strong>Exemplo:</strong> "Com um olhar apurado para peças que contam histórias e um coração mineiro cheio de afeto, [Nome da sua Mãe] é a curadora e a alma do nosso brechó. Cada peça é escolhida a dedo, refletindo seu amor pela moda atemporal e pelo consumo consciente."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* --- SEÇÃO 4: NOSSA MISSÃO E VALORES (SUGESTÃO) --- */}
          <section className="text-center">
            <h2 className="text-3xl font-semibold text-cyan-900 mb-6" style={{ fontFamily: 'var(--font-poppins)' }}>
              Nossa Missão
            </h2>
            <div className="text-base md:text-lg text-stone-700 leading-relaxed space-y-4 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-nunito)' }}>
              <p>
                {/* >> COLOQUE AQUI O TEXTO SOBRE A MISSÃO DO BRECHÓ << */}
                <strong>Exemplo:</strong> "Democratizar o acesso à moda de qualidade com afeto e propósito. Acreditamos no poder de um guarda-roupa inteligente, que expressa sua identidade, respeita o seu bolso e cuida do nosso planeta, uma peça de cada vez."
              </p>
            </div>
          </section>

          {/* --- SEÇÃO 5: CHAMADA PARA AÇÃO (CTA) --- */}
          <section className="text-center pt-12 border-t border-stone-200">
             <h2 className="text-3xl font-semibold text-cyan-900 mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
              Faça Parte da Nossa História
            </h2>
            <Link href="/" className="inline-block mt-4 px-8 py-3 font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-transform hover:scale-105">
              Ver Nossas Peças
            </Link>
          </section>

        </main>
      </div>
    </div>
  );
}