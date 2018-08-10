let peerConnection = null;
let uuid = null;

var peerConnectionConfig = {
  'iceServers': [
    {'urls': 'stun:stun.services.mozilla.com'},
    {'urls': 'stun:stun.l.google.com:19302'},
  ]
};


function pageReady() {
  uuid = Math.random().toString(36).substr(2, 10);
  socket = new WebSocket(`wss://${window.location.hostname}:${window.location.port}`);
  socket.binaryType = 'arraybuffer';
  socket.onmessage = gotMessageFromServer;
}

function send(msg) {
  console.log('msg: ', msg);
  const buff = new ArrayBuffer(16);
  socket.send(buff);
  //socket.send(JSON.stringify({ command: 'text', payload: msg }));
}

function gotMessageFromServer(message) {
  const data = JSON.parse(message.data);
  if (data.command === 'text') {
    console.log('received: ', data.payload);
  } else {
    console.log(message);
  }
  // if(!peerConnection) start(false);
  //
  // var signal = JSON.parse(message.data);
  //
  // // Ignore messages from ourself
  // if(signal.uuid == uuid) return;
  //
  // if(signal.sdp) {
  //     peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {
  //         // Only create answers in response to offers
  //         if(signal.sdp.type == 'offer') {
  //             peerConnection.createAnswer().then(createdDescription).catch(errorHandler);
  //         }
  //     }).catch(errorHandler);
  // } else if(signal.ice) {
  //     peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(errorHandler);
  // }
}


//
// function start(isCaller) {
//     peerConnection = new RTCPeerConnection(peerConnectionConfig);
//     peerConnection.onicecandidate = gotIceCandidate;
//     peerConnection.onaddstream = gotRemoteStream;
//     peerConnection.addStream(localStream);
//
//     if(isCaller) {
//         peerConnection.createOffer().then(createdDescription).catch(errorHandler);
//     }
// }
//
// function gotIceCandidate(event) {
//     if(event.candidate != null) {
//         socket.send(JSON.stringify({'ice': event.candidate, 'uuid': uuid}));
//     }
// }
//
// function createdDescription(description) {
//     console.log('got description');
//
//     peerConnection.setLocalDescription(description).then(function() {
//         socket.send(JSON.stringify({'sdp': peerConnection.localDescription, 'uuid': uuid}));
//     }).catch(errorHandler);
// }
//
// function gotRemoteStream(event) {
//     console.log('got remote stream');
//     remoteVideo.src = window.URL.createObjectURL(event.stream);
// }
//
// function errorHandler(error) {
//     console.log(error);
// }
//
// // Taken from http://stackoverflow.com/a/105074/515584
// // Strictly speaking, it's not a real UUID, but it gets the job done here
// function uuid() {
//   function s4() {
//     return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
//   }
//
//   return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
// }
