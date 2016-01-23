var arper = require("../../arper");
var desktopNotificationsMiddleware = require("../desktop_notifications");
var telegramMiddleware = require("../telegram");
var openFileMiddleware = require("../welcome_home");
var initMongodbMiddleware = require("../mongodb");

// Load all middleware!
arper.addMiddleware(desktopNotificationsMiddleware);
arper.addMiddleware(telegramMiddleware);
arper.addMiddleware(openFileMiddleware);
arper.addMiddleware(initMongodbMiddleware());

var boom = function(err, node) {
  if (err) {
    console.warn(err);
  }
};

arper.monitor("en0", boom, true);