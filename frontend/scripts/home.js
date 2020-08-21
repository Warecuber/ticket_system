(() => {
  queryRequest(endpoint_config.tickets.view_by_status, { name: "status", param: "Open" }).then(
    (res) => {
      if (res.error === "Invalid token") {
        refreshToken().then(() => {
          location.reload();
        });
      }
      updateUI(res);
    }
  );

  function updateUI(tickets) {
    console.log(tickets);
    let table = document.querySelector("#ticketTable");
    let rows = table.rows.length;
    tickets.forEach((el) => {
      let newTR = table.insertRow(rows);
      newTR.innerHTML = `<tr class="TicketRow" data-ticket="1"><td class="ticketStatus ticket--${el.status}">${el.status}</td><td>Low</td><td>${el.subject}</td><td>${el.reporter}</td><td>${el.Agent}</td></tr>`;
      rows++;
    });
  }
})();
