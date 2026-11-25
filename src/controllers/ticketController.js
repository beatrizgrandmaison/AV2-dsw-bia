import { ticketService } from '../services/ticketService.js';

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    const err = new Error('ID do chamado inválido.');
    err.statusCode = 400;
    throw err;
  }
  return id;
}

export const ticketController = {
  async index(req, res, next) {
    try {
      const tickets = await ticketService.listByUser(req.user.id);
      return res.status(200).json(tickets);
    } catch (err) {
      return next(err);
    }
  },

  async show(req, res, next) {
    try {
      const ticket = await ticketService.getById(parseId(req.params.id), req.user.id);
      return res.status(200).json(ticket);
    } catch (err) {
      return next(err);
    }
  },

  async store(req, res, next) {
    try {
      const ticket = await ticketService.create(req.body, req.user.id);
      return res.status(201).json(ticket);
    } catch (err) {
      return next(err);
    }
  },

  async update(req, res, next) {
    try {
      const ticket = await ticketService.update(
        parseId(req.params.id),
        req.body,
        req.user.id
      );
      return res.status(200).json(ticket);
    } catch (err) {
      return next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      await ticketService.remove(parseId(req.params.id), req.user.id);
      return res.status(204).end();
    } catch (err) {
      return next(err);
    }
  },
};
