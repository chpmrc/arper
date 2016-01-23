var arper = require("../../arper");
var desktopNotificationsMiddleware = require("../desktop_notifications");
var telegramMiddleware = require("../telegram");
var openFileMiddleware = require("../welcome_home");

// Load all middleware!
arper.addMiddleware(desktopNotificationsMiddleware);
arper.addMiddleware(telegramMiddleware);
arper.addMiddleware(openFileMiddleware);

var boom = function(err, node) {
  if (err) {
    console.warn(err);
  }
};

arper.monitor("en0", boom, true);