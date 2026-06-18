async function listShareProducts() {
  return request({
    url: apiUrl('/shares/products'),
    method: 'GET'
  });
}

async function listShareAccounts() {
  return request({
    url: apiUrl('/shares/accounts'),
    method: 'GET'
  });
}

async function purchaseShares(payload) {
  return request({
    url: apiUrl('/shares-extended/purchase'),
    method: 'POST',
    body: payload,
    auth: true
  });
}
