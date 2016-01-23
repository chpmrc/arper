var TelegramBot = require('node-telegram-bot-api');
var arper = require('../../arper');

var token = 'YOUR_TOKEN_HERE';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

var fromId = null;

var connectedClients = [];

var telegramMiddleware = function(node) {
  // Avoid duplicating messages
  if (connectedClients.indexOf(node.macAddr) !== -1) {
    return;
  }
  connectedClients.push(node.macAddr);
  bot.sendMessage(fromId, "New node detected!\nIP address: " + node.ipAddr + "\nMAC address: " + node.macAddr);
};

// Send /monitor to start monitoring
bot.onText(/\/monitor/, function (msg, match) {
  fromId = msg.from.id;
  var resp = "Alright! I will let you know if somebody connects to your network";
  bot.sendMessage(fromId, resp);
  arper.addMiddleware(telegramMiddleware);
  arper.monitor("en0", function(err) {
    if (err) {
      console.warn(err);
    }
  }, true);
});