var channel;
var pc;
var mediaConstraints = {
    optional: [],
    mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: false
    }
};

var audioElement = null;
var iceCandidates = [];

window.addEventListener("load", function(){
  audioElement = document.querySelector("#audio");
  init()
})

function init() {
  addStep("MORTAL");

  pc = new RTCPeerConnection(null, null);
  
  $.get("god_b.php?foo=wait");

  pc.onicecandidate = onIceCandidate;
  pc.ondatachannel = onDataChannel;
  pc.onaddstream = function(event) {
    addStep("Received audio stream from God");
    attachMediaStream(audioElement, event.stream);
  };
  $.get("god_desc.txt", function(data){receiveOffer(new RTCSessionDescription(JSON.parse(data)))});
}

function tryGet() {
  $.get("god_b_desc.txt", function(data){
      if(data === "wait"){
        console.log("waiting for God");
        setTimeout(tryGet, 5000);
      } else {
        setCandidates(JSON.parse(data));
      }
    });
}

function receiveOffer(offerSdp) {
  addStep("Offer received from God");

  pc.setRemoteDescription(offerSdp);

  getUserMedia({
    audio: true
  }, function(stream) {
    console.log('getUserMedia');
    pc.addStream(stream);
    pc.createAnswer(onDescription, function(erro) {
            addStep("Error creating answer: " + erro);
        }, mediaConstraints);

  }, function(erro) {
    addStep("Error creating audio stream: " + erro);
  });
}

function onDataChannel(event) {
  channel = event.channel;
  addStep("Data channel obtained from God");
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
      addStep("CONNECTION ESTABLISHED: now use channel.send('message') on console to send messages");
  }
}

function onDescription(desc) {
  pc.setLocalDescription(desc);
  addStep("Answer created and set as peer connection local description.");
  addStep("Send answer to God");
  var descr = JSON.stringify(desc)
  $.get("mortal.php?foo="+descr)
  if (webrtcDetectedBrowser == "chrome") {
      addStep("Receiving ice candidates to God");
      tryGet();
  }
}

function setCandidates(candidates) {
  for (var i = 0; i < candidates.length; i++) {
      pc.addIceCandidate(new RTCIceCandidate(candidates[i]));
  }
  addStep("Added ICE candidates from God");
  if (webrtcDetectedBrowser == "chrome") {
      addStep("Send ice candidates to God");
      $.get("mortal_b.php?foo="+JSON.stringify(iceCandidates))
  }
}

function close() {
  console.log("close");
  channel.close();
  pc.close();
}

function onMessage(event) {
    addStep('Message received: ' + event.data);
}

function selectText(element) {
  if (document.selection) {
      var range = document.body.createTextRange();
      range.moveToElementText(element);
      range.select();
  }
  else if (window.getSelection) {
      var range = document.createRange();
      range.selectNode(element);
      window.getSelection().addRange(range);
  }
}

function addStep(message) {
  var content = document.getElementById('content');
  var div = document.createElement('div');
  div.setAttribute('class', 'step');
  div.innerHTML = message;
  div.onclick = function() {
      selectText(this);
  };
  content.appendChild(div);
  window.scrollTo(0, document.body.scrollHeight);
}
