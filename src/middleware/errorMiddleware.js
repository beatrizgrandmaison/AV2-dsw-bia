export function errorMiddleware(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Erro interno no servidor.';

  if (status === 500) {
    console.error('[ERRO INTERNO]:', err);
  }

  return res.status(status).json({ erro: message });
}
