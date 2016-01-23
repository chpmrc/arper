var arper = require("../../arper");
var exec = require('child_process').exec;
var knownClients = require("./known_clients.json");

console.warn("THIS EXAMPLE ONLY WORKS ON MAC! Replace the `open welcome.html` command with whatever your OS is using");

// Only works on Mac!
var openFileMiddleware = function(sender) {
  var knownClient = knownClients[sender.macAddr];
  if (knownClient && ! knownClient.seen) {
    console.log(sender);
    knownClient.seen = true;
    exec("open welcome.html");
    setTimeout(function() {
      // After 10 seconds reset arrived
      this.seen = true;
    }.bind(knownClient), 10000);
  }
};

arper.addMiddleware(openFileMiddleware);

arper.monitor("en0", function(err, sender) {
  if (err) {
    console.warn(err);
  }
}, true);

module.exports = openFileMiddleware;