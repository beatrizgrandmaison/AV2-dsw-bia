import { ticketRepository } from '../repositories/ticketRepository.js';

const PRIORIDADES_VALIDAS = ['BAIXA', 'MEDIA', 'ALTA'];
const STATUS_VALIDOS = ['ABERTO', 'EM_ANDAMENTO', 'ENCERRADO'];

function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

export const ticketService = {
  async listByUser(userId) {
    return ticketRepository.findAllByUser(userId);
  },

  async getById(id, userId) {
    const ticket = await ticketRepository.findById(id);
    if (!ticket) {
      throw createError('Chamado não encontrado.', 404);
    }
    if (ticket.userId !== userId) {
      throw createError('Acesso negado: este chamado pertence a outro usuário.', 403);
    }
    return ticket;
  },

  async create({ titulo, descricao, prioridade = 'MEDIA' }, userId) {
    if (!titulo || titulo.trim().length < 3) {
      throw createError('O título deve ter pelo menos 3 caracteres.', 400);
    }
    if (!descricao || descricao.trim().length < 5) {
      throw createError('A descrição deve ter pelo menos 5 caracteres.', 400);
    }
    if (!PRIORIDADES_VALIDAS.includes(prioridade)) {
      throw createError('Prioridade inválida. Use BAIXA, MEDIA ou ALTA.', 400);
    }

    return ticketRepository.create({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      prioridade,
      status: 'ABERTO',
      userId,
    });
  },

  async update(id, { titulo, descricao, prioridade, status, solucao }, userId) {
    const ticket = await this.getById(id, userId);

    // Regra de Negócio 2: Impedir alteração em chamados já encerrados
    if (ticket.status === 'ENCERRADO') {
      throw createError(
        'Regra de negócio: chamados já encerrados não podem ser alterados.',
        422
      );
    }

    const novoStatus = status ?? ticket.status;
    const novaSolucao = solucao !== undefined ? solucao.trim() : ticket.solucao;

    if (!STATUS_VALIDOS.includes(novoStatus)) {
      throw createError('Status inválido. Use ABERTO, EM_ANDAMENTO ou ENCERRADO.', 400);
    }

    if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
      throw createError('Prioridade inválida. Use BAIXA, MEDIA ou ALTA.', 400);
    }

    // Regra de Negócio 1: Só permite encerrar se houver solução aplicada
    if (novoStatus === 'ENCERRADO' && (!novaSolucao || novaSolucao.length < 10)) {
      throw createError(
        'Regra de negócio: para encerrar o chamado, registre uma solução aplicada com pelo menos 10 caracteres.',
        422
      );
    }

    return ticketRepository.update(id, {
      titulo: titulo ? titulo.trim() : ticket.titulo,
      descricao: descricao ? descricao.trim() : ticket.descricao,
      prioridade: prioridade ?? ticket.prioridade,
      status: novoStatus,
      solucao: novaSolucao || null,
    });
  },

  async remove(id, userId) {
    await this.getById(id, userId);
    await ticketRepository.delete(id);
  },
};
