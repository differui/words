import http from 'http';

/* eslint-disable import/prefer-default-export */
export function get(url) {
  let data = '';

  return new Promise((resolve, reject) => {
    http.get(url, (response) => {
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => resolve(data.toString()));
    }).on('error', error => reject(error));
  });
}
