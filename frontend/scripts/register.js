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
  $("#register").on("click", checkPasswd);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      checkPasswd();
    }
  });
  $("#loginButton").on("click", function () {
    window.location.pathname = endpoint_config.front_end_pages.login;
  });

  async function checkPasswd() {
    if (checkRequired() > 0) {
      $(".loginError").html("Missing required fields");
    } else {
      postRequest(endpoint_config.auth.register, {
        email: document.querySelector("#email").value,
        name: `${document.querySelector("#firstName").value} ${
          document.querySelector("#lastName").value
        }`,
        username: document.querySelector("#username").value,
        password: document.querySelector("#password").value,
      }).then((res) => {
        if (res.status === 400) {
          $(".loginError").html(res.error);
        }
        if (res.user) {
          $(".loginError").css({ color: "#007a0c" });
          $(".loginError").html("Account successfully created!");
          setTimeout(() => {
            window.location.pathname = endpoint_config.front_end_pages.login;
          }, 1500);
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
