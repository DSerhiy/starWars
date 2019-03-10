const AJAX = (() => {

  function getRequest(url, success, headers) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);

    if (headers) {
      for (const key in headers) {
        xhr.setRequestHeader(key, headers[key]);
      }
    }

    xhr.addEventListener('load', (e) => {
      const response = JSON.parse(e.target.responseText);
      success(response);
    });

    xhr.send();
  }

  function postRequest(url, body, headers) {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', url);

    if (headers) {
      for (const key in headers) {
        xhr.setRequestHeader(key, headers[key]);
      }
    }

    xhr.addEventListener('load', (e) => {
      console.log(e.responseText);
    });

    xhr.send(body);
  }

  return {
    get: getRequest,
    post: postRequest
    // put: putRequest,
    // delete: deleteRequest, 
    // patch: patchRequest
  }
})();