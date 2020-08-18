let endpoint_config = (() => {
  let origin = window.location.origin;
  let base_config = {
    auth: `${origin}/user/auth`,
    tickets: `${origin}/tickets`,
  };
  endpoints = {
    auth: {
      login: `${base_config.auth}/login`,
      logout: `${base_config.auth}/logout`,
      refresh: `${base_config.auth}/refresh`,
      validate: `${base_config.auth}/validate`,
    },
    tickets: {
      view: `${base_config.tickets}/get`,
      create: `${base_config.tickets}/new`,
    },
    front_end_pages: {
      login: "/login.html",
      logout: "/logout.html",
      home: "/home.html",
    },
  };

  return endpoints;
})();

let ajax_config = (() => {
  let headers = {
    "Content-Type": "application/json",
    authtoken: localStorage.getItem("authtoken"),
  };

  function getRequest(url) {
    let returnedData;
    $.ajax({
      async: true,
      method: "GET",
      url: url,
      contentType: "json",
      headers: headers,
      success: (data) => {
        returnedData = data;
      },
      error: (err) => {
        returnedData = err;
      },
    });
    return returnedData;
  }

  function postRequest(url, formData) {
    let returnedData;
    $.ajax({
      async: true,
      method: "POST",
      url: url,
      contentType: "json",
      headers: headers,
      data: JSON.stringify(formData),
      success: (data) => {
        returnedData = data;
      },
      error: (err) => {
        returnedData = err;
      },
    });
    return returnedData;
  }

  function deleteRequest(url, formData) {
    let returnedData;
    $.ajax({
      async: true,
      method: "DELETE",
      url: url,
      contentType: "json",
      headers: headers,
      data: JSON.stringify(formData),
      success: (data) => {
        returnedData = data;
      },
      error: (err) => {
        returnedData = err;
      },
    });
    return returnedData;
  }

  function patchRequest(url, formData) {
    let returnedData;
    $.ajax({
      async: true,
      method: "PATCH",
      url: url,
      contentType: "json",
      headers: headers,
      data: JSON.stringify(formData),
      success: (data) => {
        returnedData = data;
      },
      error: (err) => {
        returnedData = err;
      },
    });
    return returnedData;
  }

  return {
    get: (url, formData) => {
      getRequest(url, formData);
    },
    post: (url, formData) => {
      postRequest(url, formData);
    },
    patch: (url, formData) => {
      patchRequest(url, formData);
    },
    delete: (url, formData) => {
      deleteRequest(url, formData);
    },
  };
})();
