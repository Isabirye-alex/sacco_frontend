async function listSavingsProducts() {
  return request({
    url: apiUrl('/savings/products'),
    method: 'GET'
  });
}

async function listSavingsAccounts() {
  return request({
    url: apiUrl('/savings/accounts'),
    method: 'GET',
    auth: true
  });
}

async function depositSavings(payload) {
  return request({
    url: apiUrl('/savings/deposit'),
    method: 'POST',
    body: payload,
    auth: true
  });
}

async function withdrawSavings(payload) {
  return request({
    url: apiUrl('/savings/withdraw'),
    method: 'POST',
    body: payload,
    auth: true
  });
}
