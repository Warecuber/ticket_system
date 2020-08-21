// IIFE to store variable for endpoint config
// returns the object to allow calling a reference to the endpoint instead of the name (just in case it changes)

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

// Functions for get, post, patch, and delete requests

let headers = {
  "Content-Type": "application/json",
  authtoken: localStorage.getItem("authtoken"),
};
async function getRequest(url) {
  let returnedData;

  try {
    returnedData = await $.ajax({
      async: true,
      method: "GET",
      url: url,
      contentType: "json",
      headers: headers,
    });
    return returnedData;
  } catch (err) {
    console.error(err);
  }
}

async function postRequest(url, formData) {
  let returnedData;
  let errorData;

  try {
    returnedData = await $.ajax({
      async: true,
      method: "POST",
      url: url,
      contentType: "json",
      headers: headers,
      data: JSON.stringify(formData),
    });
    return returnedData;
  } catch (err) {
    let errorData = err;
    return { status: err.status, error: err.responseText };
  }
}

async function deleteRequest(url, formData) {
  let returnedData;
  let errorData;

  try {
    returnedData = await $.ajax({
      async: true,
      method: "DELETE",
      url: url,
      contentType: "json",
      headers: headers,
      data: JSON.stringify(formData),
    });
    return returnedData;
  } catch (err) {
    let errorData = err;
    return { status: 401, error: errorData };
  }
}

async function patchRequest(url, formData) {
  let returnedData;

  try {
    returnedData = await $.ajax({
      async: true,
      method: "PATCH",
      url: url,
      contentType: "json",
      headers: headers,
      data: JSON.stringify(formData),
    });
    return returnedData;
  } catch (err) {
    return err;
  }
}

async function refreshToken() {
  console.log("refreshing");
  let returnedData;

  try {
    returnedData = await $.ajax({
      async: true,
      method: "POST",
      url: endpoint_config.auth.refresh,
      contentType: "json",
      headers: {
        "Content-Type": "application/json",
        refresh_token: localStorage.getItem("refresh_token"),
      },
    });
    return returnedData;
  } catch (err) {
    console.log(err);
    return err;
  }
}
