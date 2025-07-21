'use client';

import { useState, useMemo, useEffect } from 'react';
import { createPiece, updatePiece } from './actions.js';

export function AddPieceForm({ pecaInicial }) {
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
      setMedidas(pecaInicial.medidas || {});
    }
  }, [pecaInicial]);

  // Função para lidar com a mudança nos campos de medida
  const handleMedidaChange = (e) => {
    setMedidas(prevMedidas => ({ ...prevMedidas, [e.target.name]: e.target.value }));
  };
  
  // Lógica para renderizar campos de medida dinâmicos
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
          <input name="comprimento" value={medidas.comprimento || ''} onChange={handleMedidaChange} type="number" step="0.1" placeholder="Comprimento Total (cm)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        </>
      );
  
    switch(categoria) {
      case 'Blusas': case 'Camisas': case 'Tops': case 'Body': case 'Casacos e Jaquetas': case 'Tricot':
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
    <form action={pecaInicial ? updatePiece : createPiece} className="mt-8 p-6 bg-white rounded-lg shadow-lg space-y-6">
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
      
      {/* Seção de upload de fotos não será exibida no modo de edição por enquanto para simplificar a lógica de update */}
      {!pecaInicial && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fotos da Peça (pode selecionar várias)</label>
            <input type="file" name="fotos" required multiple className="mt-1 block w-full text-sm text-gray-500 ..."/>
          </div>
      )}
      
      <button type="submit" className="w-full px-4 py-3 font-bold text-white bg-yellow-600 rounded-md hover:bg-yellow-700 transition-colors">
        {pecaInicial ? 'Atualizar Peça' : 'Salvar Peça'}
      </button>
    </form>
  );
}