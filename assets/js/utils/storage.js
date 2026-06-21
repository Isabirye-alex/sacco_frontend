function getStoredToken() {
  return localStorage.getItem('access_token');
}

function saveToken(token) {
  localStorage.setItem('access_token', token);
}

function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user || {}));
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
}

function clearToken() {
  localStorage.removeItem('access_token');
}

function clearUserData() {
  localStorage.removeItem('user');
}
