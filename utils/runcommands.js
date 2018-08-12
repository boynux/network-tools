module.exports = function(cmd, timeout, callback) {

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


