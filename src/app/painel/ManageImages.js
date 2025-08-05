// src/app/painel/ManageImages.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

function ImageThumbnail({ src, onRemove }) {
  return (
    <div className="relative w-32 h-32 rounded-lg border border-gray-300 shadow-sm">
      <Image
        src={src}
        alt="Imagem da peça"
        fill
        style={{ objectFit: 'cover' }}
        className="rounded-lg"
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm hover:bg-red-700 transition-transform hover:scale-110"
        aria-label="Remover imagem"
      >
        &times;
      </button>
    </div>
  );
}

export default function ManageImages({ imagensIniciais, onImagensChange }) {
  const [imagens, setImagens] = useState(imagensIniciais || []);

  useEffect(() => {
    // Garante que o componente se atualize se os dados iniciais mudarem.
    setImagens(imagensIniciais || []);
  }, [imagensIniciais]);

  const handleRemove = (index) => {
    const imagensAtualizadas = [...imagens];
    imagensAtualizadas.splice(index, 1);
    setImagens(imagensAtualizadas);
    onImagensChange(imagensAtualizadas);
  };

  const handleAddImagens = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const imagensAtualizadas = [...imagens, ...files];
      setImagens(imagensAtualizadas);
      onImagensChange(imagensAtualizadas);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-cyan-800 mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
        Gerenciar Fotos da Peça
      </label>
      <div className="p-4 border rounded-md bg-gray-50">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {imagens.map((img, index) => {
            const src = typeof img === 'string' ? img : URL.createObjectURL(img);
            return <ImageThumbnail key={index} src={src} onRemove={() => handleRemove(index)} />;
          })}
        </div>
        <div className="mt-6">
          <label htmlFor="add-images" className="text-sm text-gray-600">Adicionar novas fotos</label>
          <input
            type="file"
            id="add-images"
            name="add-images"
            multiple
            accept="image/*"
            onChange={handleAddImagens}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>
    </div>
  );
}