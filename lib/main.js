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

 (function(){
	// exit now if contruct hasn't already been defined
	if(typeof construct == "undefined") return;


	{{{lib}}}


	// Update views after dependencies are loaded
	construct.promise.add(function(){
		extendMain3D();
		extendPlayer();
	});

})();
