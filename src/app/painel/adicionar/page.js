'use client';

import { useState, useMemo, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createPiece, updatePiece } from '../actions.js';

// Componente para o botão de submit que mostra o estado de "pending" (carregando)
function SubmitButton({ isEditing }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-3 font-bold text-white bg-rose-500 rounded-md hover:bg-rose-600 transition-colors disabled:bg-rose-300 disabled:cursor-not-allowed"
    >
      {pending ? 'Salvando...' : (isEditing ? 'Atualizar Peça' : 'Salvar Peça')}
    </button>
  );
}

export default function AddPieceForm({ pecaInicial }) {
  const initialState = { message: null };
  // Determina qual server action usar (criar ou atualizar) e a conecta ao hook useFormState
  const actionToUse = pecaInicial ? updatePiece : createPiece;
  const [state, formAction] = useFormState(actionToUse, initialState);

  // Seus estados para os campos controlados do formulário
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

  // Efeito para preencher o formulário com dados iniciais no modo de edição
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
      setMedidas(pecaInicial.medidas || {});
      setModelagem(pecaInicial.modelagem || '');
      setStatus(pecaInicial.status || 'Disponível');
    }
  }, [pecaInicial]);

  // Handler para campos de medida
  const handleMedidaChange = (e) => {
    setMedidas(prevMedidas => ({ ...prevMedidas, [e.target.name]: e.target.value }));
  };
  
  // Lógica para renderizar campos de medida dinâmicos (inalterada)
  const MedidasFields = useMemo(() => {
    const camposPartesDeCima = (
      <>
        <input name="busto" value={medidas.busto || ''} onChange={handleMedidaChange} type="number" step="0.1" placeholder="Busto/Tórax (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        <input name="ombro" value={medidas.ombro || ''} onChange={handleMedidaChange} type="number" step="0.1" placeholder="Ombro a ombro (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        <input name="manga" value={medidas.manga || ''} onChange={handleMedidaChange} type="number" step="0.1" placeholder="Comprimento da Manga (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        <input name="comprimento" value={medidas.comprimento || ''} onChange={handleMedidaChange} type="number" step="0.1" placeholder="Comprimento Total (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </>
    );
    const camposPartesDeBaixo = (
      <>
        <input name="cintura" value={medidas.cintura || ''} onChange={handleMedidaChange} type="number" step="0.1" placeholder="Cintura (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        <input name="quadril" value={medidas.quadril || ''} onChange={handleMedidaChange} type="number" step="0.1" placeholder="Quadril (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        <input name="gancho" value={medidas.gancho || ''} onChange={handleMedidaChange} type="number" step="0.1" placeholder="Gancho/Cavalo (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        <input name="comprimento_calca" value={medidas.comprimento_calca || ''} onChange={handleMedidaChange} type="number" step="0.1" placeholder="Comprimento Total (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </>
    );
  
    switch(categoria) {
      case 'Blusas': case 'Camisas': case 'Tops': case 'Body': case 'Casacos e Jaquetas': case 'Tricot': 
      case 'Alfaiataria': case 'Coletes':
        return camposPartesDeCima;
      case 'Calças': case 'Shorts':
        return camposPartesDeBaixo;
      case 'Saias':
        return <>
          <input name="cintura" value={medidas.cintura || ''} onChange={handleMedidaChange} type="number" step="0.1" placeholder="Cintura (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          <input name="quadril" value={medidas.quadril || ''} onChange={handleMedidaChange} type="number" step="0.1" placeholder="Quadril (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          <input name="comprimento" value={medidas.comprimento || ''} onChange={handleMedidaChange} type="number" step="0.1" placeholder="Comprimento Total (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </>;
      case 'Vestidos': case 'Macacão / Macaquinho':
        return <div className="contents">{camposPartesDeCima}{camposPartesDeBaixo}</div>;
      default:
        return null;
    }
  }, [categoria, medidas]);

  return (
    // O atributo `action` agora aponta para a `formAction` gerenciada pelo `useFormState`
    <form action={formAction} className="mt-8 p-6 bg-white rounded-lg shadow-lg space-y-6">
      {pecaInicial && <input type="hidden" name="id" value={pecaInicial.id} />}
      
      <h2 className="text-2xl font-bold text-amber-900" style={{ fontFamily: 'var(--font-lato)' }}>
        {pecaInicial ? `Editando Peça: ${pecaInicial.nome}` : 'Adicionar Nova Peça'}
      </h2>
      
      {/* Bloco para exibir mensagens de erro vindas do servidor */}
      {state?.message && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p>{state.message}</p>
        </div>
      )}
      
      {/* SEUS CAMPOS DO FORMULÁRIO (RESTAURADOS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Nome da Peça</label>
          <input type="text" id="nome" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Categoria</label>
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
          <label className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Medidas Precisas (cm)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-1">
            {MedidasFields}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
            <label htmlFor="tamanho" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Tamanho na Etiqueta</label>
            <input type="text" id="tamanho" name="tamanho" value={tamanho} onChange={(e) => setTamanho(e.target.value)} placeholder="Ex: P, 42, Único" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
            <label htmlFor="preco" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Preço (R$)</label>
            <input type="number" step="0.01" id="preco" name="preco" value={preco} onChange={(e) => setPreco(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label htmlFor="marca" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Marca</label>
          <input type="text" id="marca" name="marca" value={marca} onChange={(e) => setMarca(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Estado de Conservação</label>
          <select id="estado" name="estado" value={estado} onChange={(e) => setEstado(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            <option value="">-- Selecione --</option>
            <option>Como Novo</option>
            <option>Excelente</option>
            <option>Ótimo</option>
            <option>Bom com Detalhes</option>
          </select>
        </div>
        <div>
          <label htmlFor="cor" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Cor</label>
          <input type="text" id="cor" name="cor" value={cor} onChange={(e) => setCor(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
      </div>

      <div>
        <label htmlFor="modelagem" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Modelagem e Detalhes</label>
        <textarea id="modelagem" name="modelagem" value={modelagem} onChange={(e) => setModelagem(e.target.value)} rows="4" 
                  placeholder="Ex: Corte reto com ombros estruturados&#10;Dois botões frontais&#10;Dois bolsos com tampa"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
      </div>

      <div>
        <label htmlFor="composicao" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Composição do Tecido</label>
        <input type="text" id="composicao" name="composicao" value={composicao} onChange={(e) => setComposicao(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </div>
      <div>
        <label htmlFor="avarias" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Avarias (se houver, senão 'Nenhuma')</label>
        <input type="text" id="avarias" name="avarias" value={avarias} onChange={(e) => setAvarias(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </div>
      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Descrição</label>
        <textarea id="descricao" name="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
      </div>
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Tags (separadas por vírgula)</label>
        <input type="text" id="tags" name="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Ex: Novidade, Verão, Floral" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
      </div>
      
      {pecaInicial && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-cyan-800" style={{ fontFamily: 'var(--font-poppins)' }}>Status da Peça</label>
          <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            <option>Disponível</option>
            <option>Reservado</option>
            <option>Vendido</option>
          </select>
        </div>
      )}

      {!pecaInicial && (
        <div>
          <label className="block text-sm font-medium text-cyan-800 mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>Fotos da Peça</label>
          <div className="space-y-3 p-4 border rounded-md bg-gray-50">
            <div>
              <label htmlFor="fotoFrente" className="text-sm text-gray-600">Foto da Frente (obrigatória)</label>
              <input type="file" id="fotoFrente" name="fotoFrente" required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
            <div>
              <label htmlFor="fotoCostas" className="text-sm text-gray-600">Foto das Costas</label>
              <input type="file" id="fotoCostas" name="fotoCostas" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
            <div>
              <label htmlFor="fotoEtiqueta" className="text-sm text-gray-600">Foto da Etiqueta (Marca/Tamanho)</label>
              <input type="file" id="fotoEtiqueta" name="fotoEtiqueta" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
            <div>
              <label htmlFor="fotoComposicao" className="text-sm text-gray-600">Foto da Etiqueta de Composição</label>
              <input type="file" id="fotoComposicao" name="fotoComposicao" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
            <div>
              <label htmlFor="fotoDetalhe" className="text-sm text-gray-600">Foto de um Detalhe Especial</label>
              <input type="file" id="fotoDetalhe" name="fotoDetalhe" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
              <div>
              <label htmlFor="fotoAvaria" className="text-sm text-gray-600">Foto da Avaria (se houver)</label>
              <input type="file" id="fotoAvaria" name="fotoAvaria" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
          </div>
        </div>
      )}
      
      {/* O botão de submit agora é o componente que gerencia o estado de `pending` */}
      <SubmitButton isEditing={!!pecaInicial} />
    </form>
  );
}