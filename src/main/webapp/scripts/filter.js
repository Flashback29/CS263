function checkBoxAlert(){
	if($('#checkBoxAlert').is(':checked')==false){
		//hideAlert();
		//alert(alertMarkers.length);
		  for(var i=0;i<alertMarkers.length;i++){
			  //alert(i);
			  alertMarkers[i].setMap(null);
		  }
		
//		alert("alert test");
	}
	else{
		showAlert(map);
	}
}

function checkBoxMsg(){
	//alert("alert test");
	if($('#checkBoxMsg').is(':checked')==false){
		hideMsg();
		//alert("msg test");
	}
	else{
		showMsg(map);
	}
}
function checkBoxReview(){
	//alert("alert test");
	if($('#checkBoxReview').is(':checked')==false){
		hideReview();
		//alert("review test");
	}
	else{
		showReview(map);
	}
}
    	
function hideAlert(){
	//alert("alert test");
	  for(var i=0;i<alertMarkers.length;i++){
		  //alert(i);
		  alertMarkers[i].setMap(null);
	  }
}
function showAlert(map){
	  for(var i=0;i<alertMarkers.length;i++){
		  alertMarkers[i].setMap(map);
	  }
}  

function hideMsg(){
	  for(var i=0;i<msgMarkers.length;i++){
		  msgMarkers[i].setMap(null);
	  }
}
function showMsg(){
	  for(var i=0;i<msgMarkers.length;i++){
		  msgMarkers[i].setMap(map);
	  }
}
    	
function hideReview(){
	  for(var i=0;i<reviewMarkers.length;i++){
		  reviewMarkers[i].setMap(null);
	  }
}
function showReview(map){
	  for(var i=0;i<reviewMarkers.length;i++){
		  reviewMarkers[i].setMap(map);
	  }
}