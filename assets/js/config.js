const API_BASE_URL = 'https://sacco-api-pb2n.onrender.com';
const API_PREFIX = '/api/v1';

function apiUrl(path) {
  return `${API_BASE_URL}${API_PREFIX}${path}`;
}
