(function(){
	// exit now if contruct hasn't already been defined
	if(typeof construct == "undefined") return;

	construct.input = function( options ){
		// options is an array...
		//console.log(options);

		// lookup options
		if( options.indexOf("keys") > -1 ) construct.config.deps.push("backbone.keys");
		if( options.indexOf("mouse") > -1 ) construct.config.deps.push("backbone.mouse");
		if( options.indexOf("touch") > -1 ) construct.config.deps.push("backbone.touch");
		if( options.indexOf("gamepad") > -1 ) construct.config.deps.push("gamepad");

		return function( e ){
			console.log( "update" );
		};

	};

	// Dependencies
	construct.config = Object.extend(construct.config, {
		"paths": {
			"backbone.keys" : [
				"//raw.github.com/constructjs/backbone.keys/master/backbone.keys"
			],
			"backbone.touch" : [
				"//raw.github.com/constructjs/backbone.touch/master/backbone.touch"
			],
			"backbone.mouse" : [
				//"https://gist.github.com/raw/4333890/9b8eebf4e1594d79760485eb818fd292691bc8c8/backbone.mouse",
				"lib/backbone.mouse"
			],
			"gamepad" : [
				"//raw.github.com/constructjs/gamepad.js/master/gamepad"
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