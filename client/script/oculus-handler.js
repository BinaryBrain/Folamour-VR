// rotate a THREE.js object based on the orientation of the Oculus Rift
var DOMstatus = document.querySelector('#oculus-status')
var oculusPlugged = false;

DOMstatus.classList.add('error')
DOMstatus.innerHTML = 'It seems you didn\'t launched the Oculus Bridge program.'

var bridge = new OculusBridge({
	debug: true,

	onConnect: function () {
		if(!oculusPlugged) {
			DOMstatus.innerHTML = 'Your Oculus Rift seems to be unplugged'
		} else {
			DOMstatus.innerHTML = 'Connected!'
			DOMstatus.classList.remove('error')
		}

		console.log("connected")
	},

	onDisconnect: function () {
		DOMstatus.innerHTML = 'It seems you didn\'t launched the Oculus Bridge program.'
		DOMstatus.classList.add('error')

		console.log("disconnected")
	},
	
	onConfigUpdate: function(config) {
		DOMstatus.innerHTML = 'Connected!'
		DOMstatus.classList.remove('error')
	    
	    console.log("New config:", config)
    },

	onOrientationUpdate: function (quatValues) {
		// giantSquid.quaternion.set(quatValues.x, quatValues.y, quatValues.z, quatValues.w); // This comes from the doc
	}
});

bridge.connect();
