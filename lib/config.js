
	// Dependencies
	construct.config = Object.extend(construct.config, {
		"paths": {
			"backbone.ui.keys" : [
				"//rawgithub.com/backbone-input/keys/master/build/backbone.input.keys"
			],
			"backbone.ui.touch" : [
				"//rawgithub.com/backbone-input/touch/master/build/backbone.input.touch"
			],
			"backbone.ui.mouse" : [
				"//rawgithub.com/backbone-input/mouse/master/build/backbone.input.mouse"
			],
			"backbone.ui.gamepad" : [
				"//rawgithub.com/backbone-input/gamepad/master/build/backbone.input.gamepad"
			]
		},
		"shim": {
			"backbone.ui.keys": {
				"deps": [
					"backbone",
					"underscore",
					"jquery"
				]
			},
			"backbone.ui.touch": {
				"deps": [
					"backbone",
					"underscore",
					"jquery"
				]
			},
			"backbone.ui.mouse": {
				"deps": [
					"backbone",
					"underscore",
					"jquery"
				]
			}
		}
	});
