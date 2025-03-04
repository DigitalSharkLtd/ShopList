module.exports = function(app) {
  // This prevents issues with client-side routing
  app.get('/*', function(req, res, next) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
};
