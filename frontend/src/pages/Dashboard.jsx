import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { Navbar } from '../components/Navbar';
import { TicketModal } from '../components/TicketModal';

const BADGE_PRIORIDADE = {
  BAIXA: 'bg-pink-50 text-pink-700 border border-pink-200/70',
  MEDIA: 'bg-amber-50 text-amber-800 border border-amber-200/70',
  ALTA: 'bg-rose-100 text-rose-800 border border-rose-300/70',
};

const BADGE_STATUS = {
  ABERTO: 'bg-fuchsia-100 text-fuchsia-800',
  EM_ANDAMENTO: 'bg-pink-200/70 text-pink-900',
  ENCERRADO: 'bg-emerald-100 text-emerald-800',
};

export function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/tickets');
      setTickets(data);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (selectedTicket) {
        await apiFetch(`/tickets/${selectedTicket.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setFeedback({ type: 'success', text: 'Chamado atualizado com sucesso.' });
      } else {
        await apiFetch('/tickets', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setFeedback({ type: 'success', text: 'Chamado criado com sucesso.' });
      }
      setModalOpen(false);
      setSelectedTicket(null);
      await loadTickets();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este chamado?')) return;
    try {
      await apiFetch(`/tickets/${id}`, { method: 'DELETE' });
      setFeedback({ type: 'success', text: 'Chamado excluído com sucesso.' });
      await loadTickets();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="max-w-6xl w-full mx-auto px-4 py-10 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-stone-900">Meus Chamados</h1>
            <p className="text-sm text-stone-500 mt-1">
              Acompanhe, atualize e registre soluções para seus atendimentos
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedTicket(null);
              setModalOpen(true);
            }}
            className="px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-semibold rounded-2xl shadow-md shadow-pink-200 transition cursor-pointer"
          >
            + Novo Chamado
          </button>
        </div>

        {feedback.text && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-sm flex justify-between items-center ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            <span>{feedback.text}</span>
            <button
              onClick={() => setFeedback({ type: '', text: '' })}
              className="text-xs font-semibold ml-4 underline cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-3xl border border-pink-100 p-14 text-center text-pink-600 font-medium shadow-xs">
            Carregando chamados...
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-3xl border border-pink-100 p-14 text-center shadow-xs">
            <p className="font-display text-xl font-semibold text-stone-800 mb-1">
              Nenhum chamado cadastrado
            </p>
            <p className="text-sm text-stone-500">
              Clique em <strong className="text-pink-600">+ Novo Chamado</strong> para registrar sua primeira solicitação.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-3xl border border-pink-100 p-6 flex flex-col justify-between shadow-sm shadow-pink-100/50 hover:shadow-md hover:shadow-pink-100 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-pink-500 bg-pink-50 px-2.5 py-1 rounded-lg">
                      #{ticket.id}
                    </span>
                    <div className="flex gap-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          BADGE_PRIORIDADE[ticket.prioridade]
                        }`}
                      >
                        {ticket.prioridade}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          BADGE_STATUS[ticket.status]
                        }`}
                      >
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-stone-900 mb-1.5">
                    {ticket.titulo}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">{ticket.descricao}</p>

                  {ticket.solucao && (
                    <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-pink-100 text-xs text-stone-700 mb-4">
                      <strong className="block text-pink-800 font-semibold mb-1">
                        Solução aplicada:
                      </strong>
                      {ticket.solucao}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-pink-50">
                  {ticket.status !== 'ENCERRADO' && (
                    <button
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setModalOpen(true);
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-xl transition cursor-pointer"
                    >
                      Editar / Encerrar
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <TicketModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedTicket(null);
        }}
        onSave={handleSave}
        ticket={selectedTicket}
        loading={saving}
      />
    </div>
  );
}
