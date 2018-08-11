const yaml = require('yamljs');

module.exports = function(req, res, next) {
  var config = yaml.load('./config.yaml');

  res.locals.config = config

  next();
};
