app.log_console === true ? console.log("Open -- controller.js") : false ;

app.controller = function(){

/*

	

	if(app.havePointerLock){ //Si je peut lock le curseur
	
		
		var element = document.body; //recup de l'élement à bloquer
		
		var pointerlockchange = function(event){
			if(document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element){
				app.controlsLockEnabled = true;	
				console.log("controlsLockEnabled TRUE");				
			} else {
				app.controlsLockEnabled = false;
				console.log("controlsLockEnabled FALSE");				
			}
		}
		
		var pointerlockerror = function(event){
			console.log("pointerlockerror--------------------");
		}

		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

		
		
		
		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
		
		//element.requestPointerLock();
		
		
	}else{
		app.controlsLockEnabled = false;
	}

*/





	
	/*
	
    if(app.havePointerLock){
		//lock cursor for fps behavior	
		//Si la souris est contrainte alors on peut bouger dans le monde.
		
		fpscontrols.enabled = true;
		
		
	}
	*/
	
	
	/*
	if(app.keyboard.pressed("q") || app.keyboard.pressed("%")){	//Avant fleches + z
			app.control_move.rotateY((10 * Math.PI / 180)  * app.delta);
	}
	if(app.keyboard.pressed("z") || app.keyboard.pressed("&")){	//Avant fleches + z
			app.control_move.translateZ(50  * app.delta);
	}
	if(app.keyboard.pressed("d") || app.keyboard.pressed("'")){	//Avant fleches + z
			app.control_move.rotateY((-10 * Math.PI / 180)  * app.delta);
	}
	if(app.keyboard.pressed("s") || app.keyboard.pressed("(")){	//Avant fleches + z
			app.control_move.translateZ(-50 * app.delta);
	}
	*/
};
