'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Carrega o carrinho do localStorage quando o app inicia
  useEffect(() => {
    const savedCart = localStorage.getItem('brechoLuzCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // --- FUNÇÃO addToCart REATORADA ---
  const addToCart = (peca) => {
    // 1. Verificamos o carrinho ANTES de qualquer outra coisa.
    const itemExists = cart.find(item => item.id === peca.id);

    if (itemExists) {
      // 2. Se o item já existe, disparamos o erro e paramos a função.
      toast.error(`${peca.nome} já está no carrinho!`);
      return; // Impede a execução do resto do código
    }

    // 3. Se o item é novo, disparamos o sucesso.
    toast.success(`${peca.nome} foi adicionado ao carrinho!`);

    // 4. SÓ ENTÃO, atualizamos o estado e o localStorage.
    const newCart = [...cart, peca];
    setCart(newCart);
    localStorage.setItem('brechoLuzCart', JSON.stringify(newCart));
  };

  // --- FUNÇÃO removeFromCart ATUALIZADA (melhoria proativa) ---
  const removeFromCart = (pecaId) => {
  // Encontra o nome da peça antes de removê-la para usar na notificação
  const pecaRemovida = cart.find(item => item.id === pecaId);
  
  const newCart = cart.filter(item => item.id !== pecaId);
  setCart(newCart);
  localStorage.setItem('brechoLuzCart', JSON.stringify(newCart));

  if (pecaRemovida) {
  toast.error(`${pecaRemovida.nome} foi removido do carrinho.`, {
    icon: '🗑️',
  });
    }
};

  const value = {
    cart,
    addToCart,
    removeFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}