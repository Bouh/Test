/**
 * @author mrdoob / http://mrdoob.com/
 * @author schteppe / https://github.com/schteppe
 */
 
THREE.PointerLockControlsCannon = function ( camera, cannonBody){

    var eyeYPos = 20; // eyes are 2 meters above the ground
    var velocityFactor = 0.5;
    //var jumpVelocity = 200;
    var jumpVelocity = 4 * 100;
    var scope = this;

    var pitchObject = new THREE.Object3D();
	pitchObject.name = "pitchObject_CAM";
    pitchObject.add( camera );

    var yawObject = new THREE.Object3D();
	yawObject.name = "yawObject_CAM";
    yawObject.position.y = eyeYPos;
    yawObject.add( pitchObject );

    var quat = new THREE.Quaternion();

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;

	var runEnable = false;
    var canJump = false;

	cannonBody.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
		canJump = true;
		console.log(other_object);
		
	});
	
	

    var velocity = cannonBody.getLinearVelocity();
	
    var PI_2 = Math.PI / 2;

    var onMouseMove = function ( event ) {

        if ( scope.enabled === false ) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;

        pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
    };

    var onKeyDown = function ( event ) {

        switch ( event.keyCode ) {

			case 90: // z
            case 38: // up
            case 87: // w
                moveForward = true;
                break;

			case 81: // q
            case 37: // left
            case 65: // a
                moveLeft = true; break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
					cannonBody.applyCentralImpulse(new THREE.Vector3( 0, 0.2, 0 ));
                if ( canJump === true ){
                    velocity.y += jumpVelocity ;
                }
                canJump = false;
                break;
			
			case 16: // SHIFT
                runEnable = true;
                break;
        }

    };

    var onKeyUp = function ( event ) {

        switch( event.keyCode ) {

			case 90: // z
            case 38: // up
            case 87: // w
                moveForward = false;
                break;

			case 81: // q
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // a
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;
				
			case 16: // SHIFT
                runEnable = false;
                break;

        }

    };

    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    this.enabled = false;

    this.getObject = function () {
        return yawObject;
    };

    this.getDirection = function(targetVec){
        targetVec.set(0,0,-1);
        quat.multiplyVector3(targetVec);
		targetVec.applyQuaternion( quat );
    }

    // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
    var inputVelocity = new THREE.Vector3();
    this.update = function ( delta ) {

        if ( scope.enabled === false ) return;

        delta *= 0.1;

        inputVelocity.set(0,0,0);

        if ( moveForward ){
	
			if(runEnable){
				inputVelocity.z = (-velocityFactor - 0.5) * delta;
			}else{
				inputVelocity.z = -velocityFactor * delta;
			}
        }
        if ( moveBackward ){
            inputVelocity.z = velocityFactor * delta;
        }

        if ( moveLeft ){
            inputVelocity.x = -velocityFactor * delta;
        }
        if ( moveRight ){
            inputVelocity.x = velocityFactor * delta;
        }

        // Convert velocity to world coordinates
		
        quat.setFromEuler( new THREE.Euler( pitchObject.rotation.x, yawObject.rotation.y, 0,"XYZ"));
		inputVelocity.applyQuaternion( quat );

        // Add to the object
        velocity.x = (inputVelocity.x * 100 );
        velocity.z = (inputVelocity.z * 100 );

		cannonBody.setLinearVelocity(new THREE.Vector3( velocity.x, velocity.y, velocity.z ));
		
		//cannonBody.position.copy(yawObject.position);
		//yawObject.position.copy(cannonBody.position);
		yawObject.position.setX(cannonBody.position.x);
		yawObject.position.setY(cannonBody.position.y + eyeYPos );
		yawObject.position.setZ(cannonBody.position.z);
		cannonBody.__dirtyRotation = true;
    };
};