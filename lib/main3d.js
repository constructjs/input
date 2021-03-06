
function extendMain3D(){

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

	// save parent
	var Main3D = APP.Views.Main3D;

	APP.Views.Main3D = Main3D.extend({

		options: {
			//monitorMove: true
			monitor: construct.options.input
		},

		events: events,

		keys : {
			'f2': '_clickPause'
		},

		initialize: function( options ){

			// monitor mouse
			var monitor = this.options.monitorMove || _.inArray("mouse", this.options.monitor);
			if( monitor ){
				this.on("intersect", _.bind(this.clickObject, this));
			}

			return Main3D.prototype.initialize.call(this, options);
		},

		_start: function( $3d ){
			// create a projector for the click events
			$3d.projector = new THREE.Projector();
			return Main3D.prototype._start.call(this, $3d);
		},

		//onMouseMove
		mousemove: function( e ){
			// broadcast updates to player
			var player = this.objects.get("player");
			if( player && player.onMouseMove ) player.onMouseMove( e );
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

		},

		// user defined pause actions
		clickPause: function( e ){

		},

		_clickPause: function( e ){
			// FIX: don't monitor the keyup events...
			if( e.type == "keyup" ) return;
			// user events
			this.clickPause( e );
			// broadcast to pause the 3D space
			this.trigger("pause", e);
		}

	});

}