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
  // CORREÇÃO: Os nomes dos campos (busto, ombro, etc.) agora batem com os 'name' dos inputs do formulário.
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
    tags: formData.get('tags'),
    modelagem: formData.get('modelagem'),
    status: formData.get('status'),
    preco: safeParseFloat(formData.get('preco')),
    // Mapeamento de medidas para o JSON no banco de dados
    medidas: {
        busto: safeParseFloat(formData.get('busto')),
        ombro: safeParseFloat(formData.get('ombro')),
        cintura: safeParseFloat(formData.get('cintura')),
        quadril: safeParseFloat(formData.get('quadril')),
        comprimento: safeParseFloat(formData.get('comprimento')),
        manga: safeParseFloat(formData.get('manga')),
        gancho: safeParseFloat(formData.get('gancho')),
        comprimento_calca: safeParseFloat(formData.get('comprimento_calca'))
    }
  };

  // Limpa chaves de medidas que não foram preenchidas
  Object.keys(data.medidas).forEach(key => {
    if (data.medidas[key] === null) {
      delete data.medidas[key];
    }
  });
  if (Object.keys(data.medidas).length === 0) {
    delete data.medidas;
  }

  // Limpa chaves do objeto principal que são nulas ou vazias
  Object.keys(data).forEach(key => {
    if (data[key] === null || data[key] === undefined || data[key] === '') {
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
    // CORREÇÃO: 'fotoFrente' bate com o 'name' do input de arquivo.
    const imagem = formData.get('fotoFrente');

    if (!imagem || imagem.size === 0) {
      return { message: 'A imagem da peça é obrigatória.' };
    }

    const fileExtension = imagem.name.split('.').pop();
    const uniqueFileName = `${Date.now()}-${user.id.substring(0, 5)}.${fileExtension}`;
    imagePath = uniqueFileName;

    const { data: imageData, error: imageError } = await supabase.storage
      .from('fotos-pecas')
      .upload(imagePath, imagem);

    if (imageError) throw imageError;
    
    // Obter a URL pública da imagem
    const { data: { publicUrl } } = supabase.storage.from('fotos-pecas').getPublicUrl(imagePath);

    pecaData.foto_frente_url = publicUrl; // Armazena a URL pública
    pecaData.user_id = user.id;

    const { error: insertError } = await supabase.from('pecas').insert([pecaData]);
    if (insertError) throw insertError;

  } catch (error) {
    console.error('Erro em createPiece:', error);
    if (imagePath) {
      const supabase = await createClient();
      await supabase.storage.from('fotos-pecas').remove([imagePath]);
    }
    return { message: `Erro ao criar peça: ${error.message}` };
  }

  revalidatePath('/painel/catalogo');
  redirect('/painel/catalogo');
}

export async function updatePiece(previousState, formData) {
  const supabase = await createClient();
  const id = formData.get('id');
  if (!id) return { message: 'ID da peça não encontrado.' };

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { message: 'Usuário não autenticado.' };
    
    const dataToUpdate = parseAndConvertFormData(formData);

    const { error } = await supabase.from('pecas').update(dataToUpdate).eq('id', id);
    if (error) throw error;

  } catch (error) {
    console.error('Erro ao atualizar peça:', error);
    return { message: 'Falha ao atualizar a peça no banco de dados.' };
  }

  revalidatePath('/painel/catalogo');
  redirect('/painel/catalogo');
}