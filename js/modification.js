


function editJsonData(location,key,val){
	//ignore json object Window because it is a repeating window? 
	if(typeof val === 'object') {
		if(key == 'Window'){
			
		}else{
			$.each(val, function(keys, value){
				if(typeof value === 'object'){
					//find the property object that contains the coordinates data 
					if(keys === 'Property'){
						var x,y,height,width, id, className, type, title;
						var found = false;
						$.each(value, function(propertyKey, propertyValue){
							
							if(propertyValue.Name == "ID" && propertyValue.Value == rightClicked.attr("id")){
								found = true;
							}
							if(found && (propertyValue.Name == "height" || propertyValue.Name == "Height")){
								console.log("check value change");
								console.log(JSON.stringify(propertyValue));
								propertyValue.Value = rightClicked.attr("height")
								//console.log("check value change");
								console.log(JSON.stringify(propertyValue));
								return;
							}
							if(found && (propertyValue.Name == "width" || propertyValue.Name == "Width")){
								console.log("check value change");
								console.log(JSON.stringify(propertyValue));
								propertyValue.Value = rightClicked.attr("width");
								
								console.log(JSON.stringify(propertyValue));
								return;
							}
							if(found && (propertyValue.Name == "x" || propertyValue.Name == "X")){
								console.log("check value change");
								console.log(JSON.stringify(propertyValue));
								propertyValue.Value = rightClicked.attr("x");
								//console.log("check value change");
								console.log(JSON.stringify(propertyValue));
								return;
							}
							if(found && (propertyValue.Name == "y" || propertyValue.Name == "Y")){
								console.log("check value change");
								console.log(JSON.stringify(propertyValue));
								propertyValue.Value = rightClicked.attr("y");
								//console.log("check value change");
								console.log(JSON.stringify(propertyValue));
								return;
							}
							//console.log("location");
							//var change = location + "." + propertyValue.Name;
							//console.log(location + "." + propertyValue.Name);
							
						});
						
					}
					editJsonData(location + "." + keys, keys,value); 
				
				}
			});
		}
	} 
}

function editGUI(){
	$.each(editJson.GUI, function(key, val){ // loop through all the windows 
		if(typeof val === 'object') {
			editJsonData(editJson.GUI,key,val);
		}
	});
	console.log("start edit file");
	console.log(JSON.stringify(editJson));
}


$(document).ready(function(){
	
	$( "#mod-gui" ).dialog({
			autoOpen: false,
			height: 300,
			width: 350,
			modal: true,
			buttons: {
				Submit: function(){
					rightClicked.attr("x",$("#getx").val());
					rightClicked.attr("y",$("#gety").val());
					rightClicked.attr("width",$("#getw").val());
					rightClicked.attr("height",$("#geth").val());
					$("#savegui").css("background-color", "red");
					//$("#savegui").removeClass('btn-default').addClass('btn-danger');
					editGUI();
					
					$( this ).dialog( "close" );
				},
				Cancel: function() {
				  $( this ).dialog( "close" );
				}
			},
			close: function() {
				
		}
	});
		
	$('#menu').click(function() {
        $('#menu').hide();
    });
	
    $(document).click(function() {
        $('#menu').hide();
    });
	
	$('#modgui').click(function(){
		$("#getx").val(rightClicked.attr("x"));
		$("#gety").val(rightClicked.attr("y"));
		$("#geth").val(rightClicked.attr("height"));
		$("#getw").val(rightClicked.attr("width"));
		$( "#mod-gui" ).dialog( "open" );
		
	});
	
	
	$("#togglescreens").click(function() {
		if (screenon == true){
			screenon = false;
			$("#togglescreens").css("background-color", "white");
		}else{
			screenon = true;
			$("#togglescreens").css("background-color", "#428bca");
		}
		$(".screenshot").toggle();
	});	
	
	$("#toggletest").click(function() {
		if (tston == true){
			tston = false;
			$("#toggletest").css("background-color", "white");
		}else{
			tston = true;
			$("#toggletest").css("background-color", "#428bca");
		}
		console.log(mouseX + 'px' + " " + mouseY + 'py');
		$("#draggable").css("left", mouseX-300 +'px');
		$("#draggable").css("top", mouseY+50 +'px');
		$("#draggable").toggle();
		
	});	
	
	$("#togglegui").click(function(){
		if (guion == true){
			guion = false;
			$("#togglegui").css("background-color", "white");
		}else{
			guion = true;
			$("#togglegui").css("background-color", "#428bca");
		}
		$(".gui").toggle();
	});
	
	$("#toggleefg").click(function(){
		if (efgon == true){
			efgon = false;
			$("#toggleefg").css("background-color", "white");
		}else{
			efgon = true;
			$("#toggleefg").css("background-color", "#428bca");
		}
		$(".efg").toggle();
	});
	
	$("#savegui").click(function(){
		//$("#savegui").removeClass('btn-danger').addClass('btn-default');
		$("#savegui").css("background-color", "white");
	});
	
});

