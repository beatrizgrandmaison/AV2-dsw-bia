import { useState, useEffect } from 'react';

export function TicketModal({ isOpen, onClose, onSave, ticket, loading }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState('MEDIA');
  const [status, setStatus] = useState('ABERTO');
  const [solucao, setSolucao] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setLocalError('');
    if (ticket) {
      setTitulo(ticket.titulo);
      setDescricao(ticket.descricao);
      setPrioridade(ticket.prioridade);
      setStatus(ticket.status);
      setSolucao(ticket.solucao || '');
    } else {
      setTitulo('');
      setDescricao('');
      setPrioridade('MEDIA');
      setStatus('ABERTO');
      setSolucao('');
    }
  }, [ticket, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      await onSave({
        titulo,
        descricao,
        prioridade,
        ...(ticket ? { status, solucao } : {}),
      });
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl shadow-pink-900/10 border border-pink-100 max-w-lg w-full p-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl font-bold text-stone-900">
            {ticket ? `Editar Chamado #${ticket.id}` : 'Novo Chamado Técnico'}
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {localError && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Título</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Erro ao acessar sistema financeiro"
              className="w-full rounded-xl border border-pink-200 bg-rose-50/20 px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Descrição</label>
            <textarea
              rows="3"
              required
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Detalhe o problema encontrado..."
              className="w-full rounded-xl border border-pink-200 bg-rose-50/20 px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Prioridade</label>
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
                className="w-full rounded-xl border border-pink-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              >
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>

            {ticket && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Situação</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-pink-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                >
                  <option value="ABERTO">Aberto</option>
                  <option value="EM_ANDAMENTO">Em andamento</option>
                  <option value="ENCERRADO">Encerrado</option>
                </select>
              </div>
            )}
          </div>

          {ticket && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Solução aplicada{' '}
                <span className="text-xs text-pink-600 font-normal">(obrigatória para encerrar)</span>
              </label>
              <textarea
                rows="3"
                value={solucao}
                onChange={(e) => setSolucao(e.target.value)}
                placeholder="Descreva a solução técnica realizada (mín. 10 caracteres)..."
                className="w-full rounded-xl border border-pink-200 bg-rose-50/20 px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              />
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-sm shadow-pink-200 disabled:opacity-50 rounded-xl transition cursor-pointer"
            >
              {loading ? 'Salvando...' : 'Salvar Chamado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
