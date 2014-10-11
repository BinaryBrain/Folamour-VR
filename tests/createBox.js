//Spawn a box randomly
function createBox(scene)
{
    //Material
    var material = Physijs.createMaterial(
	new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( 'images/plywood.jpg' ) }),
	    .6, // medium friction
	    .3 // low restitution
    );
    material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
    material.map.repeat.set(0.5,0.5);
    //Mesh
    var box_geometry = new THREE.CubeGeometry( 4, 4, 4 );
    var box = new Physijs.BoxMesh(
        box_geometry,
        material
    );
    //Collisions handling
    var handleCollision = function(collided_with, linearVelocity, angularVelocity) {}
    box.collisions = 0;
    box.position.set(Math.random() * 15 - 7.5,25,Math.random() * 15 - 7.5);           
    box.rotation.set(Math.random() * Math.PI,Math.random() * Math.PI,Math.random() * Math.PI);           
    box.castShadow = true;
    //Listeners
    box.addEventListener('collision', handleCollision);
    //box.addEventListener( 'ready', spawnBox );
    scene.add(box);
    setTimeout(function () { createBox(scene); }, 10000);
}
