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
		if( options.indexOf("gamepad") > -1 ) {
			construct.config.shim["backbone.app"].deps.push("backbone.ui.gamepad");
			construct.config.deps.push("backbone.ui.gamepad");
		}
		// save options
		Object.extend(construct.options, { input: options });

		return function( e ){
			//console.log( "update" );
		};

	};
