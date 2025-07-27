'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// ... (as funções safeParseFloat e parseAndConvertFormData permanecem as mesmas)
function safeParseFloat(value) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return null;
  }
  const parsed = parseFloat(String(value).replace(',', '.'));
  return isNaN(parsed) ? null : parsed;
}

function normalizarImagens(imagens) {
  if (Array.isArray(imagens)) {
    return imagens; // Retorna o array se já estiver no formato correto.
  }
  if (typeof imagens === 'string') {
    return [imagens]; // Transforma uma única URL (string) em um array.
  }
  // Lida com o formato antigo de objeto, como { frente: 'url' }
  if (typeof imagens === 'object' && imagens !== null) {
    return Object.values(imagens).filter(url => typeof url === 'string');
  }
  return []; // Retorna um array vazio como fallback seguro.
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


// ... (a função createPiece permanece a mesma)
export async function createPiece(previousState, formData) {
  const supabase = await createClient();
  let imagePath = null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { message: 'Usuário não autenticado.' };
    }

    const pecaData = parseAndConvertFormData(formData);
    const imagemFrente = formData.get('fotoFrente');

    if (!imagemFrente || imagemFrente.size === 0) {
      return { message: 'A imagem da frente é obrigatória.' };
    }

    const fileExtension = imagemFrente.name.split('.').pop();
    const uniqueFileName = `frente-${Date.now()}.${fileExtension}`;
    imagePath = `${user.id}/${uniqueFileName}`;

    const { error: imageError } = await supabase.storage
      .from('fotos-pecas')
      .upload(imagePath, imagemFrente);

    if (imageError) {
        throw new Error(`Falha no upload da imagem: ${imageError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from('fotos-pecas')
      .getPublicUrl(imagePath);

    if (!urlData || !urlData.publicUrl) {
      throw new Error('Não foi possível obter a URL pública da imagem após o upload.');
    }

    // CORREÇÃO DEFINITIVA: Salvando a URL dentro de um array para manter a compatibilidade.
    pecaData.imagens = [urlData.publicUrl];
    pecaData.user_id = user.id;

    const { error: insertError } = await supabase.from('pecas').insert(pecaData);

    if (insertError) {
      // Se a inserção falhar, a imagem órfã será removida no bloco catch.
      throw new Error(`Falha ao salvar dados da peça: ${insertError.message}`);
    }

  } catch (error) {
    console.error('Erro em createPiece:', error.message);
    // Se qualquer passo no bloco try falhar, remove a imagem se ela já foi enviada.
    if (imagePath) {
      const supabase = await createClient();
      await supabase.storage.from('fotos-pecas').remove([imagePath]);
    }
    // Retorna a mensagem de erro para ser exibida no formulário.
    return { message: error.message };
  }

  // Se tudo der certo, invalida o cache e redireciona.
  revalidatePath('/painel');
  redirect('/painel');
}


// --- NOVA FUNÇÃO ---
export async function deletePiece(formData) {
  const supabase = await createClient();
  const id = formData.get('id');

  if (!id) return { message: 'ID da peça não fornecido.' };

  try {
    // 1. Obter os dados da peça para saber quais imagens deletar do Storage
    const { data: peca, error: fetchError } = await supabase
      .from('pecas')
      .select('imagens')
      .eq('id', id)
      .single();

    if (fetchError || !peca) {
      throw new Error("Peça não encontrada para exclusão.");
    }
    
    // 2. Deletar as imagens do Storage se elas existirem
    // CORREÇÃO: Lida com um array de URLs
    if (Array.isArray(peca.imagens) && peca.imagens.length > 0) {
      // Extrai os caminhos de todas as imagens no array
      const imagePaths = peca.imagens.map(url => url.split('/fotos-pecas/').pop()).filter(Boolean);
      
      if (imagePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('fotos-pecas')
          .remove(imagePaths);

        if (storageError) {
          // Apenas avisa sobre o erro, mas continua para deletar do banco
          console.warn(`Aviso: falha ao remover imagem(ns) do storage: ${storageError.message}`);
        }
      }
    }

    // 3. Deletar o registro da peça do banco de dados
    const { error: deleteError } = await supabase.from('pecas').delete().eq('id', id);
    if (deleteError) throw deleteError;

    // 4. Invalidar o cache para recarregar a lista
    revalidatePath('/painel');
    return { success: true };

  } catch (error) {
    console.error("Erro ao deletar peça:", error);
    return { message: `Erro: ${error.message}` };
  }
}

// --- NOVA FUNÇÃO ---
export async function updatePiece(previousState, formData) {
  const supabase = await createClient();
  const id = formData.get('id');

  if (!id) {
    return { message: 'ID da peça não foi encontrado no formulário.' };
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { message: 'Usuário não autenticado.' };
    }

    // Reutiliza a mesma função de parsing para obter os dados atualizados
    const dataToUpdate = parseAndConvertFormData(formData);
    
    // Nota: Esta versão atualiza os dados de texto/números.
    // A lógica para adicionar/remover/alterar fotos pode ser implementada aqui no futuro.

    const { error } = await supabase
      .from('pecas')
      .update(dataToUpdate)
      .eq('id', id)
      .eq('user_id', user.id); // Garante que o usuário só pode editar suas próprias peças

    if (error) {
      console.error("Erro ao atualizar a peça:", error);
      throw new Error(`Falha ao atualizar dados da peça: ${error.message}`);
    }

    // Invalida o cache das páginas relevantes para que a mudança seja refletida
    revalidatePath('/painel');
    revalidatePath(`/peca/${id}`);
    revalidatePath(`/painel/editar/${id}`);

  } catch (error) {
    return { message: error.message };
  }
  
  // Redireciona de volta para o catálogo após a edição bem-sucedida
  redirect('/painel');
}