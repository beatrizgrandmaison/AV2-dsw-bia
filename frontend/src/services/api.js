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

  const isAuthRequest = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');

  if (response.status === 401 && !isAuthRequest) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth:expired'));
    throw new Error('Sessão expirada ou inválida. Faça login novamente.');
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(data?.erro || data?.mensagem || 'Erro ao processar requisição.');
  }

  return data;
}
