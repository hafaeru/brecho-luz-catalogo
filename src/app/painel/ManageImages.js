'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Sub-componente para a miniatura com novas funcionalidades
function ImageThumbnail({ src, onRemove, onSetPrimary, isPrimary }) {
  return (
    <div className={`relative w-28 h-28 rounded-lg shadow-sm overflow-hidden ${isPrimary ? 'ring-4 ring-rose-500' : 'ring-1 ring-stone-300'}`}>
      <Image
        src={src}
        alt="Imagem da peça"
        fill
        sizes="120px"
        style={{ objectFit: 'cover' }}
      />
      {/* Botão de Remover */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs hover:bg-red-600 transition-colors"
        aria-label="Remover imagem"
      >
        &times;
      </button>
      {/* Botão para Definir como Capa (só aparece se não for a capa) */}
      {!isPrimary && (
        <button
          type="button"
          onClick={onSetPrimary}
          className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-1 text-center hover:bg-rose-600 transition-colors"
        >
          Capa
        </button>
      )}
    </div>
  );
}

// Componente principal com a nova lógica de reordenar
export default function ManageImages({ imagensIniciais, onImagensChange }) {
  const [imagens, setImagens] = useState(imagensIniciais || []);

  useEffect(() => {
    setImagens(imagensIniciais || []);
  }, [imagensIniciais]);

  // Função central que atualiza o estado local e notifica o formulário pai
  const handleUpdate = (newImageList) => {
    setImagens(newImageList);
    onImagensChange(newImageList);
  };

  const handleRemove = (index) => {
    const imagensAtualizadas = [...imagens];
    imagensAtualizadas.splice(index, 1);
    handleUpdate(imagensAtualizadas);
  };

  const handleSetPrimary = (index) => {
    if (index === 0) return; // Já é a capa
    const imagensAtualizadas = [...imagens];
    // Remove o item da sua posição atual e o coloca no início da lista
    const [itemToMove] = imagensAtualizadas.splice(index, 1);
    imagensAtualizadas.unshift(itemToMove);
    handleUpdate(imagensAtualizadas);
  };

  const handleAddImagens = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const imagensAtualizadas = [...imagens, ...files];
      handleUpdate(imagensAtualizadas);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-cyan-800 mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
        Gerenciar Fotos da Peça
      </label>
      <div className="p-4 border rounded-md bg-gray-50">
        <p className="text-xs text-stone-600 mb-4" style={{ fontFamily: 'var(--font-nunito)' }}>
          A primeira imagem (com a borda rosa) será a capa do produto. Clique em "Capa" para reordenar.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {imagens.map((img, index) => {
            // A chave precisa ser estável. Usaremos a URL ou o nome do arquivo.
            const key = typeof img === 'string' ? img : img.name;
            const src = typeof img === 'string' ? img : URL.createObjectURL(img);
            return (
              <ImageThumbnail 
                key={key}
                src={src} 
                isPrimary={index === 0}
                onRemove={() => handleRemove(index)} 
                onSetPrimary={() => handleSetPrimary(index)}
              />
            );
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