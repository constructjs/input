	construct.input = function( options ){
		// options is an array...
		options = options || [];
		//console.log(options);

		// lookup options
		if( options.indexOf("keys") > -1 ) {
			construct.config.shim["backbone.app"].deps.push("backbone.input.keys");
			construct.config.deps.push("backbone.input.keys");
		}
		if( options.indexOf("mouse") > -1 ) {
			construct.config.shim["backbone.app"].deps.push("backbone.input.mouse");
			construct.config.deps.push("backbone.input.mouse");
		}
		if( options.indexOf("touch") > -1 ) {
			construct.config.shim["backbone.app"].deps.push("backbone.input.touch");
			construct.config.deps.push("backbone.input.touch");
		}
		if( options.indexOf("gamepad") > -1 ) {
			construct.config.shim["backbone.app"].deps.push("backbone.input.gamepad");
			construct.config.deps.push("backbone.input.gamepad");
		}
		if( options.indexOf("motion") > -1 ) {
			construct.config.shim["backbone.app"].deps.push("backbone.input.motion");
			construct.config.deps.push("backbone.input.motion");
		}
		// save options
		$.extend({}, construct.options, { input: options });

		return function( e ){
			//console.log( "update" );
		};

	};
