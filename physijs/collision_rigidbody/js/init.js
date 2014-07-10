/*
	this = app
	this.camera();  -- from camera.js
	all is Y-UP
*/
console.log("Open -- init.js");

//Listing de toutes les images
var add_images = new Array();

var app = {
	
	time : "0:0:0",
	clock : new THREE.Clock(),
//	delta : app.clock.getDelta(),
	objectsCollider : [],
	cameraIsNotFree : false,
	src_load : 0,
	total_src_toload : 0,
	control_move : null,
	log_console : true,
	keyboard : new THREEx.KeyboardState(),
	havePointerLock : 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document,
	
	

	duff : function() {
	},
	
	start : function() {
		/*
		
		*/
	},
	
	complete : function() {
		if(src_load == total_src_toload){
			//debut du jeu possible.
		}
	},
	
	load_script : function(link,type,noajax) {
		app.total_src_toload ++;
		if(noajax){
			var balise = document.createElement("script");
			balise.rel = type;
			balise.src = link;
			document.head.appendChild(balise);
			app.src_load ++;
		}else{
			var oXmlHttp = new XMLHttpRequest() || new ActiveXObject("MsXml2.XmlHttp");
			oXmlHttp.onreadystatechange  = function(){
				if(oXmlHttp.readyState == 4 ){
					if(oXmlHttp.status == 200 || oXmlHttp.status == 304 ){
						if(typeof oXmlHttp.responseText === "string"){
							app.src_load ++;
							var balise = document.createElement("script");
							balise.rel = type;
							balise.src = link;
							document.head.appendChild(balise);
							app.log_console === true ? console.log("Load OK -- " + link) : false ;
							
						}else{
							app.log_console === true ? console.log("Load FAIL -- " + link) : false ;
						}
						
						//this.log_console === true ? console.log("Load OK -- " + link) : false ;
					}else{
						app.log_console === true ? console.log("Not Found -- " + link) : false ;
					}
				}
			}
			oXmlHttp.open('GET', link, true);
			oXmlHttp.send(null);
		}
	},
	
	
	init_scene : function(){
	
		this.log_console === true ? console.log("app.init_scene") : false ;
		scene = new Physijs.Scene();
		joueur();
		scene.setGravity(new THREE.Vector3( 0, -9.8*100, 0 ));
		this.camera();
		this.render();
	},
	
	animate : function(){
	
		/*
			Delta : For movement
			Time ; For refresh image
		*/
	
		app.delta = app.clock.getDelta();
		requestAnimationFrame(app.animate);
		app.updateStage();
		
		if(controls.enabled){
			scene.setFixedTimeStep(app.delta);
		}
		controls.update(Date.now() - time);

		//scene.getObjectByName("BoxControls").position.set(sphereBody.position.x, sphereBody.position.y, sphereBody.position.z);

		sd =  new THREE.Euler();
	//	sd.setFromQuaternion(sphereBody.quaternion,"XYZ");
		//scene.getObjectByName("BoxControls").rotation.set(sd.x, sd.y, sd.z);
		
		mesh.__dirtyPosition = true;
		
		scene.simulate( undefined, 1 );
		renderer.render(scene, camera);
		document.getElementsByTagName("p")[0].innerHTML = "Delta : 0,01699... /" + app.delta + "<br>Time : 17 / " + (Date.now() - time );
		time = Date.now();
		stats.update();
	},
	
	render : function() {
	
		var WIDTH = window.innerWidth;
		var HEIGHT = window.innerHeight - 2 * 100;
		var SCALE = 1;
		
		//renderer = new THREE.WebGLDeferredRenderer( { width: WIDTH, height: HEIGHT, scale: SCALE, antialias: true, brightness: 2.5 } );
		
		
		renderer = new THREE.WebGLRenderer({antialias:true, canvas : mycanvas});
		renderer.setFaceCulling( THREE.CullFaceBack, THREE.FrontFaceDirectionCW );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setClearColor("white");
		document.body.appendChild( renderer.domElement );
	},
	
	//Gestionnaire d'images
	images : function(src_img){
		this.log_console === true ? console.log("app.images") : false ;
		add_images.push(src_img);
		
		for(var i=0; add_images.length; i ++){
		
			ftest = THREE.ImageUtils.loadTexture(src_img);
			if(ftest.sourceFile == src_img ){
				this.log_console === true ? console.log("Load OK -- " + src_img) : false ;
				return ftest
			}else{
				this.log_console === true ? console.log("Load FAIL -- " + src_img) : false ;
				return false
			}
		}
	},
	
	mat : {
		checkboard : function(img){
			return new THREE.MeshBasicMaterial({
				map  : img,
				wireframe : false,
				side : THREE.DoubleSide					
			});
		},
		
		red : function(){
			return new THREE.MeshLambertMaterial({
				//map  : app.images(img),
				color : "blue",
				wireframe : false,
				ambient : "red"
				//side : THREE.DoubleSide					
			});
		},
		
		green : function(){
			return new THREE.MeshLambertMaterial({
				//map  : app.images(img),
				color : "red",
				wireframe : false,
				ambient : "green"
				//side : THREE.DoubleSide					
			});
		},
		
		wireframe : function(){
			return new THREE.MeshBasicMaterial({
				color : "red",
				wireframe : true
			});
		},
		
		emissive : function(){
			return new THREE.MeshLambertMaterial({
				//map  : app.images(img),
				//color : "red",
				//ambient : "blue",
				emissive : "0x0000ff"
			});
		}
		
	},
	
	axe_debug : function(arg_x,arg_y,arg_z){
		var axes = new THREE.AxisHelper(100);
		if(arg_x instanceof Object){
			x = arg_x.position.x || 0 ;
			y = arg_x.position.y || 0 ;
			z = arg_x.position.z || 0 ;
		}else{
			x = arg_x || 0 ;
			y = arg_y || 0 ;
			z = arg_z || 0 ;
		}	
		this.log_console === true ? console.log("LOG -- axe_debug = x:"+ x + ", y:" + y + ", z:" + z) : false ;
//		if(this.log_console === true) ;
		
		axes.position.set(x,y,z);
		scene.add( axes );
	}
};