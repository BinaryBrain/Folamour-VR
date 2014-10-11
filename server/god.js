var channel;
var channel2;
var pc;
var pc2;
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
	init()
})

function init() {
  addStep("GOD");

  pc = new RTCPeerConnection(null, null);
  pc.onicecandidate = onIceCandidate;
  
  pc2 = new RTCPeerConnection(null, null);
  pc2.onicecandidate = onIceCandidate2;
  
  createChannels();

  $.get("mortal.php?foo=wait");
  $.get("mortal2.php?foo=wait");
  
	getUserMedia({
		audio: true
		//,fake: true // fake audio
	}, function(stream) {
		console.log('getUserMedia');
		pc.addStream(stream);
    pc2.addStream(stream);
		// local sound
		// attachMediaStream(audioElement, stream);
		pc.createOffer(onDescription, function(erro) {
            addStep("Error creating offer: " + erro);
        }, mediaConstraints);
		pc2.createOffer(onDescription2, function(erro) {
            addStep("Error creating offer: " + erro);
        }, mediaConstraints);
	}, function(erro) {
		addStep("Error obtaining fake audio stream:<br/>" + JSON.stringify(erro));
	});
	
	pc.onaddstream = function(event) {
		attachMediaStream(audioElement, event.stream);
	};
  pc2.onaddstream = function(event) {
		attachMediaStream(audioElement2, event.stream);
	};
  
  tryGet();
  tryGet2();
}

function tryGet() {
  $.get("mortal_desc.txt", function(data){
      if(data === "wait"){
        console.log("waiting");
        setTimeout(tryGet, 5000);
      } else {
        setRemoteDescription(new RTCSessionDescription(JSON.parse(data)))
      }
    });
}

function tryGet2() {
  $.get("mortal2_desc.txt", function(data){
      if(data === "wait"){
        console.log("waiting2");
        setTimeout(tryGet2, 5000);
      } else {
        setRemoteDescription2(new RTCSessionDescription(JSON.parse(data)))
      }
    });
}

function onIceCandidate(event) {
  //console.log("onIceCandidate");
  if (event.candidate) {
      iceCandidates.push(event.candidate);
  }
}

function onIceCandidate2(event) {
  //console.log("onIceCandidate");
  if (event.candidate) {
      iceCandidates2.push(event.candidate);
  }
}

function createChannels() {
  channel = pc.createDataChannel('RTCDataChannel', {
      reliable: false
  });
  addStep("DataChannel created");
  channel.onmessage = onMessage;
  channel.onopen = onChannelStateChange;
  channel.onclose = onChannelStateChange;
  
  channel2 = pc2.createDataChannel('RTCDataChannel', {
      reliable: false
  });
  addStep("DataChannel2 created");
  channel2.onmessage = onMessage;
  channel2.onopen = onChannelStateChange2;
  channel2.onclose = onChannelStateChange2;
}

// TODO: setCandidates2?
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

function onChannelStateChange2(event) {
  if (event.type == "open") {
      addStep("CONNECTION ESTABLISHED: now use channel2.send('message') on console to send messages");
  }
}

function onDescription(desc) {
  addStep("Offer created and set as peer connection local description");
  pc.setLocalDescription(desc);

  addStep("Send offer to answerer.");
	var descr = JSON.stringify(desc)
	$.get("god.php?foo="+descr)
  //addStep('receiveOffer(new RTCSessionDescription(JSON.parse(\'' + JSON.stringify(desc).replace(/\\/g, "\\\\") + '\')));')
}

function onDescription2(desc) {
  addStep("Offer created and set as peer connection local description2");
  pc2.setLocalDescription(desc);

  addStep("Send offer to answerer2.");
	var descr = JSON.stringify(desc)
	$.get("god2.php?foo="+descr)
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

function setRemoteDescription2(desc) {
  pc2.setRemoteDescription(desc);
  addStep("Answer received and set as remote description2");
  if (webrtcDetectedBrowser == "chrome") {
      addStep("Send ice candidates to answerer. Copy & Paste the next code on the answerer console:");
      addStep("setCandidates(JSON.parse('" + JSON.stringify(iceCandidates).replace(/\\/g, "\\\\") + "'));")
  }
}

function close() {
  console.log("close");
  channel.close();
  pc.close();
  channel2.close();
  pc2.close();
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
