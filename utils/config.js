const yaml = require('yamljs');

var config = {loaded: false};

module.exports = function(req, res, next) {
  if(!config.loaded) {
    console.log("Reading config");
    config = yaml.load('./config.yaml');

    config.loaded = true;
  }

  res.locals.config = config;

  next();
};
