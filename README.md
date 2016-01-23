# Arper

Project for Istanbul Packathon (packathon.org)

*NOTE:* this tool is still in development! The package is there just as a placeholder for the name.

## Why

I want to see who is connecting to my WiFi network (or any other network for that matter) in real time.

Applications like [1] represent the state of the art in detecting nodes on a network. Their approach is based on periodic scanning of IP addresses using tools like Nmap. There are two problems with this approach:

1. It's not real time and it requires constant *polling* (and we all hate polling don't we?).
2. If there is a central entity in the network (e.g. a router) it might limit things like ICMP requests (ping), port scanning etc. Furthermore individual nodes can simply decide not to reply to any unauthenticated request, regardless of the protocol used (e.g. on OS X a user can set the machine in "stealth mode", i.e. the machine will stop replying to ICMP requests).
3. They work on top of the IP layer (OSI level 3) which means the packets they send have to be routed by an entity, likely a router.

## How

In every network based on the Ethernet protocol (like WiFi 802.11) once a node obtains an IP address (e.g. from a DHCP server) it advertises its pair (IP address, MAC address), that is, its virtual and physical addresses, to **every** node on the network in a peer-to-peer fashion using the ARP [2] protocol.

ARP packets **cannot be routed**. A central entity in the network has no control over what ARP packets are sent. Nodes can at most flood the network with packets (for example flooding with ARP responses is often used to carry on man-in-the-middle attacks).

This means that every single node on the network will receive ARP packets broadcasted by other nodes, in a completely passive manner. No polling required!

## What

Arper represents a new class of network detection tools. Arper can detect, in real time, when a new node in the network broadcasts its IP and MAC addresses. By monitoring a network device with Pcap it can passively listen for ARP packets. That *passively* is of extreme importance. It means there is virtually zero impact on performance and power usage while Arper is running.

## Middleware

Middleware for Arper can be easily attached. Do you want to receive a notification when a new node is connected? You can. Do you want to receive an SMS/Email/... when it happens? You can.

## I want it.

`npm install -g arper`

```
var arper = require("arper");
arper.monitor(function(err, newNode) {
  console.log(newNode);
});
```

## References

- [1] http://whoisonmywifi.com/
- [2] https://en.wikipedia.org/wiki/Address_Resolution_Protocol