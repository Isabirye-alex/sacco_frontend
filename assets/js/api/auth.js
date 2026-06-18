async function loginUser(payload) {
  return request({
    url: apiUrl('/auth/signin'),
    method: 'POST',
    body: payload
  });
}

async function logoutUser() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
}
