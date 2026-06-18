function getStoredToken() {
  return localStorage.getItem('access_token');
}

function saveToken(token) {
  localStorage.setItem('access_token', token);
}

function clearToken() {
  localStorage.removeItem('access_token');
}
