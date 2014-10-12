//Camera initialization
function initCamera(scene)
{
    var camera=new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000000);
    var cameraHitbox = new Physijs.BoxMesh(
        new THREE.CylinderGeometry(2, 2, 12),
        0,
        50 // mass
    );
    cameraHitbox.position.set(0,10,0);
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
//Set camera speed
function setSpeed(cameraHitbox,pressed,theta) {
    var speed = [0,0,0];
    if (pressed.w) {
        speed[0] += Math.sin(theta);
        speed[2] += Math.cos(theta);
    }

    if (pressed.s) {
        speed[0]+=-Math.sin(theta);
        speed[2]+=-Math.cos(theta);
    }

    if (pressed.a) {
        speed[0]+=Math.sin(theta+Math.PI/2);
        speed[2]+=Math.cos(theta+Math.PI/2);
    }

    if (pressed.d) {
        speed[0]+= Math.sin(theta-Math.PI/2);
        speed[2]+= Math.cos(theta-Math.PI/2);
    }

    if (pressed.jump) {
        console.log(jumpDisabled);
        if (Math.abs(cameraHitbox.getLinearVelocity().y) < 0.1 && !jumpDisabled) {
            // we jump and we set a condition to avoid jump spamming
            speed[1]+=100;
            jumpDisabled = true;
            setTimeout(function(){jumpDisabled = false;}, 500);
        }
    }
    
    var norm = normalizePlane(speed);
    cameraHitbox.setLinearVelocity(new THREE.Vector3(
        100*speed[0]/norm,
        speed[1] + cameraHitbox.getLinearVelocity().y,
        100*speed[2]/norm
    ));

    //console.log(cameraHitbox.position);
}

