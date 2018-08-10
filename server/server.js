const express = require('express')
const fs = require('fs');
const https = require('https');
const path = require('path');
const WsRouter = require('./ws-router');

const HTTPS_PORT = 8443;


const app = express();
app.use('/static', express.static(path.join(__dirname, '..', 'static')));
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '..', 'static', 'index.html'));
});

// Server
const serverConfig = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};
const httpsServer = https.createServer(serverConfig, app);
httpsServer.listen(HTTPS_PORT, '0.0.0.0', null, () => {
  console.log('Server running. Visit https://localhost:' + HTTPS_PORT + ' in Firefox/Chrome (note the HTTPS; there is no HTTP -> HTTPS redirect!)');
});

const ws = new WsRouter({ server: httpsServer });
ws.on('open', () => {
  console.log('open');
});
ws.on('close', () => {
  console.log('closed');
});
ws.on('message', (data) => {
  console.log(data);
});

//
// const wss = new ws.Server({ server: httpsServer });
// wss.on('connection', function(ws) {
//   console.log('connected?');
//   ws.on('message', function(message) {
//       // Broadcast any received message to all clients
//       console.log('received: %s', message);
//       wss.broadcast(message);
//   });
// });
// console.log('create broadcast');
// wss.broadcast = (data) => {
//   console.log('broadcast data:', JSON.stringify(data));
//   wss.clients.forEach(function each(client) {
//     if (client.readyState === ws.OPEN) {
//       console.log('sending...');
//       client.send(data);
//     }
//   });
// };



// // Yes, SSL is required
//
//
// // ----------------------------------------------------------------------------------------
//
// // Create a server for the client html page
// var handleRequest = function(request, response) {
//     // Render the single client html file for any request the HTTP server receives
//     console.log('request received: ' + request.url);
//
//     if(request.url == '/') {
//         response.writeHead(200, {'Content-Type': 'text/html'});
//         response.end(fs.readFileSync('client/index.html'));
//     } else if(request.url == '/webrtc.js') {
//         response.writeHead(200, {'Content-Type': 'application/javascript'});
//         response.end(fs.readFileSync('client/webrtc.js'));
//     }
// };
//
// var httpsServer = https.createServer(serverConfig, handleRequest);
// httpsServer.listen(HTTPS_PORT, '0.0.0.0');
//
// // ----------------------------------------------------------------------------------------
//
// // Create a server for handling websocket calls