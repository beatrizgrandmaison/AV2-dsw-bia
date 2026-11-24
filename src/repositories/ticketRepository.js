import { prisma } from '../prisma.js';

export const ticketRepository = {
  findAllByUser(userId) {
    return prisma.ticket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  findById(id) {
    return prisma.ticket.findUnique({ where: { id } });
  },

  create(data) {
    return prisma.ticket.create({ data });
  },

  update(id, data) {
    return prisma.ticket.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.ticket.delete({ where: { id } });
  },
};
