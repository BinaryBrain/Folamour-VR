// don't forget the slash at the end!
var modelPath = '../assets/models/';
var texturePath = '../assets/textures/';

var map = [
	{l: 100, h:200, d:2, x: -5, y: 1, z: 20, tex: 1}
];

var islands = [
	{l: 400, h: 1, d: 1200, x: 80, y: -1, z: 80, tex: 1}, //W island
	{l: 400, h: 1, d: 1200, x: -520, y: -1, z: 80, tex: 1}, //E island
	{l: 200, h: 1, d: 80, x: -320, y: -1, z: -200, tex: 0}, //W-E bridge N
	{l: 200, h: 1, d: 80, x: -320, y: -1, z: -960, tex: 0}, //W-E bridge S
	{l: 80, h: 1, d: 200, x: -380, y: -1, z: -1040, tex: 1}, // S bridge
	{l: 800, h: 1, d: 200, x: -20, y: -1, z: -1240, tex: 1} // S island
];

var loader = new THREE.JSONLoader();

function loadObject(model,texture,cb)
{
    loader.load(modelPath+model, function (geometry) {
	var mesh = new THREE.Mesh(
	    geometry,
	    new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture(texturePath+texture),
		ambient: 0xffffff
	    })
	);

	if(cb) {
	    cb(mesh);
	}
    });
}
function loadPhysicalObject(model, texture, cb) {
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
function loadSkybox(cb)
{
    loadObject('skybox.js', 'skybox.jpg', function (mesh) {
	mesh.scale.set(300, 300, 300);
	mesh.position.y = 0;
	mesh.position.x = 0;
	if(cb) {
	    cb(mesh);
	}
	});
}
function loadMissile(cb) {
	loadObject('missile.js', 'missile.jpg', function (mesh) {
		if(cb) {
			cb(mesh);
		}
	});
}
function loadCharacter(cb) {
	loadObject('character.js', 'robot.jpg', function (mesh) {
	    if(cb) {
		mesh.scale.set(5, 5, 5);
		mesh.rotation.y=Math.PI;
		cb(mesh);
		}
	});
}
function createBarrels(scene)
{
    barrels=[{obj:"barrel.js",tex:"barrel.jpg"},{obj:"barrel2.js",tex:"barrel2.jpg"}];

    /*for (var x = 20; x<80; x++) {
	for (var z = 20; z<1440; z++) {
	    if(Math.floor((Math.random() * 100) + 1)==1)
	    {*/
		loadObject("barrel.js","barrel.jpg",function(mesh){
		    mesh.scale.set(3,3,3);
		    mesh.position.y = 2;
		    mesh.position.x = -20;
		    mesh.position.z = -50;
		    //mesh.mass=0;
		    scene.add(mesh);
	/*	});	
	    }
	}*/
		});
    

}
