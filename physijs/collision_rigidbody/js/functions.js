/*

découpage du fichier colonnes en 1 colonne sur le quel une collision boite est mise 
puis le plafond qui lui aussi est une boite de collision.

deplacement de la cam avec physijs

*/









function initPhysijs(){

	Physijs.scripts.worker = './lib/physijs_worker.js';
	Physijs.scripts.ammo = 'ammo.js';
	
	//sphere_geometry = new THREE.SphereGeometry(25, 8, 8 ),
	//sphereBody = new Physijs.SphereMesh(sphere_geometry,app.mat.red(),0,{ restitution: Math.random() * 1.5 });
	//sphereBody.position.set(0,-100,100);
	
	
	
}

function joueur(){

	ground_material = Physijs.createMaterial(
				app.mat.red(),
				0, // high friction
				0 // low restitution
			);
			
	boite = new Physijs.SphereMesh(
				new THREE.SphereGeometry(10, 18, 18 ),
				ground_material,
				undefined // mass undefined
			);
			scene.add( boite);
			boite.name = "boite";
			boite.position.set(0,25,-50);
			boite.__dirtyPosition = true;
			
}


function sol(){

	ground_material = Physijs.createMaterial(
				app.mat.green(),
				0, // high friction
				0 // low restitution
			);
			
	ground = new Physijs.BoxMesh(
				new THREE.BoxGeometry(1000, 1, 1000),
				ground_material,
				0 // mass
			);
			ground.receiveShadow = true;
			scene.add( ground);
			ground.position.set(0,0,0);
			ground.__dirtyPosition = true;
			
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
 * @param threeVec3 : Vec3 (Three.js)
 * @brief Convert THREE.Vector3() to CANNON.Vec3()
 */
function ThreeVec3TOcannonVec3(threeVec3){
	return new CANNON.Vec3(threeVec3.x, threeVec3.y, threeVec3.z);
}


//function HardCollide(vertices, faces, arg_dimension, arg_position, arg_name){
function HardCollide(geometry, arg_dimension, arg_position, arg_name){

         
	var geometry = geometry;
	//var verts = vertices;
	//var faces = faces;
	var pos = arg_position;

	
	var vertices = [];
	var faces = [];
	var normals = [];
	
	for(var i = 0; i < geometry.vertices.length; i++){
		vertices[i] = ThreeVec3TOcannonVec3(geometry.vertices[i]);
		//vertices[i] = ThreeVec3TOcannonVec3(geometry.vertices[i]).mult(10);
	}
	
	for(var i = 0; i < geometry.faces.length; i++){
		faces[i] = ThreeVec3TOcannonVec3(geometry.faces[i]);
		//faces[i] = ThreeVec3TOcannonVec3(geometry.faces[i]).mult(10);
	}

	
	var ShapeCollide = new CANNON.ConvexPolyhedron(vertices, faces, normals);
	
	var offset = new CANNON.Vec3(0,0,0);
	
	//compound.addChild(ShapeCollide,offset);

	
	var ShapeBody = new CANNON.RigidBody(0,ShapeCollide);
	
	ShapeBody.name = arg_name;
	//plateformeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
	
	ShapeBody.position.set(pos[0],pos[1],pos[2]);
	
	world.add(ShapeBody);
	
	
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
		
		var loader = new THREE.JSONLoader( manager );
	
		
		var d = loader.load(name,function (geometry,materials){
			
			var geometry = geometry;
		
			var name = elem.name;//name
			var pos = elem.position;//position
			var rot = elem.rotation;//rotation
			var sca = elem.scale;//rotation
			
			var collisionType = elem.collisionType;//collision
			var vertices = vertices;//vertices
			var faces = elem.faces;//faces
			
			var object = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials)); 
			
			/*
			ground_material = Physijs.createMaterial(
				new THREE.MeshFaceMaterial(materials),
				.8, // high friction
				.4 // low restitution
			);
			
			object = new Physijs.ConvexMesh(geometry,
				ground_material,
				0 // mass
			);
			*/
			
			object.name = name;
			
			object.position.set(pos[0],pos[1],pos[2]);
			ground.__dirtyPosition = true;
			object.rotation.set(rot[0],rot[1],rot[2]);
			ground.__dirtyRotation = true;
			
			scene.add(object);
			
			objTOrescale = scene.getObjectByName(object.name);
			
			objTOrescale.scale.set(sca[0],sca[1],sca[2]);

			//ne fonctionne pas car :
			//var vertices = vertices;//vertices
			//var faces = elem.faces;//faces
			//ne recupere pas les info dans le bon format;
			
			//il y a array dans array, au lieux d'une suite comme dans colonnes.js

			//physics
			switch(collisionType) {
				case "Hard":
						//HardCollide(vertices, faces, sca, pos, name);
						//HardCollide(geometry, sca, pos, name);
						//objectPhysic.position.set(pos[0],pos[1],pos[2]);
						//objectPhysic.quaternion.set(rot[0],rot[1],rot[2]);
						//world.add(objectPhysic);
					break;
					
				case "Box":
					break;
					
				case "Sphere":
					break;
					
				case "none":
					break;
					
				default:
					break;
			}

			
			
			
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