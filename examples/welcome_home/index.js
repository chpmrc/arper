var arper = require("../../arper");
var exec = require('child_process').exec;

console.warn("THIS EXAMPLE ONLY WORKS ON MAC! Replace the `open welcome.html` command with whatever your OS is using");

var arrived = false;

// Only works on Mac!
var openFileMiddleware = function(sender) {
  if (sender.macAddr === "30:75:12:B3:C7:8A" && ! arrived) {
    console.log(sender);
    arrived = true;
    exec("open welcome.html");
    setTimeout(function() {
      // After 10 seconds reset arrived
      arrived = false;
    }, 10000);
  }
};

arper.addMiddleware(openFileMiddleware);

arper.monitor("en0", function(err, sender) {
  if (err) {
    console.warn(err);
  }
}, true);