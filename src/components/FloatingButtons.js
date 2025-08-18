'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { FaWhatsapp } from 'react-icons/fa';
import CartSidebar from './CartSidebar'; // Assumindo que CartSidebar.js está em /src/components

// A correção é garantir que a palavra 'default' esteja aqui.
export default function FloatingButtons() {
  const { cart } = useCart();
  const [showCarrinho, setShowCarrinho] = useState(false);

  return (
    <>
      {/* Botão flutuante do Carrinho */}
      <button 
        onClick={() => setShowCarrinho(true)} 
        className="fixed bottom-5 right-5 bg-orange-600 text-white w-16 h-16 rounded-full shadow-lg hover:scale-110 transition z-40 flex items-center justify-center"
        aria-label="Abrir carrinho"
      >
        <span className="text-2xl">🛒</span>
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </button>

      {/* Botão flutuante do WhatsApp */}
      <a
        href="https://chat.whatsapp.com/DRKWqlxvFDCFaun2aZCiiB"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale Conosco pelo WhatsApp"
        className="fixed bottom-24 right-5 bg-green-600 text-white w-16 h-16 rounded-full shadow-lg hover:scale-110 transition z-40 flex items-center justify-center"
      >
        <FaWhatsapp size={32} />
      </a>

      {/* Menu Lateral do Carrinho (renderizado aqui para ser controlado por este componente) */}
      <CartSidebar isOpen={showCarrinho} onClose={() => setShowCarrinho(false)} />
    </>
  );
}