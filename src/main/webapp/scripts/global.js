/**
 * global variables that will be used in the system
 */
	var map;  
    var markers=[];
    var msgMarkers=[];
    var alertMarkers=[];
    var reviewMarkers=[];
    var userMarkers= [];
    var friendsMarkers={};
    var chatMsg = [];
    var latitude;
    var longitude ;
    var city ;
    var country ;
    var country_code;
    var region ;
    var text; 
    var homeLatlng;
    var homeLatlngJSON;
    var usersJSON;
    var usersNicknameJSON;
    var lastReceivedData;
    var userNickName;
    var homeControlDiv;
    var homeControl;
    var lasttime=0;
    
    /**
     * The HomeControl adds a control to the map that
     * returns the user to the control's defined home.
     */
    function HomeControl(map, div) {

      // Get the control DIV. We'll attach our control UI to this DIV.
      var controlDiv = div;

      // We set up a variable for the 'this' keyword since we're adding event
      // listeners later and 'this' will be out of scope.
      var control = this;

      // Set the home property upon construction.
      //control.home_ = home;

      // Set CSS styles for the DIV containing the control. Setting padding to
      // 5 px will offset the control from the edge of the map.
      controlDiv.style.padding = '5px';

      // 1.Client Location
      var goHomeUI = document.createElement('div');
      goHomeUI.title = 'Click to set the map to Your Location';
      controlDiv.appendChild(goHomeUI);

      // Set CSS for the control interior.
      var goHomeText = document.createElement('div');
      goHomeText.innerHTML = '<strong>Client Location</strong>';
      goHomeUI.appendChild(goHomeText);

      
      // 2.Client Logout
      var setHomeUI = document.createElement('div');
      setHomeUI.title = 'Click to login out';
      controlDiv.appendChild(setHomeUI);

      // Set CSS for the control interior.
      var setHomeText = document.createElement('div');
      setHomeText.innerHTML = '<strong>Login out</strong>';
      setHomeUI.appendChild(setHomeText);
      
      // 3.Show Your Friends
      var friendMenuUI = document.createElement('div');
      friendMenuUI.title = 'Friends Menu';
      controlDiv.appendChild(friendMenuUI);

      // Set CSS for the control interior.
      var friendMenuText = document.createElement('div');
      friendMenuText.innerHTML = '<strong>People Nearby</strong>';
      friendMenuUI.appendChild(friendMenuText);
      
      // 4.Set your account logo
      var logoUI = document.createElement('div');
      logoUI.title = 'Set Your Account Logo';
      controlDiv.appendChild(logoUI);

      // Set CSS for the control interior.
      var logoText = document.createElement('div');
      logoText.innerHTML = '<strong>Account Logo</strong>';
      logoUI.appendChild(logoText);

      // Setup the click event listener for goHome:
      // simply set the map to the control's current home property.
      google.maps.event.addDomListener(goHomeUI, 'click', function() {
        //var currentHome = control.getHome();
        map.setCenter(homeLatlng);
      });
           
      //Setup click event listener for setting account logo
      google.maps.event.addDomListener(logoUI, 'click', function() {
          setLogo();
      });
      
      // Setup the click event listener for Logout
      google.maps.event.addDomListener(setHomeUI, 'click', function() {
        exit();
      });
      
      // Setup the click event listener for friend Menu
      google.maps.event.addDomListener(friendMenuUI, 'click', function() {
          //$("#menu").menu();
    	  $("ul#friendMenu").sidebar({
    		  position:"right",
    		  callback:{
	    		  item : {
		    		  enter : function(){
		    		  $(this).find("a").animate({color:"red"}, 250);
		    		  },
		    		  leave : function(){
		    			  $(this).find("a").animate({color:"white"}, 250);
		    		  }
	    		  }
    		  }
    		  });
        });
    }    

/**
 * geology data init function
 * get user's location via their IP address
 */
    
function geoInit() {    
    if (google.loader.ClientLocation) {

        latitude = google.loader.ClientLocation.latitude;
        longitude = google.loader.ClientLocation.longitude;
        city = google.loader.ClientLocation.address.city;
        country = google.loader.ClientLocation.address.country;
        country_code = google.loader.ClientLocation.address.country_code;
        region = google.loader.ClientLocation.address.region;
        homeLatlng = new google.maps.LatLng(latitude,longitude);
        homeLatlngJSON = {"lat":latitude,"lng":longitude};
        
        text = 'Your Location<br /><br />Latitude: ' + latitude + '<br />Longitude: ' + longitude + '<br />City: ' + city + '<br />Country: ' + country + '<br />Country Code: ' + country_code + '<br />Region: ' + region;

    } else {
        text = 'Google was not able to detect your location';
        alert(text);
    }
}

/**
 * post User function using AJAX to communicate with the backend
 * post the User's login geo data to the backend and store the geo data in the memcache
 * other uses could read from the memcache to locate your login location
 */
function postUser(){
	
	$(function(){$.ajax({
		type:'POST',
		url:'/context/jerseyws/postuser',
		data:JSON.stringify(homeLatlngJSON),
		contentType: 'application/json; charset=UTF-8',
        success: function(data){
        	usersNicknameJSON = data;
        },
        error: function(){
        	alert("Error Hell");
        }
	});});
	
}


/**
 * initialize function for the whole map based social network
 */
function initialize() {
		 usersNicknameJSON = null;
		 geoInit();
		 postUser();
		 getUserNickName();
    	 
		/**
		 * mapOptions setup for the google map
		 */ 
        var mapOptions = {
          center: 
          homeLatlng,
          zoom: 12,
    
        };
        /**
         * init the map with the map setting
         */
        map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);
        
        
        /**
         * homeControlDiv init
         */
        homeControlDiv = document.createElement('div');
        homeControl = new HomeControl(map, homeControlDiv);
        homeControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
        
        /**
         * longPolling AJAX function to get Other login users info from the backend memcache
         */
    	$(function longPolling(){$.ajax({
    		type:'POST',
    		url:'/context/jerseyws/userinit',
    		data:usersNicknameJSON,
    		contentType: 'application/json; charset=UTF-8',
            success: function(data,textStatus){
            	if(data!=null){
            		usersJSON = data;
            		getFriends(data);
            	}
            	
            	//watch out for the no-content case
                    longPolling();
            },
            error: function(textStatus){
            	if("timeout"){
            		longPolling();
            	}
            	else{
            		longPolling();
            	}
            }
    	});});
    	
    	/**
    	 * longPolling AJAX function to get Other login chat msg from the backend memcache
    	 */
    	$(function longPollingChatMsg(){$.ajax({
    		type:'GET',
    		url:'/context/jerseyws/receivemsg',
            success: function(data,textStatus){
            	if(data!=null){
            		usersJSON = data;
            		parseChatMsg(data);      
            	}
            	//watch out for the no-content case
            		longPollingChatMsg();
            },
            error: function(textStatus){
            	if("timeout"){
            		longPollingChatMsg();
            	}
            	else{
            		longPollingChatMsg();
            	}
            }
    	});});
        
    	/**
    	 * get markers from the datastore using the AJAX from backend
    	 */
    	$(function(){$.ajax({
    		type:'GET',
    		url:'/context/jerseyws/markerinit',
            success: function(data){
            	getData(data);
            },
            error: function(){
            	alert("Error Hell");
            }
    	});});  
          
        /**
         * rightclick on the map event set up
         * when rightclick on the map, you will have a dialog that could fill out the marker information
         * and the marker will be stored in the datastore, when other users login they will retrive the markers from the backend
         * These markers are typed to "Msg","Alert","Review" with different logos on the map
         * These markers could warn others ,leave a msg, give a review for a shop or others
         */
        google.maps.event.addListener(map,'rightclick',function(event){
        	var menu = document.getElementById("map_canvas");
        	var element = document.getElementById("addMsg");
        	        	        	
            var lat = event.latLng.lat();
            var lng = event.latLng.lng();
            
            var marker = new Object();

            $( "#myForm" ).dialog({
                open: function() {
                    $( this ).find( "[type=submit]" ).hide();
                },
                buttons: [
                    {
                        text: "Submit A Msg",
                        click: function(){
                        	var type = $("#myForm").find("#type").val();
                        	var title = $("#myForm").find("#title").val();
                        	var text = $("#myForm").find("#text").val();
                        	
                        	var Msg = {"lat":lat,"lng":lng,"type":type,"title":title,"text":text};
                        	var json = $.toJSON(Msg);
                        	var str = "hello world";
                        	
                        	$(function(){$.ajax({
                        		type:'POST',
                        		url:'/context/jerseyws/enqueue',
                        		data:JSON.stringify(Msg),
                        		contentType: 'application/json; charset=UTF-8',
	                            success: function(data){
	                            },
	                            error: function(){
	                            	alert("Error Hell");
	                            }
                        	});});
                        	
                        	placeMarker(event.latLng,type,title,text,null,null);
                        	
                        	$(this).dialog("close");
                        },
                        type: "submit",
                    },
                    {
                        text: "Close",
	                        click: function() {
	                            $( this ).dialog( "close" );
                        }
                    }
                ]
            });
        });

        /**
         * placeMarker function that will place the marker on the map, markers could be typed into
         * "User","Alert","Msg","Review"
         */
        function placeMarker(location,type, title, text,friend,logo) {
            var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">'+title+'</h1>'+
            '<div id="bodyContent">'+
            '<p>'+text+'</p>'+
            '</div>'+
            '</div>';
        	var infoWindow;
        	
	        	switch(type){
		        	case "Msg":var image='image/Technorati.png';break;
		        	case "Alert":var image = 'image/Alert.png';break;
		        	case "Review":var image = 'image/Review.png';break;
		        	case "User":var image = 'image/User.png';break;
		        	default:break;
	        	}
	        	
	        	var marker = new google.maps.Marker({
	        	      position: location,
	        	      map: map,
	        	      title:title,
	        	      animation: google.maps.Animation.DROP,
	        	      icon:image
	        	  });
	        switch(type){
	        	case "Msg":msgMarkers.push(marker);break;
	        	case "Alert":alertMarkers.push(marker);break;
	        	case "Review":reviewMarkers.push(marker);break;
	        	case "User":userMarkers.push(marker);friendsMarkers[friend]=marker;
	        	contentString = '<div><h1>'+friend+' Logo'+'</h1><img src='+logo+'></div>';
	        	break;
	        	default:break;
        	}
	        map.setCenter(location);
	        
	       	google.maps.event.addListener(marker,'click',function(){
	       		if(marker.getAnimation()!=null){
	       			marker.setAnimation(null);
	       		}
	       		else{
	       			marker.setAnimation(google.maps.Animation.BOUNCE);
	       		}
	       	});
	       	
	        infoWindow = new google.maps.InfoWindow({
            	content: contentString
            });
	       	
	       	google.maps.event.addListener(marker,'click',function(){
	       		infoWindow.open(map,marker);
	       	});
        }
        
        /**
         * parse the received markers data from the datastore
         */
        function getData(receivedData){	
	        if(receivedData!="]"){
	          var data = JSON.parse(receivedData);
	      	  for(var i=0;i<data.length;i++){
	      		  var msg = data[i];
	      		  var type = msg.type;
	      		  var lat = msg.lat;
	      		  var lng = msg.lng;
	      		  var title = msg.title;
	      		  var text = msg.text;
	      		  
	      		  var latLng = new google.maps.LatLng(lat,lng);
	      		  placeMarker(latLng,type,title,text,null,null);
	      	  }
	        }
        }
        
        
        /**
         * parse the users login data from the backend memcache
         */
        function getFriends(receivedData){
        	var data = JSON.parse(receivedData);
        	
          	  for(var i=0;i<data.length;i++){
          		  var friend = data[i];
          		  
          		  if(lastReceivedData!=null){
        	  		  if(!isOnline(friend.nickName)){
        	  			  if(friend.nickName!=userNickName){
        	  				  chatMsg[friend.nickName]=[];
        	  			  }
        	  			  
        				  var li = document.createElement("li");
        				  li.id = friend.nickName;
        				  li.innerHTML = friend.nickName;
        				  li.style.color = "green";
        				  li.addEventListener("click", function(){
        					  findFriend(this.id);
        				  });
        				  $("#friendMenu").append(li);
        				  friendLatlng = new google.maps.LatLng(friend.lat,friend.lng);
        				  placeMarker(friendLatlng,"User","","",friend.nickName,getUserLogo(friend.nickName)/*friend.logo*/);
        	  		  }
        	  		  checkOfflineFriends(receivedData);
          		  }
          		  else{
    	  			  if(friend.nickName!=userNickName){
    	  				  chatMsg[friend.nickName]=[];
    	  			  }
          			  
          			  var li = document.createElement("li");
        			  li.id = friend.nickName;
        			  li.innerHTML = friend.nickName;
        			  li.style.color = "green";
        			  li.addEventListener("click", function(){
    					  findFriend(this.id);
    				  });
        			  $("#friendMenu").append(li);
        			  friendLatlng = new google.maps.LatLng(friend.lat,friend.lng);
    				  placeMarker(friendLatlng,"User","","",friend.nickName,getUserLogo(friend.nickName)/*friend.logo*/);
          		  }
          	  }
          	  
          	  lastReceivedData = receivedData;
            }  
        
        /**
         * check the offline friends msg from the users login data 
         * this will help updating the users info on the Friends Nearby Widget
         */
        function  checkOfflineFriends(receivedData){
        	var data = JSON.parse(receivedData);
        	var lastData = JSON.parse(lastReceivedData);
        	var flag;
        	
        	for(var i =0 ;i<lastData.length;i++){
        		flag = false;
        		for(var j=0;j<data.length;j++){
        			if(lastData[i].nickName==data[j].nickName){
        				flag = true;
        			}
        		}
        		if(flag == false){
        			var li = document.getElementById(lastData[i].nickName);
        			if(li!=null){
        				li.remove();
        			}
        			friendsMarkers[lastData[i].nickName].setMap(null);
        		}
        	}
        }
}

/**
 * 
 * @param map
 * setAllMap function this will set all the markers on the map
 */
  function setAllMap(map){
	  for(var i=0;i<markers.length;i++){
		  markers[i].setMap(map);
	  }
  }
  
  /**
   * clearMarkers funciton
   * this will set all the markers hidden
   */
  function clearMarkers(){
	  setAllMap(null);
  }
  
  /**
   * showMarkers function
   * this will show all the markers on the map
   */
  function showMarkers(){
	  setAllMap(map);
  }
  
  /**
   * deleteMarkers function
   * this will delete all the markers from the map
   */
  function deleteMarkers(){
	  clearMarkers();
	  markers=[];
  }

  /**
   * 
   * @param receiveddata
   * parse ChatMsg and show the msg on the chatting dialog with each user
   */
  function parseChatMsg(receiveddata){
	  var data = JSON.parse(receiveddata);
	  if(data!=null){
		  for(var i=0;i<data.length;i++){
			  var time = data[i].time;
			  var name = data[i].nickname;
			  var text = data[i].text;
			  
			  if(time>lasttime){
				  if($("#"+name+"chatBox").length ==0){
					  var cb = document.createElement('div');
					  cb.id = name+"chatBox";
					  
					  var textarea = document.createElement('textarea');
					  textarea.id = "text";
					  textarea.rows = 5;
					  textarea.cols = 20;
					  
					  document.body.appendChild(cb);
					  $("#"+name+"chatBox").append(textarea);
					  
					  var button = document.createElement('button');
					  button.type = "submit";
					  
					  $("#"+name+"chatBox").append(button);
				  }
				  
				  if($("#"+name+"chatBox").find("#"+name).length !=0){
					  var li = document.createElement("li");
		        	  
		        	  li.innerHTML = name+":"+text;
		        	  $("#"+name+"chatBox").find("#"+name).append(li);
				  }
				  else{
					  var ul = document.createElement('ul');
	            	  ul.id=name;
	            	  $("#"+name+"chatBox").append(ul);
	            	  
	            	  var li = document.createElement("li");
		        	  
		        	  li.innerHTML = name+":"+text;
		        	  $("#"+name+"chatBox").find("#"+name).append(li);
				  }
				  lasttime = time;
			  }
		  }
	  }
  }
  
  /**
   * 
   * @param nickname
   * findFriend function for opening the chatting dialog with each user
   */
  function findFriend(nickname){
	  if(nickname!=userNickName){
		  if($("#"+nickname+"chatBox").length ==0){
			  var cb = document.createElement('div');
			  cb.id = nickname+"chatBox";

			  var textarea = document.createElement('textarea');
			  textarea.id = "text";
			  textarea.rows = 5;
			  textarea.cols = 20;
			  
			  document.body.appendChild(cb);
			  $("#"+nickname+"chatBox").append(textarea);
			  
			  var button = document.createElement('button');
			  button.type = "submit";
			  
			  $("#"+nickname+"chatBox").append(button);
		  }
		  
	      $( "#"+nickname+"chatBox" ).dialog({
	          open: function() {
	              // On open, hide the original submit button
	              $( this ).find( "[type=submit]" ).hide();
	              $(".ui-dialog-titlebar-close").hide();
	              
	              var copyMsg = chatMsg;
	              
	              if($("#"+nickname+"chatBox").find("#"+nickname).length ==0){
	            	  var ul = document.createElement('ul');
	            	  ul.id=nickname;

	            	  $("#"+nickname+"chatBox").append(ul);

	              }    
	          },
	          buttons: [
	              {
	                  text: "Submit your Msg",
	                  click: function(){
	                  	var text = $("#"+nickname+"chatBox").find("#text").val();
	                  	date = new Date();
	                  	time = date.getTime();
	                  	
	                  	var li = document.createElement("li");
		            	li.innerHTML = userNickName+":"+text;
		            	$("#"+nickname+"chatBox").find("#"+nickname).append(li);
	                  	
		            	var msgSent = {"time":time,"nickname":nickname,"text":text};
	                  	
	                  	$(function(){$.ajax({
	                  		type:'POST',
	                  		url:'/context/jerseyws/sendmsg',
	                  		data:JSON.stringify(msgSent),
	                  		
	                  		contentType: 'application/json; charset=UTF-8',
	                          success: function(data){
	                          	
	                          },
	                          error: function(){
	                          	alert("Error Hell");
	                          }
	                  	});});
	                  	
	                  },
	                  type: "submit",
	                  
	              },
	              {
	                  text: "Close",
	                      click: function() {
	                    	  
	                          $( this ).dialog( "close" );
	                  }
	              }
	          ]
	      });
	  }
  }
  
  /**
   * 
   * @param nickname
   * @returns {Boolean}
   * 
   * checks if a user is online
   * return true/false
   */
  function isOnline(nickname){
	 	var lastData = JSON.parse(lastReceivedData);
		var flag=false;
		
		for(var i =0 ;i<lastData.length;i++){
			if(lastData[i].nickName == nickname){
				flag = true;
			}
		}
		return flag;
  }
  /**
   * 
   * @param nickname
   * @returns
   * get User's logo from the recievedData from the datastore
   * 
   */
  function getUserLogo(nickname){
  	var data = JSON.parse(usersNicknameJSON);
  	
	  for(var i=0;i<data.length;i++){
		  if(data[i].nickName == nickname){
			  return data[i].logo;
		  }
	  }
  }

  /**
   * set Logo function when clicking on the Account Logo button
   */
function setLogo(){
	window.location.href='http://pure-league-728.appspot.com/setlogo.jsp';
}  

/**
 * log out function 
 */
function exit(){
	var confirmExit = confirm("Are you sure to exit the app?");
	
	if(confirmExit==true){
    	$(function(){$.ajax({
    		type:'GET',
    		async: false,
    		url:'/context/jerseyws/loginout',
            success: function(data){
            	if(data!='failure'){
            		window.location.href=data;
            	}
            },
            error: function(){
            	alert("Error Hell");
            }
    	});});
	}
}

/**
 * get the User's nickname from the backend
 */
function getUserNickName(){
	$(function(){$.ajax({
		type:'GET',
		url:'/context/jerseyws/getusername',
        success: function(data){
        	if(data!='failure'){
        		userNickName = data;
        	}
        	else{
        		alert("Please Login in");
        	}
        },
        error: function(){
        	alert("Error Hell");
        }
	});});
}

/**
 * main function 
 * addDomListener for the window loading event
 * after loading the initialize function will be loaded
 */
google.maps.event.addDomListener(window, 'load', initialize);

