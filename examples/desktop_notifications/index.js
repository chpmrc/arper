var arper = require("../../arper");
var notifier = require("node-notifier");

var desktopNotificationsMiddleware = function(sender) {
  notifier.notify({
    title: "We detected a new node in the network",
    message: "IP address: " + sender.ipAddr + "\nMAC address: " + sender.macAddr,
    // icon: path.join(__dirname, "coulson.jpg"), // absolute path (not balloons)
    sound: true, // Only Notification Center or Windows Toasters
  });
};

if(require.main === module) {
  arper.addMiddleware(desktopNotificationsMiddleware);

  arper.monitor("en0", function(err, sender) {
    if (err) {
      console.warn(err);
    }
  }, true);
}

module.exports = desktopNotificationsMiddleware;