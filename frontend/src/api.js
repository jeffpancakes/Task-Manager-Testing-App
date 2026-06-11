import { toast } from 'react-toastify';

const API_URL = 'http://localhost:3000';

function getUserId() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return user?.id;
}

export async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const userId = getUserId();

  if (userId) {
    headers['x-user-id'] = userId;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    const message = data.message || 'Nastala chyba při komunikaci se serverem.';

    throw new Error(message);
  }

  return data;
}