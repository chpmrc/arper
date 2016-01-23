var arper = require("../../arper");
var exec = require('child_process').exec;
var knownClients = require("./known_clients.json");
var fs = require("fs");

var template = '\
<center style="font-size: 60px;">\
<h1 style="margin-top: 300px;">Welcome {{name}}</h1>\
<p>Courtesy of <a href="https://www.npmjs.com/package/arper">Arper</a></p>\
</center>';

console.warn("THIS EXAMPLE ONLY WORKS ON MAC! Replace the `open welcome.html` command with whatever your OS is using");

// Only works on Mac!
var openFileMiddleware = function(sender) {
  var knownClient = knownClients[sender.macAddr];
  if (knownClient && ! knownClient.seen) {
    console.log(sender);
    knownClient.seen = true;
    // Create HTML file
    fs.writeFileSync("welcome.html", template.replace("{{name}}", knownClient.name));
    exec("open welcome.html");
    setTimeout(function() {
      // After 10 seconds reset arrived
      this.seen = true;
    }.bind(knownClient), 10000);
  }
};

if(require.main === module) {
  arper.addMiddleware(openFileMiddleware);

  arper.monitor("en0", function(err, sender) {
    if (err) {
      console.warn(err);
    }
  }, true);
}

module.exports = openFileMiddleware;