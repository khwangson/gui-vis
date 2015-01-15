var screenshots = new Array();


function getScreenShots(){
	var files = document.getElementById('screenshots').files;
		if (!files.length) {
			alert('No file selected!');
		    return;
	  	}

		for(var i = 0, f; f=files[i]; i++){	
			var reader = new FileReader();

			reader.onload = (
				function(file){
				return function(e){
					var img = e.target.result
					var curr = new Image();
					curr.src = img;
					//$("#screenShots").append("<img src=\""+img+"\"/>");
					//d3.select('#svgContainer').append("image").attr("src", "\"img\"");
					d3.select('#svgContainer svg').append("svg:image")
					.attr("class","screenshot")
					.attr("xlink:href", img)
					.attr("x","200")
					.attr("y","200")
					.attr("width",curr.width)
					.attr("height",curr.height)
					.call(d3.behavior.drag().on("drag", move));
				};
			})(f);
			
			reader.readAsDataURL(f); //for reading images as a data url	
		}
}
