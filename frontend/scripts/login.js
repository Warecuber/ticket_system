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
      error: async (err) => {
        if (err.status === 401) {
          // if not authorized, try to refresh the token
          try {
            postRequest(endpoint_config.auth.refresh, {
              refresh_token: localStorage.getItem("refresh_token"),
            }).then((res) => {
              console.log(res);
            });
            // $.ajax({
            //   async: true,
            //   method: "POST",
            //   url: endpoint_config.auth.refresh,
            //   contentType: "json",
            //   headers: {
            //     "Content-Type": "application/json",
            //     refresh_token: localStorage.getItem("refresh_token"),
            //   },
            //   success: (data) => {
            //     console.log(data);
            //     localStorage.setItem("authtoken", data.accessToken);
            //     window.location.pathname = endpoint_config.front_end_pages.home;
            //   },
            //   error: (err) => {
            //     console.log("error");
            //   },
            // });
          } catch (err) {
            console.log("err");
          }
        } else {
          console.log("Error");
        }
      },
    });
  }
  $(".loginButton").on("click", checkPasswd);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      checkPasswd();
    }
  });

  async function checkPasswd() {
    if (checkRequired() > 0) {
      $(".loginError").html("Missing required fields");
    } else {
      postRequest(endpoint_config.auth.login, {
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
      }).then((res) => {
        if (res.token) {
          localStorage.setItem("authtoken", `Bearer ${res.token}`);
          localStorage.setItem("refresh_token", res.refresh_token);
          window.location.pathname = endpoint_config.front_end_pages.home;
        }
      });

      // try to log the value of apiCall to see if it works
      // await console.log(apiCall);

      // $.ajax({
      //   async: true,
      //   method: "POST",
      //   url: endpoint_config.auth.login,
      //   contentType: "json",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   data: JSON.stringify({
      //     email: document.querySelector("#email").value,
      //     password: document.querySelector("#password").value,
      //   }),
      //   success: (data) => {
      //     console.log("authenticated");
      //     localStorage.setItem("authtoken", `Bearer ${data.token}`);
      //     localStorage.setItem("refresh_token", data.refresh_token);
      //     window.location.pathname = endpoint_config.front_end_pages.home;
      //   },
      //   error: (err) => {
      //     $(".loginError").html(err.responseText);
      //   },
      // });
    }
  }
  function checkRequired() {
    let missingFields = 0;
    let listOfInputs = document.querySelectorAll("input[data-required='true']");
    listOfInputs.forEach((el) => {
      if (!el.value) {
        el.style["border-color"] = "#7a0000";
        el.style["background-color"] = "#FFADAD";
        $(el).on("focus", function () {
          $(el).css({
            "background-color": "#bec6bf",
            "border-color": "#44280e",
          });
        });
        missingFields++;
      }
    });
    return missingFields;
  }
})();
