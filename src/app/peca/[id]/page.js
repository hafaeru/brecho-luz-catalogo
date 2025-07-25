'use client'; 

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CartIcon from '@/app/CartIcon';




function LoadingSpinner() {
  return <div className="text-center p-12">Carregando detalhes da peça...</div>;
}

export default function PecaDetalhe() {
   const { addToCart } = useCart();
  const params = useParams();
  const [peca, setPeca] = useState(null);
  const [imagemAtiva, setImagemAtiva] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPeca() {
      if (!params.id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('pecas')
        .select('*')
        .eq('id', params.id)
        .single();

      if (!error && data) {
        setPeca(data);
        if (data.imagens && data.imagens.length > 0) {
          setImagemAtiva(data.imagens[0]);
        }
      } else {
        console.error('Erro ao buscar peça:', error);
      }
      setLoading(false);
    }
    
    getPeca();
  }, [params.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!peca) {
    return (
      <div className="text-center p-8">
        <p>Peça não encontrada.</p>
        <Link href="/" className="text-yellow-600 hover:underline mt-4 inline-block">
          &larr; Voltar para o catálogo
        </Link>
      </div>
    );
  }

  const mensagemWhatsApp = encodeURIComponent(
    `Olá! Tenho interesse na peça "${peca.nome}" (ID: ${peca.id}) que vi no catálogo. Ainda está disponível?`
  );
  const linkWhatsApp = `https://chat.whatsapp.com/DRKWqlxvFDCFaun2aZCiiB?text=${mensagemWhatsApp}`; // IMPORTANTE: Troque pelo número de vocês

  const temMedidas = peca.medida_busto || peca.medida_ombro || peca.medida_manga || peca.medida_cintura || peca.medida_quadril || peca.medida_gancho || peca.medida_comprimento;

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Link href="/" className="text-yellow-600 hover:underline mb-6 inline-block">
        &larr; Voltar para o catálogo
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Coluna da Galeria de Fotos */}
        <div>
          <div className="relative w-full h-96 md:h-[500px] mb-4">
            <Image
              src={imagemAtiva || '/placeholder.jpg'}
              alt={peca.nome}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto p-2">
            {peca.imagens?.map((img, index) => (
              <div key={index} className="relative w-20 h-20 flex-shrink-0 cursor-pointer border-2 hover:border-yellow-500 rounded"
                   onClick={() => setImagemAtiva(img)}>
                <Image src={img} alt={`Thumbnail ${index + 1}`} fill style={{ objectFit: 'cover' }} className="rounded"/>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna das Informações */}
        <div className="flex flex-col space-y-6">
          <div>
            {/* CORRIGIDO: Cores e fontes aplicadas */}
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900" style={{ fontFamily: 'var(--font-lato)' }}>
              {peca.nome}
            </h1>
            {peca.marca && <p className="text-lg text-cyan-800 mt-1"style={{ fontFamily: 'var(--font-poppins)' }}>{peca.marca}</p>}
          </div>
          
          <p className="text-4xl font-bold text-orange-500" style={{ fontFamily: 'var(--font-space-grotesk)' }}>R$ {peca.preco}</p>
          


          {peca.descricao && <p className="text-stone-500 text-base  leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'var(--font-nunito)' }}>{peca.descricao}</p>}
          
          {peca.modelagem && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Modelagem e Detalhes</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{peca.modelagem}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => addToCart(peca)} 
              className="flex-grow text-center px-6 py-3 font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors"
            >
              Adicionar ao Carrinho
            </button>
            <a 
              href={linkWhatsApp} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-grow text-center px-6 py-3 font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            >
              Comprar Agora (WhatsApp)
            </a>
          </div>

          {/* NOVO CARD DE DETALHES COM SUAS CORES */}
          <div className="bg-stone-50 border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider"style={{ fontFamily: 'var(--font-poppins)' }}>Cor</h4>
                <p className="text-md text-cyan-900"style={{ fontFamily: 'var(--font-nunito)' }}>{peca.cor || '---'}</p>
              </div>
              <div className="col-span-1">
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider"style={{ fontFamily: 'var(--font-poppins)' }}>Tamanho</h4>
                <p className="text-md text-cyan-900"style={{ fontFamily: 'var(--font-nunito)' }}>{peca.tamanho || '---'}</p>
              </div>
              <div className="col-span-1">
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider"style={{ fontFamily: 'var(--font-poppins)' }}>Composição</h4>
                <p className="text-md text-cyan-900"style={{ fontFamily: 'var(--font-nunito)' }}>{peca.composicao_tecido || '---'}</p>
              </div>
              <div className="col-span-1">
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider"style={{ fontFamily: 'var(--font-poppins)' }}>Estado</h4>
                <p className="text-md text-cyan-900"style={{ fontFamily: 'var(--font-nunito)' }}>{peca.estado_conservacao || '---'}</p>
              </div>
            </div>
            {peca.avarias && (
              <div className="mt-4 pt-4 border-t border-rose-200">
                 <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider"style={{ fontFamily: 'var(--font-poppins)' }}>Avarias</h4>
                 <p className={`text-md ${peca.avarias.toLowerCase() === 'nenhuma' ? 'text-green-600' : 'text-red-500'}`}>{peca.avarias}</p>
              </div>
            )}
          </div>

          {/* NOVO CARD DE MEDIDAS */}
           {temMedidas && (
            <div className="bg-stone-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-center text-cyan-900">Medidas da Peça</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                    {peca.medida_busto && <div><h4 className="text-xs font-bold text-gray-500 uppercase">Busto</h4><p className="text-cyan-900">{peca.medida_busto} cm</p></div>}
                    {peca.medida_ombro && <div><h4 className="text-xs font-bold text-gray-500 uppercase">Ombro</h4><p className="text-cyan-900">{peca.medida_ombro} cm</p></div>}
                    {peca.medida_manga && <div><h4 className="text-xs font-bold text-gray-500 uppercase">Manga</h4><p className="text-cyan-900">{peca.medida_manga} cm</p></div>}
                    {peca.medida_cintura && <div><h4 className="text-xs font-bold text-gray-500 uppercase">Cintura</h4><p className="text-cyan-900">{peca.medida_cintura} cm</p></div>}
                    {peca.medida_quadril && <div><h4 className="text-xs font-bold text-gray-500 uppercase">Quadril</h4><p className="text-cyan-900">{peca.medida_quadril} cm</p></div>}
                    {peca.medida_gancho && <div><h4 className="text-xs font-bold text-gray-500 uppercase">Gancho</h4><p className="text-cyan-900">{peca.medida_gancho} cm</p></div>}
                    {peca.medida_comprimento && <div><h4 className="text-xs font-bold text-gray-500 uppercase">Comprimento</h4><p className="text-cyan-900">{peca.medida_comprimento} cm</p></div>}
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}