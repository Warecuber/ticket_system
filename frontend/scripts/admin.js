(() => {
  getRequest(endpoint_config.user.current).then((res) => {
    if (res.name) {
      $(".loggedInAs").html(res.name);
    }
  });
  $("#openTickets").on("click", function () {
    window.location.pathname = endpoint_config.front_end_pages.home;
  });

  $("#email").on("input", function () {
    if (this.value) {
      queryRequest(endpoint_config.user.search, {
        queryName: "email",
        queryParam: this.value,
      }).then((res) => {
        updateUI(res);
      });
    }
  });

  $("#logout").on("click", function () {
    window.location.pathname = endpoint_config.front_end_pages.logout;
  });

  function updateUI(users) {
    let table = document.querySelector("#ticketTable");
    resetTable(table);
    let rows = table.rows.length;
    users.forEach((el) => {
      let newTR = table.insertRow(rows);
      newTR.classList.add("TicketRow");
      newTR.dataset.email = el.email;
      newTR.innerHTML = `<td>${el.name}</td><td>${el.username}</td><td>${el.email}</td>`;
      rows++;
    });
    $(".TicketRow").on("click", openUser);
  }

  function resetTable(table) {
    for (let i = table.rows.length; i > 1; i--) {
      table.deleteRow(i - 1);
    }
  }

  function openUser() {
    queryRequest(endpoint_config.user.search, {
      queryName: "email",
      queryParam: this.dataset.email,
    }).then((res) => {
      let userOverlay = new Overlay(res[0], "userOverlay");
    });
  }
  queryRequest(endpoint_config.user.search, {
    queryName: "email",
    queryParam: this.value,
  }).then((res) => {
    updateUI(res);
  });
  function Overlay(data, varName) {
    this.data = data;
    this.varName = varName;
    this.create();
  }

  Overlay.prototype.create = function () {
    let mainContainer = document.querySelector(".body");
    let newContainer = document.createElement("div");
    newContainer.classList.add("ticketDetails");

    newContainer.innerHTML = `<div class="overlayNav"><p class="overlayTitle">${this.data.name}</p><div class="closeButton"> <i class="far fa-times-circle"></i></div></div><div class="overlayUserBody"><div class="userContainer"><p class="userSectionHeader">Account Settings:</p><div class="outsideBorder"><div class="userRow"><p class="userLabel">Email</p><div class="two-thirds-width"> <input type="email" class="userInput" id="userEmail" /> <button class="updateUser" data-field="userEmail" data-endpoint="email"> Save </button></div></div><div class="userRow"><p class="userLabel">Name</p><div class="two-thirds-width"> <input type="Name" class="userInput" id="userFullName" /><button class="updateUser" data-field="userFullName" data-endpoint="name"> Save </button></div></div><div class="userRow"><p class="userLabel">Username</p><div class="two-thirds-width"> <input type="text" class="userInput" id="username" /> <button class="updateUser" data-field="username" data-endpoint="username"> Save </button></div></div><div class="userRow row-no-border"><p class="userLabel">Password</p><div class="two-thirds-width"> <input type="password" class="userInput" id="userPasword" /> <button class="updateUser" data-field="userPasword" data-endpoint="password"> Save </button></div></div></div><div class="scopes"><p class="userSectionHeader">Scopes:</p><div class="outsideBorder"><div class="scopeSettings"><div class="customCheckbox"> <input type="checkbox" class="userCheckbox" name="scopeAgent" id="scopeagent" value="agent" /> <label for="scopeagent" class="scopeLabel">Agent</label></div><div class="customCheckbox"> <input type="checkbox" class="userCheckbox" name="scopeAdmin" id="scopeadmin" value="admin" /> <label for="scopeadmin" class="scopeLabel">Admin</label></div><div class="customCheckbox"> <input type="checkbox" class="userCheckbox" name="scopeCreate" id="scopecreate" value="create" /> <label for="scopecreate" class="scopeLabel">Create</label></div></div></div></div></div>`;
    mainContainer.insertAdjacentElement("beforeend", newContainer);
    this.setOptions();
    this.eventListeners();
    this.slideUp();
  };
  Overlay.prototype.setOptions = function () {
    document.getElementById("userEmail").value = this.data.email;
    document.getElementById("userFullName").value = this.data.name;
    document.getElementById("username").value = this.data.username;
    this.data.scopes.forEach((el) => {
      document.getElementById(`scope${el}`).checked = true;
    });
  };
  Overlay.prototype.slideUp = function () {
    let currentPos = -20;
    let animateInterval = setInterval(animate, 1);

    function animate() {
      if (currentPos === 1) {
        clearInterval(animateInterval);
      } else {
        $(".ticketDetails").css({
          bottom: `${currentPos * 5}%`,
        });
        currentPos++;
      }
    }
  };

  Overlay.prototype.slideDown = function () {
    let currentPos = 0;
    let animateInterval = setInterval(animate, 1);

    function animate() {
      if (currentPos === -21) {
        clearInterval(animateInterval);
      } else {
        $(".ticketDetails").css({
          bottom: `${currentPos * 5}%`,
        });
        currentPos--;
      }
    }
    setTimeout(() => {
      document.querySelector(".ticketDetails").remove();
    }, 200);
  };

  Overlay.prototype.eventListeners = function () {
    let that = this;
    $(".closeButton").on("click", function () {
      that.slideDown();
    });
    $(".updateUser").on("click", function () {
      console.log(`${endpoint_config.user.update}/${this.dataset.endpoint}`);
      postRequest(`${endpoint_config.user.update}/${this.dataset.endpoint}`, {
        data: document.getElementById(this.dataset.field).value,
        _id: that.data._id,
      }).then((res) => {
        if (res.status === 400) {
          let errorBanner = new Banner(res.error, "errorBanner");
        } else {
          let successBanner = new Banner("Updated user", "successBanner");
        }
      });
    });
    $(".userCheckbox").on("change", function () {
      postRequest(`${endpoint_config.user.update}/scopes`, {
        data: generateScopes(),
        _id: that.data._id,
      }).then((res) => {
        if (res.ok === 1) {
          let successBanner = new Banner("Updated user", "successBanner");
        } else {
          let errorBanner = new Banner(res.error, "errorBanner");
        }
      });
    });
    // $(".overlaySendButtonLower").on("click", function () {
    //   let assignedTo = document.getElementById("assignedTo").value;
    //   let status = document.getElementById("status").value;
    //   let priority = document.getElementById("priority").value;
    //   let category = document.getElementById("category").value;
    //   let subCategory = document.getElementById("subCategory").value;
    //   patchRequest(endpoint_config.tickets.update, {
    //     ticket: this.dataset.id,
    //     assignedTo: assignedTo,
    //     status: status,
    //     priority: priority,
    //     category: category,
    //     subCategory: subCategory,
    //   }).then((res) => {
    //     if (res.status === 200) {
    //       let successBanner = new Banner("Saved", "successBanner");
    //     }
    //   });
    // });
  };

  function generateScopes() {
    let scopeArr = [];
    let scopeList = document.querySelectorAll(".userCheckbox");
    scopeList.forEach((el) => {
      if (el.checked) {
        scopeArr.push(el.value);
      }
    });
    return scopeArr;
  }
})();
