'use client';

import { createContext, useContext, useState, useEffect } from 'react';

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

  const addToCart = (peca) => {
    setCart((prevCart) => {
      // Evita adicionar a mesma peça duas vezes
      if (prevCart.find(item => item.id === peca.id)) {
        alert(`${peca.nome} já está no carrinho!`);
        return prevCart;
      }
      const newCart = [...prevCart, peca];
      localStorage.setItem('brechoLuzCart', JSON.stringify(newCart));
      alert(`${peca.nome} foi adicionado ao carrinho!`);
      return newCart;
    });
  };

  const removeFromCart = (pecaId) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter(item => item.id !== pecaId);
      localStorage.setItem('brechoLuzCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}