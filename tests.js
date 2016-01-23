/**
 * This is an interactive test.
 * The user has to check that his/her device is recognized properly.
 * Set the MAC address of your device in the testConfig.json file.
 *
 * Since we might receive many ARP packets we cannot rely on detecting only the first one.
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

// Hydrate the sender's info with an additional field
var hydratedSender = function(sender) {
  sender._test = "test";
};

arper.addMiddleware(hydratedSender, logger);

arper.monitor(INTERFACE, function(err, newNode) {
  var expected = null;
  var given = null;
  if (err) {
    console.log(err);
  } else {
    try {
      console.assert(newNode._test === "test");
      console.warn("[V] Test passed! The _test field was set!");
    } catch (ae) {
      console.warn("[X] Test failed! The _test field was not set...");
    }
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