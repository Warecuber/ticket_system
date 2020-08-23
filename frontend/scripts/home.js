(() => {
  queryRequest(endpoint_config.tickets.view_by_status, {
    name: "status",
    param: "Open",
  }).then((res) => {
    if (res.error === "Invalid token") {
      refreshToken().then(() => {
        if (res.status === 401) {
          window.location.path === endpoint_config.front_end_pages.login;
        } else {
          location.reload();
        }
      });
    }
    updateUI(res);
  });

  function updateUI(tickets) {
    console.log(tickets);
    let table = document.querySelector("#ticketTable");
    let rows = table.rows.length;
    tickets.forEach((el) => {
      let newTR = table.insertRow(rows);
      newTR.classList.add("TicketRow");
      newTR.innerHTML = `<tr class="TicketRow" data-ticket="1"><td class="ticketStatus ticket--${el.status}">${el.status}</td><td>Low</td><td>${el.subject}</td><td>${el.reporter}</td><td>${el.agent}</td></tr>`;
      rows++;
    });
  }

  function Overlay(title) {
    this.title = title;
  }

  Overlay.prototype.create = function (ticketDetails) {};
  Overlay.prototype.slideUp = function () {};
  Overlay.prototype.slideDown = function () {};
})();
