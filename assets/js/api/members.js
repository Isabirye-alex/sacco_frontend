async function createMember(payload) {
  return request({
    url: apiUrl('/members/'),
    method: 'POST',
    body: payload
  });
}

async function createMemberWithUser(payload) {
  return request({
    url: apiUrl('/members/'),
    method: 'POST',
    body: payload
  });
}

async function getMemberProfile() {
  return request({
    url: apiUrl('/members/member/'),
    method: 'GET',
    auth: true
  });
}
