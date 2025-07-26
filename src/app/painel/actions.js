'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const supabase = createServerComponentClient({ cookies });

function parseFormData(formData) {
  const campos = [
    'nome', 'categoria', 'preco', 'tamanho', 'marca', 'cor', 'composicao',
    'estado', 'avarias', 'descricao', 'tags', 'modelagem', 'status',
    'medida_busto', 'medida_ombro', 'medida_cintura', 'medida_quadril', 'medida_comprimento',
    'foto_frente_url'
  ];

  const data = {};
  for (const campo of campos) {
    data[campo] = formData.get(campo);
  }

  return data;
}

// ✅ Agora recebe FormData e transforma em objeto para o Supabase
export async function createPiece(formData) {
  const pecaData = parseFormData(formData);

  try {
    const { error } = await supabase.from('pecas').insert([pecaData]);
    if (error) throw error;
  } catch (error) {
    console.error('Erro ao criar peça:', error);
    return { error: 'Falha ao criar a peça no banco de dados.' };
  }

  revalidatePath('/');
  revalidatePath('/painel/catalogo');
  redirect('/painel/catalogo');
}

export async function updatePiece(formData) {
  const id = formData.get('id');
  const dataToUpdate = parseFormData(formData);

  try {
    const { error } = await supabase.from('pecas').update(dataToUpdate).eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error('Erro ao atualizar peça:', error);
    return { error: 'Falha ao atualizar a peça no banco de dados.' };
  }

  revalidatePath('/');
  revalidatePath('/painel/catalogo');
  redirect('/painel/catalogo');
}

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
      const filePaths = peca.imagens.map((url) =>
        url.substring(url.lastIndexOf('/') + 1)
      );
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
