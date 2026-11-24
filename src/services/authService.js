import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository.js';

function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

export const authService = {
  async register({ nome, email, senha }) {
    if (!nome || nome.trim().length < 2) {
      throw createError('O nome deve ter pelo menos 2 caracteres.', 400);
    }
    if (!email || !email.includes('@')) {
      throw createError('Informe um e-mail válido.', 400);
    }
    if (!senha || senha.length < 6) {
      throw createError('A senha deve ter no mínimo 6 caracteres.', 400);
    }

    const existing = await userRepository.findByEmail(email.toLowerCase().trim());
    if (existing) {
      throw createError('Este e-mail já está cadastrado.', 409);
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    return userRepository.create({
      nome: nome.trim(),
      email: email.toLowerCase().trim(),
      senha: hashedPassword,
    });
  },

  async login({ email, senha }) {
    if (!email || !senha) {
      throw createError('E-mail e senha são obrigatórios.', 400);
    }

    const user = await userRepository.findByEmail(email.toLowerCase().trim());
    if (!user) {
      throw createError('Credenciais inválidas.', 401);
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      throw createError('Credenciais inválidas.', 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, nome: user.nome },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    return {
      token,
      user: { id: user.id, nome: user.nome, email: user.email },
    };
  },
};
