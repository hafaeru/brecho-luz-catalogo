'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import Magnifier from '@/components/Magnifier';
import {
  WhatsappShareButton,
  FacebookShareButton,
  TelegramShareButton, // Adicionado
  WhatsappIcon,
  FacebookIcon,
  TelegramIcon, // Adicionado
} from 'react-share';

// Adicione esta importação para o ícone de copiar e para o toast
import { FaLink } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

function ImageModal({ src, alt, onClose }) {
  const [show, setShow] = useState(false);

  // Efeito para controlar a animação de entrada/saída e a tecla 'Esc'
  useEffect(() => {
    // Ativa a animação de entrada
    setShow(true); 

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleClose = () => {
    setShow(false); // Ativa a animação de saída
    // Aguarda a animação terminar antes de chamar a função para desmontar o componente
    setTimeout(() => {
      onClose();
    }, 300); // Deve ser igual à duração da transição
  };

  if (!src) return null;

  return (
    // 1. FUNDO COM DESFOQUE E ANIMAÇÃO DE OPACIDADE
    <div 
      className={`fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      {/* 2. CONTAINER DA IMAGEM COM ANIMAÇÃO DE ESCALA */}
      <div 
        className={`relative max-w-4xl max-h-[90vh] w-full h-full transition-all duration-300 ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()} 
      >
        <Image src={src} alt={alt} fill style={{ objectFit: 'contain' }} className="rounded-lg" />
        
        {/* 3. BOTÃO DE FECHAR REPOSICIONADO */}
        <button 
          className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-white text-stone-800 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-2xl shadow-lg hover:bg-rose-500 hover:text-white transition-all hover:scale-110"
          onClick={handleClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default function PecaDetalheClient({ peca, pecasRelacionadas }) {
  const { addToCart } = useCart();
  const [imagemAtiva, setImagemAtiva] = useState(peca.imagens?.[0] || '/placeholder.jpg');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

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
<Link 
  href="/" 
  className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-semibold text-stone-600 bg-stone-100 rounded-full shadow-sm hover:bg-stone-200 transition-colors"
>
  <FaArrowLeft />
  Voltar ao Catálogo
</Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="col-span-1"> {/* Coluna da Galeria de Fotos */}
<div 
  className="relative w-full h-96 md:h-[500px] mb-4 cursor-pointer rounded-lg shadow-lg" 
  onClick={() => setIsModalOpen(true)}
>
  <Magnifier src={imagemAtiva} alt={peca.nome} />
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
<div className="flex flex-col gap-4">
  {/* Botões de Ação Principais */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <button onClick={() => addToCart(peca)} className="flex-grow text-center px-6 py-3 font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors">
      Adicionar ao Carrinho
    </button>
    <a href={linkWhatsApp} target="_blank" rel="noopener noreferrer" className="flex-grow text-center px-6 py-3 font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors">
      Comprar Agora
    </a>
  </div>

  {/* --- NOVO BOTÃO DE COMPARTILHAR E OPÇÕES --- */}
  <div className="pt-4 border-t border-stone-200">
    <button 
      onClick={() => setShowShareOptions(!showShareOptions)}
      className="w-full text-center px-6 py-3 font-bold text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors"
    >
      Compartilhar
    </button>

    {/* Ícones de compartilhamento que aparecem ao clicar */}
    {showShareOptions && (
      <div className="flex items-center justify-center gap-4 mt-4 p-4 bg-stone-100 rounded-lg">
        <WhatsappShareButton url={shareUrl} title={peca.nome} separator=" :: ">
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>
        <FacebookShareButton url={shareUrl} quote={`Confira esta peça incrível do Brechó Luz: ${peca.nome}`}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>
        <TelegramShareButton url={shareUrl} title={peca.nome}>
          <TelegramIcon size={40} round />
        </TelegramShareButton>
        {/* Botão para copiar o link (ideal para Instagram) */}
        <button 
          onClick={() => {
            navigator.clipboard.writeText(shareUrl);
            toast.success('Link copiado!');
          }}
          className="w-10 h-10 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 text-white rounded-full flex items-center justify-center"
          title="Copiar link (para Instagram)"
        >
          <FaLink />
        </button>
      </div>
    )}
  </div>
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
      {/* --- SEÇÃO DE PEÇAS RELACIONADAS --- */}


{/* --- SEÇÃO DE PEÇAS RELACIONADAS (DESIGN FINAL) --- */}
{pecasRelacionadas && pecasRelacionadas.length > 0 && (
  // Container principal com a mesma cor de fundo do Footer e borda superior sutil
<div className="bg-stone-100 border-t border-stone-200 mt-20 -mx-4 sm:-mx-8">
  <div className="container mx-auto px-4 sm:px-8 py-12">
      
      {/* Título redesenhado, mais compacto e elegante */}
      <h2 className="text-2xl font-bold text-amber-900 mb-6" style={{ fontFamily: 'var(--font-playfair-display)' }}>
        Você também pode gostar
      </h2>
      
      {/* Vitrine horizontal que economiza espaço vertical */}
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
        {pecasRelacionadas.map(pecaRelacionada => (
          // Cards com tamanho reduzido para uma seção mais compacta
          <div key={pecaRelacionada.id} className="flex-shrink-0 w-40 md:w-48">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <Link href={`/peca/${pecaRelacionada.id}`} className="block w-full aspect-[3/4] overflow-hidden relative">
                <Image
                  src={pecaRelacionada.imagens?.[0]}
                  alt={pecaRelacionada.nome}
                  fill
                  sizes="33vw"
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <div className="p-2 text-center">
                <Link href={`/peca/${pecaRelacionada.id}`} className="hover:underline">
                  <h3 className="font-semibold text-cyan-900 text-xs truncate" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {pecaRelacionada.nome}
                  </h3>
                </Link>
                <p className="text-rose-600 font-bold text-sm mt-1" style={{ fontFamily: 'var(--font-nunito)' }}>
                  R$ {pecaRelacionada.preco.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
         {/* Adiciona um item fantasma no final para dar um respiro no scroll */}
        <div className="flex-shrink-0 w-1"></div>
      </div>
    </div>
  </div>
)}
      {isModalOpen && (
        <ImageModal src={imagemAtiva} alt={peca.nome} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}