function initCannon(){
	// Setup our world
	world = new CANNON.World();
	world.quatNormalizeSkip = 0;
	world.quatNormalizeFast = false;

	var solver = new CANNON.GSSolver();

	world.defaultContactMaterial.contactEquationStiffness = 1e9;
	world.defaultContactMaterial.contactEquationRegularizationTime = 4;

	solver.iterations = 7;
	solver.tolerance = 0.1;
	var split = true;
	if(split){
		world.solver = new CANNON.SplitSolver(solver);
	}else{
		world.solver = solver;
	}

	world.gravity.set(0,-970,0);
	world.broadphase = new CANNON.NaiveBroadphase();

	// Create a slippery material (friction coefficient = 0.0)
	physicsMaterial = new CANNON.Material("slipperyMaterial");
	var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
															physicsMaterial,
															0.9, // friction coefficient
															0.1  // restitution
															);
	// We must add the contact materials to the world
	world.addContactMaterial(physicsContactMaterial);
	
	// Create a sphere
	var mass = 10 * 100, radius = 50;
	sphereShape = new CANNON.Sphere(radius);
	sphereBody = new CANNON.RigidBody(mass,sphereShape,physicsMaterial);
	sphereBody.position.set(0,50,10);
	sphereBody.linearDamping = 0.1;
	world.add(sphereBody);

	
	// Create a plane
	var groundShape = new CANNON.Plane();
//	var groundShape = new CANNON.Box(new CANNON.Vec3(10, 10, 10),true);
	var groundBody = new CANNON.RigidBody(0,groundShape,physicsMaterial);
	groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
	world.add(groundBody);
}

/**
 * @param arg_name : String (Cannon or Three.js)
 * @brief Delete object with collision and display
 */
function removeObject(arg_name){

	var name = arg_name;
	
	var cannon_object = world.getObjectByName(name);
	var three_object = scene.getObjectByName(name);
	
	if(cannon_object && three_object){
		world.remove(cannon_object)
		scene.remove(three_object);
	}

}

/**
 * @param arg_dimension : Vec3 
 * @param arg_position : Vec3
 * @param aarg_name : String
 * @brief Create box with name, dimension, position
 */
function boxCollide(arg_dimension,arg_position, arg_name){

	var position = arg_position;
	var dimension = arg_dimension;
	
	var plateformeShape = new CANNON.Box(new CANNON.Vec3(dimension.x, dimension.y, dimension.z));
	var plateformeBody = new CANNON.RigidBody(0,plateformeShape,physicsMaterial);
	plateformeBody.name = arg_name;
	//plateformeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
	
	plateformeBody.position.set(position.x,position.y,position.z);
	world.add(plateformeBody);
	
	var currentMaterial = new THREE.MeshLambertMaterial({ color: "red", wireframe:false });
	
	var box_geometry = new THREE.BoxGeometry(  dimension.x*2, dimension.y*2, dimension.z*2 );
	
	mesh = new THREE.Mesh( box_geometry, currentMaterial);
	mesh.position.set( position.x, position.y, position.z);
	mesh.name = arg_name;
	scene.add(mesh);
}

/**
 * @brief If we can block cursor for movement type FPS
 */
function activePointerLock(){

	if(app.havePointerLock){

		var element = document.body;
			var pointerlockchange = function (event){

				if(document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element){
					controls.enabled = true;
				}else{
					controls.enabled = false;
				}
			}
		var pointerlockerror = function (event){
			//nothing
		}

		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

		window.addEventListener( 'click', function ( event ) {

			// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
			element.requestPointerLock();
		}, false );
		
		return true;
		
	}else{
		instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
		return false;
	}
}


//todo
function load_all_files(data){

	data.object.forEach(function(elem){
	
		var name = "data/models/" + elem.name + ".js";//file
		
		console.log(name);
		
		var loader = new THREE.JSONLoader( manager );
		loader.load(name,function (geometry,materials){						
			
			
			var name = elem.name;//name
			var pos = elem.position;//position
			var rot = elem.rotation;//rotation
			var sca = elem.scale;//rotation
			
			var object = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials)); 
			
			object.name = name;
			
			object.position.set(pos[0],pos[1],pos[2]);
			object.rotation.set(rot[0],rot[1],rot[2]);
			
			scene.add(object);
			
			objTOrescale = scene.getObjectByName(object.name);
			
			objTOrescale.scale.set(sca[0],sca[1],sca[2]);
			
		},"data/textures/");
	});
}

/**
 * @brief Resize in realtime canvas for ratio image
 */
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

/**
 * @brief View in console debug
 */
function manager(){
	new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};
}

/**
 * @brief Timer in index.html
 */
function changeTime() {
    var timeSplited = app.time.split(':');
    var hour = timeSplited[0];
    var minute = timeSplited[1];
    var second = timeSplited[2];
    second++;
    if(second==60) {
        second = '0';
        minute++;
        if(minute == 60){
            minute = '0';
            hour++;
        }
    }
	hour = '0'+hour;
	hour = hour.toString().substr(-2, 2);
	minute = '0'+minute;
	minute = minute.toString().substr(-2, 2);
	second = '0'+second;
	second = second.toString().substr(-2, 2);
    app.time = hour+':'+minute+':'+second;
    document.getElementById('time').innerHTML = app.time;
}


///////////////////////////////////
//OTHER unused
/*

function collision(box1, box2){
	if((box2.position.x >= box1.position.x + box1.geometry.width)	// trop à droite
	|| (box2.position.x + box2.geometry.width <= box1.position.x)	// trop à gauche
	|| (box2.position.y >= box1.position.y + box1.geometry.height)	// trop en bas
	|| (box2.position.y + box2.geometry.height <= box1.position.y)  // trop en haut 
	|| (box2.position.z >= box1.position.z + box1.geometry.depth)	// trop derrière
	|| (box2.position.z + box2.geometry.depth <= box1.position.z)
	){	// trop devant
		return false; 
	}else{
		return true; 
	}
}

function boundingBox(object,name) {
	
	object.geometry.computeBoundingBox();	//calcul la bounding box
	
	box = object.geometry.boundingBox;	//affectation de la bounding box à box
	
	var scale = 1.05;	//Agrandissement de la bounding box pour etre visible
	
	var dlength = scale * (box.max.x - box.min.x);	//calcul de la longeur
	var height = scale * (box.max.y - box.min.y);	//calcul de la hauteur
	var depth =  scale * (box.max.z - box.min.z);	//calcul de la profondeur

	var boundingBoxGeometry = new THREE.BoxGeometry( dlength, height, depth );
	var boundingBoxMesh = new THREE.Mesh( boundingBoxGeometry, app.mat.wireframe());
	
	boundingBoxMesh.position.set(object.position.x,object.position.y,object.position.z);
	boundingBoxMesh.rotation.set(object.rotation.x,object.rotation.y,object.rotation.z);
	scene.add( boundingBoxMesh );
}

function create_vehicule(x,y,z,mat){
		
	mat_vehicule = mat || app.mat.checkboard(check);
	grp_vehicule = new THREE.Object3D();//create an empty container

	geo_vehicule = new THREE.BoxGeometry(50, 50, 100);
	mesh_vehicule = new THREE.Mesh(geo_vehicule, mat_vehicule);
	grp_vehicule.add(mesh_vehicule);
	
	// zone
	
	zone_porte = new THREE.BoxGeometry(25, 50, 25);
	porte_G = new THREE.Mesh(zone_porte, app.mat.wireframe());
	porte_D = new THREE.Mesh(zone_porte, app.mat.wireframe());
	grp_vehicule.add(porte_G);
	grp_vehicule.add(porte_D);
	porte_G.position.set(-35,0,11);
	porte_D.position.set(35,0,11);
		
	
	grp_vehicule.position.set(x,y,z);
	
	scene.add(grp_vehicule);
	
	return grp_vehicule;
}


function rayon(){
	
	var ray = new THREE.Ray(
		camera.position,
		vector.subSelf(camera.position).normalize()
	);

	var intersects = ray.intersectObjects(app.objectsCollider);

	
}


*/