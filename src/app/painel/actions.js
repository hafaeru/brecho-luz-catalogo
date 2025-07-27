'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

function safeParseFloat(value) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return null;
  }
  const parsed = parseFloat(String(value).replace(',', '.'));
  return isNaN(parsed) ? null : parsed;
}

function parseAndConvertFormData(formData) {
  const tagsValue = formData.get('tags');
  // Garante que as tags sejam um array limpo ou null
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

    // Mapeamento para colunas individuais
    medida_busto: safeParseFloat(formData.get('busto')),
    medida_ombro: safeParseFloat(formData.get('ombro')),
    medida_manga: safeParseFloat(formData.get('manga')),
    medida_comprimento: safeParseFloat(formData.get('comprimento')),
    medida_cintura: safeParseFloat(formData.get('cintura')),
    medida_quadril: safeParseFloat(formData.get('quadril')),
    medida_gancho: safeParseFloat(formData.get('gancho')),
    medida_comprimento_calca: safeParseFloat(formData.get('comprimento_calca')),
  };

  // CORREÇÃO: Bloco com erro foi removido.
  // O bloco abaixo já limpa corretamente qualquer valor nulo ou indefinido,
  // incluindo as colunas de medida individuais.
  Object.keys(data).forEach(key => {
    if (data[key] === null || data[key] === undefined || data[key] === '' || (Array.isArray(data[key]) && data[key].length === 0)) {
      delete data[key];
    }
  });

  return data;
}

export async function createPiece(previousState, formData) {
  const supabase = await createClient();
  let imagePath = null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { message: 'Usuário não autenticado. Faça o login para continuar.' };
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
      .from('fotos-pecas') // Nome do seu bucket
      .upload(imagePath, imagemFrente);

    if (imageError) {
      console.error("Erro no Upload para o Storage:", imageError);
      throw new Error(`Falha no upload da imagem: ${imageError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from('fotos-pecas')
      .getPublicUrl(imagePath);

    // Usando sua coluna 'imagens' do tipo jsonb
    pecaData.imagens = { frente: urlData.publicUrl };
    pecaData.user_id = user.id;

    const { error: insertError } = await supabase.from('pecas').insert(pecaData);

    if (insertError) {
      console.error("Erro na Inserção no Banco:", insertError);
      throw new Error(`Falha ao salvar dados da peça: ${insertError.message}`);
    }

  } catch (error) {
    console.error('Erro em createPiece:', error.message);
    if (imagePath) {
      // Se a inserção no DB falhar, remove a imagem órfã do Storage
      const supabase = await createClient();
      await supabase.storage.from('fotos-pecas').remove([imagePath]);
    }
    return { message: error.message }; // Retorna a mensagem de erro para o formulário
  }

  revalidatePath('/painel/catalogo');
  redirect('/painel/catalogo');
}

export async function updatePiece(previousState, formData) {
  // A ser implementado
  return { message: 'Função de atualizar peça precisa ser ajustada.' };
}