import fetch from 'isomorphic-fetch';

export default async function({ url, body, method = 'GET' }) {
  const csrfToken =
    // eslint-disable-next-line dot-notation
    (window && window['__INITIAL_STATE__'] && window['__INITIAL_STATE__'].csrf) || '';

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'csrf-token': csrfToken,
  };

  const payload = {
    method,
    credentials: 'same-origin',
    redirect: 'manual',
    headers,
  };

  if (method === 'POST') {
    payload.body = JSON.stringify(body);
  }

  return fetch(url, payload);
}

export async function tempfetch(url, opts = {}) {
  const csrfToken =
    // eslint-disable-next-line dot-notation
    (window && window['__INITIAL_STATE__'] && window['__INITIAL_STATE__'].csrf) || '';

  const response = await fetch(url, {
    credentials: 'same-origin',
    redirect: 'manual',
    ...opts,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'csrf-token': csrfToken,
      ...opts.headers,
    },
  });

  if (response.ok) {
    const data = await response.json();

    return data;
  }

  if (response.status === 401) {
    window.loaction = response.headers.get('Location');

    return null;
  }

  return null;
}
