const ws = require('ws');

class WsRouter {
  constructor(options) {
    this._clients = new Set();
    this._callbacks = {};
    this._server = new ws.Server(options);
    this._server.on('connection', (client) => {
      this._clients.add(client);
      console.log('connection: ', 'client...');

      client.on('message', (msg, other) => {
        console.log('message.type: ', msg.type);
        console.log('message: ', msg, other);
        //this.dispatch(msg);
      });
      client.on('close', (data, d2) => {
        this._clients.delete(client);
        console.log('close: ', data, d2);
        //this.dispatch('close')
      });
      client.on('ping', () => {
        console.log('ping');
      });
      client.on('pong', () => {
        console.log('pong');
      });
      client.on('error', (err) => {
        console.log('error: ', err);
      });
      client.on('unexpected-response', (req, res) => {
        console.log('unexpected-response: ', req, res);
      });
    });
    this._server.on('error', (err) => {
      console.log('error: ', err);
    });
    this._server.on('listening', () => {
      console.log('listening');
    });
    this._server.on('headers', (headers) => {
      console.log('headers: ', headers);
    });
  }

  on(event, callback) {
    this._callbacks[event] = this._callbacks[event] || [];
    this._callbacks[event].push(callback);
  }

  dispatch(event, data) {
    const chain = this._callbacks[event_name];
    if (typeof chain === 'undefined') {
      return; // no callbacks for this event
    }
    for(let i = 0; i < chain.length; i++){
      chain[i](data);
    }
  }
}

module.exports = WsRouter;

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



/*
Simplified WebSocket events dispatcher (no channels, no users)

var socket = new FancyWebSocket();

// bind to server events
socket.bind('some_event', function(data){
  alert(data.name + ' says: ' + data.message)
});

// broadcast events to all connected users
socket.send( 'some_event', {name: 'ismael', message : 'Hello world'} );
*/

// var FancyWebSocket = function(url){
//   var conn = new WebSocket(url);
//
//   var callbacks = {};
//
//   this.bind = function(event_name, callback){
//     callbacks[event_name] = callbacks[event_name] || [];
//     callbacks[event_name].push(callback);
//     return this;// chainable
//   };
//
//   this.send = function(event_name, event_data){
//     var payload = JSON.stringify({event:event_name, data: event_data});
//     conn.send( payload ); // <= send JSON data to socket server
//     return this;
//   };
//
//   // dispatch to the right handlers
//   conn.onmessage = function(evt){
//     var json = JSON.parse(evt.data)
//     dispatch(json.event, json.data)
//   };
//
//   conn.onclose = function(){dispatch('close',null)}
//   conn.onopen = function(){dispatch('open',null)}
//
//   var dispatch = function(event_name, message){
//     var chain = callbacks[event_name];
//     if(typeof chain == 'undefined') return; // no callbacks for this event
//     for(var i = 0; i < chain.length; i++){
//       chain[i]( message )
//     }
//   }
// };