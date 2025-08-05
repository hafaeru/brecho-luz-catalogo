'use client';

import { useState, useMemo, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { createPiece, updatePiece } from './actions.js';
import imageCompression from 'browser-image-compression';
import ManageImages from './ManageImages';
import Image from 'next/image';

// Seus componentes internos
function SubmitButton({ isEditing, loading }) {
    return (
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 font-bold text-white bg-rose-500 rounded-md hover:bg-rose-600 transition-colors disabled:bg-rose-300 disabled:cursor-not-allowed"
      >
        {loading ? 'Salvando...' : (isEditing ? 'Atualizar Peça' : 'Salvar Peça')}
      </button>
    );
}

function ImageInputWithPreview({ label, id, onFileChange, required = false }) {
    const [preview, setPreview] = useState(null);
  
    const handleFileChange = (e) => {
      const file = e.target.files?.[0] || null;
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
      onFileChange(file);
    };
  
    return (
      <div>
        <label htmlFor={id} className="text-sm text-gray-600">
          {label} {required && '(obrigatória)'}
        </label>
        <input
          type="file"
          id={id}
          name={id}
          accept="image/*"
          onChange={handleFileChange}
          required={required}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {preview && (
          <div className="mt-3 relative w-32 h-32 rounded-lg border border-gray-300 shadow-sm">
            <Image src={preview} alt={`Pré-visualização de ${label}`} fill style={{ objectFit: 'cover' }} className="rounded-lg" />
          </div>
        )}
      </div>
    );
}

// --- COMPONENTE PRINCIPAL ---
export default function AddPieceForm({ pecaInicial }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  
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
  const [fotoFrente, setFotoFrente] = useState(null);
  const [fotoCostas, setFotoCostas] = useState(null);
  const [fotoEtiqueta, setFotoEtiqueta] = useState(null);
  const [fotoComposicao, setFotoComposicao] = useState(null);
  const [fotoDetalhe, setFotoDetalhe] = useState(null);
  const [fotoAvaria, setFotoAvaria] = useState(null);
  const [listaImagensEdit, setListaImagensEdit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
      if (Array.isArray(pecaInicial.tags)) {
        setTags(pecaInicial.tags.join(', '));
      } else {
        setTags(pecaInicial.tags || '');
      }
      setMedidas({
          busto: pecaInicial.medida_busto || '',
          ombro: pecaInicial.medida_ombro || '',
          manga: pecaInicial.medida_manga || '',
          cintura: pecaInicial.medida_cintura || '',
          quadril: pecaInicial.medida_quadril || '',
          gancho: pecaInicial.medida_gancho || '',
          comprimento: pecaInicial.medida_comprimento || '',
      });
      setModelagem(pecaInicial.modelagem || '');
      setStatus(pecaInicial.status || 'Disponível');
      setListaImagensEdit(pecaInicial.imagens || []);
    }
  }, [pecaInicial]);

  const handleMedidaChange = (e) => {
    setMedidas(prevMedidas => ({ ...prevMedidas, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      let fotoUrlsFinais = [];
      let urlsParaDeletar = [];
      if (pecaInicial) {
        const urlsImagensIniciais = pecaInicial.imagens || [];
        const urlsMantidas = listaImagensEdit.filter(img => typeof img === 'string');
        const arquivosNovos = listaImagensEdit.filter(img => typeof img !== 'string');
        urlsParaDeletar = urlsImagensIniciais.filter(url => !urlsMantidas.includes(url));
        const uploadPromises = arquivosNovos.map(async (file) => {
          const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
          const compressedFile = await imageCompression(file, options);
          const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
          const fileName = `${Date.now()}-${cleanFileName}`;
          const { data, error: uploadError } = await supabase.storage.from('fotos-pecas').upload(fileName, compressedFile);
          if (uploadError) throw new Error(`Falha no upload: ${uploadError.message}`);
          const { data: urlData } = supabase.storage.from('fotos-pecas').getPublicUrl(data.path);
          return urlData.publicUrl;
        });
        const novasUrls = await Promise.all(uploadPromises);
        fotoUrlsFinais = [...urlsMantidas, ...novasUrls];
      } else {
        if (!fotoFrente) {
          setError('A foto da frente é obrigatória.');
          setLoading(false); return;
        }
        const fotosParaUpload = [fotoFrente, fotoCostas, fotoEtiqueta, fotoComposicao, fotoDetalhe, fotoAvaria].filter(Boolean);
        const uploadPromises = fotosParaUpload.map(async (file) => {
          const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
          const compressedFile = await imageCompression(file, options);
          const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
          const fileName = `${Date.now()}-${cleanFileName}`;
          const { data, error: uploadError } = await supabase.storage.from('fotos-pecas').upload(fileName, compressedFile);
          if (uploadError) throw new Error(`Falha no upload: ${uploadError.message}`);
          const { data: urlData } = supabase.storage.from('fotos-pecas').getPublicUrl(data.path);
          return urlData.publicUrl;
        });
        fotoUrlsFinais = await Promise.all(uploadPromises);
      }
      const pecaData = {
        nome, categoria, status,
        preco: parseFloat(String(preco).replace(',', '.')) || null,
        tamanho, marca, cor, modelagem,
        composicao_tecido: composicao, estado_conservacao: estado,
        avarias, descricao, 
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        medida_busto: parseFloat(medidas.busto) || null,
        medida_ombro: parseFloat(medidas.ombro) || null,
        medida_manga: parseFloat(medidas.manga) || null,
        medida_cintura: parseFloat(medidas.cintura) || null,
        medida_quadril: parseFloat(medidas.quadril) || null,
        medida_gancho: parseFloat(medidas.gancho) || null,
        medida_comprimento: parseFloat(medidas.comprimento) || null,
        imagens: fotoUrlsFinais 
      };
      if (pecaInicial) {
        await updatePiece(pecaInicial.id, pecaData, urlsParaDeletar);
      } else {
        await createPiece(pecaData);
      }
      setMessage('Peça salva com sucesso!');
      router.push('/painel/catalogo');
    } catch (err) {
      console.error('Erro no processo de salvamento:', err);
      setError(`Ocorreu um erro ao salvar a peça: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const MedidasFields = useMemo(() => {
    // ... (Sua lógica de MedidasFields permanece inalterada)
  }, [categoria, medidas]);

  return (
    <form onSubmit={handleSubmit} className="mt-8 p-6 bg-white rounded-lg shadow-lg space-y-6">
      {pecaInicial && <input type="hidden" name="id" value={pecaInicial.id} />}
      
      <h2 className="text-2xl font-bold text-amber-900" style={{ fontFamily: 'var(--font-lato)' }}>
        {pecaInicial ? `Editando Peça: ${pecaInicial.nome}` : 'Adicionar Nova Peça'}
      </h2>
      
      {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md"><p>{error}</p></div>}
      {message && <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md"><p>{message}</p></div>}
      
      {/* --- SEÇÃO DE CAMPOS DO FORMULÁRIO (COMPLETA) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Nome da Peça</label>
          <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Categoria</label>
          <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            <option value="">-- Selecione --</option>
            {/* Exemplo de como usar constantes - ajuste conforme seu arquivo `constants` */}
            {['Alfaiataria', 'Blusas', 'Calçados', 'Camisas', 'Casacos e Jaquetas', 'Coletes', 'Conjuntos', 'Saias', 'Shorts', 'Tops', 'Body', 'Tricot', 'Vestidos', 'Macacão / Macaquinho', 'Acessórios'].map(cat => <option key={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* Seção de Medidas (se aplicável) */}
      {MedidasFields && (
        <div>
          <label className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Medidas Precisas (cm)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-1">{MedidasFields}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="tamanho" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Tamanho na Etiqueta</label>
          <input type="text" id="tamanho" value={tamanho} onChange={(e) => setTamanho(e.target.value)} placeholder="Ex: P, 42, Único" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label htmlFor="preco" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Preço (R$)</label>
          <input type="number" step="0.01" id="preco" value={preco} onChange={(e) => setPreco(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label htmlFor="marca" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Marca</label>
          <input type="text" id="marca" value={marca} onChange={(e) => setMarca(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Estado de Conservação</label>
          <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            <option value="">-- Selecione --</option>
            {['Como Novo', 'Excelente', 'Ótimo', 'Bom com Detalhes'].map(est => <option key={est}>{est}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="cor" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Cor</label>
          <input type="text" id="cor" value={cor} onChange={(e) => setCor(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
      </div>

      <div>
        <label htmlFor="modelagem" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Modelagem e Detalhes</label>
        <textarea id="modelagem" value={modelagem} onChange={(e) => setModelagem(e.target.value)} rows="4" placeholder="Ex: Corte reto com ombros estruturados&#10;Dois botões frontais&#10;Dois bolsos com tampa" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
      </div>

      <div>
        <label htmlFor="composicao" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Composição do Tecido</label>
        <input type="text" id="composicao" value={composicao} onChange={(e) => setComposicao(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </div>
      <div>
        <label htmlFor="avarias" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Avarias (se houver, senão 'Nenhuma')</label>
        <input type="text" id="avarias" value={avarias} onChange={(e) => setAvarias(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </div>
      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Descrição</label>
        <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
      </div>
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Tags (separadas por vírgula)</label>
        <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Ex: Novidade, Verão, Floral" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </div>
      
      {pecaInicial && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Status da Peça</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            <option>Disponível</option>
            <option>Reservado</option>
            <option>Vendido</option>
          </select>
        </div>
      )}

      {/* --- SEÇÃO DE IMAGENS --- */}
      {/* Bloco de UPLOAD para PEÇAS NOVAS */}
      {!pecaInicial && (
        <div>
          <label className="block text-sm font-medium text-cyan-800 mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>Fotos da Peça</label>
          <div className="space-y-4 p-4 border rounded-md bg-gray-50">
            <ImageInputWithPreview label="Foto da Frente" id="fotoFrente" onFileChange={setFotoFrente} required />
            <ImageInputWithPreview label="Foto das Costas" id="fotoCostas" onFileChange={setFotoCostas} />
            <ImageInputWithPreview label="Foto da Etiqueta (Marca/Tamanho)" id="fotoEtiqueta" onFileChange={setFotoEtiqueta} />
            <ImageInputWithPreview label="Foto da Etiqueta de Composição" id="fotoComposicao" onFileChange={setFotoComposicao} />
            <ImageInputWithPreview label="Foto de um Detalhe Especial" id="fotoDetalhe" onFileChange={setFotoDetalhe} />
            <ImageInputWithPreview label="Foto da Avaria (se houver)" id="fotoAvaria" onFileChange={setFotoAvaria} />
          </div>
        </div>
      )}

      {/* Bloco de GERENCIAMENTO para PEÇAS EXISTENTES */}
      {pecaInicial && (
        <ManageImages
          imagensIniciais={pecaInicial.imagens}
          onImagensChange={setListaImagensEdit}
        />
      )}
      
      <SubmitButton isEditing={!!pecaInicial} loading={loading} />
    </form>
  );
}