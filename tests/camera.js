//Camera initialization
function initCamera(scene)
{
    var camera=new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    var cameraHitbox = new Physijs.BoxMesh(
        new THREE.CylinderGeometry(4, 4, 12),
        0,
        50 // mass
    );
    cameraHitbox.position.set(0,57,0);
    cameraHitbox.add(camera);
    scene.add(cameraHitbox);
    //Constraints
    var constraint = new Physijs.DOFConstraint(
        cameraHitbox, // First object to be constrained
        0,
        new THREE.Vector3( 0, 10, 0 ) // point in the scene to apply the constraint
    );
    scene.addConstraint(constraint);
    constraint.setLinearLowerLimit( new THREE.Vector3( -1e30, -1e30, -1e30) ); // sets the lower end of the linear movement along the x, y, and z axes.
    constraint.setLinearUpperLimit( new THREE.Vector3( 1e30, 1e30, 1e30 ) );
    constraint.setAngularLowerLimit( new THREE.Vector3( 0, 0, 0 ) ); // sets the lower end of the angular movement, in radians, along the x, y, and z axes.
    constraint.setAngularUpperLimit( new THREE.Vector3( 0, 0, 0 ) ); // sets the upper end of the angular movement, in radians, along the x, y, and z axes.

    return {camera:camera, cameraHitbox:cameraHitbox};
}

         //camControls.enabled = true;

