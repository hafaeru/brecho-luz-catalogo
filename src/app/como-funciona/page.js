import Link from 'next/link';
import { FaEye, FaWhatsapp, FaBoxOpen, FaGift } from 'react-icons/fa';
import { PiPackageBold, PiHandHeartBold } from "react-icons/pi";


// Metadados da página para SEO
export const metadata = {
  title: 'Como Funciona | Brechó Luz',
  description: 'Descubra como é fácil garimpar seus achados no Brechó Luz. Conheça nosso processo de compra, reserva e entrega.',
};

export default function ComoFuncionaPage() {
  return (
    <div className="bg-white">
      <div className="container mx-auto max-w-4xl px-6 py-16 md:py-24">

        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900" style={{ fontFamily: 'var(--font-lato)' }}>
            Como Funciona
          </h1>
          <p className="mt-4 text-lg text-stone-600" style={{ fontFamily: 'var(--font-nunito)' }}>
            Nossa forma de levar luz e estilo até você.
          </p>
        </header>

        <main className="space-y-16">

          {/* --- PASSO 1: O ACHADO --- */}
          <section className="flex flex-col items-center text-center">
            <FaEye size={40} className="text-rose-500 mb-4" />
            <h2 className="text-3xl font-semibold text-cyan-900" style={{ fontFamily: 'var(--font-poppins)' }}>
              1. Encontre seu Tesouro
            </h2>
            <p className="mt-4 text-stone-700 leading-relaxed max-w-2xl" style={{ fontFamily: 'var(--font-nunito)' }}>
              Nossas peças são garimpos únicos e cheios de história. Como trabalhamos com itens exclusivos, se você se apaixonou por algo, não espere! Cada achado é uma oportunidade rara de iluminar seu guarda-roupa.
            </p>
          </section>

          {/* --- PASSO 2: A RESERVA --- */}
          <section className="flex flex-col items-center text-center">
            <FaWhatsapp size={40} className="text-green-600 mb-4" />
            <h2 className="text-3xl font-semibold text-cyan-900" style={{ fontFamily: 'var(--font-poppins)' }}>
              2. Chame no WhatsApp e Garanta sua Peça
            </h2>
            <p className="mt-4 text-stone-700 leading-relaxed max-w-2xl" style={{ fontFamily: 'var(--font-nunito)' }}>
              Para garantir seu achado, é simples: envie uma mensagem para nosso WhatsApp com a peça de interesse. Sua reserva especial é confirmada assim que recebermos o comprovante do pagamento via Pix. É rápido, seguro e garante que o tesouro é seu!
            </p>
          </section>

          {/* --- PASSO 3: A ENTREGA --- */}
          <section className="flex flex-col items-center text-center">
            <FaBoxOpen size={40} className="text-amber-800 mb-4" />
            <h2 className="text-3xl font-semibold text-cyan-900" style={{ fontFamily: 'var(--font-poppins)' }}>
              3. Receba ou Retire
            </h2>
            <p className="mt-4 text-stone-700 leading-relaxed max-w-2xl" style={{ fontFamily: 'var(--font-nunito)' }}>
              Oferecemos duas formas de você receber seu novo achado:
            </p>
            <div className="mt-8 grid md:grid-cols-2 gap-8 w-full">
              {/* Opção 1: Retirada */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 text-center">
                <PiHandHeartBold size={32} className="text-cyan-900 mx-auto mb-3" />
                <h3 className="font-bold text-lg text-cyan-900" style={{ fontFamily: 'var(--font-poppins)' }}>Retire Conosco</h3>
                <p className="mt-2 text-sm text-stone-600" style={{ fontFamily: 'var(--font-nunito)' }}>
                  Gostaria de nos visitar? Agende um horário e venha retirar sua peça em nosso espaço no Alto da XV. Aproveite para experimentar, conhecer outros achados e tomar um café conosco!
                </p>
              </div>
              {/* Opção 2: Entrega */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
                <PiPackageBold size={32} className="text-cyan-900 mx-auto mb-3" />
                <h3 className="font-bold text-lg text-cyan-900 text-center" style={{ fontFamily: 'var(--font-poppins)' }}>Receba em Casa (Uber Flash)</h3>
                <ol className="list-decimal list-inside text-left mt-4 space-y-2 text-sm text-stone-600" style={{ fontFamily: 'var(--font-nunito)' }}>
                  <li>Após a confirmação do Pix, preparamos seu pacote com todo o carinho.</li>
                  <li>Pedimos um prazo de 15 minutos para deixar tudo pronto.</li>
                  <li>Você solicita um **Uber Flash** para nosso endereço.</li>
                  <li>Envie-nos o print com as informações do entregador e despachamos seu tesouro na mesma hora!</li>
                </ol>
              </div>
            </div>
          </section>

          {/* --- PASSO 4: O PÓS-COMPRA --- */}
          <section className="flex flex-col items-center text-center">
            <FaGift size={40} className="text-rose-500 mb-4" />
            <h2 className="text-3xl font-semibold text-cyan-900" style={{ fontFamily: 'var(--font-poppins)' }}>
              4. Um Carinho para o Futuro
            </h2>
            <p className="mt-4 text-stone-700 leading-relaxed max-w-2xl" style={{ fontFamily: 'var(--font-nunito)' }}>
              Todas as nossas peças são selecionadas e higienizadas com muito cuidado, prontas para começar uma nova história com você. Após cada compra, enviamos um cupom de desconto especial como nosso agradecimento, para seu próximo achado ser ainda mais feliz!
            </p>
          </section>

          {/* --- CTA FINAL --- */}
          <section className="text-center pt-12 border-t border-stone-200">
             <h2 className="text-3xl font-semibold text-cyan-900 mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
              Pronta para Garimpar?
            </h2>
            <Link href="/" className="inline-block mt-4 px-8 py-3 font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-transform hover:scale-105">
              Ver Peças Disponíveis
            </Link>
          </section>

        </main>
      </div>
    </div>
  );
}