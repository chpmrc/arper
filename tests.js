/**
 * This is an interactive test.
 * The user has to check that his/her device is recognized properly.
 * Set the MAC address of your device in the testConfig.json file.
 */

var arper = require('./arper');
var config = require('./testConfig');
var INTERFACE = "en0";

var logger = function(sender) {
  console.log("New node detected");
  console.log("-----------------");
  console.log("IP address: " + sender.ipAddr);
  console.log("MAC address: " + sender.macAddr);
};

arper.addMiddleware(logger);

arper.monitor(INTERFACE, function(err, newNode) {
  var expected = null;
  var given = null;
  if (err) {
    console.log(err);
  } else {
    given = newNode.macAddr.toLowerCase();
    expected = config.macAddr.toLowerCase();
    try {
      console.assert(expected == given);
      console.log("[V] Test passed!");
      process.exit(0);
    } catch (ae) {
      console.warn("[X] Test failed! Expected " + expected + " / Given " + given);
      console.log("Waiting...\n\n");
    }
  }
}, true);