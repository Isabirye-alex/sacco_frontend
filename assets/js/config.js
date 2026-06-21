const API_BASE_URL = window.API_BASE_URL || window.__API_BASE_URL__ || 'http://127.0.0.1:8000';
const API_PREFIX = '/api/v1';

function apiUrl(path) {
  return `${API_BASE_URL}${API_PREFIX}${path}`;
}
