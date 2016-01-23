/**
 * Arper uses pcap to passively detect incoming ARP packets on the specified network interface.
 * The IP and MAC addresses of the packet's sender are extracted and passed to the callback.
 */

var pcap = require('pcap');

var arper = {
  /**
   * Passively listen for ARP packets on the given interface and pass the sender's
   * IP and MAC address as strings to the given callback.
   * @param  {Function} callback The first argument is an error, the second is the sender's
   */
  monitor: function(netif, callback, pretty) {
    pretty = pretty || false;  // undefined is bad for your health
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
      callback(null, sender);
    });
  }
};

module.exports = arper;