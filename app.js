//NOTE: SERVER CONFIGURATION has 2 options. ENABLE 1 of 2 options

//NOTE: option (1) - https server (8443) + redirection 8080 to 8443

//prepare credentials & etc
var fs = require('fs');
var https = require('https');
var privateKey = fs.readFileSync('/etc/letsencrypt/live/choir.run/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/choir.run/fullchain.pem', 'utf8');
var credentials = {
  key: privateKey,
  cert: certificate
};

//https WWW server @ port 8443
var express = require('express');
var app = express();
var httpsWebServer = https.createServer(credentials, app).listen(8443, function() {
  console.log('[express] listening on *:8443');
});

//http Redirection server @ port 8080
//  ==> Don't get why this works.. all others not. ==> https://stackoverflow.com/a/23283173
var http = require('http');
var httpApp = express();
var httpRouter = express.Router();
httpApp.use('*', httpRouter);
httpRouter.get('*', function(req, res) {
  var host = req.get('Host');
  // replace the port in the host
  host = host.replace(/:\d+$/, ":" + app.get('port'));
  // determine the redirect destination
  var destination = ['https://', host, req.url].join('');
  return res.redirect(destination);
});
var httpServer = http.createServer(httpApp);
httpServer.listen(8080);

//https socket.io server @ port 8443 (same port as WWW service)
var io = require('socket.io')(httpsWebServer, {
  'pingInterval': 1000,
  'pingTimeout': 3000
});

// //NOTE: option (2) - simple http dev server (5500)

// var http = require('http');
// var express = require('express');
// var app = express();
// var httpServer = http.createServer(app);
// httpServer.listen(5500);

// //http socket.io server @ port 5500 (same port as WWW service)
// var io = require('socket.io')(httpServer, {
//   'pingInterval': 1000,
//   'pingTimeout': 3000
// });

//express configuration
app.use(express.static('public'));

//socket.io events
io.on('connection', function(socket) {

  //entry log.
  console.log('someone connected.');

  //on 'sound'
  socket.on('sound', function(sound) {

    //relay the message to everybody INCLUDING the sender
    io.emit('sound', sound);

    //INFO
    console.log('sound :' + sound);
  });

  //on 'sing-note'
  socket.on('sing-note', function(note) {

    //relay the message to everybody EXCEPT the sender
    socket.broadcast.emit('sing-note', note);

    //INFO
    console.log('sing-note :' + note);
  });

  //on 'disconnect'
  socket.on('disconnect', function() {

    console.log('someone disconnected.');

  });
});



//// OLD & Original version, serving webpages from 'github pages service'


// //
// // this is a node.js server
// //

// // uses both socket.io & osc.js

// // socket.io for web-browser clients. (mobile & pc clients)
// // osc.js/udp for mobmuplat client. (mobile client)

// ////common lib
// var express = require('express');
// var http = require('http');

// //// socket.io service - for Instruments clients (:5500)
// var ioInstApp = express();
// var ioInstServer = http.Server(ioInstApp);
// var ioInst = require('socket.io')(ioInstServer, {'pingInterval': 1000, 'pingTimeout': 3000});

// ioInst.on('connection', function(socket){

//     //
//     console.log('a instrument user connected');

//     //msg. for everybody - oneshot sounds
//     socket.on('sound', function(msg) {
//         ioInst.emit('sound', msg);
//         console.log('sound :' + msg);
//     });

//     //msg. for everyone - notes
//     socket.on('sing-note', function(msg) {
//         socket.broadcast.emit('sing-note', msg);
//         console.log('sing-note :' + msg);
//     });

//     //
//     socket.on('disconnect', function(){
//         console.log('instrument user disconnected');
//     });
// });

// ioInstServer.listen(5500, function(){
//     console.log('[socket.io] listening on *:5500');
// });

// // //// osc.js/udp service
// // var osc = require("osc");

// // var udp_sc = new osc.UDPPort({
// //     localAddress: "0.0.0.0",
// //     localPort: 52000,
// //     metadata: true
// // });

// // //message handler
// // udp_sc.on("message", function (oscmsg, timetag, info) {
// //     console.log("[udp] got osc message:", oscmsg);

// //     //EX)
// //     // //method [1] : just relay as a whole
// //     // ioInst.emit('osc-msg', oscmsg); //broadcast

// //     //EX)
// //     // //method [2] : each fields
// //     // ioInst.emit('osc-address', oscmsg.address); //broadcast
// //     // ioInst.emit('osc-type', oscmsg.type); //broadcast
// //     // ioInst.emit('osc-args', oscmsg.args); //broadcast
// //     // ioInst.emit('osc-value0', oscmsg.args[0].value); //broadcast

// //     //just grab i need.. note!
// //     ioInst.emit('sing-note', oscmsg.address); //broadcast
// // });
// // //open port
// // udp_sc.open();
// // udp_sc.on("ready", function() {
// //     console.log("[udp] ready... - 0.0.0.0:", udp_sc.options.localPort);
// // });
