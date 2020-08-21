(() => {
  if (localStorage.getItem("authtoken")) {
    // if there's a refresh token, try to refresh it
    try {
      refreshToken().then((res) => {
        if (res.status === 200) {
          console.log(res);
          window.location.href = endpoint_config.front_end_pages.home;
        }
      });
    } catch (err) {
      console.log(err);
    }
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
        if (res.status === 400) {
          $(".loginError").html(res.error);
        }
        if (res.token) {
          localStorage.setItem("authtoken", `Bearer ${res.token}`);
          localStorage.setItem("refresh_token", res.refresh_token);
          window.location.pathname = endpoint_config.front_end_pages.home;
        }
      });
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
