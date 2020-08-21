(() => {
  getRequest(endpoint_config.tickets.view).then((res) => {
    if (res.error === "Invalid token") {
      refreshToken().then(() => {
        location.reload();
      });
    }
    console.log(res);
  });
})();
