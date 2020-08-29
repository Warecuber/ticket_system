let ticketController = (() => {
  queryRequest(endpoint_config.tickets.view_by_status, {
    queryName: "status",
    queryParam: "Open",
  }).then((res) => {
    if (res.error === "Invalid token") {
      refreshToken().then((res) => {
        if (res.status === 401 || res.status === 403) {
          window.location.pathname = endpoint_config.front_end_pages.login;
        } else if (res.status === 200) {
          location.reload();
        }
      });
    } else {
      getRequest(endpoint_config.user.current).then((res) => {
        if (res.name) {
          $(".loggedInAs").html(res.name);
        }
      });
      updateUI(res);
    }
  });

  $("#logout").on("click", function () {
    window.location.pathname = endpoint_config.front_end_pages.logout;
  });
  $("#admin").on("click", function () {
    window.location.pathname = endpoint_config.front_end_pages.admin;
  });

  $(".selectQuery").on("change", function () {
    queryRequest(endpoint_config.tickets.view_by_status, {
      queryName: "status",
      queryParam: this.value,
    }).then((res) => {
      updateUI(res);
    });
  });

  $("#createNewTicket").on("click", function () {
    let newTicketOverlay = new Overlay([], "newTicketOverlay", "newTicket");
  });

  function refreshUI() {
    queryRequest(endpoint_config.tickets.view_by_status, {
      queryName: "status",
      queryParam: document.getElementById("viewType").value,
    }).then((res) => {
      updateUI(res);
    });
  }

  function updateUI(tickets) {
    let table = document.querySelector("#ticketTable");
    resetTable(table);
    let rows = table.rows.length;
    tickets.forEach((el) => {
      let newTR = table.insertRow(rows);
      newTR.classList.add("TicketRow");
      newTR.dataset.id = el._id;
      newTR.innerHTML = `<td class="ticketStatus ticket--${el.status}">${el.status}</td><td>${el.priority}</td><td>${el.subject}</td><td>${el.reporter}</td><td>${el.agent}</td>`;
      rows++;
    });
    $(".TicketRow").on("click", openTicket);
  }

  function resetTable(table) {
    for (let i = table.rows.length; i > 1; i--) {
      table.deleteRow(i - 1);
    }
  }

  function openTicket() {
    queryRequest(endpoint_config.tickets.view_by_status, {
      queryName: "id",
      queryParam: this.dataset.id,
    }).then((res) => {
      let ticketOverlay = new Overlay(res[0], "ticketOverlay", "ticketDetails");
    });
  }

  function Overlay(data, varName, type) {
    this.data = data;
    this.varName = varName;
    this.type = type;
    this.create();
  }

  Overlay.prototype.create = function () {
    if (this.type === "ticketDetails") {
      this.ticketDetails();
    } else if (this.type === "newTicket") {
      this.newTicket();
    }
  };

  Overlay.prototype.newTicket = function () {
    let where = document.querySelector(".body");
    let newHTML = `<div class="ticketDetails">
    <div class="overlayNav">
      <p class="overlayTitle">Create New Ticket</p>
      <div class="closeButton">
        <i class="far fa-times-circle"></i>
      </div>
    </div>
    <div class="overlayDetails">
      <div class="divider"></div>
      <div class="branding">John's Ticket System</div>
      <div class="divider"></div>
      <div class="ticketData">
        <div class="setting_item">
          <p class="settingLabel">Assigned To</p>
          <select name="" id="" class="settingSelect">
            <option value="Unassigned">Unassigned</option>
            <option value="John Ware">John Ware</option>
          </select>
        </div>
        <div class="divider"></div>
        <div class="setting_item">
          <p class="settingLabel">Status</p>
          <select name="" id="" class="settingSelect">
            <option value="Open">Open</option>
            <option value="Awaiting Response">Awaiting Response</option>
            <option value="In Progress">In Progress</option>
            <option value="Code Change">Code Change</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div class="divider"></div>
        <div class="setting_item">
          <p class="settingLabel">Priority</p>
          <select name="" id="" class="settingSelect">
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Normal" selected>Normal</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div class="divider"></div>
        <div class="setting_item">
          <p class="settingLabel">Category</p>
          <select name="" id="" class="settingSelect">
            <option value="Unassigned">Default</option>
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
            <option value="Developnent">Developnent</option>
          </select>
        </div>
        <div class="divider"></div>
        <div class="setting_item">
          <p class="settingLabel">Sub Category</p>
          <select name="" id="" class="settingSelect">
            <option value="Unassigned">Default</option>
            <option value="Google Chrome">Google Chrome</option>
            <option value="User Error">User Error</option>
            <option value="Bug fix">Bug fix</option>
            <option value="New Feature">New Feature</option>
          </select>
        </div>
      </div>
    </div>
    <div class="overlayBody">
      <div class="newTicketDetails">
        <div class="ticketDetailContainer">
          <div class="userRow">
            <label for="ticketReporter" class="userLabel"
              >Reporter email</label
            >
            <div class="two-thirds-width">
              <input
                type="email"
                name="ticketReporter"
                id="ticketReporter"
                placeholder="Reporter's email"
                data-required="true"
                class="userInput"
              />
            </div>
          </div>
          <div class="userRow">
            <label for="reporterName" class="userLabel">Reporter Name</label>
            <div class="two-thirds-width">
              <input
                type="text"
                name="reporterName"
                id="reporterName"
                placeholder="Reporter's name"
                data-required="true"
                class="userInput"
              />
            </div>
          </div>
          <div class="userRow">
            <label for="ticketTitle" class="userLabel">Ticket Title</label>
            <div class="two-thirds-width">
              <input
                type="text"
                name="ticketTitle"
                id="ticketTitle"
                placeholder="Reporter's email"
                class="userInput"
                data-required="true"
              />
            </div>
          </div>
        </div>
        <textarea
          name="ticketBody"
          id="ticketBody"
          class="replyTextarea"
          placeholder="Type the ticket body"
          data-required="true"
        ></textarea>
        <div class="replyButtonContainer">
          <button class="crateNewTicketButton">Create</button>
        </div>
      </div>
    </div>`;
    where.insertAdjacentHTML("beforeend", newHTML);
    this.eventListeners();
    this.slideUp();
  };

  Overlay.prototype.ticketDetails = function () {
    let mainContainer = document.querySelector(".body");
    let newContainer = document.createElement("div");
    newContainer.classList.add("ticketDetails");

    newContainer.innerHTML = `<div class="overlayNav"><p class="overlayTitle">${
      this.data.subject
    }</p><div class="closeButton"> <i class="far fa-times-circle"></i></div></div><div class="overlayDetails"><div class="divider"></div><div class="branding">John's Ticket System</div><div class="divider"></div><div class="ticketData"><div class="setting_item"><p class="settingLabel">Assigned To</p><select name="assignedTo" id="assignedTo" class="settingSelect"><option value="Unassigned">Unassigned</option></select></div><div class="divider"></div><div class="setting_item"><p class="settingLabel">Status</p> <select name="status" id="status" class="settingSelect"><option value="Open">Open</option><option value="Awaiting Response">Awaiting Response</option><option value="In Progress">In Progress</option><option value="Code Change">Code Change</option><option value="Closed">Closed</option></select></div><div class="divider"></div><div class="setting_item"><p class="settingLabel">Priority</p> <select name="priority" id="priority" class="settingSelect"><option value="Urgent">Urgent</option><option value="High">High</option><option value="Normal" selected>Normal</option><option value="Low">Low</option></select></div><div class="divider"></div><div class="setting_item"><p class="settingLabel">Category</p><select name="category" id="category" class="settingSelect"><option value="Default">Default</option><option value="Software">Software</option><option value="Hardware">Hardware</option><option value="Developnent">Developnent</option></select></div><div class="divider"></div><div class="setting_item"><p class="settingLabel">Sub Category</p><select name="subCategory" id="subCategory" class="settingSelect"><option value="Default">Default</option><option value="Google Chrome">Google Chrome</option><option value="User Error">User Error</option><option value="Bug fix">Bug fix</option><option value="New Feature">New Feature</option></select></div></div><div class="ticketSettingsButtons"><button class='overlaySendButtonLower' data-id="${
      this.data._id
    }">save</button></div></div></div><div class="overlayBody"><div class="threadContainer"><div class="thread reporter"><div class="replyHeader"><span class="replyName">${
      this.data.reporter
    }</span><span class="replyDate">${formatDateTime(
      this.data.date
    )}</span></div><div class="replyContents">${
      this.data.description
    }</div></div></div><div class="replyContainer"><textarea name="replyContent"id="replyContent"class="replyTextarea" placeholder="Type a reply..."></textarea><div class="replyButtonContainer"><button class="overlaySendButtonLower">Send</button></div></div>`;
    mainContainer.insertAdjacentElement("beforeend", newContainer);
    getAgents(this.data.agent);
    this.setOptions();
    this.eventListeners();
    this.slideUp();
  };

  Overlay.prototype.setOptions = function () {
    document.getElementById("status").value = this.data.status;
    document.getElementById("priority").value = this.data.priority;
    document.getElementById("category").value = this.data.category;
    document.getElementById("subCategory").value = this.data.sub_category;
    document.getElementById("assignedTo").value = this.data.agent;
  };
  Overlay.prototype.slideUp = function () {
    console.log(this);
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
    refreshUI();
    setTimeout(() => {
      document.querySelector(".ticketDetails").remove();
    }, 200);
  };

  Overlay.prototype.eventListeners = function () {
    let that = this;
    if (this.type === "ticketDetails") {
      $(".overlaySendButtonLower").on("click", function () {
        let assignedTo = document.getElementById("assignedTo").value;
        let status = document.getElementById("status").value;
        let priority = document.getElementById("priority").value;
        let category = document.getElementById("category").value;
        let subCategory = document.getElementById("subCategory").value;
        patchRequest(endpoint_config.tickets.update, {
          ticket: this.dataset.id,
          assignedTo: assignedTo,
          status: status,
          priority: priority,
          category: category,
          subCategory: subCategory,
        }).then((res) => {
          if (res.status === 200) {
            let successBanner = new Banner("Saved", "successBanner");
          }
        });
      });
    } else if (this.type === "newTicket") {
      $(".crateNewTicketButton").on("click", () => {
        if (checkRequired() > 0) {
          let error = new Banner("Missing required fields", "errorBanner");
        } else {
          postRequest(endpoint_config.tickets.create, {
            email: document.getElementById("ticketReporter").value,
            name: document.getElementById("reporterName").value,
            subject: document.getElementById("ticketTitle").value,
            description: document.getElementById("ticketBody").value,
          }).then(res => {
            console.log(res);
          });
        }
      });
    }
    $(".closeButton").on("click", function () {
      that.slideDown();
    });
  };

  function checkRequired() {
    let requiredArr = [];
    let hasError = 0;
    requiredArr.push(document.querySelectorAll("input[data-required='true']"));
    requiredArr.push(
      document.querySelectorAll("textarea[data-required='true']")
    );
    requiredArr.forEach((el) => {
      el.forEach((subEl) => {
        if (!subEl.value) {
          subEl.style["border-color"] = "#7a0000";
          subEl.style["background-color"] = "#FFADAD";
          $(subEl).on("focus", function () {
            $(subEl).css({
              "background-color": "#bec6bf",
              "border-color": "#44280e",
            });
          });
          hasError++;
        }
      });
    });
    return hasError;
  }

  function getAgents(assigned_agent) {
    queryRequest(endpoint_config.user.agent, {
      queryName: "scope",
      queryParam: "agent",
    }).then((res) => {
      let where = document.getElementById("assignedTo");
      res.forEach((el) => {
        let agent = document.createElement("option");
        agent.value = el.name;
        agent.innerHTML = el.name;
        if (assigned_agent === el.name) {
          agent.selected = true;
        }
        where.insertAdjacentElement("beforeend", agent);
        return "complete";
      });
      document.getElementById("assignedTo").value = assigned_agent;
    });
  }
})();
