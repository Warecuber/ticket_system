let endpoint_config = (() => {
  let origin = window.location.origin;
  let base_config = {
    auth: `${origin}/user/auth`,
    tickets: `${origin}/tickets`,
  };
  endpoints = {
    auth: {
      login: `${base_config.auth}/login`,
      logout: `${base_config.auth}/logout`,
      refresh: `${base_config.auth}/refresh`,
      validate: `${base_config.auth}/validate`
    },
    tickets: {
      view: `${base_config.tickets}/get`,
      create: `${base_config.tickets}/new`,
    },
    front_end_pages: {
      login: '/login.html',
      logout: '/logout.html',
      home: '/home.html'
    }
  };

  return endpoints;
})();
