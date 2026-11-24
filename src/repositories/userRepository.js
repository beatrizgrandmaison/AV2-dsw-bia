import { prisma } from '../prisma.js';

export const userRepository = {
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },

  create(data) {
    return prisma.user.create({
      data,
      select: { id: true, nome: true, email: true, createdAt: true },
    });
  },
};
