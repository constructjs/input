
	// Dependencies
	construct.config = Object.extend(construct.config, {
		"paths": {
			"backbone.input.keys" : [
				"//rawgithub.com/backbone-input/keys/master/build/backbone.input.keys"
			],
			"backbone.input.touch" : [
				"//rawgithub.com/backbone-input/touch/master/build/backbone.input.touch"
			],
			"backbone.input.mouse" : [
				"//rawgithub.com/backbone-input/mouse/master/build/backbone.input.mouse"
			],
			"backbone.input.gamepad" : [
				"//rawgithub.com/backbone-input/gamepad/master/build/backbone.input.gamepad"
			],
			"backbone.input.motion" : [
				"//rawgithub.com/backbone-input/motion/master/build/backbone.input.motion"
			]
		},
		"shim": {
			"backbone.input.keys": {
				"deps": [
					"backbone",
					"underscore",
					"jquery"
				]
			},
			"backbone.input.touch": {
				"deps": [
					"backbone",
					"underscore",
					"jquery"
				]
			},
			"backbone.input.mouse": {
				"deps": [
					"backbone",
					"underscore",
					"jquery"
				]
			},
			"backbone.input.motion": {
				"deps": [
					"backbone",
					"underscore",
					"jquery"
				]
			}
		}
	});
