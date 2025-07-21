'use client';

import { useState, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function AddPieceForm() {
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

  // Estados separados para cada foto
  const [fotoFrente, setFotoFrente] = useState(null);
  const [fotoCostas, setFotoCostas] = useState(null);
  const [fotoEtiqueta, setFotoEtiqueta] = useState(null);
  const [fotoComposicao, setFotoComposicao] = useState(null);
  const [fotoDetalhe, setFotoDetalhe] = useState(null);
  const [fotoAvaria, setFotoAvaria] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const handleMedidaChange = (e) => {
    setMedidas({ ...medidas, [e.target.name]: e.target.value });
  };

  // Função auxiliar para upload de um arquivo
  const uploadFile = async (file) => {
    if (!file) return null;
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
    const fileName = `${Date.now()}-${cleanFileName}`;
    const { data, error } = await supabase.storage.from('fotos-pecas').upload(fileName, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('fotos-pecas').getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fotoFrente) {
      setMessage({ type: 'error', content: 'A foto da frente é obrigatória.' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      // 1. Upload de TODAS as fotos selecionadas
      const fotoUrls = await Promise.all([
        uploadFile(fotoFrente),
        uploadFile(fotoCostas),
        uploadFile(fotoEtiqueta),
        uploadFile(fotoComposicao),
        uploadFile(fotoDetalhe),
        uploadFile(fotoAvaria),
      ]);

      // 2. Salvar as Informações
      const { error: insertError } = await supabase.from('pecas').insert([
        { 
          nome, categoria, preco, tamanho, marca, cor,
          composicao_tecido: composicao,
          estado_conservacao: estado,
          avarias, descricao, tags,
          medidas,
          imagens: fotoUrls.filter(url => url !== null), // Salva apenas os links das fotos que foram enviadas
        },
      ]);

      if (insertError) throw insertError;

      setMessage({ type: 'success', content: 'Peça cadastrada com sucesso!' });
      e.target.reset(); // Limpa o formulário
      setMedidas({}); // Limpa as medidas

      router.refresh('/');

    } catch (error) {
      setMessage({ type: 'error', content: 'Ocorreu um erro: ' + error.message });
    } finally {
      setLoading(false);
    }
  };
  
  const MedidasFields = useMemo(() => {
    // ... (O código dos campos de medida permanece o mesmo da versão anterior)
    const camposPartesDeCima = (
      <>
        <input name="busto" onChange={handleMedidaChange} type="number" placeholder="Busto/Tórax (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        <input name="ombro" onChange={handleMedidaChange} type="number" placeholder="Ombro a ombro (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        <input name="manga" onChange={handleMedidaChange} type="number" placeholder="Comprimento da Manga (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        <input name="comprimento" onChange={handleMedidaChange} type="number" placeholder="Comprimento Total (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </>
    );
    const camposPartesDeBaixo = (
      <>
        <input name="cintura" onChange={handleMedidaChange} type="number" placeholder="Cintura (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        <input name="quadril" onChange={handleMedidaChange} type="number" placeholder="Quadril (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        <input name="gancho" onChange={handleMedidaChange} type="number" placeholder="Gancho/Cavalo (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        <input name="comprimento" onChange={handleMedidaChange} type="number" placeholder="Comprimento Total (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </>
    );

    switch(categoria) {
      case 'Blusas': case 'Camisas': case 'Tops': case 'Body': case 'Casacos e Jaquetas': case 'Tricot':
        return camposPartesDeCima;
      case 'Calças': case 'Shorts':
        return camposPartesDeBaixo;
      case 'Saias':
        return <>
            <input name="cintura" onChange={handleMedidaChange} type="number" placeholder="Cintura (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            <input name="quadril" onChange={handleMedidaChange} type="number" placeholder="Quadril (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            <input name="comprimento" onChange={handleMedidaChange} type="number" placeholder="Comprimento Total (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </>;
      case 'Vestidos': case 'Macacão / Macaquinho':
        return <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{camposPartesDeCima}{camposPartesDeBaixo}</div>;
      default:
        return null;
    }
  }, [categoria]);

  return (
    <form onSubmit={handleSubmit} className="mt-8 p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Adicionar Nova Peça</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome da Peça</label>
          <input type="text" id="nome" onChange={(e) => setNome(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoria</label>
          <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            <option value="">-- Selecione uma Categoria --</option>
            <option>Blusas</option><option>Camisas</option><option>Calças</option><option>Saias</option><option>Shorts</option><option>Vestidos</option><option>Macacão / Macaquinho</option><option>Conjuntos</option><option>Tops</option><option>Body</option><option>Casacos e Jaquetas</option><option>Tricot</option><option>Acessórios</option><option>Calçados</option>
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
            <input type="text" id="tamanho" onChange={(e) => setTamanho(e.target.value)} placeholder="Ex: P, 42, Único" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
            <label htmlFor="preco" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
            <input type="number" step="0.01" id="preco" onChange={(e) => setPreco(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca</label>
          <input type="text" id="marca" onChange={(e) => setMarca(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado de Conservação</label>
          <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            <option value="">-- Selecione o Estado --</option>
            <option>Como Novo</option>
            <option>Excelente</option>
            <option>Ótimo</option>
            <option>Bom com Detalhes</option>
          </select>
        </div>
        <div>
          <label htmlFor="cor" className="block text-sm font-medium text-gray-700">Cor</label>
          <input type="text" id="cor" onChange={(e) => setCor(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
      </div>

      <div>
        <label htmlFor="composicao" className="block text-sm font-medium text-gray-700">Composição do Tecido</label>
        <input type="text" id="composicao" onChange={(e) => setComposicao(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </div>
       <div>
        <label htmlFor="avarias" className="block text-sm font-medium text-gray-700">Avarias (se houver, senão digite 'Nenhuma')</label>
        <input type="text" id="avarias" onChange={(e) => setAvarias(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </div>
       <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição (história da peça, etc.)</label>
        <textarea id="descricao" onChange={(e) => setDescricao(e.target.value)} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
      </div>
       <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (separadas por vírgula)</label>
        <input type="text" id="tags" onChange={(e) => setTags(e.target.value)} placeholder="Ex: Novidade da Semana, Verão, Floral" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fotos da Peça</label>
        <div className="space-y-3 p-4 border rounded-md bg-gray-50">
          <div>
            <label htmlFor="fotoFrente" className="text-sm text-gray-600">Foto da Frente (obrigatória)</label>
            <input type="file" id="fotoFrente" onChange={(e) => setFotoFrente(e.target.files[0])} required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>
          <div>
            <label htmlFor="fotoCostas" className="text-sm text-gray-600">Foto das Costas</label>
            <input type="file" id="fotoCostas" onChange={(e) => setFotoCostas(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>
          <div>
            <label htmlFor="fotoEtiqueta" className="text-sm text-gray-600">Foto da Etiqueta (Marca/Tamanho)</label>
            <input type="file" id="fotoEtiqueta" onChange={(e) => setFotoEtiqueta(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>
          <div>
            <label htmlFor="fotoComposicao" className="text-sm text-gray-600">Foto da Etiqueta de Composição</label>
            <input type="file" id="fotoComposicao" onChange={(e) => setFotoComposicao(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>
          <div>
            <label htmlFor="fotoDetalhe" className="text-sm text-gray-600">Foto de um Detalhe Especial</label>
            <input type="file" id="fotoDetalhe" onChange={(e) => setFotoDetalhe(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>
           <div>
            <label htmlFor="fotoAvaria" className="text-sm text-gray-600">Foto da Avaria (se houver)</label>
            <input type="file" id="fotoAvaria" onChange={(e) => setFotoAvaria(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>
        </div>
      </div>
      
      {message.content && (
        <p className={`text-center text-sm ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{message.content}</p>
      )}
      <button type="submit" disabled={loading} className="w-full px-4 py-3 font-bold text-white bg-yellow-600 rounded-md hover:bg-yellow-700 transition-colors disabled:bg-gray-400">
        {loading ? 'Salvando...' : 'Salvar Peça'}
      </button>
    </form>
  );
}