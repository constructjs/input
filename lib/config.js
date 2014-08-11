
	// Dependencies
	construct.config = Object.extend(construct.config, {
		"paths": {
			"backbone.input.keys" : [
				"//rawgit.com/backbone-input/keys/master/build/backbone.input.keys"
			],
			"backbone.input.touch" : [
				"//rawgit.com/backbone-input/touch/master/build/backbone.input.touch"
			],
			"backbone.input.mouse" : [
				"//rawgit.com/backbone-input/mouse/master/build/backbone.input.mouse"
			],
			"backbone.input.gamepad" : [
				"//rawgit.com/backbone-input/gamepad/master/build/backbone.input.gamepad"
			],
			"backbone.input.motion" : [
				"//rawgit.com/backbone-input/motion/master/build/backbone.input.motion"
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
