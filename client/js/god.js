var channel;
var channel2;
var pc;
var pc2;

var callbackOnMessage;

var mediaConstraints = {
    optional: [],
    mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: false
    }
};

var iceCandidates = [];
var iceCandidates2 = [];
var audioElement = null;
var audioElement2 = null;

window.addEventListener("load", function(){
  audioElement = document.querySelector("#audio");
  audioElement2 = document.querySelector("#audio2");
})

function sendInfo(data) {
  channel.send(data);
  channel2.send(data);
}

function init() {
  log("GOD");

  pc = new RTCPeerConnection(null, null);
  pc.onicecandidate = onIceCandidate;
  
  pc2 = new RTCPeerConnection(null, null);
  pc2.onicecandidate = onIceCandidate2;
  
  createChannels();

  $.get("php/mortal.php?foo=wait");
  $.get("php/mortal2.php?foo=wait");
  $.get("php/mortal_b.php?foo=wait");
  $.get("php/mortal2_b.php?foo=wait");
  
  getUserMedia({
    audio: true
    //,fake: true // fake audio
  }, function(stream) {
    log('getUserMedia');
    pc.addStream(stream);
    pc2.addStream(stream);
    // local sound
    // attachMediaStream(audioElement, stream);
    pc.createOffer(onDescription, function(erro) {
            log("Error creating offer: " + erro);
        }, mediaConstraints);
    pc2.createOffer(onDescription2, function(erro) {
            log("Error creating offer: " + erro);
        }, mediaConstraints);
  }, function(erro) {
    log("Error obtaining fake audio stream:<br/>" + JSON.stringify(erro));
  });
  
  pc.onaddstream = function(event) {
    log("Received audio stream");
    attachMediaStream(audioElement, event.stream);
  };
  pc2.onaddstream = function(event) {
    log("Received audio stream2");
    attachMediaStream(audioElement2, event.stream);
  };
  
  tryGet();
  tryGet2();
}

function tryGet() {
  $.get("php/mortal_desc.txt", function(data){
      if(data === "wait"){
        log("waiting");
        setTimeout(tryGet, 5000);
      } else {
        setRemoteDescription(new RTCSessionDescription(JSON.parse(data)));
      }
    });
}

function tryGet2() {
  $.get("php/mortal2_desc.txt", function(data){
      if(data === "wait"){
        log("waiting2");
        setTimeout(tryGet2, 5000);
      } else {
        setRemoteDescription2(new RTCSessionDescription(JSON.parse(data)));
      }
    });
}

function tryGetB() {
  $.get("php/mortal_b_desc.txt", function(data){
      if(data === "wait"){
        log("waitingb");
        setTimeout(tryGetB, 5000);
      } else {
        setCandidates(JSON.parse(data));
      }
    });
}

function tryGetB2() {
  $.get("php/mortal2_b_desc.txt", function(data){
      if(data === "wait"){
        log("waiting2b");
        setTimeout(tryGetB2, 5000);
      } else {
        setCandidates2(JSON.parse(data));
      }
    });
}

function onIceCandidate(event) {
  //log("onIceCandidate");
  if (event.candidate) {
      iceCandidates.push(event.candidate);
  }
}

function onIceCandidate2(event) {
  //log("onIceCandidate");
  if (event.candidate) {
      iceCandidates2.push(event.candidate);
  }
}

function createChannels() {
  channel = pc.createDataChannel('RTCDataChannel', {
      reliable: false
  });
  log("DataChannel created");
  channel.onmessage = onMessage;
  channel.onopen = onChannelStateChange;
  channel.onclose = onChannelStateChange;
  
  channel2 = pc2.createDataChannel('RTCDataChannel', {
      reliable: false
  });
  log("DataChannel2 created");
  channel2.onmessage = onMessage;
  channel2.onopen = onChannelStateChange2;
  channel2.onclose = onChannelStateChange2;
}

function setCandidates(candidates) {
  for (var i = 0; i < candidates.length; i++) {
      pc.addIceCandidate(new RTCIceCandidate(candidates[i]));
  }
  log("Added ICE candidates from answerer");
}

function setCandidates2(candidates) {
  for (var i = 0; i < candidates.length; i++) {
      pc2.addIceCandidate(new RTCIceCandidate(candidates[i]));
  }
  log("Added ICE candidates from answerer");
}

function onChannelStateChange(event) {
  if (event.type == "open") {
      log("CONNECTION ESTABLISHED: now use channel.send('message') on console to send messages");
      log("Connection established with mortal");
  }
}

function onChannelStateChange2(event) {
  if (event.type == "open") {
      log("CONNECTION ESTABLISHED: now use channel2.send('message') on console to send messages");
      log("Connection established with mortal2");
  }
}

function onDescription(desc) {
  log("Offer created and set as peer connection local description");
  pc.setLocalDescription(desc);

  log("Send offer to answerer.");
  var descr = JSON.stringify(desc)
  $.get("php/god.php?foo="+descr)
  //log('receiveOffer(new RTCSessionDescription(JSON.parse(\'' + JSON.stringify(desc).replace(/\\/g, "\\\\") + '\')));')
}

function onDescription2(desc) {
  log("Offer created and set as peer connection local description2");
  pc2.setLocalDescription(desc);

  log("Send offer to answerer2.");
  var descr = JSON.stringify(desc)
  $.get("php/god2.php?foo="+descr)
  //log('receiveOffer(new RTCSessionDescription(JSON.parse(\'' + JSON.stringify(desc).replace(/\\/g, "\\\\") + '\')));')
}

function setRemoteDescription(desc) {
  pc.setRemoteDescription(desc);
  log("Answer received and set as remote description");
  if (webrtcDetectedBrowser == "chrome") {
      log("Send ice candidates to answerer.");
      $.get("php/god_b.php?foo="+JSON.stringify(iceCandidates))
      tryGetB();
  }
}

function setRemoteDescription2(desc) {
  pc2.setRemoteDescription(desc);
  log("Answer received and set as remote description2");
  if (webrtcDetectedBrowser == "chrome") {
      log("Send ice candidates to answerer2.");
      $.get("php/god2_b.php?foo="+JSON.stringify(iceCandidates))
      tryGetB2();
  }
}

function close() {
  log("close");
  channel.close();
  pc.close();
  channel2.close();
  pc2.close();
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
