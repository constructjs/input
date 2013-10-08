(function(){
	// exit now if contruct hasn't already been defined
	if(typeof construct == "undefined") return;

	construct.input = function( options ){
		// options is an array...
		options = options || [];
		//console.log(options);

		// lookup options
		if( options.indexOf("keys") > -1 ) {
			construct.config.shim["backbone.app"].deps.push("backbone.ui.keys");
			construct.config.deps.push("backbone.ui.keys");
		}
		if( options.indexOf("mouse") > -1 ) construct.config.deps.push("backbone.ui.mouse");
		if( options.indexOf("touch") > -1 ) {
			construct.config.shim["backbone.app"].deps.push("backbone.ui.touch");
			construct.config.deps.push("backbone.ui.touch");
		}
		if( options.indexOf("gamepad") > -1 ) construct.config.deps.push("gamepad");

		// save options
		Object.extend(construct.options, { input: options });

		return function( e ){
			//console.log( "update" );
		};

	};

	// Dependencies
	construct.config = Object.extend(construct.config, {
		"paths": {
			"backbone.ui.keys" : [
				"//rawgithub.com/backbone-input/keys/0.3.0/dist/backbone.keys.min"
			],
			"backbone.ui.touch" : [
				"//rawgithub.com/backbone-input/touch/0.3.0/dist/backbone.touch.min"
			],
			"backbone.ui.mouse" : [
				"//rawgithub.com/backbone-input/mouse/0.2.0/backbone.input.mouse"
			],
			"gamepad" : [
				"//rawgithub.com/constructjs/gamepad.js/master/gamepad"
			]
		},
		"shim": {
			"backbone.keys": {
				"deps": [
					"backbone",
					"underscore",
					"jquery"
				]
			},
			"backbone.touch": {
				"deps": [
					"backbone",
					"underscore",
					"jquery"
				]
			}
		}
	});

})();

// Views

// Add models after dependencies are loaded
construct.promise.add(function(){

	// add the appropariate events based on the input methods initialized
	var types = construct.options.input || [];
	var events = {};
	// lookup input types
	if( types.indexOf("keys") > -1 ) {
	}
	if( types.indexOf("mouse") > -1 ) {
	}
	if( types.indexOf("touch") > -1 && isTouch() ) {
		events.click = "_ontouch";
	}
	if( types.indexOf("gamepad") > -1 ){
	}

	// in case APP.Mesh has already been defined by a plugin
	var Main3D = APP.Views.Main3D || APP.View;

	APP.Views.Main3D = Main3D.extend({

		options: {
			monitorMove: true
		},

		events: events,

		initialize: function( options ){

			this.on("intersect", _.bind(this.clickObject, this));

			return Main3D.prototype.initialize.call(this, options);
		},

		_start: function( $3d ){
			// create a projector for the click events
			$3d.projector = new THREE.Projector();
			return Main3D.prototype._start.call(this, $3d);
		},

		mousedown: function(){
			this.checkIntersect();
		},

		_ontouch: function( e ){
			// internal...
			 var touch = e.originalEvent.changedTouches[0];
			var x = touch.clientX;
			var y = touch.clientY;
			this.params.set({
				mouse: { x : x, y : y }
			});
			alert("Sddd");
			this.checkIntersect();
			// user defined
			if( this.ontouch ) this.ontouch( e );
		},
		/*
		_touchmove: function(){
			// internal...
			// user defined
			if( this.touchmove ) this.touchmove( e );
		},

		_touchend: function(){
			// internal...
			// user defined
			if( this.touchend ) this.touchend( e );
		},
		*/
		clickObject: function( objects ){
			console.log("clickObject:", objects);
		},

		checkIntersect: function(){

			var $el = $(this.el),
				elOffset = $el.offset(),
				mouse = this.params.get("mouse");
			// check click event with a raycast
			var x = ( (mouse.x - elOffset.left) / jQuery(window).width() ) * 2 - 1;
			var y = - ( (mouse.y - elOffset.top) / jQuery(window).height() ) * 2 + 1;
			var z = 0.5;
			//
			var vector = new THREE.Vector3( x, y, z );
			var camera = this.$3d.active.camera;
			// get the meshes (map as array...)
			var objects = getMeshes( this.$3d.objects );

			//this.$3d
			this.$3d.projector.unprojectVector( vector, camera );

			var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

			var intersects = raycaster.intersectObjects( objects );

			if ( intersects.length > 0 ) {
				// is the array always with one item and does the object always have a parent (assuming it's an Object3D container)?
				var object = intersects[0].object.parent;
				this.trigger("intersect", object);
				//intersects[0].object.parent.lookAt(new THREE.Vector3( 0, 0, 0 ) );
				// console.log( JSON.stringify( intersects[0].object.parent.rotation ) );
			}

		}

	});

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

});
