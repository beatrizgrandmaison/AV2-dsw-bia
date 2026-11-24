import { authService } from '../services/authService.js';

export const authController = {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.', user });
    } catch (err) {
      return next(err);
    }
  },

  async login(req, res, next) {
    try {
      const data = await authService.login(req.body);
      return res.status(200).json(data);
    } catch (err) {
      return next(err);
    }
  },
};
