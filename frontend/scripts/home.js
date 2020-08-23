(() => {
  queryRequest(endpoint_config.tickets.view_by_status, {
    queryName: "status",
    queryParam: "Open",
  }).then((res) => {
    if (res.error === "Invalid token") {
      refreshToken().then(() => {
        if (res.status === 401) {
          window.location.path === endpoint_config.front_end_pages.login;
        } else if (res.status === 200) {
          location.reload();
        }
      });
    }
    updateUI(res);
  });

  function updateUI(tickets) {
    // console.log(tickets);
    let table = document.querySelector("#ticketTable");
    let rows = table.rows.length;
    tickets.forEach((el) => {
      let newTR = table.insertRow(rows);
      newTR.classList.add("TicketRow");
      newTR.dataset.id = el._id;
      newTR.innerHTML = `<tr class="TicketRow" data-ticket="1"><td class="ticketStatus ticket--${el.status}">${el.status}</td><td>Low</td><td>${el.subject}</td><td>${el.reporter}</td><td>${el.agent}</td></tr>`;
      rows++;
    });
    $(".TicketRow").on("click", openTicket);
  }

  function openTicket() {
    queryRequest(endpoint_config.tickets.view_by_status, {
      queryName: "id",
      queryParam: this.dataset.id,
    }).then((res) => {
      let ticketOverlay = new Overlay(res[0], "ticketOverlay");
    });
  }

  function Overlay(data, varName) {
    this.data = data;
    this.varName = varName;
    this.create();
  }

  Overlay.prototype.create = function () {
    let mainContainer = document.querySelector(".body");
    let newContainer = document.createElement("div");
    newContainer.classList.add("ticketDetails");

    newContainer.innerHTML = `<div class="overlayNav"><p class="overlayTitle">${
      this.data.subject
    }</p><div class="closeButton"> <i class="far fa-times-circle"></i></div></div><div class="overlayDetails"><div class="branding">John's Ticket System</div><div class="divider"></div><div class="ticketData"><div class="setting_item"><p class="settingLabel">Assigned To</p> <select name="" id="" class="settingSelect"><option value="Unassigned">Unassigned</option><option value="John Ware">John Ware</option> </select></div><div class="divider"></div><div class="setting_item"><p class="settingLabel">Status</p> <select name="" id="" class="settingSelect" onchange="updateTicket(this)" ><option value="Open">Open</option><option value="Awaiting Response">Awaiting Response</option><option value="In Progress">In Progress</option><option value="Code Change">Code Change</option><option value="Closed">Closed</option> </select></div><div class="divider"></div><div class="setting_item"><p class="settingLabel">Priority</p> <select name="" id="" class="settingSelect" onchange="updateTicket(this)" ><option value="Urgent">Urgent</option><option value="High">High</option><option value="Normal" selected>Normal</option><option value="Low">Low</option> </select></div><div class="divider"></div><div class="setting_item"><p class="settingLabel">Category</p> <select name="" id="" class="settingSelect" onchange="updateTicket(this)" ><option value="Unassigned">Default</option><option value="Software">Software</option><option value="Hardware">Hardware</option><option value="Developnent">Developnent</option> </select></div><div class="divider"></div><div class="setting_item"><p class="settingLabel">Sub Category</p> <select name="" id="" class="settingSelect" onchange="updateTicket(this)" ><option value="Unassigned">Default</option><option value="Google Chrome">Google Chrome</option><option value="User Error">User Error</option><option value="Bug fix">Bug fix</option><option value="New Feature">New Feature</option> </select></div></div></div><div class="overlayBody"><div class="threadContainer"><div class="thread reporter"><div class="replyHeader"><span class="replyName">${
      this.data.reporter
    }</span><span class="replyDate">${formatDateTime(
      this.data.date
    )}</span></div><div class="replyContents">${
      this.data.description
    }</div></div></div><div class="replyContainer"><textarea name="replyContent"id="replyContent"class="replyTextarea" placeholder="Type a reply..."></textarea><div class="replyButtonContainer"><button class="overlaySendButtonLower">Send</button></div></div>`;
    mainContainer.insertAdjacentElement("beforeend", newContainer);
    this.eventListeners();
    this.slideUp();
  };
  Overlay.prototype.setOptions = function () {};
  Overlay.prototype.slideUp = function () {
    let currentPos = -100;
    let animateInterval = setInterval(animate, 1);

    function animate() {
      if (currentPos === 1) {
        clearInterval(animateInterval);
      } else {
        $(".ticketDetails").css({
          bottom: `${currentPos}%`,
        });
        currentPos++;
      }
    }
  };

  Overlay.prototype.slideDown = function () {
    let currentPos = 0;
    let animateInterval = setInterval(animate, 1);

    function animate() {
      if (currentPos === -101) {
        clearInterval(animateInterval);
      } else {
        $(".ticketDetails").css({
          bottom: `${currentPos}%`,
        });
        currentPos--;
      }
    }
    setTimeout(() => {
      document.querySelector(".ticketDetails").remove();
    }, 300);
  };

  Overlay.prototype.eventListeners = function () {
    let that = this;
    $(".closeButton").on("click", function () {
      that.slideDown();
    });
  };
})();
