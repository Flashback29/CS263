/**
 * check Alert box for the filter options
 */
function checkBoxAlert(){
	if($('#checkBoxAlert').is(':checked')==false){
		  for(var i=0;i<alertMarkers.length;i++){
			  alertMarkers[i].setMap(null);
		  }
	}
	else{
		showAlert(map);
	}
}

/**
 * check Msg box for the filter options
 */
function checkBoxMsg(){
	if($('#checkBoxMsg').is(':checked')==false){
		hideMsg();
	}
	else{
		showMsg(map);
	}
}

/**
 * check Review box for the filter options
 */
function checkBoxReview(){
	if($('#checkBoxReview').is(':checked')==false){
		hideReview();
	}
	else{
		showReview(map);
	}
}
    	
/**
 * hide the alert markers
 */
function hideAlert(){
	  for(var i=0;i<alertMarkers.length;i++){
		  alertMarkers[i].setMap(null);
	  }
}

/**
 * show alert markers
 * @param map
 */
function showAlert(map){
	  for(var i=0;i<alertMarkers.length;i++){
		  alertMarkers[i].setMap(map);
	  }
}  

/**
 * hide the msg markers
 */
function hideMsg(){
	  for(var i=0;i<msgMarkers.length;i++){
		  msgMarkers[i].setMap(null);
	  }
}

/**
 * show the alert markers
 */
function showMsg(){
	  for(var i=0;i<msgMarkers.length;i++){
		  msgMarkers[i].setMap(map);
	  }
}
    	

/**
 * hide the review markers
 */
function hideReview(){
	  for(var i=0;i<reviewMarkers.length;i++){
		  reviewMarkers[i].setMap(null);
	  }
}

/**
 * show the review markers
 * @param map
 */
function showReview(map){
	  for(var i=0;i<reviewMarkers.length;i++){
		  reviewMarkers[i].setMap(map);
	  }
}