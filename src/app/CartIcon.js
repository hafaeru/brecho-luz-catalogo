// Arquivo: src/app/CartIcon.js

'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext'; // Caminho corrigido com @

export default function CartIcon() {
  const { cart } = useCart();
  return (
    <Link href="/carrinho" 
          className="fixed bottom-20 right-5 bg-amber-800 text-white p-4 rounded-full shadow-lg hover:bg-amber-900 transition-transform hover:scale-110 flex items-center z-50">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.344 1.087-.835l1.823-6.819A2.25 2.25 0 0018.217 6H5.318a2.25 2.25 0 00-2.141 2.591l2.046 7.653M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218m-11.218 0L5.318 6m12.372 0L17.69 4.5m-12.372 0L5.318 4.5m12.372 0l-1.409-2.25m-10.963 0L5.318 6m0 0a2.25 2.25 0 00-2.141 2.591l2.046 7.653M7.5 14.25" />
      </svg>
      {cart.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cart.length}
        </span>
      )}
    </Link>
  );
}