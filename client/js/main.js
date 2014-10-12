var missile_mesh;
function main(mode, id) {

    isOculus = mode;
    var cameraHitbox;
    var otherPlayers = {};
    var characters = {};
    var screen=false;

  //Compatibility
  if (navigator.mozGetUserMedia) var nav = "moz";
  else nav = "webkit";

  //Init scene
  initScene = function() {
    //Camera, renderer
    var theta = -1*Math.PI;
    var phi = 0;
    var pressed = {};
    jumpDisabled = false;
    var pressed = {};
      
    //Setup renderer
    var renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Here is the effect for the Oculus Rift
    // worldScale 100 means that 100 Units == 1m
    if(isOculus) {
      effect = new THREE.OculusRiftEffect(renderer, {
        worldScale: 100,
        HMD: {
          hResolution: 1280,
          vResolution: 800,
          hScreenSize: 0.14976,
          vScreenSize: 0.0936,
          interpupillaryDistance: 0.055,
          lensSeparationDistance: 0.065,
          eyeToScreenDistance: 0.041,
          distortionK : [1.0, 0.22, 0.24, 0.0],
          chromaAbParameter: [ 0.996, -0.004, 1.014, 0.0]
        }
      });
      missileSpeed = new THREE.Vector3(0, 0, 0);
      effect.setSize(window.innerWidth, window.innerHeight);
    }

    document.body.appendChild(renderer.domElement);

    //Compteur FPS
    /*render_stats = new Stats();
    render_stats.domElement.style.position = 'absolute';
    render_stats.domElement.style.top = '0px';
    render_stats.domElement.style.zIndex = 100;
    document.body.appendChild(render_stats.domElement);

    physics_stats = new Stats();
    physics_stats.domElement.style.position = 'absolute';
    physics_stats.domElement.style.top = '50px';
    physics_stats.domElement.style.zIndex = 100;
    document.body.appendChild(physics_stats.domElement);*/

    //Physijs scene
    var scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3(0, -500, 0));
    scene.addEventListener(
      'update',
      function() {
        scene.simulate(undefined, 1);
        //physics_stats.update();
      }
    );

    loadSkybox(function (mesh) {
      scene.add(mesh);
    });

    if(id !== 1) {
      loadCharacter(function(mesh){
      mesh.position.y = 7.5;
      mesh.position.x = 25;
      mesh.position.z=	10;
      scene.add(mesh);
      characters.char1=mesh;
    });
    }

    if(id !== 2) {
      loadCharacter(function(mesh){
      mesh.position.y = 7.5;
      mesh.position.x = 35;
      mesh.position.z=	10;
      scene.add(mesh);
      characters  .char2=mesh;
    });
    }

    /*loadCharacter(function(mesh){
      mesh.position.y = 7.5;
      mesh.position.x = 20;
      mesh.position.z =	10;
      scene.add(mesh);
      character=mesh;
    });*/
      createBarrels(scene);

      loadPhysicalObject("dynamite.js","dynamite.jpg",function(mesh){
	mesh.scale.set(2,2,2);
	mesh.position.y = 3;
	mesh.position.x = -25;
	mesh.position.z = -50;
	mesh.mass=0;
	scene.add(mesh);
    });
    //Base de départ
    loadPhysicalObject("flag-base.js","flag-base-green.jpg",function(mesh){
	mesh.scale.set(8,8,8);
	mesh.position.y = 5;
	mesh.position.x = 40;
	mesh.position.z = 40;
	mesh.mass=0;
	scene.add(mesh);
    });
    
    //Base de fin
    loadObject("flag-base.js","flag-base-red.jpg",function(mesh){
      mesh.scale.set(8,8,8);
      mesh.position.y = 5;
      mesh.position.x = -726;
      mesh.position.z = -1317;
      scene.add(mesh);
    });
      //Ponts
      loadObject("bridge.js","wood.jpg",function(mesh){
	  mesh.scale.set(10,5,10);
	  mesh.position.y = 0;
	  mesh.position.x = -425;
	  mesh.position.z = -239;
	  mesh.mass=0;
	  scene.add(mesh);
      });
            loadObject("bridge.js","wood.jpg",function(mesh){
	  mesh.scale.set(20,5,10);
	  mesh.position.y = 0;
	  mesh.position.x = -321;
	  mesh.position.z = -1010;
	  mesh.mass=0;
	  scene.add(mesh);
      });


    loadMissile(function (missile) {
        missile.scale.set(10, 10, 10);
      if(isOculus) {
        missile.position.x = 0;
        missile.position.y = -20;
        missile.position.z = -25;
        missile.quaternion.setFromEuler(new THREE.Euler(Math.PI/8, -Math.PI/2, 0, 'XYZ' ));
        missile.quaternion.normalize();
        camera.add(missile);
        missile_mesh = missile;
      } else {
        missile.position.y = 200;
        missile.position.x = -726;
        missile.position.z = -1317;
        missile.quaternion.setFromEuler(new THREE.Euler(Math.PI, -Math.PI/1.5, 0, 'XYZ' ));
        missile.quaternion.normalize();
        scene.add(missile);
        characters.missile = missile; 
      }
    })

    //A plane, with tiling texture
    /*var texture = THREE.ImageUtils.loadTexture('grass.b.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000),
        new THREE.MeshLambertMaterial({
        map: texture,
        ambient: 0xbbbbbb
        }));
    plane.overdraw = true;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);*/

    //Ground
    /*ground_material = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('grass.jpg')
      }),
      .8, // high friction
      .9
    );*/
    var textures = {1: '../assets/textures/grass.jpg'};
    var ground_material = [];
    for (i in textures) {
      ground_material[i] = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture(textures[i]) } );
      ground_material[i].map.wrapS = ground_material[i].map.wrapT = THREE.RepeatWrapping;
      //ground_material.map.repeat.set(1, 1);
    }
      //ground_material[0]=new THREE.MeshLambertMaterial({color: 0x0000ff, transparent: true, opacity: 0.5});
      ground_material[0]=0;

/*      var xLen = map[0].length;
    var yLen = map[0][0].length;

    var ground = [];
    for (var i = 0; i<map.length; i++) {
      ground[i] = [];
      for (j=0; j<xLen; j++) {
        ground[i][j] = [];
        for (k=0; k<yLen; k++) {
          if (map[i][j][k]) {
            ground[i][j][k] = new Physijs.BoxMesh(
              new THREE.CubeGeometry(5, 5, 5),
              ground_material[map[i][j][k]],
              0 // mass
            );
            ground[i][j][k].position.set(5*(-xLen/2+j), 5*i, 5*(-yLen/2+k));
            scene.add(ground[i][j][k]);
          }
        }
      }
    }*/
    //Wall

    var wall = [];
    for (var i=0; i<map.length; i++) {
      wall[i] = new Physijs.BoxMesh(
        new THREE.CubeGeometry(map[i].l, map[i].h, map[i].d),
        ground_material[map[i].tex],
        0 // mass
      );
      wall[i].position.set(map[i].x - map[i].l/2, -map[i].y + map[i].h/2, map[i].z - map[i].d/2);
      scene.add(wall[i]);
    }

    var ground = [];
    for (var i=0; i<islands.length; i++) {
      ground[i] = new Physijs.BoxMesh(
        new THREE.CubeGeometry(islands[i].l, islands[i].h, islands[i].d),
        ground_material[islands[i].tex],
        0 // mass
      );
      ground[i].position.set(islands[i].x-islands[i].l/2, -islands[i].y + islands[i].h/2, islands[i].z-islands[i].d/2);
      scene.add(ground[i]);
    }

    //Blender model exporter as a js object
    /*var loader = new THREE.JSONLoader();
    loader.load("blender/monkey.js", function(geometry) {
      mesh = new Physijs.ConcaveMesh(
        geometry,
        new THREE.MeshNormalMaterial(),
      0);
      mesh.scale.set(10, 10, 10);
      mesh.position.y = 0;
      mesh.position.x = 0;
      scene.add(mesh);
    });*/

    //Blender model exporter as a js object
    /*var loader = new THREE.JSONLoader();
    loader.load("../assets/models/terrain0.js", function(geometry) {
      mesh = new Physijs.HeightfieldMesh(geometry, new THREE.MeshNormalMaterial());
      mesh.scale.set(10, 10, 10);
      mesh.position.y = 0;
      mesh.position.x = 0;
      scene.add(mesh);
    });*/

    //Some light
    var ambientLight = new THREE.AmbientLight(0xbbbbbb);
    scene.add(ambientLight);

    //Camera
    var ret = initCamera(scene);
    camera = ret.camera;
    cameraHitbox = ret.cameraHitbox;

    camera.lookAt(new THREE.Vector3(
    cameraHitbox.position.x + 10000 * Math.sin(theta),
    cameraHitbox.position.y + 10000 * Math.tan(phi),
    cameraHitbox.position.z + 10000 * Math.cos(theta)));
    camera.updateMatrix();

    if(isOculus) {
        camera.position.y = 200;
        camera.position.x = -726;
        camera.position.z = -1317;
        camera.quaternion.setFromEuler(new THREE.Euler(Math.PI, -Math.PI/1.5, 0, 'XYZ' ));
        camera.quaternion.normalize();
    }else{
        cameraHitbox.position.y = 7.5;
        cameraHitbox.position.x = 25;
        cameraHitbox.position.z=	10;
    }
    
    //Render function
    var render = function() {
      requestAnimationFrame(render);
      
      
      if(id !== 0){
        if(otherPlayers.p0) {
          characters.missile.position.y = otherPlayers.p0.p.y
          characters.missile.position.x = otherPlayers.p0.p.x
          characters.missile.position.z = otherPlayers.p0.p.z
		  characters.missile.quaternion._x = otherPlayers.p0.q._x
		  characters.missile.quaternion._y = otherPlayers.p0.q._y+Math.PI/2;
  		  characters.missile.quaternion._z = otherPlayers.p0.q._z
  		  characters.missile.quaternion._w = otherPlayers.p0.q._w
		  characters.missile.quaternion.normalize();
          var diff = camera.position.distanceTo(otherPlayers.p0.p);
          if(diff < 250) {
			gameOver(function(){
				cameraHitbox.position.y = 7.5;
				cameraHitbox.position.x = 35;
				cameraHitbox.position.z=	10;});
          }
        }
      }

      if(id !== 1){
        if(otherPlayers.p1) {
          characters.char1.position.y = otherPlayers.p1.p.y
          characters.char1.position.x = otherPlayers.p1.p.x
          characters.char1.position.z = otherPlayers.p1.p.z
        }
      }
      if(id !== 2){
        if(otherPlayers.p2) {
          characters.char2.position.y = otherPlayers.p2.p.y
          characters.char2.position.x = otherPlayers.p2.p.x
          characters.char2.position.z = otherPlayers.p2.p.z
        }
      }
      
      var send = {};
	//console.log(id);
      if(id === 0) {
        send.pers = {id: id, p: camera.position, v: missileSpeed, q: camera.quaternion};
      } else {
        send.pers = {id: id, p: cameraHitbox.position, v: cameraHitbox.getLinearVelocity()};
      }
      
      if (otherPlayers.p1) {
        send.p1 = otherPlayers.p1;
      }
      if (otherPlayers.p2) {
        send.p2 = otherPlayers.p2;
      }

      sendInfo(JSON.stringify(send));
      if(isOculus) {
        camera.position.add(missileSpeed);

        // Altitude trop basse
        if(camera.position.y < 0) {
            //crashed = true;
	    gameOver(function(){camera.position.y = 300;});
        }

       // if(crashed) {
        //}

        effect.render( scene, camera );
      } else {
        setSpeed(cameraHitbox, pressed, theta);
        //if (character){
          //character.position.x=cameraHitbox.position.x;
          //character.position.z=cameraHitbox.position.z;
	  
	    //Chute
	    if (cameraHitbox.position.y<0)
	    {
		cameraHitbox.setLinearVelocity(new THREE.Vector3(0,0,0));

		gameOver(function(){
		    cameraHitbox.position.set(5,20,0);
		    cameraHitbox.__dirtyPosition=true;
		});
	    }
<<<<<<< HEAD
		
=======
	  //Victoire
	  var diff = cameraHitbox.position.distanceTo(new THREE.Vector3(-726,5,-1317));
	  if (diff<40)
	  {	     
	      overlayScreen(function(){
		  cameraHitbox.position.set(5,20,0);
		  cameraHitbox.__dirtyPosition=true;
	      }, "victory.png",5);
	  }

>>>>>>> Victory
        renderer.render(scene, camera);
      }
    };

    //createBox(scene);
    scene.simulate();
    render();

      function overlayScreen(callback,image,duration)
      {
	  if(!screen)
	  {
	      screen=true;
	      var text2 = document.createElement('div');
	      text2.style.position = 'absolute';
	      text2.style.width = 100;
	      text2.style.height = 100;
	      text2.innerHTML = "<img src='/assets/textures/"+image+"'>";
	      text2.style.top = 60 + 'px';
	      text2.style.left = 160 + 'px';
	      document.body.appendChild(text2);

	      setTimeout(function(){
		  text2.remove();
		  if(callback)
		  {
		      callback();
		  }
		  screen=false;
	      },duration*1000);
	  }
      }
      function gameOver(callback)
      {
	  overlayScreen(callback,"game-over.png",3);
      }
      
    //Mouse movements
    function onDocumentMouseMove(event) {
      if(!isOculus) {

        //Angles
        theta -= event[nav + 'MovementX'] / window.innerWidth * 10;
        phi -= event[nav + 'MovementY'] / window.innerWidth * 10;
        phi = Math.min(Math.PI / 2, Math.max(-Math.PI / 2, phi));
        //Orient camera
        camera.lookAt(new THREE.Vector3(
          cameraHitbox.position.x + 10000 * Math.sin(theta),
          cameraHitbox.position.y + 10000 * Math.tan(phi),
          cameraHitbox.position.z + 10000 * Math.cos(theta)));
        camera.updateMatrix();
      }
    }

    //Keyboard management
    function onKeydown(event) {
      switch (event.keyCode) {
        case 87: //w
          pressed.w = true;
          break;
        case 83: //s
          pressed.s = true;
          break;
        case 65: //a
          pressed.a = true;
          break;
        case 68: //d
          pressed.d = true;
          break;
        case 32: //jump
          pressed.jump = true;
          break;
      }
      setSpeed(cameraHitbox, pressed, theta);
    }

    function onKeyup(event) {
      switch (event.keyCode) {
        case 87: //w
          pressed.w = false;
          break;
        case 83: //s
          pressed.s = false;
          break;
        case 65: //a
          pressed.a = false;
          break;
        case 68: //d
          pressed.d = false;
          break;
        case 32: //jump
          pressed.jump = false;
          break;
      }
      setSpeed(cameraHitbox, pressed, theta);
    }

    //Binding listeners
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('keydown', onKeydown, false);
    document.addEventListener('keyup', onKeyup, false);
    window.addEventListener('resize', onWindowResize, false);

    //Resize window
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      if(isOculus) {
        effect.setSize(window.innerWidth, window.innerHeight);
      } else {
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    }
  }

  //Initialize scene
  window.onload = initScene;

  //callback called when receiving
  return function(event){
    var ret = JSON.parse(event.data);
    otherPlayers['p'+ret.pers.id] = ret.pers;
    if (ret.p1 && ret.pers.id !== 1) otherPlayers.p1 = ret.p1;
    if (ret.p2 && ret.pers.id !== 2) otherPlayers.p2 = ret.p2;
  };
}

function onOculusOrientationUpdate(q) {
  if (isOculus && camera) {
    camera.quaternion._x = q.x;
    camera.quaternion._y = q.y;
    camera.quaternion._z = q.z;
    camera.quaternion._w = q.w;
    //camera.quaternion.multiplyVector3(THREE.Vector3(1,0,0),-1*missileSpeed);
    missileSpeed = new THREE.Vector3(0, 0, 3).applyQuaternion(camera.quaternion);
    missileSpeed.multiplyScalar(-1);
  } else {
    console.warn("Camera is still not defined.")
  }
}
  
//Helper functions
function normalizePlane(vec) {
  normsq = vec[0] * vec[0] + vec[2] * vec[2];
  return Math.sqrt(normsq);
}
