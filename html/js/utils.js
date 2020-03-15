

$(document).ready(function() {

	// var config = 
	console.log("start");
	// alert();
	// window.parent.document.alert();
	console.log(window);
	// console.log(parent);
	// window.parent.window.daying();
	// console.log(config);

	var funName = "daying";
	var path = "parent";
	var have = false;
	for(var one in parent){
		if(one == funName){
			path = path + "." + funName;
			console.log(path);
			have = true;
			break
		}
		if(have){break}

		for(var a in one){
			if(a == funName){
				path = path + "." + a + "." + funName;
				console.log(path);
				have = true;
				break
			}
			if(have){break}

			for(var b in a){
				if(b == funName){
					path = path + "." + a + "." + b + "." + funName;
					console.log(path);
					have = true;
					break
				}
				if(have){break}
				for(var c in b){
					if(c == funName){
						path = path + "." + a + "." + b + "." + c + "." + funName;
						console.log(path);
						have = true;
						break
					}
					if(have){break}
				}
			}
			
		}
		// console.log(one);
		
	}


	console.log("end");

});




