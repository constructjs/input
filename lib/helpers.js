
	// Helpers
	// - loop through objects to get meshes
	function getMeshes( objects, meshes ){
		//fallbacks
		objects = objects || {};
		meshes = meshes || [];
		for( var i in objects) {
			var object = objects[i];
			if( object instanceof THREE.Mesh ){
				meshes.push( object );
			} else {
				// assume it's an Object3D
				if( object.children ) {
					meshes = meshes.concat( getMeshes( object.children ) );
				}
			}
		}

		return meshes;
	}

	// this method also exists in APP.View as part of the touch plugin...
	function isTouch() {
		return 'ontouchstart' in document && !('callPhantom' in window);
	}

	// underscore helpers
	_.mixin({
		inArray: _.inArray || function(value, array){
			return array.indexOf(value) > -1;
		},
		// - Check if in debug mode (requires the existence of a global DEBUG var)
		// Usage: _.inDebug()
		inDebug : _.inDebug || function() {
			return ( typeof DEBUG != "undefined" && DEBUG );
		}
	});
