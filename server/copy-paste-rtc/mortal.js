var channel;
var pc;
var mediaConstraints = {
    optional: [],
    mandatory: {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false
    }
};

var iceCandidates = [];

function init() {
    addStep("OFFERER");

    pc = new RTCPeerConnection([], {});
    pc.onicecandidate = onIceCandidate;

    createChannel();
    if (webrtcDetectedBrowser == "chrome") {
        pc.createOffer(onDescription, onDescription, mediaConstraints);
    }
    else {
        getUserMedia({
            audio: true,
            fake: true
        }, function(stream) {
            //console.log('getUserMedia');
            pc.addStream(stream);
            pc.createOffer(onDescription, onDescription, mediaConstraints);

        }, function(erro) {
            addStep("Error obtaining fake audio stream:<br/>" + JSON.stringify(erro));
        });
    }
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

    addStep("Send offer to answerer. Copy & Paste the next code on the answerer console:");
    addStep('receiveOffer(new RTCSessionDescription(JSON.parse(\'' + JSON.stringify(desc).replace(/\\/g, "\\\\") + '\')));')
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
