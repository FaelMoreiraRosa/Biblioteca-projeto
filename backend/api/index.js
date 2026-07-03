const app = require('../app');

module.exports = (req, res) => {
  if (req.url === '/api') {
    req.url = '/';
  }

  if (req.url.startsWith('/api/')) {
    req.url = req.url.slice(4);
  }

  return app(req, res);
};
