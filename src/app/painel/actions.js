'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const supabase = createServerComponentClient({ cookies });

// Função auxiliar para sanitizar valores numéricos
const parseToFloatOrNull = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

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

// LÓGICA PARA ADICIONAR UMA NOVA PEÇA (COM SANITIZAÇÃO)
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
      preco: parseToFloatOrNull(formData.get('preco')),
      tamanho: formData.get('tamanho'),
      marca: formData.get('marca'),
      cor: formData.get('cor'),
      composicao_tecido: formData.get('composicao'),
      estado_conservacao: formData.get('estado'),
      avarias: formData.get('avarias'),
      descricao: formData.get('descricao'),
      tags: formData.get('tags'),
      status: 'Disponível',
      modelagem: formData.get('modelagem'),
      imagens: fotoUrls.filter(url => url !== null),
      medida_busto: parseToFloatOrNull(formData.get('busto')),
      medida_ombro: parseToFloatOrNull(formData.get('ombro')),
      medida_manga: parseToFloatOrNull(formData.get('manga')),
      medida_cintura: parseToFloatOrNull(formData.get('cintura')),
      medida_quadril: parseToFloatOrNull(formData.get('quadril')),
      medida_gancho: parseToFloatOrNull(formData.get('gancho')),
      medida_comprimento: parseToFloatOrNull(formData.get('comprimento')) || parseToFloatOrNull(formData.get('comprimento_calca')),
    };

    const { error } = await supabase.from('pecas').insert([pecaData]);
    if (error) throw error;

  } catch (error) {
    console.error('Erro ao criar peça:', error);
  }

  revalidatePath('/');
  revalidatePath('/painel/catalogo');
  redirect('/painel/catalogo');
}

// LÓGICA PARA ATUALIZAR UMA PEÇA EXISTENTE (COM SANITIZAÇÃO)
export async function updatePiece(formData) {
  const id = formData.get('id');

  const dataToUpdate = {
    nome: formData.get('nome'),
    categoria: formData.get('categoria'),
    preco: parseToFloatOrNull(formData.get('preco')),
    tamanho: formData.get('tamanho'),
    marca: formData.get('marca'),
    cor: formData.get('cor'),
    composicao_tecido: formData.get('composicao'),
    estado_conservacao: formData.get('estado'),
    avarias: formData.get('avarias'),
    descricao: formData.get('descricao'),
    tags: formData.get('tags'),
    status: formData.get('status'),
    modelagem: formData.get('modelagem'),
    medida_busto: parseToFloatOrNull(formData.get('busto')),
    medida_ombro: parseToFloatOrNull(formData.get('ombro')),
    medida_manga: parseToFloatOrNull(formData.get('manga')),
    medida_cintura: parseToFloatOrNull(formData.get('cintura')),
    medida_quadril: parseToFloatOrNull(formData.get('quadril')),
    medida_gancho: parseToFloatOrNull(formData.get('gancho')),
    medida_comprimento: parseToFloatOrNull(formData.get('comprimento')) || parseToFloatOrNull(formData.get('comprimento_calca')),
  };

  try {
    const { error } = await supabase.from('pecas').update(dataToUpdate).eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error('Erro ao atualizar peça:', error);
  }

  revalidatePath('/');
  revalidatePath('/painel/catalogo');
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
      if (filePaths.length > 0) {
        await supabase.storage.from('fotos-pecas').remove(filePaths);
      }
    }

    const { error: deleteError } = await supabase.from('pecas').delete().eq('id', id);
    if (deleteError) throw deleteError;
  } catch (error) {
    console.error('Erro ao deletar peça:', error);
  }

  revalidatePath('/');
  revalidatePath('/painel/catalogo');
  redirect('/painel/catalogo');
}

// LÓGICA PARA ATUALIZAR O STATUS
export async function updatePieceStatus(formData) {
  const id = formData.get('id');
  const newStatus = formData.get('status');

  try {
    const { error } = await supabase
      .from('pecas')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) throw error;

  } catch (error) {
    console.error('Erro ao atualizar status da peça:', error);
  }

  revalidatePath('/');
  revalidatePath('/painel/catalogo');
  redirect('/painel/catalogo');
}