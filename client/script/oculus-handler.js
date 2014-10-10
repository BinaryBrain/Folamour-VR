// rotate a THREE.js object based on the orientation of the Oculus Rift

var bridge = new OculusBridge({
	"onOrientationUpdate" : function(quatValues) {
		// giantSquid.quaternion.set(quatValues.x, quatValues.y, quatValues.z, quatValues.w); // This comes from the doc
	}
});

bridge.connect();