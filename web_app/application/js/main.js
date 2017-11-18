'use strict';

document.querySelector('#submit-btn').addEventListener('click', (e) => {
  const data = new FormData(document.querySelector('#doggo-image-form'));
  const XHR  = new XMLHttpRequest();

  XHR.open('POST', 'http://127.0.0.1:5000/api/labels', true);
  XHR.setRequestHeader('Access-Control-Allow-Credentials', true);
  XHR.onload = (e) => {
    if (XHR.readyState === 4) {
      const response = JSON.parse(XHR.responseText);

      console.log(response);
    }
  }

  console.log(data)

  XHR.send(data);
  e.preventDefault();
});