var express = require('express');
var router = express.Router();

var runCommand = function(cmd, timeout, callback) {

  const { spawn } = require( 'child_process', {ditached: true, killSignal: "SIGKILL"} );
  const command = spawn(...cmd);

  var message = `$ ${ cmd[0] } ${ cmd[1].join(" ") }\n\n`;

  command.stdout.on('data', (data) => {
    message += data;
  });

  var timeout = setTimeout(() => {
    command.kill("SIGKILL");

    console.log(`${ command['stdout'] }`);

    message += "\n\nTERMINATED\n";
  }, timeout);

  command.on('close', () => {
    clearTimeout(timeout);

    callback(message);
  });
};

/* GET home page. */
router.get('/', function(req, res, next) {
  var message = false;

  if(req.query.action) {
    if(req.query.action == "ping") {
      console.log("ping request");
      if(!req.query.ip) {
        message = "You must provide a valid IP address";
      } else {
        var ip = req.query.ip;
        console.log(ip);

        runCommand(['ping', [ '-c', 5, ip]], 10000, (data) => {
          res.message = data;

          next();
        });
      }
    } else if(req.query.action == "trace") {
      console.log("trace request");
      if(!req.query.ip) {
        message = "You must provide a valid IP address";
      } else {
        var ip = req.query.ip;
        console.log(ip);

        runCommand(['traceroute', [ '-n', ip]], 10000, (data) => {
          res.message = data;

          next();
        });
      }
    } else if(req.query.action == "lookup") {
      console.log("lookup Request");
      if(!req.query.dns) {
        message = "You must provide a valid IP address";
      } else {
        var dns = req.query.dns;
        console.log(dns);

        runCommand(['host', [ dns ]], 10000, (data) => {
          res.message = data;

          next();
        });
      }
    } else {
      next();
    }
  } else {
    next();
  }
}, function(req, res, next) {
  
  res.render('index', {message: res.message, req: req});
});

module.exports = router;
