'use client';

import { useCart } from '@/context/CartContext.js';
import Link from 'next/link';
import Image from 'next/image';

export default function CarrinhoPage() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((acc, item) => acc + item.preco, 0);

  const mensagemWhatsApp = encodeURIComponent(
    `Olá! Gostaria de reservar as seguintes peças do meu carrinho:\n\n${cart.map(p => `- ${p.nome} (R$ ${p.preco})`).join('\n')}\n\nTotal: R$ ${total.toFixed(2)}`
  );
  const linkWhatsApp = `https://wa.me/SEUNUMERODOTELEFONE?text=${mensagemWhatsApp}`; // TROQUE SEU NÚMERO

  return (
    <main className="container mx-auto p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-amber-900 mb-8" style={{ fontFamily: 'var(--font-lato)' }}>
        Meu Carrinho
      </h1>

      {cart.length === 0 ? (
        <p className="text-stone-500" style={{ fontFamily: 'var(--font-nunito)' }}>
          Seu carrinho está vazio.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Lista de Peças */}
          <div className="md:col-span-2 space-y-4">
            {cart.map(peca => (
              <div key={peca.id} className="flex items-center bg-white p-4 rounded-lg shadow-sm border">
                <Link href={`/peca/${peca.id}`} className="relative w-20 h-20 flex-shrink-0 mr-4">
                  <Image src={peca.imagens?.[0]} alt={peca.nome} fill style={{objectFit: 'cover'}} className="rounded-md" />
                </Link>
                <div className="flex-grow">
                  <Link href={`/peca/${peca.id}`}>
                      <h2 className="font-semibold text-cyan-800" style={{fontFamily: 'var(--font-poppins)'}}>{peca.nome}</h2>
                  </Link>
                  <p className="text-sm text-stone-500" style={{fontFamily: 'var(--font-nunito)'}}>Tam: {peca.tamanho}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-orange-500" style={{fontFamily: 'var(--font-nunito)'}}>R$ {peca.preco.toFixed(2)}</p>
                  <button onClick={() => removeFromCart(peca.id)} className="text-xs text-rose-500 hover:underline mt-1">Remover</button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo do Pedido */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
              <h2 className="text-2xl font-bold text-amber-900 mb-4" style={{ fontFamily: 'var(--font-lato)' }}>Resumo</h2>
              <div className="flex justify-between text-stone-500" style={{ fontFamily: 'var(--font-nunito)' }}>
                <span>Subtotal</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t text-amber-900" style={{ fontFamily: 'var(--font-lato)' }}>
                <span>Total</span>
                <span className="text-orange-500" style={{fontFamily: 'var(--font-space-grotesk)'}}>R$ {total.toFixed(2)}</span>
              </div>
              <a href={linkWhatsApp} target="_blank" rel="noopener noreferrer" className="block w-full text-center mt-6 px-6 py-3 font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors">
                Entre em contato e reserve!
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}