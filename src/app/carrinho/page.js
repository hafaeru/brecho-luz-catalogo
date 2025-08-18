'use client';

import { useCart } from '@/context/CartContext.js';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingBag } from 'react-icons/fa';

export default function CarrinhoPage() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((acc, item) => acc + item.preco, 0);

  const mensagemWhatsApp = encodeURIComponent(
    `Olá! Tenho interesse em finalizar a compra dos seguintes itens:\n\n${cart.map(p => `- ${p.nome} (R$ ${p.preco.toFixed(2)})`).join('\n')}\n\nTotal: R$ ${total.toFixed(2)}`
  );
  const linkWhatsApp = `https://wa.me/5541SEUNUMEROAQUI?text=${mensagemWhatsApp}`; // TROQUE SEU NÚMERO

  return (
    <main className="container mx-auto p-4 sm:p-8">
      <header className="text-center md:text-left mb-8">
        <h1 className="text-4xl font-bold text-amber-900" style={{ fontFamily: 'var(--font-lato)' }}>
          Meu Carrinho
        </h1>
      </header>

      {cart.length === 0 ? (
        // TELA DE CARRINHO VAZIO APRIMORADA (FUNCIONALIDADE MANTIDA)
        <div className="text-center text-stone-500 py-16 flex flex-col items-center">
          <FaShoppingBag size={48} className="text-stone-300 mb-6" />
          <h2 className="text-2xl font-semibold text-stone-700 mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>Seu carrinho está vazio</h2>
          <p className="max-w-sm mb-8" style={{ fontFamily: 'var(--font-nunito)' }}>
            Parece que você ainda não encontrou seu próximo tesouro. Explore nossas peças e adicione um pouco de luz ao seu guarda-roupa!
          </p>
          <Link href="/" className="inline-block mt-6 px-8 py-3 font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-transform hover:scale-105">
            Continuar Comprando
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Coluna da Esquerda: Itens do Carrinho (DESIGN ANTIGO RESTAURADO) */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(peca => (
              <div key={peca.id} className="flex items-center bg-white p-4 rounded-lg shadow-sm border">
                <Link href={`/peca/${peca.id}`} className="relative w-20 h-20 flex-shrink-0 mr-4">
                  <Image src={peca.imagens?.[0]} alt={peca.nome} fill style={{objectFit: 'cover'}} className="rounded-md" />
                </Link>
                <div className="flex-grow">
                  <Link href={`/peca/${peca.id}`} className="hover:underline">
                    <h2 className="font-semibold text-cyan-800" style={{fontFamily: 'var(--font-poppins)'}}>{peca.nome}</h2>
                  </Link>
                  <p className="text-sm text-stone-500" style={{fontFamily: 'var(--font-nunito)'}}>Tam: {peca.tamanho || 'Único'}</p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="font-bold text-orange-500" style={{fontFamily: 'var(--font-nunito)'}}>R$ {peca.preco.toFixed(2)}</p>
                  <button onClick={() => removeFromCart(peca.id)} className="text-xs text-rose-500 hover:underline mt-1">Remover</button>
                </div>
              </div>
            ))}
          </div>

          {/* Coluna da Direita: Resumo do Pedido (DESIGN ANTIGO RESTAURADO COM MELHORIAS) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
              <h2 className="text-2xl font-bold text-amber-900 mb-4" style={{ fontFamily: 'var(--font-lato)' }}>Resumo</h2>
              <div className="space-y-2 text-stone-600" style={{ fontFamily: 'var(--font-nunito)' }}>
                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} {cart.length > 1 ? 'itens' : 'item'})</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span>A combinar</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t text-amber-900" style={{ fontFamily: 'var(--font-lato)' }}>
                <span>Total</span>
                <span className="text-orange-500" style={{fontFamily: 'var(--font-space-grotesk)'}}>R$ {total.toFixed(2)}</span>
              </div>
              
              {/* LINK WHATSAPP GARANTIDO E TEXTO DO BOTÃO ORIGINAL */}
              <a href={linkWhatsApp} target="_blank" rel="noopener noreferrer" className="block w-full text-center mt-6 px-6 py-3 font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors">
                Entre em contato e reserve!
              </a>

              {/* TEXTO DE PAGAMENTO CORRIGIDO */}
              <div className="mt-4 text-xs text-stone-500 text-center space-y-1" style={{ fontFamily: 'var(--font-nunito)' }}>
                  <p>Você será redirecionado para o WhatsApp para combinar o pagamento e a entrega.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}