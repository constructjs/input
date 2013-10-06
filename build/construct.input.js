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


// in case APP.Mesh has already been defined by a plugin
	var Main3D = APP.Views.Main3D || APP.View;

	APP.Views.Main3D = Main3D.extend({

		options: {
			monitorMove: true
		},

		initialize: function( options ){
			var types = construct.options.input || [];
			// lookup input types
			if( types.indexOf("keys") > -1 ) {
			}
			if( types.indexOf("mouse") > -1 ) {
			}
			if( types.indexOf("touch") > -1 ) {
			}
			if( types.indexOf("gamepad") > -1 ){
			}

			this.on("intersect", _.bind(this.clickObject, this));

			return Main3D.prototype.initialize.call(this, options);
		},

		_start: function( $3d ){
			// create a projector for the click events
			$3d.projector = new THREE.Projector();
			return Main3D.prototype._start.call(this, $3d);
		},

		mousedown: function(){

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
			// get the objects (map as array...)
			var objects = $.map(this.$3d.objects, function (value, key) { return (value.children.length) ? value.children[0] : value; });
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

		},

		clickObject: function( objects ){
			console.log("clickObject:", objects);
		}

	});


});
