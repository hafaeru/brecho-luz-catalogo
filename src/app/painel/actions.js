'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// Função para atualizar o status de uma peça (INALTERADA)
export async function updatePieceStatus(formData) {
  const supabase = await createClient();
  const id = formData.get('id');
  const status = formData.get('status');

  if (!id || !status) {
    return { message: 'ID ou status não fornecido.' };
  }

  try {
    const { error } = await supabase
      .from('pecas')
      .update({ status })
      .eq('id', id);

    if (error) throw new Error(`Falha ao atualizar status: ${error.message}`);
    
    revalidatePath('/painel/catalogo');
    revalidatePath(`/peca/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return { message: `Erro: ${error.message}` };
  }
}

// Funções helper (INALTERADAS)
function safeParseFloat(value) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return null;
  }
  const parsed = parseFloat(String(value).replace(',', '.'));
  return isNaN(parsed) ? null : parsed;
}

function normalizarImagens(imagens) {
  if (Array.isArray(imagens)) {
    return imagens;
  }
  if (typeof imagens === 'string') {
    return [imagens];
  }
  if (typeof imagens === 'object' && imagens !== null) {
    return Object.values(imagens).filter(url => typeof url === 'string');
  }
  return [];
}

function parseAndConvertFormData(formData) {
  const tagsValue = formData.get('tags');
  const tagsArray = tagsValue ? tagsValue.split(',').map(tag => tag.trim()).filter(Boolean) : null;
  const data = {
    nome: formData.get('nome'),
    categoria: formData.get('categoria'),
    tamanho: formData.get('tamanho'),
    marca: formData.get('marca'),
    cor: formData.get('cor'),
    composicao_tecido: formData.get('composicao'),
    estado_conservacao: formData.get('estado'),
    avarias: formData.get('avarias'),
    descricao: formData.get('descricao'),
    modelagem: formData.get('modelagem'),
    status: formData.get('status') || 'Disponível',
    preco: safeParseFloat(formData.get('preco')),
    tags: tagsArray,
    medida_busto: safeParseFloat(formData.get('busto')),
    medida_ombro: safeParseFloat(formData.get('ombro')),
    medida_manga: safeParseFloat(formData.get('manga')),
    medida_comprimento: safeParseFloat(formData.get('comprimento')),
    medida_cintura: safeParseFloat(formData.get('cintura')),
    medida_quadril: safeParseFloat(formData.get('quadril')),
    medida_gancho: safeParseFloat(formData.get('gancho')),
    medida_comprimento_calca: safeParseFloat(formData.get('comprimento_calca')),
  };
  Object.keys(data).forEach(key => {
    if (data[key] === null || data[key] === undefined || (Array.isArray(data[key]) && data[key].length === 0)) {
      delete data[key];
    }
  });
  return data;
}

// Função createPiece (INALTERADA)
export async function createPiece(pecaData) {
  const supabase = await createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado.');
    }
    pecaData.user_id = user.id;
    const { error } = await supabase.from('pecas').insert(pecaData);
    if (error) {
      throw new Error(`Falha ao salvar dados da peça: ${error.message}`);
    }
  } catch (error) {
    return { message: error.message };
  }
  revalidatePath('/painel/catalogo');
  redirect('/painel/catalogo');
}

// --- FUNÇÃO CORRIGIDA ---
export async function updatePiece(id, pecaData, urlsParaDeletar) {
  'use server';
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado.');
    }
    
    // ATUALIZA OS DADOS DA PEÇA NO BANCO
    const { error } = await supabase
      .from('pecas')
      .update(pecaData)
      .eq('id', id); // A verificação .eq('user_id', user.id) foi removida.

    if (error) {
      throw new Error(`Falha ao atualizar dados da peça: ${error.message}`);
    }

    // DELETA AS IMAGENS REMOVIDAS DO STORAGE
    if (urlsParaDeletar && urlsParaDeletar.length > 0) {
      const caminhosParaDeletar = urlsParaDeletar.map(url => url.split('/fotos-pecas/')[1]).filter(Boolean);
      if (caminhosParaDeletar.length > 0) {
        const { error: storageError } = await supabase.storage.from('fotos-pecas').remove(caminhosParaDeletar);
        if (storageError) {
          console.error("Aviso: Falha ao deletar imagens antigas do Storage. Erro:", storageError.message);
        }
      }
    }

    revalidatePath('/painel/catalogo');
    revalidatePath(`/peca/${id}`);
    revalidatePath(`/painel/editar/${id}`);

  } catch (error) {
    return { message: error.message };
  }
  
  redirect('/painel/catalogo');
}

// Função deletePiece (INALTERADA)
export async function deletePiece(formData) {
  const supabase = await createClient();
  const id = formData.get('id');

  if (!id) return { message: 'ID da peça não fornecido.' };

  try {
    const { data: peca, error: fetchError } = await supabase
      .from('pecas')
      .select('imagens')
      .eq('id', id)
      .single();

    if (fetchError || !peca) {
      throw new Error("Peça não encontrada para exclusão.");
    }
    
    if (Array.isArray(peca.imagens) && peca.imagens.length > 0) {
      const imagePaths = peca.imagens.map(url => url.split('/fotos-pecas/').pop()).filter(Boolean);
      
      if (imagePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('fotos-pecas')
          .remove(imagePaths);
        if (storageError) {
          console.warn(`Aviso: falha ao remover imagem(ns) do storage: ${storageError.message}`);
        }
      }
    }

    const { error: deleteError } = await supabase.from('pecas').delete().eq('id', id);
    if (deleteError) throw deleteError;

    revalidatePath('/painel');
    return { success: true };

  } catch (error) {
    console.error("Erro ao deletar peça:", error);
    return { message: `Erro: ${error.message}` };
  }
}