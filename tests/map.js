// don't forget the slash at the end!
var modelPath = '../assets/models/';
var texturePath = '../assets/textures/';

var map = [
	{l: 100, h:200, d:2, x: -5, y: 1, z: 20, tex: 1}
];

var islands = [
	{l: 400, h: 1, d: 1200, x: 80, y: -1, z: 80, tex: 1}, //W island
	{l: 400, h: 1, d: 1200, x: -520, y: -1, z: 80, tex: 1}, //E island
	{l: 200, h: 1, d: 80, x: -320, y: -1, z: -200, tex: 1}, //W-E bridge N
	{l: 200, h: 1, d: 80, x: -320, y: -1, z: -960, tex: 1}, //W-E bridge S
	{l: 80, h: 1, d: 200, x: -380, y: -1, z: -1040, tex: 1}, // S bridge
	{l: 800, h: 1, d: 200, x: -20, y: -1, z: -1240, tex: 1} // S island
];

var loader = new THREE.JSONLoader();

function loadSkybox(cb) {
	loader.load(modelPath+'skybox.js', function (geometry) {
		var mesh = new THREE.Mesh(
			geometry,
			new THREE.MeshLambertMaterial({
				map: THREE.ImageUtils.loadTexture(texturePath+'skybox.jpg'),
				ambient: 0xffffff
			})
		);

		if(cb) {
			cb(mesh);
		}
	});
}

function loadEntity(model, texture, cb) {
	loader.load(modelPath+model, function (geometry) {
		var mesh = new Physijs.ConcaveMesh(
			geometry,
			new THREE.MeshLambertMaterial({
				map: THREE.ImageUtils.loadTexture(texturePath+texture),
				ambient: 0xffffff
			})
		);

		cb(mesh);
	});
}

function loadMissile(cb) {
	loadEntity('missile.js', 'missile.jpg', function (mesh) {
		if(cb) {
			cb(mesh);
		}
	});
}
