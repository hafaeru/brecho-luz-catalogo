'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Helper para converter strings para float de forma segura.
function safeParseFloat(value) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return null;
  }
  const parsed = parseFloat(String(value).replace(',', '.'));
  return isNaN(parsed) ? null : parsed;
}

// Extrai e converte os dados do formulário para o formato do banco de dados.
function parseAndConvertFormData(formData) {
  const data = {
    nome: formData.get('nome'),
    categoria: formData.get('categoria'),
    tamanho: formData.get('tamanho'),
    marca: formData.get('marca'),
    cor: formData.get('cor'),
    composicao_tecido: formData.get('composicao'), // Nome da coluna no DB
    estado_conservacao: formData.get('estado'),   // Nome da coluna no DB
    avarias: formData.get('avarias'),
    descricao: formData.get('descricao'),
    tags: formData.get('tags'),
    modelagem: formData.get('modelagem'),
    status: formData.get('status'),
    preco: safeParseFloat(formData.get('preco')),
    medida_busto: safeParseFloat(formData.get('medida_busto')),
    medida_ombro: safeParseFloat(formData.get('medida_ombro')),
    medida_cintura: safeParseFloat(formData.get('medida_cintura')),
    medida_quadril: safeParseFloat(formData.get('medida_quadril')),
    medida_comprimento: safeParseFloat(formData.get('medida_comprimento')),
    medida_manga: safeParseFloat(formData.get('medida_manga')),
    medida_gancho: safeParseFloat(formData.get('medida_gancho')),
  };

  Object.keys(data).forEach(key => {
    if (data[key] === null || data[key] === undefined || data[key] === '') {
      delete data[key];
    }
  });

  return data;
}

// A action agora aceita (state, formData) para compatibilidade com o hook useFormState.
export async function createPiece(state, formData) {
  const supabase = await createClient();
  let imagePath = null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'Usuário não autenticado. Faça o login para continuar.' };
    }

    const pecaData = parseAndConvertFormData(formData);
    const imagem = formData.get('foto_frente');

    if (!imagem || imagem.size === 0) {
      return { error: 'A imagem da peça é obrigatória.' };
    }

    const fileExtension = imagem.name.split('.').pop();
    const uniqueFileName = `${Date.now()}-${user.id.substring(0, 5)}.${fileExtension}`;
    imagePath = uniqueFileName;

    const { data: imageData, error: imageError } = await supabase.storage
      .from('fotos-pecas')
      .upload(imagePath, imagem);

    if (imageError) throw imageError;

    pecaData.foto_frente_url = imageData.path;
    pecaData.user_id = user.id; // Adiciona o user_id para satisfazer a RLS policy

    const { error: insertError } = await supabase.from('pecas').insert([pecaData]);
    if (insertError) throw insertError;

  } catch (error) {
    console.error('Erro em createPiece:', error);
    if (imagePath) {
      const supabase = await createClient();
      await supabase.storage.from('fotos-pecas').remove([imagePath]);
    }
    return { error: error.message };
  }

  revalidatePath('/painel/catalogo');
  redirect('/painel/catalogo');
}

export async function updatePiece(state, formData) {
  const supabase = await createClient();
  const id = formData.get('id');
  if (!id) return { error: 'ID da peça não encontrado.' };

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Usuário não autenticado.' };
    
    const dataToUpdate = parseAndConvertFormData(formData);

    // Futuramente, adicionar lógica de atualização de imagem aqui.
    
    const { error } = await supabase.from('pecas').update(dataToUpdate).eq('id', id);
    if (error) throw error;

  } catch (error) {
    console.error('Erro ao atualizar peça:', error);
    return { error: 'Falha ao atualizar a peça no banco de dados.' };
  }

  revalidatePath('/painel/catalogo');
  redirect('/painel/catalogo');
}