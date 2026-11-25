const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Falha de comunicação com o servidor. Verifique sua conexão.');
  }

  if (response.status === 401 && !endpoint.includes('/auth/login')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth:expired'));
    throw new Error('Sessão expirada ou inválida. Faça login novamente.');
  }

  if (response.status === 204) return null;

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.erro || 'Erro ao processar requisição.');
  }

  return data;
}
