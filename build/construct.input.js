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
	var Mesh = APP.Mesh || View;

	APP.Mesh = Mesh.extend({
		initialize: function( options ){
			var types = construct.options.input;
			// lookup input types
			if( types.indexOf("keys") > -1 ) {
			}
			if( types.indexOf("mouse") > -1 ) {
			}
			if( types.indexOf("touch") > -1 ) {
			}
			if( types.indexOf("gamepad") > -1 ){
			}

			return Mesh.prototype.initialize.call(this, options);
		}

	});


});
