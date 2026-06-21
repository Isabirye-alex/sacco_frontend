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
    method: 'GET',
    auth: true
  });
}

async function submitLoanRepayment(payload) {
  const loanId = payload?.loan_id;
  if (!loanId) {
    throw new Error('A loan id is required to submit repayment.');
  }

  return request({
    url: apiUrl(`/loans-extended/${loanId}/repay`),
    method: 'POST',
    body: payload,
    auth: true
  });
}
