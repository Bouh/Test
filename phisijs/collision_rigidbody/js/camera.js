//ok
app.log_console === true ? console.log("Open -- camera.js") : false ;

app.camera = function(){

		app.log_console === true ? console.log("app.camera") : false ;
		
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		
		controls = new THREE.PointerLockControlsCannon(camera,scene.getObjectByName("boite"));
		scene.add( controls.getObject() );

};


