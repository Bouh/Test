app.log_console === true ? console.log("Open -- stage.js") : false ;

app.stage = function(){
	
	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light );

	var light = new THREE.PointLight( "white",1,1000);
	light.position.set(10,0,0);
	scene.add( light );
	
	
	app.element = document.getElementById("mycanvas");

	app.element.requestPointerLock = app.element.requestPointerLock || app.element.mozRequestPointerLock || app.element.webkitRequestPointerLock;
	app.element.requestPointerLock();

	document.exitPointerLock = document.exitPointerLock ||	document.mozExitPointerLock ||	document.webkitExitPointerLock;
	document.exitPointerLock();
	
	
	var currentMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe:true });
	var sphere_geometry = new THREE.SphereGeometry( 50, 8, 8);
	mesh = new THREE.Mesh( sphere_geometry, currentMaterial );
	mesh.name = "sphereControls";
	scene.add(mesh);
	
	
	boxCollide(new CANNON.Vec3(100, 10, 100), new CANNON.Vec3(500, 10, 100), "plateforme_remove");
	
	boxCollide(new CANNON.Vec3(100, 10, 100), new CANNON.Vec3(5, 35, 150), "plateforme_1");
	boxCollide(new CANNON.Vec3(100, 10, 100), new CANNON.Vec3(5, 60, 450), "plateforme_2");
	
};
