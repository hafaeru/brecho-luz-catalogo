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
    revalidatePath('/'); 

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

// ADICIONE ESTA NOVA FUNÇÃO NO FINAL DE `actions.js`

export async function getDashboardMetrics() {
  'use server';
  const supabase = await createClient();

  const { data: pecas, error } = await supabase
    .from('pecas')
    .select('status, preco');

  if (error) {
    console.error('Erro ao buscar métricas:', error);
    return null;
  }

  const pecasVendidas = pecas.filter(p => p.status === 'Vendido');
  const pecasDisponiveis = pecas.filter(p => p.status === 'Disponível');

  const faturamentoTotal = pecasVendidas.reduce((acc, p) => acc + p.preco, 0);
  const totalVendido = pecasVendidas.length;
  const ticketMedio = totalVendido > 0 ? faturamentoTotal / totalVendido : 0;

  return {
    faturamentoTotal,
    totalVendido,
    ticketMedio,
    pecasEmEstoque: pecasDisponiveis.length,
  };
}

// ADICIONE ESTA NOVA FUNÇÃO NO FINAL DE actions.js

export async function getSalesByCategory() {
  'use server';
  const supabase = await createClient();

  // Busca apenas as peças vendidas, selecionando preço e categoria
  const { data: pecasVendidas, error } = await supabase
    .from('pecas')
    .select('categoria, preco')
    .eq('status', 'Vendido');

  if (error) {
    console.error('Erro ao buscar vendas por categoria:', error);
    return [];
  }

  // Agrupa os dados: soma o faturamento de cada categoria
  const salesData = pecasVendidas.reduce((acc, peca) => {
    const categoria = peca.categoria || 'Sem Categoria';
    if (!acc[categoria]) {
      acc[categoria] = { name: categoria, faturamento: 0 };
    }
    acc[categoria].faturamento += peca.preco;
    return acc;
  }, {});

  // Converte o objeto em um array, que é o formato que o gráfico precisa
  return Object.values(salesData);
}

// ADICIONE ESTA NOVA FUNÇÃO NO FINAL DE actions.js

export async function getSalesAnalytics(groupBy) {
  'use server';
  const supabase = await createClient();

  // Valida o critério de agrupamento para segurança
  const validGroupByColumns = ['categoria', 'marca', 'cor', 'tamanho', 'estado_conservacao'];
  if (!validGroupByColumns.includes(groupBy)) {
    throw new Error('Critério de agrupamento inválido.');
  }

  // Busca as peças vendidas, selecionando apenas o preço e a coluna de agrupamento
  const { data: pecasVendidas, error } = await supabase
    .from('pecas')
    .select(`${groupBy}, preco`)
    .eq('status', 'Vendido')
    .not(groupBy, 'is', null); // Ignora peças onde o critério é nulo

  if (error) {
    console.error(`Erro ao buscar vendas por ${groupBy}:`, error);
    return [];
  }

  // Agrupa os dados dinamicamente com base no critério 'groupBy'
  const salesData = pecasVendidas.reduce((acc, peca) => {
    const key = peca[groupBy] || `Sem ${groupBy}`;
    if (!acc[key]) {
      acc[key] = { name: key, faturamento: 0, quantidade: 0 };
    }
    acc[key].faturamento += peca.preco;
    acc[key].quantidade += 1; // Bônus: agora também contamos a quantidade de peças
    return acc;
  }, {});

  // Converte o objeto em um array e ordena do maior para o menor faturamento
  return Object.values(salesData).sort((a, b) => b.faturamento - a.faturamento);
}



export async function getStagnantStock() {
  'use server';
  const supabase = await createClient();

  // Busca as 10 peças mais antigas que ainda estão disponíveis
  const { data: pecas, error } = await supabase
    .from('pecas')
    .select('*') // Seleciona todos os dados para podermos exibi-los na tabela
    .eq('status', 'Disponível')
    .order('created_at', { ascending: true }) // Ordena pelas mais antigas primeiro
    .limit(10); // Limita aos 10 primeiros resultados

  if (error) {
    console.error('Erro ao buscar estoque encalhado:', error);
    return [];
  }

  return pecas;
}
// ADICIONE ESTA NOVA FUNÇÃO NO FINAL DE actions.js

export async function getSalesOverTime() {
  'use server';
  const supabase = await createClient();

  // Busca apenas as peças vendidas, selecionando o preço e a data de criação
  const { data: pecasVendidas, error } = await supabase
    .from('pecas')
    .select('created_at, preco') // Assumindo que a venda ocorre próximo à criação. Para mais precisão, precisaríamos de uma coluna 'sold_at'.
    .eq('status', 'Vendido')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erro ao buscar vendas ao longo do tempo:', error);
    return [];
  }

  // Agrupa os dados por mês
  const salesByMonth = pecasVendidas.reduce((acc, peca) => {
    const month = new Date(peca.created_at).toLocaleString('default', { month: 'short', year: '2-digit' });
    if (!acc[month]) {
      acc[month] = { name: month, faturamento: 0 };
    }
    acc[month].faturamento += peca.preco;
    return acc;
  }, {});

  // Converte o objeto em um array
  return Object.values(salesByMonth);
}