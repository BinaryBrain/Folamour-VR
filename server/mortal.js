var channel;
var pc;
var mediaConstraints = {
    optional: [],
    mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: false
    }
};

var iceCandidates = [];
var audioElement = null;

window.addEventListener("load", function(){
	audioElement = document.querySelector("#audio");
	init()
})

function init() {
  addStep("MORTAL1");

  pc = new RTCPeerConnection(null, null);
  pc.onicecandidate = onIceCandidate;

  createChannel();

  $.get("god.php?foo=wait");
  
	getUserMedia({
		audio: true,
		fake: true // fake audio
	}, function(stream) {
		console.log('getUserMedia');
		pc.addStream(stream);
		// local sound
		// attachMediaStream(audioElement, stream);
		pc.createOffer(onDescription, function(erro) {
            addStep("Error creating offer: " + erro);
        }, mediaConstraints);

	}, function(erro) {
		addStep("Error obtaining fake audio stream:<br/>" + JSON.stringify(erro));
	});
	
	pc.onaddstream = function(event) {
		attachMediaStream(audioElement, event.stream);
	};
  
  tryGet();
}

function tryGet() {
  $.get("god_desc.txt", function(data){
      if(data === "wait"){
        console.log("waiting");
        setTimeout(tryGet, 2000);
      } else {
        setRemoteDescription(new RTCSessionDescription(JSON.parse(data)))
      }
    });
}

function onIceCandidate(event) {
  //console.log("onIceCandidate");
  if (event.candidate) {
      iceCandidates.push(event.candidate);
  }
}

function createChannel() {
  channel = pc.createDataChannel('RTCDataChannel', {
      reliable: false
  });
  addStep("DataChannel created");
  channel.onmessage = onMessage;
  channel.onopen = onChannelStateChange;
  channel.onclose = onChannelStateChange;
}

function setCandidates(candidates) {
  for (var i = 0; i < candidates.length; i++) {
      pc.addIceCandidate(new RTCIceCandidate(candidates[i]));
  }
  addStep("Added ICE candidates from answerer");
}

function onChannelStateChange(event) {
  if (event.type == "open") {
      addStep("CONNECTION ESTABLISHED: now use channel.send('message') on console to send messages");
  }
}

function onDescription(desc) {
  addStep("Offer created and set as peer connection local description");
  pc.setLocalDescription(desc);

  addStep("Send offer to answerer.");
	var descr = JSON.stringify(desc)
	$.get("mortal.php?foo="+descr)
  //addStep('receiveOffer(new RTCSessionDescription(JSON.parse(\'' + JSON.stringify(desc).replace(/\\/g, "\\\\") + '\')));')
}

function setRemoteDescription(desc) {
  pc.setRemoteDescription(desc);
  addStep("Answer received and set as remote description");
  if (webrtcDetectedBrowser == "chrome") {
      addStep("Send ice candidates to answerer. Copy & Paste the next code on the answerer console:");
      addStep("setCandidates(JSON.parse('" + JSON.stringify(iceCandidates).replace(/\\/g, "\\\\") + "'));")
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
