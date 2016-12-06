function extendPlayer(){

	var Player = APP.Meshes.Player;

	APP.Meshes.Player = Player.extend({

		// keyboard support
		keys : {
			'w a s d': '_moveKeys',
			'up left down right': '_rotateKeys',
			'q e': '_rollKeys',
			'r f': '_elevateKeys',
			'shift': '_accelerateKeys'
		},

		_start: function( options ){

			_.bindAll(this, 'updateData');

			// events
			if( this.options.controls ){
				// events
				this.on("update", _.bind(this._updateControls, this));
				// data
				this.data.set({
					controls: { lon: 0, lat: 0 }
				});
			}
			this.on( "gamepadButton", _.bind(this.onGamepadButton, this) );

			return Player.prototype._start.call( this, options );
		},

		// events
		_clickPause: function(e){
			// bubble up event
			this.trigger("pause", e);
		},

		// Gamepad support

		onConnectGamepad: function( e ){
			//console.log("onConnectGamepad", e );
		},

		onDisconnectGamepad: function( e ){

		},

		updateGamepads: function( e ){

			var data = this.params.get("gamepads");
			// support only first gamepad for now...
			if( data && data[0] ){
				var axes = data[0].axes;
				// convention: two first axes is left, two latter is right
				this.state.move.left = ( axes[0] < -0.4 ) ? 1 : 0;
				this.state.move.right = ( axes[0] > 0.4 ) ? 1 : 0;
				this.state.move.forward = ( axes[1] < -0.4 ) ? 1 : 0;
				this.state.move.back = ( axes[1] > 0.4 ) ? 1 : 0;

				this.state.move.yawLeft = ( axes[2] < -0.4 ) ? 1 : 0;
				this.state.move.yawRight = ( axes[2] > 0.4 ) ? 1 : 0;
				this.state.move.pitchUp = ( axes[3] < -0.4 ) ? 1 : 0;
				this.state.move.pitchDown = ( axes[3] > 0.4 ) ? 1 : 0;

				// monitor buttons
				var buttons = data[0].buttons;
				var pressed = [];
				for(var i in buttons){
					// true if it is pressed...
					if( buttons[i].value ){
						var button = this._buttonKey( i );
						pressed.push( button );
					}
				}
				// one event trigger for the whole button set
				if( pressed.length ){
					this.trigger( "gamepadButton", { buttons: pressed });
				} else {
					// reset state
					this.state.set({ 'gamepadButtons': [] });
				}
			}

			this.updateMovementVector();
			this.updateRotationVector();
		},

		onGamepadButton: function( e ){
			var pressed = e.buttons;
			var previous = this.state.get('gamepadButtons');
			//
			for( var i in pressed ){
				// Start is used as the pause button (monitor only first click )
				if( pressed[i] == "Start" && previous.indexOf("Start") == -1 ){
					this._clickPause( e );
				}
			}
			// add it in the list of pressed buttons
			this.state.set('gamepadButtons', pressed);
		},


		// Keyboard support

		_moveKeys: function( e, key ){

			// prerequisite
			if( !_.inArray("keys", this.options.monitor) ) return;

			var press = ( e.type == "keydown" ); // options: keydown, keyup

			var keys = this._keys._moveKeys;
			var paused = this.options.keys.pause || [];

			switch( key ){

				// move
				case keys[0]: this.state.move.forward = ( press && !_.inArray(key, paused) ) ? 1 : 0; break;
				case keys[1]: this.state.move.left = ( press && !_.inArray(key, paused) ) ? 1 : 0; break;
				case keys[2]: this.state.move.back = ( press && !_.inArray(key, paused) ) ? 1 : 0; break;
				case keys[3]: this.state.move.right = ( press && !_.inArray(key, paused) ) ? 1 : 0; break;

			}

			this.updateMovementVector();
		},

		_rotateKeys: function( e, key ){

			// prerequisite
			if( !_.inArray("keys", this.options.monitor) ) return;

			var press = ( e.type == "keydown" ); // options: keydown, keyup

			var keys = this._keys._rotateKeys;
			var paused = this.options.keys.pause || [];

			switch( key ){

				// rotate
				case keys[0]: this.state.move.pitchUp = ( press && !_.inArray(key, paused) ) ? 1 : 0; break;
				case keys[1]: this.state.move.yawLeft = ( press && !_.inArray(key, paused) ) ? 1 : 0; break;
				case keys[2]: this.state.move.pitchDown = ( press && !_.inArray(key, paused) ) ? 1 : 0; break;
				case keys[3]: this.state.move.yawRight = ( press && !_.inArray(key, paused) ) ? 1 : 0; break;

			}

			this.updateRotationVector();
		},

		_rollKeys: function( e, key ){

			// prerequisite
			if( !_.inArray("keys", this.options.monitor) ) return;

			var press = ( e.type == "keydown" ); // options: keydown, keyup

			var keys = this._keys._rollKeys;

			switch( key ){

				// rotate
				case keys[0]:  this.state.move.rollLeft = ( press ) ? 1 : 0; break;
				case keys[1]: this.state.move.rollRight = ( press ) ? 1 : 0; break;

			}

			this.updateRotationVector();

		},

		_elevateKeys: function( e, key ){

			// prerequisite
			if( !_.inArray("keys", this.options.monitor) ) return;

			var press = ( e.type == "keydown" ); // options: keydown, keyup

			var keys = this._keys._elevateKeys;

			switch( key ){

				// rotate
				case keys[0]:  this.state.move.up = ( press ) ? 1 : 0; break;
				case keys[1]: this.state.move.down = ( press ) ? 1 : 0; break;

			}

			this.updateMovementVector();
		},

		_accelerateKeys: function( e, key ){

			// prerequisite
			if( !_.inArray("keys", this.options.monitor) ) return;

			var press = ( e.type == "keydown" ); // options: keydown, keyup
			var multiplier = this.movementSpeedMultiplier;

			this.movementSpeedMultiplier = ( press ) ? multiplier * 10 : multiplier / 10;

		},


		// Mouse support

		onMouseMove: function( event ){

			// prerequisite
			if( !_.inArray("mouse", this.options.monitor) ) return;

			var container = this.getContainerDimensions();
			var halfWidth  = container.size[ 0 ] / 2;
			var halfHeight = container.size[ 1 ] / 2;

			this.state.move.yawLeft   = - ( ( event.pageX - container.offset[ 0 ] ) - halfWidth  ) / halfWidth;
			this.state.move.pitchDown =   ( ( event.pageY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

			this.updateRotationVector();
			//console.log( JSON.stringify( this.state.move ) );

		},

		// Motion support
		onMotionAccelerometer: function( ){
			// prerequisite
			if( !_.inArray("motion", this.options.monitor) ||  !_.inArray("accelerometer", this.options.states.motion) ) return;

			var data = this.params.get("accelerometer");

			var container = this.getContainerDimensions();
			var halfWidth  = container.size[ 0 ] / 2;
			var halfHeight = container.size[ 1 ] / 2;

			//this.state.move.yawLeft   = - ( ( data.x - container.offset[ 0 ] ) - halfWidth  ) / halfWidth;
			//this.state.move.pitchDown =   ( ( data.y - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

			// tabletop
			//this.state.move.yawLeft   = - data.z * Math.PI/180;
			//this.state.move.pitchDown =  data.y * Math.PI/180;

			// fly
			// y goes from 90 to -90 and from 180 to -180
			var directionX = ( data.y > 0 ) ? 1 : -1;
			var yaw = ( Math.abs( data.y ) < 90 ) ? data.y : directionX * (180 - Math.abs( data.y )) ;
			this.state.move.yawLeft = - yaw/90;
			//console.log( this.state.move.yawLeft );
			// account for resetting the z axis
			var directionY = ( data.z < 0 ) ? 1 : -1;
			this.state.move.pitchDown = directionY * ( 1 - ( Math.abs( data.z )/90 ) );

			this.updateRotationVector();

		},

		onOrientationUpdate: function(){
			// prerequisite
			if( !_.inArray("motion", this.options.monitor) ||  !_.inArray("rift", this.options.states.motion) ) return;

			var data = this.params.get("rift");
			this.tmpQuaternion = new THREE.Quaternion(data.x, data.y, data.z, data.w);

			// bypass updateRotationVector?
		},

		// Controls

		_updateControls: function( e ){
			// controls update only after the object is loaded
			if( !this.object) return;

			var vr = ( _.inArray("motion", this.options.monitor) &&  _.inArray("rift", this.options.states.motion) );

			switch( this.options.controls ){
				case "walk":
					this.updateControlsWalk(e);
				break;
				case "fly":
					if( vr ){
						this.updateControlsFlyVR(e);
					} else {
						this.updateControlsFly(e);
					}
				break;
				default:
					// nothing?
				break;
			}
		},

		// first person perspective in flying mode
		updateControlsFly: function( e ){

			// remove when the object is no longer visible
			var $3d = e.target;
			// look around...
			var delta = $3d.clock.getDelta();
			var moveMult = delta * this.options.moveStep;
			var rotMult = delta * this.options.rotateStep;

			this.object.translateX( this.moveVector.x * moveMult );
			this.object.translateY( this.moveVector.y * moveMult );
			this.object.translateZ( this.moveVector.z * moveMult );

			this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
			this.object.quaternion.multiply( this.tmpQuaternion );

			// expose the rotation vector for convenience
			this.object.rotation.setFromQuaternion( this.object.quaternion, this.object.rotation.order );

			// update data
			this.updateData(["position", "rotation"]);

		},

		updateControlsFlyVR: function( e ){

			// remove when the object is no longer visible
			var $3d = e.target;
			// look around...
			var delta = $3d.clock.getDelta();
			var moveMult = delta * this.options.moveStep;
			var rotMult = delta * this.options.rotateStep;

			this.object.translateX( this.moveVector.x * moveMult );
			this.object.translateY( this.moveVector.y * moveMult );
			this.object.translateZ( this.moveVector.z * moveMult );

			this.object.quaternion.set( this.tmpQuaternion.x, this.tmpQuaternion.y, this.tmpQuaternion.z, this.tmpQuaternion.w  );

			// expose the rotation vector for convenience
			this.object.rotation.setFromQuaternion( this.object.quaternion, this.object.rotation.order );

			// update data
			this.updateData(["position", "rotation"]);

		},

		// first person perspective in walking mode
		updateControlsWalk: function( e ){

			// remove when the object is no longer visible
			var $3d = e.target;
			// look around...
			var delta = $3d.clock.getDelta();

			var moveMult = delta * this.options.moveStep;
			var rotMult = delta * this.options.rotateStep * 2;

			var y = this.object.position.y;
			this.object.translateX( this.moveVector.x * moveMult );
			this.object.translateY( this.moveVector.y * moveMult );
			this.object.translateZ( this.moveVector.z * moveMult );
			//this.object.position.x -= this.moveVector.z * moveMult;
			//this.object.position.y += this.moveVector.y * moveMult;
			//this.object.position.z += this.moveVector.x * moveMult;
			// reset position
			this.object.position.y = y;
			/* jump...
			if ( this.heightSpeed ) {

				var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
				var heightDelta = y - this.heightMin;
				this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );
			} else {
				this.autoSpeedFactor = 0.0;
			}
			*/
			var data = this.data.get("controls");
			// update lat/lon
			data.lon -= this.rotationVector.y;
			data.lat += this.rotationVector.x;
			data.lat = Math.max( - 85, Math.min( 85, data.lat ) );
			// calculate angles
			var phi = THREE.Math.degToRad( 90 - data.lat );
			var theta = THREE.Math.degToRad( data.lon );

			var targetPosition = new THREE.Vector3(0,0,0),
				position = this.object.position;

			// place target object in front of actual object
			targetPosition.x = position.x + 100 * Math.sin( phi ) * Math.cos( theta );
			targetPosition.y = position.y + 100 * Math.cos( phi );
			targetPosition.z = position.z + 100 * Math.sin( phi ) * Math.sin( theta );

			this.object.lookAt( targetPosition );

			// save lat/lon in data
			this.data.set({
				controls: data
			});
			// update (regular) data
			this.updateData(["position", "rotation"]);
		},

		// the camera follows the player objject from a distance
		updateControlsFollow: function( e ){

		},

		// pin camera around an object
		updateControlsRotate: function( e ){

		},

		// update data model (name too common?)
		// use debounce to save some processing?
		//updateData: _.debounce(function( types ){
		updateData: function( types ){

			types = types || [];
			// if not an array assume a string (of one item)
			if( !(types instanceof Array) ) types = [types];
			var data = {};

			for( var i in types ){
				var type = types[i];
				if( this.object[type] ){
					var property = this.object[type];
					data[type] = [ property.x , property.y , property.z ];
				}
			}
			// update data
			this.data.set( data );

		},
		//}, 100),

		// temp method - replace with $3d dimensions
		getContainerDimensions : function() {
/*
			if ( this.domElement != document ) {

				return {
					size	: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
					offset	: [ this.domElement.offsetLeft,  this.domElement.offsetTop ]
				};

			} else {
*/
				return {
					size	: [ window.innerWidth, window.innerHeight ],
					offset	: [ 0, 0 ]
				};

//			}

		}

	});


}
