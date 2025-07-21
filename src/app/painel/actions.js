'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const supabase = createServerComponentClient({ cookies });

// Função auxiliar para upload de um arquivo
async function uploadFile(file) {
  if (!file || file.size === 0) return null;
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
  const fileName = `${Date.now()}-${cleanFileName}`;
  const { data, error } = await supabase.storage.from('fotos-pecas').upload(fileName, file);
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('fotos-pecas').getPublicUrl(data.path);
  return urlData.publicUrl;
}

// LÓGICA PARA ADICIONAR UMA NOVA PEÇA
export async function createPiece(formData) {
  try {
    const fotos = [
      formData.get('fotoFrente'),
      formData.get('fotoCostas'),
      formData.get('fotoEtiqueta'),
      formData.get('fotoComposicao'),
      formData.get('fotoDetalhe'),
      formData.get('fotoAvaria'),
    ];

    const fotoUrls = await Promise.all(fotos.map(file => uploadFile(file)));

    const pecaData = {
      nome: formData.get('nome'),
      categoria: formData.get('categoria'),
      preco: formData.get('preco'),
      tamanho: formData.get('tamanho'),
      marca: formData.get('marca'),
      cor: formData.get('cor'),
      composicao_tecido: formData.get('composicao'),
      estado_conservacao: formData.get('estado'),
      avarias: formData.get('avarias'),
      descricao: formData.get('descricao'),
      tags: formData.get('tags'),
      imagens: fotoUrls.filter(url => url !== null),
      // ✅ Medidas com nomes corrigidos
      medida_busto: formData.get('medida_busto') || null,
      medida_ombro: formData.get('medida_ombro') || null,
      medida_manga: formData.get('medida_manga') || null,
      medida_cintura: formData.get('medida_cintura') || null,
      medida_quadril: formData.get('medida_quadril') || null,
      medida_gancho: formData.get('medida_gancho') || null,
      medida_comprimento: formData.get('medida_comprimento') || null,
    };

    const { error } = await supabase.from('pecas').insert([pecaData]);
    if (error) throw error;
  } catch (error) {
    console.error('Erro ao criar peça:', error);
  }

  redirect('/painel/catalogo');
}

// LÓGICA PARA ATUALIZAR UMA PEÇA EXISTENTE
export async function updatePiece(formData) {
  console.log("--- DEBUG: FormData Recebido no Servidor ---");
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  console.log("-----------------------------------------");

  const id = formData.get('id');

  const dataToUpdate = {
    nome: formData.get('nome'),
    categoria: formData.get('categoria'),
    preco: formData.get('preco'),
    tamanho: formData.get('tamanho'),
    marca: formData.get('marca'),
    cor: formData.get('cor'),
    composicao_tecido: formData.get('composicao'),
    estado_conservacao: formData.get('estado'),
    avarias: formData.get('avarias'),
    descricao: formData.get('descricao'),
    tags: formData.get('tags'),
    // ✅ Medidas com nomes corrigidos
    medida_busto: formData.get('medida_busto') || null,
    medida_ombro: formData.get('medida_ombro') || null,
    medida_manga: formData.get('medida_manga') || null,
    medida_cintura: formData.get('medida_cintura') || null,
    medida_quadril: formData.get('medida_quadril') || null,
    medida_gancho: formData.get('medida_gancho') || null,
    medida_comprimento: formData.get('medida_comprimento') || null,
  };

  try {
    const { error } = await supabase.from('pecas').update(dataToUpdate).eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error('Erro ao atualizar peça:', error);
  }

  redirect('/painel/catalogo');
}

// LÓGICA PARA DELETAR UMA PEÇA
export async function deletePiece(formData) {
  const id = formData.get('id');
  try {
    const { data: peca, error: fetchError } = await supabase
      .from('pecas')
      .select('imagens')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    if (peca.imagens && peca.imagens.length > 0) {
      const filePaths = peca.imagens.map(url => url.substring(url.lastIndexOf('/') + 1));
      await supabase.storage.from('fotos-pecas').remove(filePaths);
    }

    const { error: deleteError } = await supabase.from('pecas').delete().eq('id', id);
    if (deleteError) throw deleteError;
  } catch (error) {
    console.error('Erro ao deletar peça:', error);
  }

  redirect('/painel/catalogo');
}
