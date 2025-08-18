'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

function ImageModal({ src, alt, onClose }) {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!src) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
        <Image src={src} alt={alt} fill style={{ objectFit: 'contain' }} className="rounded-lg" />
      </div>
      <button className="absolute top-4 right-5 text-white text-4xl font-bold hover:text-stone-300 transition-colors" onClick={onClose}>
        &times;
      </button>
    </div>
  );
}

export default function PecaDetalheClient({ peca }) {
  const { addToCart } = useCart();
  const [imagemAtiva, setImagemAtiva] = useState(peca.imagens?.[0] || '/placeholder.jpg');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setImagemAtiva(peca.imagens?.[0] || '/placeholder.jpg');
  }, [peca]);

  const mensagemWhatsApp = encodeURIComponent(
    `Olá! Tenho interesse na peça "${peca.nome}" (ID: ${peca.id}) que vi no catálogo.`
  );
  const linkWhatsApp = `https://chat.whatsapp.com/DRKWqlxvFDCFaun2aZCiiB?text=${mensagemWhatsApp}`;
  const temMedidas = peca.medida_busto || peca.medida_ombro || peca.medida_manga || peca.medida_cintura || peca.medida_quadril || peca.medida_gancho || peca.medida_comprimento;

  return (
    <>
      <div className="container mx-auto p-4 sm:p-8">
        <Link href="/" className="text-amber-900 hover:underline mb-6 inline-block">
          &larr; Voltar para o catálogo
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="col-span-1"> {/* Coluna da Galeria de Fotos */}
              <div className="relative w-full h-96 md:h-[500px] mb-4 cursor-pointer" onClick={() => setIsModalOpen(true)}>
                <Image src={imagemAtiva} alt={peca.nome} fill style={{ objectFit: 'cover' }} className="rounded-lg shadow-lg" priority />
              </div>
              <div className="flex space-x-2 overflow-x-auto p-2">
                {peca.imagens?.map((img, index) => (
                  <div key={index} className={`relative w-20 h-20 flex-shrink-0 cursor-pointer border-2 rounded ${imagemAtiva === img ? 'border-rose-500' : 'border-transparent'}`} onClick={() => setImagemAtiva(img)}>
                    <Image src={img} alt={`Thumbnail ${index + 1}`} fill style={{ objectFit: 'cover' }} className="rounded"/>
                  </div>
                ))}
              </div>
            </div>
            
            {/* --- CÓDIGO RESTAURADO --- */}
            <div className="flex flex-col space-y-6 col-span-1"> {/* Coluna das Informações */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-amber-900" style={{ fontFamily: 'var(--font-lato)' }}>{peca.nome}</h1>
                {peca.marca && <p className="text-lg text-cyan-800 mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>{peca.marca}</p>}
              </div>
              <p className="text-4xl font-bold text-orange-500" style={{ fontFamily: 'var(--font-space-grotesk)' }}>R$ {peca.preco.toFixed(2)}</p>
              {peca.descricao && <p className="text-stone-500 text-base leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'var(--font-nunito)' }}>{peca.descricao}</p>}
              <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => addToCart(peca)} className="flex-grow text-center px-6 py-3 font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors">
                      Adicionar ao Carrinho
                  </button>
                  <a href={linkWhatsApp} target="_blank" rel="noopener noreferrer" className="flex-grow text-center px-6 py-3 font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors">
                      Comprar Agora (WhatsApp)
                  </a>
              </div>
              
              {/* Card de Detalhes */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>Cor</h4>
                          <p className="text-md text-cyan-900" style={{ fontFamily: 'var(--font-nunito)' }}>{peca.cor || '---'}</p>
                      </div>
                      <div>
                          <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>Tamanho</h4>
                          <p className="text-md text-cyan-900" style={{ fontFamily: 'var(--font-nunito)' }}>{peca.tamanho || '---'}</p>
                      </div>
                      <div>
                          <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>Composição</h4>
                          <p className="text-md text-cyan-900" style={{ fontFamily: 'var(--font-nunito)' }}>{peca.composicao_tecido || '---'}</p>
                      </div>
                      <div>
                          <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>Estado</h4>
                          <p className="text-md text-cyan-900" style={{ fontFamily: 'var(--font-nunito)' }}>{peca.estado_conservacao || '---'}</p>
                      </div>
                  </div>
                  {peca.avarias && (
                      <div className="mt-4 pt-4 border-t border-rose-200">
                          <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>Avarias</h4>
                          <p className={`text-md ${peca.avarias.toLowerCase() === 'nenhuma' ? 'text-green-600' : 'text-red-500'}`}>{peca.avarias}</p>
                      </div>
                  )}
              </div>

              {/* Card de Medidas */}
{/* Card de Medidas (NOVO DESIGN) */}
{temMedidas && (
    <div className="bg-cyan-50 border border-stone-200 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 text-center text-cyan-900" style={{ fontFamily: 'var(--font-lato)' }}>
            Medidas da Peça
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Medida Busto */}
            {peca.medida_busto && (
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>Busto</h4>
                    <p className="text-lg font-bold text-cyan-900 mt-1">{peca.medida_busto} cm</p>
                </div>
            )}
            {/* Medida Ombro */}
            {peca.medida_ombro && (
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>Ombro</h4>
                    <p className="text-lg font-bold text-cyan-900 mt-1">{peca.medida_ombro} cm</p>
                </div>
            )}
            {/* Medida Manga */}
            {peca.medida_manga && (
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>Manga</h4>
                    <p className="text-lg font-bold text-cyan-900 mt-1">{peca.medida_manga} cm</p>
                </div>
            )}
            {/* Medida Cintura */}
            {peca.medida_cintura && (
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>Cintura</h4>
                    <p className="text-lg font-bold text-cyan-900 mt-1">{peca.medida_cintura} cm</p>
                </div>
            )}
            {/* Medida Quadril */}
            {peca.medida_quadril && (
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>Quadril</h4>
                    <p className="text-lg font-bold text-cyan-900 mt-1">{peca.medida_quadril} cm</p>
                </div>
            )}
            {/* Medida Gancho */}
            {peca.medida_gancho && (
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>Gancho</h4>
                    <p className="text-lg font-bold text-cyan-900 mt-1">{peca.medida_gancho} cm</p>
                </div>
            )}
            {/* Medida Comprimento */}
            {peca.medida_comprimento && (
                <div className="bg-white rounded-lg p-3 text-center shadow-sm col-span-2 sm:col-span-1">
                    <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-poppins)' }}>Comprimento</h4>
                    <p className="text-lg font-bold text-cyan-900 mt-1">{peca.medida_comprimento} cm</p>
                </div>
            )}
        </div>
    </div>
)}
            </div>
        </div>
      </div>
      {isModalOpen && (
        <ImageModal src={imagemAtiva} alt={peca.nome} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}