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
  // CORREÇÃO: Adicionado 'await' que foi omitido na versão anterior.
  const supabase = await createClient(); 
  
  // Array para rastrear imagens enviadas com sucesso e limpá-las em caso de erro
  const uploadedImagePaths = []; 

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { message: 'Usuário não autenticado.' };
    }

    const pecaData = parseAndConvertFormData(formData);
    
    // 1. Coleta todos os arquivos do formulário que não estão vazios
    const filesToUpload = [
      { name: 'fotoFrente', file: formData.get('fotoFrente') },
      { name: 'fotoCostas', file: formData.get('fotoCostas') },
      { name: 'fotoEtiqueta', file: formData.get('fotoEtiqueta') },
      { name: 'fotoComposicao', file: formData.get('fotoComposicao') },
      { name: 'fotoDetalhe', file: formData.get('fotoDetalhe') },
      { name: 'fotoAvaria', file: formData.get('fotoAvaria') },
    ].filter(entry => entry.file && entry.file.size > 0);

    if (filesToUpload.length === 0 || filesToUpload[0].name !== 'fotoFrente') {
      return { message: 'A imagem da frente é obrigatória.' };
    }

    // 2. Prepara e executa todos os uploads em paralelo para maior performance
    const uploadPromises = filesToUpload.map(({ name, file }) => {
      const fileExtension = file.name.split('.').pop();
      const filePath = `${user.id}/${name}-${Date.now()}.${fileExtension}`;
      
      return supabase.storage.from('fotos-pecas').upload(filePath, file)
        .then(result => {
          if (result.error) {
            throw new Error(`Falha no upload de ${name}: ${result.error.message}`);
          }
          uploadedImagePaths.push(result.data.path);
          return result.data.path;
        });
    });

    const successfullyUploadedPaths = await Promise.all(uploadPromises);

    // 3. Obter as URLs públicas para todos os caminhos de imagem
    const publicUrls = successfullyUploadedPaths.map(path => {
        const { data } = supabase.storage.from('fotos-pecas').getPublicUrl(path);
        if (!data || !data.publicUrl) {
            throw new Error(`Não foi possível obter a URL pública para a imagem: ${path}`);
        }
        return data.publicUrl;
    });

    // 4. Salvar o array de URLs no banco de dados
    pecaData.imagens = publicUrls;
    pecaData.user_id = user.id;

    const { error: insertError } = await supabase.from('pecas').insert(pecaData);

    if (insertError) {
      throw new Error(`Falha ao salvar dados da peça: ${insertError.message}`);
    }

  } catch (error) {
    console.error('Erro em createPiece:', error.message);
    
    if (uploadedImagePaths.length > 0) {
      console.log('Limpando imagens órfãs do storage:', uploadedImagePaths);
      await supabase.storage.from('fotos-pecas').remove(uploadedImagePaths);
    }
    
    return { message: error.message };
  }

  revalidatePath('/painel/catalogo');
  redirect('/painel/catalogo');
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