import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, sessionMessage } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
      });
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-rose-50 via-pink-50/70 to-white">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-pink-100/80 border border-pink-100 p-8 sm:p-10">
        <div className="mb-6">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-pink-600 bg-pink-50 px-3 py-1 rounded-full mb-3">
            Bem-vinda de volta
          </span>
          <h1 className="font-display text-3xl font-bold text-stone-900 mb-1">
            Entrar no HelpDesk
          </h1>
          <p className="text-sm text-stone-500">
            Acompanhe e organize seus chamados técnicos
          </p>
        </div>

        {(erro || sessionMessage) && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
            {erro || sessionMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">E-mail</label>
            <input
              type="email"
              required
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-pink-200 bg-rose-50/20 px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Senha</label>
            <input
              type="password"
              required
              placeholder="••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-xl border border-pink-200 bg-rose-50/20 px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-sm rounded-xl shadow-md shadow-pink-200 transition disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          Ainda não tem conta?{' '}
          <Link to="/register" className="text-pink-600 font-semibold hover:text-pink-700 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
