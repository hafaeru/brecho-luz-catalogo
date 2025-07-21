'use client'; 

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Usamos o cliente do lado do cliente
import Image from 'next/image';
import Link from 'next/link';

// Componente de carregamento para uma melhor experiência
function LoadingSpinner() {
  return <div className="text-center p-12">Carregando detalhes da peça...</div>;
}

export default function PecaDetalhe({ params }) {
  const [peca, setPeca] = useState(null);
  const [imagemAtiva, setImagemAtiva] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPeca() {
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
    
    if (params.id) {
        getPeca();
    }
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

  // Lógica para formatar a mensagem do WhatsApp
  const mensagemWhatsApp = encodeURIComponent(
    `Olá! Tenho interesse na peça "${peca.nome}" (ID: ${peca.id}) que vi no catálogo. Ainda está disponível?`
  );
  const linkWhatsApp = `https://wa.me/SEUNUMERODOTELEFONE?text=${mensagemWhatsApp}`; // IMPORTANTE: Troque SEUNUMERODOTELEFONE

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
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{peca.nome}</h1>
          {peca.marca && <p className="text-lg text-gray-500 mt-1">Marca: {peca.marca}</p>}
          
          <p className="text-4xl font-bold text-yellow-600 my-4">R$ {peca.preco}</p>
          
          <a href={linkWhatsApp} target="_blank" rel="noopener noreferrer" className="w-full text-center px-6 py-3 mb-6 font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors">
            Tenho Interesse! (WhatsApp)
          </a>

          {peca.descricao && <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap mb-6">{peca.descricao}</p>}

          <div className="border-t pt-4 space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Detalhes</h3>
              <ul className="space-y-2 text-gray-600">
                {peca.tamanho && <li><strong>Tamanho na Etiqueta:</strong> {peca.tamanho}</li>}
                {peca.cor && <li><strong>Cor:</strong> {peca.cor}</li>}
                {peca.composicao_tecido && <li><strong>Composição:</strong> {peca.composicao_tecido}</li>}
                {peca.estado_conservacao && <li><strong>Estado:</strong> {peca.estado_conservacao}</li>}
                {peca.avarias && <li className="text-red-600"><strong>Avarias:</strong> {peca.avarias}</li>}
              </ul>
            </div>
            
            <div className="border-t pt-4">
                <h3 className="text-xl font-semibold mb-2">Medidas</h3>
                <ul className="space-y-2 text-gray-600">
                    {peca.medida_busto && <li><strong>Busto/Tórax:</strong> {peca.medida_busto} cm</li>}
                    {peca.medida_ombro && <li><strong>Ombro a ombro:</strong> {peca.medida_ombro} cm</li>}
                    {peca.medida_manga && <li><strong>Comprimento da Manga:</strong> {peca.medida_manga} cm</li>}
                    {peca.medida_cintura && <li><strong>Cintura:</strong> {peca.medida_cintura} cm</li>}
                    {peca.medida_quadril && <li><strong>Quadril:</strong> {peca.medida_quadril} cm</li>}
                    {peca.medida_gancho && <li><strong>Gancho/Cavalo:</strong> {peca.medida_gancho} cm</li>}
                    {peca.medida_comprimento && <li><strong>Comprimento Total:</strong> {peca.medida_comprimento} cm</li>}
                </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}