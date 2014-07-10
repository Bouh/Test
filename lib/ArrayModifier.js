/*
 *	@author Aurélien Vivet | twitter.com/Bouh1 | www.witly.fr/portfolio
 *
 *	Array Modifier 
 *		duplicate objects in a new group
 *
 */

THREE.ArrayModifier = function ( copy , vector, offset) {

	this.copy = (copy === undefined ) ? 1 : copy;
	this.vector = (vector === undefined ) ? new THREE.Vector3( 1, 0, 0 ) : vector;
	this.offset = (offset === undefined ) ? new THREE.Vector3( 0, 0, 0 ) : offset;
	this.defaut_space = 5;
};

THREE.ArrayModifier.prototype.modify = function ( object ) {

	group = new THREE.Object3D();

	if(object.name){
		group.name = "Array_" + object.name;
	}else{
		group.name = "Array_" + object.uuid;
	}

	var repeats = this.copy;

	while ( repeats-- > 0 ) {
		this.repeat( object,repeats, group );
	}
	
	scene.add(group);
	
};

(function() {

	THREE.ArrayModifier.prototype.repeat = function ( object, repeats, group ) {

		object_origin = object;
		
		new_object = object_origin.clone();

		repeats++; //for the frist object +1
		
		if(object_origin.geometry.width){
			width = object_origin.geometry.width;
		}else{
			width = this.defaut_space;
		}
		
		if(object_origin.geometry.height){
			height = object_origin.geometry.height;
		}else{
			height = this.defaut_space;
		}
		
		if(object_origin.geometry.depth){
			depth = object_origin.geometry.depth;
		}else{
			depth = this.defaut_space;
		}
		
		//position
		new_object.position.x = (this.offset.x*repeats) + object_origin.position.x + (this.vector.x * (width*repeats));
		new_object.position.y = (this.offset.y*repeats) + object_origin.position.y + (this.vector.y * (depth*repeats));
		new_object.position.z = (this.offset.z*repeats) + object_origin.position.z + (this.vector.z * (height*repeats));
		
		//rotation
		new_object.rotation.x = object_origin.rotation.x;
		new_object.rotation.y = object_origin.rotation.y;
		new_object.rotation.z = object_origin.rotation.z;

		group.add(new_object);
	};


})();