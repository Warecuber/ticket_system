(() => {
  if (localStorage.getItem("authtoken")) {
    $.ajax({
      async: true,
      method: "POST",
      url: endpoint_config.auth.validate,
      contentType: "json",
      headers: {
        "Content-Type": "application/json",
        authtoken: localStorage.getItem("authtoken"),
      },
      success: (data) => {
        window.location.pathname = endpoint_config.front_end_pages.home;
      },
      error: (err) => {
        if (err.status === 401) {
          $.ajax({
            async: true,
            method: "POST",
            url: endpoint_config.auth.refresh,
            contentType: "json",
            headers: {
              "Content-Type": "application/json",
              refresh_token: localStorage.getItem("refresh_token"),
            },
            success: (data) => {
              window.location.pathname = endpoint_config.front_end_pages.home;
            },
            error: (err) => {
              console.log("error");
            },
          });
        } else {
          console.log("Error");
        }
      },
    });
  }
  $(".loginButton").on("click", () => {
    $.ajax({
      async: true,
      method: "POST",
      url: endpoint_config.auth.login,
      contentType: "json",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
      }),
      success: (data) => {
        console.log("authenticated");
        localStorage.setItem("authtoken", `Bearer ${data.token}`);
        localStorage.setItem("refresh_token", data.refresh_token);
        window.location.pathname = endpoint_config.front_end_pages.login;
      },
      error: (err) => {
        // if(err.)
        console.log(err);
      },
    });
  });
})();
