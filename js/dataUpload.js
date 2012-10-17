function startRead() {  
  // obtain input element through DOM 
  
  var file = document.getElementById('newDataSet').files[0];
  if(file){
    consoleMess("Loading dataset...");
    getAsText(file);
  }
}

function getAsText(readFile) {
        
  var reader = new FileReader();
  
  // Read file into memory as UTF-8      
  reader.readAsText(readFile);
  
  // Handle progress, success, and errors
  reader.onprogress = updateProgress;
  reader.onload = loaded;
  reader.onerror = errorHandler;
}

function updateProgress(evt) {
  if (evt.lengthComputable) {
    // evt.loaded and evt.total are ProgressEvent properties
    var loaded = (evt.loaded / evt.total);
    if (loaded < 1) {
    }
  }
}

function loaded(evt) {  
  // Obtain the read file data    
  var fileString = evt.target.result;
  //Reading Json and creating Object
  var index = datasets.push(new DataSet());
  var data = eval('(' + fileString + ')').dataset;
  datasets[index-1].setPoints(data.points);
  if(typeof data.name !== 'undefined' && data.name !== '') {
    datasets[index-1].setName(data.name);
  }
  else {
    datasets[index-1].setName("Dataset #"+index);
  }

  datasets[index-1].loaded = true;
  //Adding dataset to the UI
	//Create accordion
	$("#accordionData").append("<h3><a href='#'>"+datasets[index-1].name+"</a></h3><div id='worldDataAccordion"+index+"'>");
	$("#worldDataAccordion"+index+"").append("<div id='worldSelectData"+index+"'></div>");
	for(var i=1;i<=worlds.length;i++) {
		$("#worldSelectData"+index+"").append("<h2><a href=\"#\">world "+i+"</a></h2><div id='worldSelectData"+index+"-"+i+"'><select id='worldButtonData"+index+""+i+"'><option class='noaction'>Select Data</option><option class='raw'>Raw Data</option></select></div>");
		$("#worldButtonData"+index+""+i+"").bind("change",{world:i,dataset:index},selectDataHandler);
	}
	//create JqueryUI radio button
	$( "#worldSelectData"+index+"" ).accordion({header: "h2", heightStyle: "content"});
	
	//Appening input file to import cluster data
	$("#worldDataAccordion"+index+"").append("<div id='clustAccordion"+index+"'></div>");
	$("#worldDataAccordion"+index+"").append("Add cluster data : <input class='clusterFile' id='clusterFile"+(index-1)+"' type='file'>");
	$("#worldDataAccordion"+index+"").append("</div>");
	$("#accordionData").accordion({ header: "h3" , heightStyle: "content"});
	$("#accordionData").accordion('destroy');
	$("#accordionData").accordion({ header: "h3" , heightStyle: "content"});
	$("#accordion").accordion( "refresh" );
	consoleMess("Loaded dataset \""+datasets[index-1].name+"\" containing "+datasets[index-1].points.length+" points");
	
      
}

function errorHandler(evt) {
  if(evt.target.error.name == "NotReadableErr") {
	consoleMess("Could not read this file ? Wrong permissions ?");
  }
}