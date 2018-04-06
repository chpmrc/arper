/**
 * Arper uses pcap to passively detect incoming ARP packets on the specified network interface.
 * The IP and MAC addresses of the packet's sender are extracted and passed to the callback.
 */

var pcap = require('pcap');

/**
 * Middleware functions.
 * @type {Array}
 */
var _middleware = [];

var arper = {

  /**
   * Passively listen for ARP packets on the given interface and pass the sender's
   * IP and MAC address as strings to the given callback.
   * Note: the specified callback will be called last, after all middleware functions are called
   * and it's the only function that should handle an error.
   * It's useless to propagate the error to the middleware.
   * @param  {Function} callback The first argument is an error, the second is the sender's
   */
  monitor: function(netif, callback, pretty) {
    console.assert(typeof netif === 'string', 'Param netif has to be string.');
    console.assert(typeof callback === 'function', 'Param callback has to be function.');
    
    pretty = !!pretty;  // undefined is bad for your health
    var pcapSession = null;
    try {
      pcapSession = pcap.createSession(netif, "ether proto \\arp");
    } catch (e) {
      return callback(e);
    }
    pcapSession.on('packet', function (raw_packet) {
      var packet = pcap.decode.packet(raw_packet);
      var ipAddr = packet.payload.payload.sender_pa.addr;
      var macAddr = packet.payload.payload.sender_ha.addr;
      if (pretty) {
        // Convert addresses to human-readable strings
        macAddr = macAddr.map(function(addrByte) {
          return addrByte.toString(16);
        }).join(":").toUpperCase();
        ipAddr = ipAddr.join(".");
      }
      var sender = {
        macAddr: macAddr,
        ipAddr: ipAddr
      };
      for (var mf = 0; mf < _middleware.length; mf ++) {
        _middleware[mf](sender);
      }
      callback(null, sender);
    });
  },
  /**
   * Adds a middleware function.
   * Whenever a packet is received all middleware functions are called in the order
   * they were added.
   * @param {Function} fn A middleware function to which the new node is passed.
   */
  addMiddleware: function(fn) {
    console.assert(typeof fn === 'function', 'Param fn has to be function.');
    _middleware.push(fn);
  }
};

module.exports = arper;
