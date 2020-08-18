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
            let apicall = await ajax_config.post(endpoint_config.auth.refresh, {
              refresh_token: localStorage.getItem("refresh_token"),
            });
            console.log(apicall);
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
    // console.log(e);
  });

  ////////////////////
  // Code to debug //
  //////////////////

  async function checkPasswd() {
    if (checkRequired() > 0) {
      // run checkRequired(). If it returns at least 1 field missing a value, show an error
      $(".loginError").html("Missing required fields");
    } else {
      // else, make an API call and store the result in a variable names apiCall

      //////////////////////////////////////////////////////////////
      //  I prefer to do something like this, if I can.          //
      //  I find it easier to follow the code when it's objects //
      ///////////////////////////////////////////////////////////

      let apiCall = await ajax_config.post(endpoint_config.auth.login, {
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
      });

      ///////////////////////////////////////////
      // I found this works if I do it this   //
      // way, but then the code in config.js //
      // ins't contained in an IIFE         //
      ///////////////////////////////////////

      postRequest(endpoint_config.auth.login, {
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
      }).then((res) => {
        console.log(res);
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
