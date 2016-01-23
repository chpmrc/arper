var pcap = require('pcap');
var pcap_session = pcap.createSession('en0', "ether proto \\arp");


// This is a first attempt at detecting ARP packets in real time
pcap_session.on('packet', function (raw_packet) {
  // console.log(raw_packet);
  var packet = pcap.decode.packet(raw_packet);
  var sender = {
    macAddr: packet.payload.payload.sender_ha.addr,
    ipAddr: packet.payload.payload.sender_pa.addr
  };
  console.log("New node:", sender.ipAddr, sender.macAddr);
});