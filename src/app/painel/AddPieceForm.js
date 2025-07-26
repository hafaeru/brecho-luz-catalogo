'use client';

import { useState, useMemo, useEffect } from 'react';
import { createPiece, updatePiece } from './actions.js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function AddPieceForm({ pecaInicial }) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [marca, setMarca] = useState('');
  const [cor, setCor] = useState('');
  const [composicao, setComposicao] = useState('');
  const [estado, setEstado] = useState('');
  const [avarias, setAvarias] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tags, setTags] = useState('');
  const [medidas, setMedidas] = useState({});
  const [modelagem, setModelagem] = useState('');
  const [status, setStatus] = useState('Disponível');
  
  // Estados para cada foto individual
  const [fotoFrente, setFotoFrente] = useState(null);
  const [fotoCostas, setFotoCostas] = useState(null);
  const [fotoEtiqueta, setFotoEtiqueta] = useState(null);
  const [fotoComposicao, setFotoComposicao] = useState(null);
  const [fotoDetalhe, setFotoDetalhe] = useState(null);
  const [fotoAvaria, setFotoAvaria] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Efeito para preencher o formulário no modo de edição
  useEffect(() => {
    if (pecaInicial) {
      setNome(pecaInicial.nome || '');
      setCategoria(pecaInicial.categoria || '');
      setPreco(pecaInicial.preco || '');
      setTamanho(pecaInicial.tamanho || '');
      setMarca(pecaInicial.marca || '');
      setCor(pecaInicial.cor || '');
      setComposicao(pecaInicial.composicao_tecido || '');
      setEstado(pecaInicial.estado_conservacao || '');
      setAvarias(pecaInicial.avarias || '');
      setDescricao(pecaInicial.descricao || '');
      setTags(pecaInicial.tags || '');
      setMedidas({
          busto: pecaInicial.medida_busto || '',
          ombro: pecaInicial.medida_ombro || '',
          manga: pecaInicial.medida_manga || '',
          cintura: pecaInicial.medida_cintura || '',
          quadril: pecaInicial.medida_quadril || '',
          gancho: pecaInicial.medida_gancho || '',
          comprimento: pecaInicial.medida_comprimento || '',
          comprimento_calca: pecaInicial.comprimento_calca || ''
      });
      setModelagem(pecaInicial.modelagem || '');
      setStatus(pecaInicial.status || 'Disponível');
    }
  }, [pecaInicial]);

  const handleMedidaChange = (e) => {
    setMedidas(prevMedidas => ({ ...prevMedidas, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pecaInicial && !fotoFrente) {
      setError('A foto da frente é obrigatória.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    try {
      let fotoUrls = pecaInicial ? pecaInicial.imagens || [] : [];

      if (!pecaInicial) {
        const fotosParaUpload = [
          fotoFrente, fotoCostas, fotoEtiqueta, fotoComposicao, fotoDetalhe, fotoAvaria
        ].filter(Boolean);

        const uploadPromises = fotosParaUpload.map(async (file) => {
          const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
          const fileName = `${Date.now()}-${cleanFileName}`;
          const { data, error: uploadError } = await supabase.storage.from('fotos-pecas').upload(fileName, file);
          if (uploadError) throw uploadError;
          const { data: urlData } = supabase.storage.from('fotos-pecas').getPublicUrl(data.path);
          return urlData.publicUrl;
        });
        fotoUrls = await Promise.all(uploadPromises);
      }
      
      const pecaData = {
        nome, categoria, preco, tamanho, marca, cor, modelagem,
        composicao_tecido: composicao, estado_conservacao: estado,
        avarias, descricao, tags, status,
        medida_busto: medidas.busto || null,
        medida_ombro: medidas.ombro || null,
        medida_manga: medidas.manga || null,
        medida_cintura: medidas.cintura || null,
        medida_quadril: medidas.quadril || null,
        medida_gancho: medidas.gancho || null,
        medida_comprimento: medidas.comprimento || medidas.comprimento_calca || null,
      };

      if (pecaInicial) {
        await updatePiece(pecaInicial.id, pecaData);
      } else {
        pecaData.imagens = fotoUrls;
        await createPiece(pecaData);
      }

      setMessage('Peça salva com sucesso!');
      
    } catch (err) {
      console.error('Erro no processo:', err);
      setError('Ocorreu um erro ao salvar a peça: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const MedidasFields = useMemo(() => {
    // ... (O código dos campos de medida permanece o mesmo)
  }, [categoria, medidas]);

  return (
    <form onSubmit={handleSubmit} className="mt-8 p-6 bg-white rounded-lg shadow-lg space-y-6">
      {pecaInicial && <input type="hidden" name="id" value={pecaInicial.id} />}
      
      <h2 className="text-2xl font-semibold text-gray-800">
        {pecaInicial ? `Editando Peça: ${pecaInicial.nome}` : 'Adicionar Nova Peça'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome da Peça</label>
          <input type="text" id="nome" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoria</label>
          <select id="categoria" name="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            <option value="">-- Selecione --</option>
            <option>Alfaiataria</option>
            <option>Blusas</option>
            <option>Calçados</option>
            <option>Camisas</option>
            <option>Casacos e Jaquetas</option>
            <option>Coletes</option>
            <option>Conjuntos</option>
            <option>Saias</option>
            <option>Shorts</option>
            <option>Tops</option>
            <option>Body</option>
            <option>Tricot</option>
            <option>Vestidos</option>
            <option>Macacão / Macaquinho</option>
            <option>Acessórios</option>
          </select>
        </div>
      </div>

      {MedidasFields && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Medidas Precisas (cm)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-1">
            {MedidasFields}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
            <label htmlFor="tamanho" className="block text-sm font-medium text-gray-700">Tamanho na Etiqueta</label>
            <input type="text" id="tamanho" name="tamanho" value={tamanho} onChange={(e) => setTamanho(e.target.value)} placeholder="Ex: P, 42, Único" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
            <label htmlFor="preco" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
            <input type="number" step="0.01" id="preco" name="preco" value={preco} onChange={(e) => setPreco(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca</label>
          <input type="text" id="marca" name="marca" value={marca} onChange={(e) => setMarca(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado de Conservação</label>
          <select id="estado" name="estado" value={estado} onChange={(e) => setEstado(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            <option value="">-- Selecione --</option>
            <option>Como Novo</option>
            <option>Excelente</option>
            <option>Ótimo</option>
            <option>Bom com Detalhes</option>
          </select>
        </div>
        <div>
          <label htmlFor="cor" className="block text-sm font-medium text-gray-700">Cor</label>
          <input type="text" id="cor" name="cor" value={cor} onChange={(e) => setCor(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
      </div>

      <div>
        <label htmlFor="modelagem" className="block text-sm font-medium text-gray-700">Modelagem e Detalhes</label>
        <textarea id="modelagem" name="modelagem" value={modelagem} onChange={(e) => setModelagem(e.target.value)} rows="4" 
                  placeholder="Ex: Corte reto com ombros estruturados&#10;Dois botões frontais&#10;Dois bolsos com tampa"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
      </div>

       <div>
        <label htmlFor="composicao" className="block text-sm font-medium text-gray-700">Composição do Tecido</label>
        <input type="text" id="composicao" name="composicao" value={composicao} onChange={(e) => setComposicao(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </div>
       <div>
        <label htmlFor="avarias" className="block text-sm font-medium text-gray-700">Avarias (se houver, senão 'Nenhuma')</label>
        <input type="text" id="avarias" name="avarias" value={avarias} onChange={(e) => setAvarias(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </div>
       <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea id="descricao" name="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
      </div>
       <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (separadas por vírgula)</label>
        <input type="text" id="tags" name="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Ex: Novidade, Verão, Floral" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </div>
      
      {pecaInicial && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status da Peça</label>
          <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            <option>Disponível</option>
            <option>Reservado</option>
            <option>Vendido</option>
          </select>
        </div>
      )}

      {!pecaInicial && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fotos da Peça</label>
          <div className="space-y-3 p-4 border rounded-md bg-gray-50">
            <div>
              <label htmlFor="fotoFrente" className="text-sm text-gray-600">Foto da Frente (obrigatória)</label>
              <input type="file" id="fotoFrente" name="fotoFrente" required onChange={(e) => setFotoFrente(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
            <div>
              <label htmlFor="fotoCostas" className="text-sm text-gray-600">Foto das Costas</label>
              <input type="file" id="fotoCostas" name="fotoCostas" onChange={(e) => setFotoCostas(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
            <div>
              <label htmlFor="fotoEtiqueta" className="text-sm text-gray-600">Foto da Etiqueta (Marca/Tamanho)</label>
              <input type="file" id="fotoEtiqueta" name="fotoEtiqueta" onChange={(e) => setFotoEtiqueta(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
            <div>
              <label htmlFor="fotoComposicao" className="text-sm text-gray-600">Foto da Etiqueta de Composição</label>
              <input type="file" id="fotoComposicao" name="fotoComposicao" onChange={(e) => setFotoComposicao(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
            <div>
              <label htmlFor="fotoDetalhe" className="text-sm text-gray-600">Foto de um Detalhe Especial</label>
              <input type="file" id="fotoDetalhe" name="fotoDetalhe" onChange={(e) => setFotoDetalhe(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
             <div>
              <label htmlFor="fotoAvaria" className="text-sm text-gray-600">Foto da Avaria (se houver)</label>
              <input type="file" id="fotoAvaria" name="fotoAvaria" onChange={(e) => setFotoAvaria(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
          </div>
        </div>
      )}
      
      {message && <p className="text-sm text-center text-green-600">{message}</p>}
      {error && <p className="text-sm text-center text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="w-full px-4 py-3 font-bold text-white bg-yellow-600 rounded-md hover:bg-yellow-700 transition-colors disabled:bg-gray-400">
        {loading ? 'Salvando...' : (pecaInicial ? 'Atualizar Peça' : 'Salvar Peça')}
      </button>
    </form>
  );
}