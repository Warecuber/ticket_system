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
      view_by_status: `${base_config.tickets}/get/query`,
      create: `${base_config.tickets}/new`,
    },
    user: {},
    front_end_pages: {
      login: "/login",
      logout: "/logout",
      home: "/home",
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
      headers: headers,
    });
    return returnedData;
  } catch (err) {
    return { status: err.status, error: err.responseText };
  }
}

async function queryRequest(url, query) {
  let returnedData;
  try {
    returnedData = await $.ajax({
      async: true,
      method: "GET",
      url: `${url}?queryName=${query.queryName}&${query.queryName}=${query.queryParam}`,
      headers: headers,
    });
    return returnedData;
  } catch (err) {
    return { status: err.status, error: err.responseText };
  }
}

async function postRequest(url, formData) {
  let returnedData;

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
    return { status: err.status, error: err.responseText };
  }
}

async function deleteRequest(url, formData) {
  let returnedData;

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
    return { status: err.status, error: err.responseText };
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
    return { status: err.status, error: err.responseText };
  }
}

async function refreshToken() {
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
    localStorage.setItem("authtoken", returnedData.accessToken);
    return returnedData;
  } catch (err) {
    if (err.status === 401) {
      localStorage.removeItem("authtoken");
      window.location.pathname = endpoint_config.front_end_pages.login;
    }
    return { status: err.status, error: err.responseText };
  }
}

function formatDateTime(date) {
  let dataSplit = date.split("T");
  let dateRaw = dataSplit[0];
  let timeRaw = dataSplit[1].replace("Z", "");

  // date
  let dateSplit = dateRaw.split("-");
  let newDate = `${dateSplit[1]}/${dateSplit[2]}/${dateSplit[0]}`;

  //time
  let timeRemoveDecimal = timeRaw.split(".");
  let timeSplit = timeRemoveDecimal[0].split(":");

  let hour = timeSplit[0] % 12;
  let AMPM = timeSplit[0] > 12 ? "PM" : "AM";
  let newTime = `${hour}:${timeSplit[1]}:${timeSplit[2]} ${AMPM} `;
  return `${newDate} - ${newTime}`;
}
