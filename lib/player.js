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

			// events
			if( this.options.controls ){
				// events
				this.on("update", _.bind(this._updateControls, this));
				// data
				this.data.set({
					controls: { lon: 0, lat: 0 }
				});
			}

			return Player.prototype._start.call( this, options );
		},

		// gamepad support

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
				for(var i in buttons){
					// true if it is pressed...
					if( buttons[i] ){
						var button = this._buttonKey( i );
						this.trigger( button );
					}
				}

			}

			this.updateMovementVector();
			this.updateRotationVector();
		},


		// Keyboard support

		_moveKeys: function( e, key ){

			// prerequisite
			if( !_.inArray("keys", this.options.monitor) ) return;

			var press = ( e.type == "keydown" ); // options: keydown, keyup

			var keys = this._keys._moveKeys;

			switch( key ){

				// move
				case keys[0]: this.state.move.forward = ( press ) ? 1 : 0; break;
				case keys[1]: this.state.move.left = ( press ) ? 1 : 0; break;
				case keys[2]: this.state.move.back = ( press ) ? 1 : 0; break;
				case keys[3]: this.state.move.right = ( press ) ? 1 : 0; break;

			}

			this.updateMovementVector();
		},

		_rotateKeys: function( e, key ){

			// prerequisite
			if( !_.inArray("keys", this.options.monitor) ) return;

			var press = ( e.type == "keydown" ); // options: keydown, keyup

			var keys = this._keys._rotateKeys;

			switch( key ){

				// rotate
				case keys[0]: this.state.move.pitchUp = ( press ) ? 1 : 0; break;
				case keys[1]: this.state.move.yawLeft = ( press ) ? 1 : 0; break;
				case keys[2]: this.state.move.pitchDown = ( press ) ? 1 : 0; break;
				case keys[3]: this.state.move.yawRight = ( press ) ? 1 : 0; break;

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


		_updateControls: function( e ){
			// controls update only after the object is loaded
			if( !this.object) return;

			switch( this.options.controls ){
				case "walk":
					this.updateControlsWalk(e);
				break;
				case "fly":
					this.updateControlsFly(e);
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
		},

		// the camera follows the player objject from a distance
		updateControlsFollow: function( e ){

		},

		// pin camera around an object
		updateControlsRotate: function( e ){

		},

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