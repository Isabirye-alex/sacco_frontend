async function request({ url, method = 'GET', body = null, auth = false }) {
  const headers = {};

  if (body instanceof FormData) {
    delete headers['Content-Type'];
  } else if (body !== null && body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const requestBody = body == null
    ? undefined
    : body instanceof FormData
      ? body
      : JSON.stringify(body);

  console.info('[API]', method, url);
  if (requestBody) {
    console.info('[API] payload:', requestBody);
  }

  const response = await fetch(url, {
    method,
    headers,
    body: requestBody
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  console.info('[API] response:', response.status, response.statusText, url);
  if (data !== null && data !== undefined) {
    console.info('[API] data:', data);
  }

  if (!response.ok) {
    const message =
      (data && typeof data === 'object'
        ? data.detail || data.message || data.error || data.errors || 'Request failed'
        : data) || `Request failed with status ${response.status}`;
    console.error('[API] error:', message);
    throw new Error(message);
  }

  return data;
}
