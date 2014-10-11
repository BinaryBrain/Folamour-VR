var channel;
var pc;

var callbackOnMessage;

var mediaConstraints = {
    optional: [],
    mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: false
    }
};

var audioElement = null;
var iceCandidates = [];
var modifier;

window.addEventListener("load", function(){
  audioElement = document.querySelector("#audio");
})

function init(mod) {
  log("Initializing")
  modifier = mod;
  pc = new RTCPeerConnection(null, null);
  
  $.get("php/god"+modifier+"_b.php?foo=wait");

  pc.onicecandidate = onIceCandidate;
  pc.ondatachannel = onDataChannel;
  pc.onaddstream = function(event) {
    log("Received audio stream from God");
    attachMediaStream(audioElement, event.stream);
  };
  $.get("php/god"+modifier+"_desc.txt", function(data){receiveOffer(new RTCSessionDescription(JSON.parse(data)))});
}

function tryGet() {
  $.get("php/god"+modifier+"_b_desc.txt", function(data){
      if(data === "wait"){
        log("waiting for God");
        setTimeout(tryGet, 5000);
      } else {
        setCandidates(JSON.parse(data));
      }
    });
}

function receiveOffer(offerSdp) {
  log("Offer received from God");

  pc.setRemoteDescription(offerSdp);

  getUserMedia({
    audio: true
  }, function(stream) {
    log('getUserMedia');
    pc.addStream(stream);
    pc.createAnswer(onDescription, function(erro) {
            log("Error creating answer: " + erro);
        }, mediaConstraints);

  }, function(erro) {
    log("Error creating audio stream: " + erro);
  });
}

function onDataChannel(event) {
  channel = event.channel;
  log("Data channel obtained from God");
  channel.onmessage = onMessage;
  channel.onopen = onChannelStateChange;
  channel.onclose = onChannelStateChange;
}

function setCandidate(candidateJson) {
  var candidate = JSON.parse(candidateJson);
  pc.addIceCandidate(candidate);
}

function onIceCandidate(event) {
  if (event.candidate) {
      iceCandidates.push(event.candidate);
  }
}

function onChannelStateChange(event) {
  if (event.type == "open") {
      log("CONNECTION ESTABLISHED: now use channel.send('message') on console to send messages");
  }
}

function onDescription(desc) {
  pc.setLocalDescription(desc);
  log("Answer created and set as peer connection local description.");
  log("Send answer to God");
  var descr = JSON.stringify(desc);
  $.get("php/mortal"+modifier+".php?foo="+descr);
  if (webrtcDetectedBrowser == "chrome") {
      log("Receiving ice candidates to God");
      tryGet();
  }
}

function setCandidates(candidates) {
  for (var i = 0; i < candidates.length; i++) {
      pc.addIceCandidate(new RTCIceCandidate(candidates[i]));
  }
  log("Added ICE candidates from God");
  if (webrtcDetectedBrowser == "chrome") {
      log("Send ice candidates to God");
      $.get("php/mortal"+modifier+"_b.php?foo="+JSON.stringify(iceCandidates));
  }
}

function close() {
  log("close");
  channel.close();
  pc.close();
}

function setCallbackOnMessage(fun) {
  callbackOnMessage = fun;
}

function onMessage(event) {
  callbackOnMessage(event);
}

function log(message) {
  console.log(message);
}
