async function listLoanProducts() {
  return request({
    url: apiUrl('/loans/products'),
    method: 'GET'
  });
}

async function createLoanApplication(payload) {
  return request({
    url: apiUrl('/loans-extended/applications'),
    method: 'POST',
    body: payload,
    auth: true
  });
}

async function getMemberLoans(memberId) {
  return request({
    url: apiUrl(`/loans-extended/member/${memberId}`),
    method: 'GET'
  });
}

async function submitLoanRepayment(payload) {
  return request({
    url: apiUrl('/loans-extended/repay'),
    method: 'POST',
    body: payload,
    auth: true
  });
}
