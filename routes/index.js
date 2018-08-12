var router = require('express').Router();

const isIP = require('is-ip');
const runCommand = require('../utils/runcommands');
const commandMap = {
  "ping": "ping",
  "trace": "traceroute",
  "lookup": "host",
};

function isValidDomain(domain) {
  const regex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}\.?$/;

  return regex.test(domain);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var message = false;

  if(!req.query.action) {
    return next();
  }

  if(!(req.query.action in commandMap)) {
    return next();
  }

  if(req.query.action == "ping") {
    console.log("ping request");
    if(!req.query.ip || !isIP.v4(req.query.ip)) {
      res.message = `You must provide a valid IPV4 address. "${ req.query.ip }" is invalid.`;
      req.query.ip = "";

      return next();
    } 

    var ip = req.query.ip;
    console.log(ip);

    runCommand(['ping', [ '-c', 5, ip]], 10000, (data) => {
      res.message = data;

      next();
    });
  } else if(req.query.action == "trace") {
    console.log("trace request");
    if(!req.query.ip || !isIP.v4(req.query.ip)) {
      res.message = `You must provide a valid IPV4 address. "${ req.query.ip }" is invalid.`;
      req.query.ip = "";

      return next();
    } 

    var ip = req.query.ip;
    console.log(ip);

    runCommand(['traceroute', [ '-A', '-n', ip]], 10000, (data) => {
      res.message = data;

      next();
    });

  } else if(req.query.action == "lookup") {
    console.log("lookup Request");
    if(!req.query.dns || !isValidDomain(req.query.dns) && !isIP(req.query.dns)) {
      res.message = `You must provide a valid DNS entry or IPV4 address. "${ req.query.dns }" is invalid.`;
      req.query.dns = "";

      return next();
    }

    var dns = req.query.dns;
    console.log(dns);

    runCommand(['host', [ dns ]], 10000, (data) => {
      res.message = data;

      next();
    });
  }
}, function(req, res, next) {
  res.render('index', {message: res.message, req: req});
});

module.exports = router;
