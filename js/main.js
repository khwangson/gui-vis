
var rightClicked;
var counter = 0; // use to iD different <g> tag within SVG 
var zoomValue = .1;
var guion = false;
var efgon = false;
var tston = false;
var screenon = false;
var editJson;
var mouseX;
var mouseY;
var testcases = [];
var testID = [];
var testCounter = 0;
var cbFlags = [];

function zoomed() {
	var dragTarget = d3.select(this);
	var x = dragTarget.attr("x");
	var y = dragTarget.attr("y");
	
	var temp = dragTarget.attr("transform");
	var scale = parseFloat(temp.substring(temp.indexOf("scale")+6, temp.length -1));
	d3.select(this).attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
}

function rightClick(){
		rightClicked = d3.select(this);
		
		
		
		d3.select('#menu')
		.style('position', 'absolute')
		.style('left', mouseX + "px")
		.style('top', mouseY + "px")
		.style('display', 'block');

		d3.event.preventDefault();

}
	
//Generate a random color to draw the wire frame 
function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.round(Math.random() * 15)];
	}
	return color;
}

//Method for Dragging wire frames 
function zoomIn(){
	
	if(zoomValue < 1){
		zoomValue += .1;
		d3.selectAll("svg g").each(function() { 
			var dragTarget = d3.select(this);
			var x = dragTarget.attr("x");
			var y = dragTarget.attr("y");
			dragTarget.attr("transform", "translate(" + x + "," + y + ")scale(" + zoomValue + ")");
		});
	}
}

function zoomOut(){
	
	if(zoomValue > .2){
		zoomValue -= .1;
		d3.selectAll("svg g").each(function() { 
			var dragTarget = d3.select(this);
			var x = dragTarget.attr("x");
			var y = dragTarget.attr("y");
			dragTarget.attr("transform", "translate(" + x + "," + y + ")scale(" + zoomValue + ")");
		});
	}
}

function click(elm){
	this.parentNode.appendChild(this);
	var dragTarget = d3.select(this);
	var x = dragTarget.attr("x");
	var y = dragTarget.attr("y");
	
	var temp = dragTarget.attr("transform");
	var scale = parseFloat(temp.substring(temp.indexOf("scale")+6, temp.length -1));
	
	if(scale < 1){
		dragTarget.attr("transform", "translate(" + x + "," + y + ")scale(1)");
	}else{
		dragTarget.attr("transform", "translate(" + x + "," + y + ")scale(" + zoomValue + ")");
	}
}

function move() {
	this.parentNode.appendChild(this);
	var dragTarget = d3.select(this);
	dragTarget
		.attr("x", function(){return d3.event.dx + parseInt(dragTarget.attr("x"))})
		.attr("y", function(){return d3.event.dy + parseInt(dragTarget.attr("y"))});
	var x = dragTarget.attr("x");
	var y = dragTarget.attr("y");
	
	var temp = dragTarget.attr("transform");
	var scale = temp.substring(temp.indexOf("scale")+6, temp.length -1);
	d3.select(this).attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
}

//This function recursively look for x, y, width, height and draw it with D3 
function parseData(key, val, name){
	//ignore json object Window because it is a repeating window? 
	if(typeof val === 'object') {
		if(key == 'Window'){
			var title;
			$.each(val.Attributes.Property, function(windowKey, windowValue){
				if(windowValue.Name == "Title"){
					title = windowValue.Value;
				}
			});
			d3.select('#svgContainer svg #'+name).append('text')
			.text(title).attr('fill', 'black').style("stroke", "black");
		}else{
			$.each(val, function(keys, value){
				if(typeof value === 'object'){
					//find the property object that contains the coordinates data 
					if(keys === 'Property'){
						var x,y,height,width, id, className, type, title;
						$.each(value, function(propertyKey, propertyValue){
							if(propertyValue.Name == "Class"){
								className = propertyValue.Value;
								$("code").append(propertyValue.Name, propertyValue.Value, ", ");
							}
							if(propertyValue.Name == "ID"){
								id = propertyValue.Value;
								$("code").append(propertyValue.Name, propertyValue.Value, ", ");
							}
							if(propertyValue.Name == "Type"){
								type = propertyValue.Value;
								$("code").append(propertyValue.Name, propertyValue.Value, ", ");
							}
							if(propertyValue.Name == "Title"){
								title = propertyValue.Value;
								$("code").append(propertyValue.Name, propertyValue.Value, ", ");
							}
							if(propertyValue.Name == "height" || propertyValue.Name == "Height"){
								height = propertyValue.Value;
								$("code").append(propertyValue.Name, propertyValue.Value, ", ");
							}
							if(propertyValue.Name == "width" || propertyValue.Name == "Width"){
								width = propertyValue.Value;
								$("code").append(propertyValue.Name, propertyValue.Value, ", ");
							}
							if(propertyValue.Name == "x" || propertyValue.Name == "X"){
								x = propertyValue.Value;
								$("code").append(propertyValue.Name, propertyValue.Value, ", ");
							}
							if(propertyValue.Name == "y" || propertyValue.Name == "Y"){
								y = propertyValue.Value;
								$("code").append(propertyValue.Name, propertyValue.Value, ", ");
							}
						});
						//add a rect to svg with extracted coordinates and attributes 
						
						d3.select('#svgContainer svg #'+name).append("rect").attr("x", x).attr("id", id)
						.attr("y", y).attr("width", width).attr("height",height).attr("class", "gui").on("contextmenu", rightClick);


						$("code").append('<br/>');
						//output the data for testing purpose 
						
					}
					parseData(keys, value, name); 
				
				}
			});
		}
	} 
	$("#togglegui").css("background-color", "#428bca");
}
function parseTestData(key, val, name){
	//ignore json object Window because it is a repeating window? 
	
	if(typeof val === 'object') {
		$.each(val, function(keys, value){
				if(typeof value === 'object'){
					var id = "";
					var reaching = "";
					$.each(value, function(propertyKey, propertyValue){
						if(propertyKey == "EventId"){
							id = propertyValue;
							id = id.replace("e", "w");
						}if (propertyKey == "ReachingStep"){
							reaching = propertyValue;
						}
						
						if (reaching == "false"){
							$("#"+id).attr("fill", "green").attr("class", "gui test"+testCounter).attr("mycolor", "green");
							testcases[testCounter].push("#"+id);
							//alert(testcases[testCounter]);
						}
							
						else{
							$("#"+id).attr("fill", "red").attr("class", "gui test"+testCounter).attr("mycolor", "red");
							testcases[testCounter].push("#"+id);
							//alert(testcases[testCounter]);
						}
							

						
						
						//alert(id);
					});
				}
				parseTestData(keys, value, name);
		});
		//testCounter++;
	}
} 

function readGUI() {
	var files = document.getElementById('files').files;
	if (!files.length) {
		alert('No file selected!');
		return;
	}
	var file = files[0];
	var reader = new FileReader();
	
	// If we use onloadend, we need to check the readyState.
	reader.onloadend = function(evt) {
		if (evt.target.readyState == FileReader.DONE) { // DONE == 2
			var json = $.xml2json(evt.target.result); //convert xml to jSON 
			editJson = json;
			//console.log(JSON.stringify(json));
		
			var zoom = d3.behavior.zoom().scaleExtent([.1, 1]).on("zoom", zoomed);
			
			$("#showGraph").append("<div id='svgContainer'/>");
			//create the svg window 
			d3.select('#svgContainer').append("svg").attr("width", "100%").attr("height", "100%");
			
			//getting the width and height of the viewing frame 
			var width = document.getElementById('showGraph').offsetWidth;
			var height = document.getElementById('showGraph').offsetHeight;
			
			//var container = d3.select('svg').append("g").call(zoom);
			var container = d3.select('svg').append("g")
			.attr("transform", "translate(0,0)scale(1)");
			
			//draw the grid -x axis 
			container.append("g").attr("class", "x axis").selectAll("line")
			.data(d3.range(0, width, 10)).enter().append("line")
			.attr("x1", function(d) { return d; }).attr("y1", 0)
			.attr("x2", function(d) { return d; }).attr("y2", height);
			//draw the grid -y axis
			container.append("g").attr("class", "y axis").selectAll("line")
			.data(d3.range(0, height, 10)).enter().append("line")
			.attr("x1", 0).attr("y1", function(d) { return d; })
			.attr("x2", width).attr("y2", function(d) { return d; });
			
			var tempShiftX = 100;
			var tempShiftY = 100;
			counter = 0;
			$.each(json.GUI, function(key, val){ // loop through all the windows 
				
				if(typeof val === 'object') {
					var name = "g" + counter;  //making a unique iD for <g> tag 
					counter += 1;
					//append a <g> tag for each wire frame
					d3.select('#svgContainer svg').append("g").attr("id", name)
						.attr("x", tempShiftX).attr("y", tempShiftY).style("fill", "white")
						.style("stroke", getRandomColor())
						.call(d3.behavior.drag().on("drag", move))
						.on("dblclick", click)
						.attr("transform", "scale(" + zoomValue + ")").call(zoom)
						.attr("class", "gui");
					
					parseData(key, val, name); //looks into each seperate json object
					
					d3.select('#svgContainer svg #'+name)
					.attr("transform", "translate("+ tempShiftX +"," + tempShiftY + ")scale(" + zoomValue + ")")
					if(tempShiftX <= 400){
						tempShiftX += 70;
					}else{
						tempShiftX = 100;
						tempShiftY += 70;
					}
				}
			});

			$('#g1').hover(function(){

				d3.select(this).append("button").attr("name","button"); // Add a click handler
				
			});
				
		}
	};
	reader.readAsBinaryString(file);
	
} 

function drawEFG(matrix, widgetLU,eventGraph){
	var graph = { nodes: [], links: [] };
	
	for(i = 0; i < widgetLU.length; i++){
		var dragTarget = d3.select("#"+widgetLU[i]);
		var x = dragTarget.attr("x");
		var y = dragTarget.attr("y");
		var width = dragTarget.attr("width");
		var height = dragTarget.attr("height");
		var group = $("#"+widgetLU[i]).parents('g').attr('id');
		if(x != null && y != null){
			graph.nodes.push({ 
		        "x" : parseInt(x),
		        "y"  : parseInt(y),
		        "width"  : parseInt(width),
		        "height"  : parseInt(height),
		        "fixed": true,
		        "group": group
		    });
		}
	}
	//svg.selectAll("rect").each() 
	d3.selectAll("rect").each(function() {
		var target = d3.select(this);
		if($.inArray( target.attr("id"), widgetLU )){
			var group = $("#" + target.attr("id")).parents('g').attr('id');
			graph.nodes.push({ 
		        "x" : parseInt(target.attr("x")),
		        "y"  : parseInt(target.attr("y")),
		        "width"  : parseInt(target.attr("width")),
		        "height"  : parseInt(target.attr("height")),
		        "id" : target.attr("id"),
		        "fixed": true,
		        "group": group
		    });
			//console.log(target.attr("id"));
		}
	});
	
	
	
	for(i = 0; i < eventGraph.length; i++){
		for(j = 0; j < eventGraph.length; j++){
			if(matrix[i][j] === "1"){
				var temp = widgetLU[i] + "," + widgetLU[j]; 
				var reverse = widgetLU[j] + "," + widgetLU[i]; 
				//&& $.inArray(reverse, mapID) === -1 && $.inArray(temp, mapID) === -1
				if(widgetLU[i] != widgetLU[j] ){
					
					var dragTarget1 = d3.select("#"+widgetLU[i]);
					var x1 = dragTarget1.attr("x");
					var y1 = dragTarget1.attr("y");
					
					var dragTarget2 = d3.select("#"+widgetLU[j]);
					var x2 = dragTarget2.attr("x");
					var y2 = dragTarget2.attr("y");
					
					var dx = x1 - x2, dy = y1 - y1;
					var dist = Math.sqrt(dx * dx + dy * dy);
					
					graph.links.push({ 
				        "source" : i,
				        "target"  : j,
				        "distance" :  dist
				    });
				}
			}
		}
	}
	$("svg").remove();
	//console.log(JSON.stringify(graph));
	
	var width = document.getElementById('showGraph').offsetWidth;
	var height = document.getElementById('showGraph').offsetHeight;


var svg = d3.select('#svgContainer').append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .size([width, height])
    .charge(-1000);

//d3.json("testfile.json", function(graph) {
	//console.log(graph);
	var force = self.force = d3.layout.force()
		.nodes(graph.nodes)
		.links(graph.links)
		.gravity(0.05)
		.distance(1000)
		.start();

	var link = svg.selectAll(".link")
		.data(graph.links)
		.enter().append("line")
		.attr("class", "link efg")
		.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });

	var node_drag = d3.behavior.drag()
		.on("dragstart", dragstart)
		.on("drag", move)
		.on("dragend", dragend);
	
	
	var tempShiftX = 100;
	var tempShiftY = 100;
	var zoom = d3.behavior.zoom().scaleExtent([.1, 1]).on("zoom", zoomed);
	
	for(var i = 0; i < counter; i++ ){
		d3.select("svg").append("g").attr("id", "g"+i).call(node_drag)
		.attr("transform", "scale(" + zoomValue + ")")
		.style("stroke", getRandomColor())
		.on("dblclick", click)
		.attr("x", tempShiftX).attr("y", tempShiftY)
		.call(zoom).attr("class", "gui");;
		
		/*
		d3.select('svg').append("g").attr("id", "g"+i).call(node_drag)
		.attr("x", tempShiftX).attr("y", tempShiftY).style("fill", "white")
		.style("stroke", getRandomColor())
		.call(d3.behavior.drag().on("drag", move))
		.on("dblclick", click)
		.attr("transform", "scale(" + zoomValue + ")").call(zoom)
		.attr("class", "gui");
	*/
		
		var name = "g" + counter;
		
		
		d3.select('svg #'+name)
		.attr("transform", "translate("+ tempShiftX +"," + tempShiftY + ")scale(" + zoomValue + ")")
		if(tempShiftX <= 400){
			tempShiftX += 70;
		}else{
			tempShiftX = 100;
			tempShiftY += 70;
		}
	}
	
	var node = svg.selectAll("rect")
		.data(graph.nodes)
		.enter()
		.append("rect")
		.attr("class", "node gui")
		.attr("id", function(d) { return d.id; })
		.attr("x", function(d) { return d.x; })
		.attr("y", function(d) { return d.y; })
		.attr("width", function(d) { return d.width; })
		.attr("height", function(d) { return d.height; })
		.attr("group", function(d) { return d.group; });
		//.on("contextmenu", rightClick);
		
		
	console.log(node);
	$.each(node, function(key, value){
		$.each(value, function(key2, value2){
			$("#" + $(value2).attr("group")).append(value2);
		});
	});
	
	zoomIn();
	function dragstart(d, i) {
		force.stop(); // stops the force auto positioning before you start dragging
	}

	function dragend(d, i) {
		tick();
		force.resume();
	}
	
  
	force.on("tick", tick);
	
	

	function tick() {
		  link.attr("x1", function(d) { return parseInt($("#" + $(d.source).attr("group")).attr("x")) + Math.round(d.source.x * zoomValue) + Math.round(d.source.width/2 * zoomValue); })
		  .attr("y1", function(d) { return parseInt($("#" + $(d.source).attr("group")).attr("y")) + Math.round(d.source.y * zoomValue) + Math.round(d.source.height/2 * zoomValue); })
		  .attr("x2", function(d) { return parseInt($("#" + $(d.target).attr("group")).attr("x")) + Math.round(d.target.x * zoomValue) + Math.round(d.target.width/2 * zoomValue); })
		  .attr("y2", function(d) { return parseInt($("#" + $(d.target).attr("group")).attr("y")) + Math.round(d.target.y * zoomValue) + Math.round(d.target.height/2 * zoomValue); });

		}
	
	
	
}

function readEFG() {
	var files = document.getElementById('files').files;
	if (!files.length) {
		alert('No file selected!');
		return;
	}
	var file = files[0];
	var reader = new FileReader();
	
	// If we use onloadend, we need to check the readyState.
	reader.onloadend = function(evt) {
		if (evt.target.readyState == FileReader.DONE) { // DONE == 2
			var json = $.xml2json(evt.target.result); //convert xml to jSON 
		
			var zoom = d3.behavior.zoom().scaleExtent([.1, 1]).on("zoom", zoomed);
			
			$("#showGraph").append("<div id='svgContainer'/>");
			//create the svg window 
			d3.select('#svgContainer').append("svg").attr("width", "100%").attr("height", "100%");
			
			//getting the width and height of the viewing frame 
			var width = document.getElementById('showGraph').offsetWidth;
			var height = document.getElementById('showGraph').offsetHeight;
			
			//var container = d3.select('svg').append("g").call(zoom);
			var container = d3.select('svg').append("g")
			.attr("transform", "translate(0,0)scale(1)");
			
			//draw the grid -x axis 
			container.append("g").attr("class", "x axis").selectAll("line")
			.data(d3.range(0, width, 10)).enter().append("line")
			.attr("x1", function(d) { return d; }).attr("y1", 0)
			.attr("x2", function(d) { return d; }).attr("y2", height);
			//draw the grid -y axis
			container.append("g").attr("class", "y axis").selectAll("line")
			.data(d3.range(0, height, 10)).enter().append("line")
			.attr("x1", 0).attr("y1", function(d) { return d; })
			.attr("x2", width).attr("y2", function(d) { return d; });
			

			//Code for EFG----------------------------------------
			var eventGraph = json.EventGraph.Row;
			var widgets = json.Events.Event;
			var i ,j = 0;
			var matrix = new Array(eventGraph.length);
			var widgetLU = new Array(widgets.length);
		
			
			//Populate widget look-up array. 
			for(i = 0; i < widgets.length; i++){
				widgetLU[i] = widgets[i].WidgetId;
				console.log(widgetLU[i]);
			}
			
			//Create a matrix of event graph for widgets
			for(i = 0; i < eventGraph.length; i++){
				matrix[i] = new Array(eventGraph.length);
				for(j = 0; j < eventGraph.length; j++){
					matrix[i][j] = eventGraph[i].E[j];
					
				}
			}
			
			var table = $('<table></table>');
			table.append("<tr><th>Widget ID</th><th colspan="+eventGraph.length+">Events</th></tr>");
			for(i = 0; i < eventGraph.length; i++){
				var row = $('<tr></tr>');
				var w = $('<td>'+widgetLU[i]+'</td>');
				row.append(w);
				for(j = 0; j < eventGraph.length;j++){
					var data;
					if(matrix[i][j] === "1"){
						data = $('<td bgcolor="#00FF00">'+matrix[i][j]+'</td>');
					}
					else if(matrix[i][j] ==="2"){
						data = $('<td bgcolor="#F0E68C">'+matrix[i][j]+'</td>');
					}
					else{
						data = $('<td>'+matrix[i][j]+'</td>');
					}	 
					table.append(row);
					row.append(data);
					//console.log(matrix[i][j]);
				}
			}

			$('#matrix').append(table);
			drawEFG(matrix,widgetLU,eventGraph);
				
			//-----------------------------------------------------
			$('#g1').hover(function(){

				//d3.select(this).append("button").attr("name","button"); // Add a click handler
				
			});
				
		}
	};
	reader.readAsBinaryString(file);
}

function readTest() {
	var files = document.getElementById('files').files;
	if (!files.length) {
		alert('No file selected!');
		return;
	}
	
	var file;
	var length = files.length;
	var i;


	for(var j = 0; j < length; j++){

		testID.push(files[j].name);
		var row = $("<tr id=row"+j+"></tr>");
		var checkbox = $("<td><input type=\"checkbox\" id=cb"+j+" checked=\"true\"/></td>");
		var w = $('<td>'+files[j].name+'</td>');
		row.append(checkbox);
		row.append(w);
		$("#tc_table").append(row);
		//alert($(".tc_table tr").children('td').text());
	}

	for (i = 0; i < length; i++){
	
		var reader = new FileReader();
	
		file = files[i];


		// If we use onloadend, we need to check the readyState.
		reader.onloadend = function(evt) {
			if (evt.target.readyState == FileReader.DONE) { // DONE == 2
				var json = $.xml2json(evt.target.result); //convert xml to jSON 
				testcases[testCounter] = new Array();
				cbFlags[testCounter] = new Array();
				cbFlags[testCounter][0] = true;
				$.each(json, function(key, val){ // loop through all the windows 
					parseTestData(key, val, name); //looks into each seperate json object
					
				});
				testCounter++;		
			}
		};
		reader.readAsBinaryString(file);

		
	}

	
	

}

$(document).ready(function(){
	
	$(document).mousemove(function(e) {
		mouseX = e.pageX;
		mouseY = e.pageY;
	}).mouseover();
	
	$( "#extractGUI" ).click(function() {
		$(".gui").remove();
		$("svg").remove();
		$("#togglegui").css("background-color", "yellow");
		//$("#togglegui").removeClass('btn-default').addClass('btn-warning');
		guion = true;
		readGUI();
		
	});

	$( "#extractEFG" ).click(function() {
		if (guion == true){
			efgon = true; 
			//$("#toggleefg").removeClass('btn-default').addClass('btn-warning');
			$("#toggleefg").css("background-color", "yellow");
			readEFG();
			$("#toggleefg").css("background-color", "#428bca");
			//$("#toggleefg").removeClass('btn-warning').addClass('btn-default');
		}else{
			event.preventDefault();
			alert("Please submit a GUI file first");
		}

	});
	
	$( "#test" ).click(function() {
		if (guion == true){
			tston = true;
			readTest();
			$("#draggable").show();
			$("#toggletest").css("background-color", "#428bca");
		}else{
			event.preventDefault();
			alert("Please submit a GUI file first");
		}
	}); 
	
	$( "#zoomIn" ).click(function() {
			zoomIn();
	});
	$( "#zoomOut" ).click(function() {
			zoomOut();
	});	
	

	$("#uploadScreenshots").click(function() {
		if (guion == true){
			screenon = true;
			getScreenShots();
			$("#togglegui").css("background-color", "#428bca");
		}else{
			event.preventDefault();
			alert("Please submit a GUI file first");
		}
	});




 $(function() {
    $( "#draggable" ).draggable();
  });


  $("#checkAll").click(function(){
    $(":checkbox").prop('checked', true);

    for(var i = 0; i < testID.length; i++){
    	cbFlags[i][0] = true;
    	for (var j = 0; j < testcases[i].length; j+=2){
    		$(testcases[i][j]).attr("fill", $(testcases[i][j]).attr("mycolor"));
    	}
    }

  });

  $('#uncheckAll').click(function(){
    $(":checkbox").attr('checked', false);
    for(var i = 0; i < testID.length; i++){
    	cbFlags[i][0] = false;
    	for (var j = 0; j < testcases[i].length; j+=2){
    		$(testcases[i][j]).attr("fill", "white");
    	}
    }
  });



	$(document.body).on("change", ":checkbox", function(){
	
		var testcase = $($(this).parent().next()).text();
		var index = testID.indexOf(testcase);


		if(this.checked){
			cbFlags[index][0] = true;
			for(var k = 0; k < testcases[index].length; k+=2){
				$(testcases[index][k]).attr("fill", $(testcases[index][k]).attr("mycolor"));
				
			// 	console.log(testcases[index][k]);
			}
	
		}else{
			 cbFlags[index][0] = false;
			 for(var k = 0; k < testcases[index].length; k+=2){
				$(testcases[index][k]).attr("fill", "white");

			  }
		
		}


	});	

	$("draggable").hide();
	
});