/**
 * @name {{name}}
 * {{description}}
 *
 * Version: {{version}} ({{build_date}})
 * Homepage: {{homepage}}
 *
 * @author {{author}}
 * Initiated by: Makis Tracend (@tracend)
 *
 * @cc_on Copyright © Makesites.org
 * @license {{#license licenses}}{{/license}}
 */

(function (lib) {

	//"use strict";

	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery', 'underscore', 'backbone'], lib);
	} else {
		// Browser globals
		lib($, _, Backbone);
	}
}(function ($, _, Backbone) {

	// exit now if contruct hasn't already been defined
	if(typeof construct == "undefined") return;


	{{{lib}}}


	// Update views after dependencies are loaded
	construct.promise.add(function(){
		extendMain3D();
		extendPlayer();
	});

	// return for module loaders?
	//return construct.input;

}));
