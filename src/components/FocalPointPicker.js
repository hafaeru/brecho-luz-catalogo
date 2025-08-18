'use client';

import { useRef } from 'react';
import Image from 'next/image';

// Componente "controlado": não tem estado próprio, apenas exibe o que o pai manda.
export default function FocalPointPicker({ imageUrl, focalX, focalY, onFocalPointChange, onApply }) {
  const containerRef = useRef(null);

  const handleImageClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    
    // Apenas notifica o componente pai sobre a mudança.
    onFocalPointChange({ x, y });
  };

  if (!imageUrl) {
    return (
      <div className="text-center p-4 border rounded-md bg-gray-50 text-sm text-stone-500">
        Gerencie as imagens da peça para poder definir o ponto focal.
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-cyan-800 mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
        Ajustar Miniatura da Página Inicial
      </label>
      <div className="p-4 border rounded-md bg-gray-50">
        <p className="text-xs text-stone-600 mb-3 text-center" style={{ fontFamily: 'var(--font-nunito)' }}>
          Clique na imagem para definir o centro do recorte. Use o botão para ver a prévia.
        </p>
        
        <div
          ref={containerRef}
          onClick={handleImageClick}
          className="relative max-w-sm mx-auto rounded-lg overflow-hidden cursor-pointer"
        >
          <Image
            src={imageUrl}
            alt="Imagem original da peça"
            width={400}
            height={533}
            className="w-full h-auto block"
            priority
          />
          <div className="absolute top-0 left-0 pointer-events-none w-full h-full">
            <div
              className="absolute border-2 border-white/75 rounded-md"
              style={{
                width: '100%',
                aspectRatio: '3 / 4',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                top: `${focalY * 100}%`,
                left: `${focalX * 100}%`,
                transform: 'translate(-50%, -50%)',
                transition: 'top 0.2s ease, left 0.2s ease',
              }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onApply}
            className="px-6 py-2 bg-rose-500 text-white text-sm font-semibold rounded-md hover:bg-rose-600 transition-colors"
          >
            Pré-visualizar Recorte
          </button>
        </div>
      </div>
    </div>
  );
}