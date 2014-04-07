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
