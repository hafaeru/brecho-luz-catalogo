'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { useEffect } from 'react';

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce((acc, item) => acc + item.preco, 0);

  // Efeito para gerenciar o scroll da página e a tecla 'Esc'
  useEffect(() => {
    // Função para fechar com a tecla 'Escape'
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'auto';
    }

    // Limpa os efeitos ao desmontar o componente ou quando o estado muda
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);


  return (
    // --- OVERLAY CORRIGIDO ---
    // Este div agora controla o fundo transparente e o desfoque.
    // A animação de opacidade faz o fundo surgir suavemente.
    <div 
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? 'bg-opacity-30 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}
      onClick={onClose}
    >
      {/* --- CONTAINER DO MENU LATERAL CORRIGIDO --- */}
      {/* A animação de 'transform' foi movida para este container. 
          A sintaxe com backticks (`) agora está correta. */}
      <div 
        className={`w-full max-w-md h-full bg-white shadow-xl flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* O conteúdo interno (cabeçalho, corpo, rodapé) permanece o mesmo */}
        <header className="flex items-center justify-between p-6 border-b border-stone-200">
          <h2 className="text-2xl font-bold text-amber-900" style={{ fontFamily: 'var(--font-lato)' }}>
            Meu Carrinho
          </h2>
          <button onClick={onClose} className="text-stone-500 hover:text-rose-500">
            <FaTimes size={24} />
          </button>
        </header>

        <div className="flex-grow p-6 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center text-stone-500 flex flex-col items-center justify-center h-full">
              <p>Seu carrinho está vazio.</p>
              <Link href="/" onClick={onClose} className="mt-4 text-rose-500 font-semibold hover:underline">
                Ver peças
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(peca => (
                <div key={peca.id} className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded overflow-hidden">
                    <Image src={peca.imagens?.[0]} alt={peca.nome} fill style={{objectFit: 'cover'}} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-cyan-900 text-sm">{peca.nome}</h3>
                    <p className="text-rose-600 font-bold text-lg mt-1">R$ {peca.preco.toFixed(2)}</p>
                  </div>
                  <button onClick={() => removeFromCart(peca.id)} className="text-stone-400 hover:text-red-500">
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <footer className="p-6 border-t border-stone-200 bg-stone-50">
            <div className="flex justify-between font-bold text-lg text-amber-900">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="mt-6 space-y-3">
              <Link href="/carrinho" onClick={onClose} className="block w-full text-center px-6 py-3 font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors">
                Finalizar Compra
              </Link>
              <button onClick={onClose} className="block w-full text-center px-6 py-3 font-semibold text-stone-600 bg-transparent rounded-lg hover:bg-stone-200 transition-colors">
                Continuar Comprando
              </button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}