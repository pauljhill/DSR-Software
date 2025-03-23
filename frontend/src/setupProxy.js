const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Setup proxy for development environment to avoid CORS issues
 * and to route API requests to the backend server
 */
module.exports = function(app) {
  // Proxy API requests to the backend server
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  );

  // Proxy data file requests
  app.use(
    '/data',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  );

  // Proxy file uploads
  app.use(
    '/upload',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  );

  // Proxy file downloads
  app.use(
    '/download',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  );

  // Proxy PDF generation requests
  app.use(
    '/pdf',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  );

  // Proxy authentication requests
  app.use(
    '/auth',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  );

  // Setup WebSocket proxy for live updates
  app.use(
    '/ws',
    createProxyMiddleware({
      target: 'ws://localhost:3001',
      ws: true,
      changeOrigin: true,
    })
  );
};
