const API_BASE_URL = window.API_BASE_URL || window.__API_BASE_URL__ || 'https://sacco-api-pb2n.onrender.com';
const API_PREFIX = '/api/v1';

function apiUrl(path) {
  return `${API_BASE_URL}${API_PREFIX}${path}`;
}

