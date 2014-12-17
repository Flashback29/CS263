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
    /*
    // Define a property to hold the Home state.
    HomeControl.prototype.home_ = null;

    // Define setters and getters for this property.
    HomeControl.prototype.getHome = function() {
      return this.home_;
    };

    HomeControl.prototype.setHome = function(home) {
      this.home_ = home;
    };
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
           
      //Set account logo button
      google.maps.event.addDomListener(logoUI, 'click', function() {
          setLogo();
      });
      
      // Setup the click event listener for Set Home:
      // Set the control's home to the current Map center.
      google.maps.event.addDomListener(setHomeUI, 'click', function() {
        exit();
      });
      
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
/*
function addMsg(event){
	var menu = document.getElementById("map_canvas");
	var element = document.getElementById("addMsg");
	
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    // populate yor box/field with lat, lng
    alert("Lat=" + lat + "; Lng=" + lng);
}*/     
/*
function geoInit() {
    if (navigator.geolocation) {
    	//alert("Geolocation is supported by this browser.");
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        //alert( "Geolocation is not supported by this browser." );
    }
}
function showPosition(position) {
	latitude = position.coords.latitude;
	longitude =position.coords.longitude;
	homeLatlng = new google.maps.LatLng(latitude,longitude);
    homeLatlngJSON = {"lat":latitude,"lng":longitude};
    
    //alert("Your Location Latitude: " + latitude + "Longitude: " + longitude);
    //alert(homeLatlngJSON);
    //alert(JSON.stringify(homeLatlngJSON));
    
    postUser();
    getUserNickName();
}    
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
        //alert(text);
        //alert(homeLatlngJSON);
        //alert(JSON.stringify(homeLatlngJSON));
    } else {

        text = 'Google was not able to detect your location';
        alert(text);
    }
    //document.write(text);
}

function postUser(){
	
	$(function(){$.ajax({
		type:'POST',
		url:'/context/jerseyws/postuser',
		data:JSON.stringify(homeLatlngJSON),
		//data:str,
		contentType: 'application/json; charset=UTF-8',
        success: function(data){
        	//alert("success"+data);
        	usersNicknameJSON = data;
        	//getUsers(data);
        },
        error: function(){
        	alert("Error Hell");
        }
	});});
	
}


function initialize() {
		 usersNicknameJSON = null;
		 geoInit();
		 //alert(homeLatlngJSON);
		 //alert(JSON.stringify(homeLatlngJSON));
		 postUser();
		 getUserNickName();
    	  /*var contentString = '<div id="content">'+
          '<div id="siteNotice">'+
          '</div>'+
          '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
          '<div id="bodyContent">'+
          '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
          'sandstone rock formation in the southern part of the '+
          'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
          'south west of the nearest large town, Alice Springs; 450&#160;km '+
          '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
          'features of the Uluru - Kata Tjuta National Park. Uluru is '+
          'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
          'Aboriginal people of the area. It has many springs, waterholes, '+
          'rock caves and ancient paintings. Uluru is listed as a World '+
          'Heritage Site.</p>'+
          '<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
          'http://en.wikipedia.org/w/index.php?title=Uluru</a> '+
          '(last visited June 22, 2009).</p>'+
          '</div>'+
          '</div>';*/

    	//var myLatlng = new google.maps.LatLng(-25.363882,131.044922);		
        var mapOptions = {
          center: //new google.maps.LatLng(-34.397, 150.644),
          homeLatlng,
          zoom: 12,
          //mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);
        //placeMarker(homeLatlng,"User","","");
        
        // Create the DIV to hold the control and call the HomeControl()
        // constructor passing in this DIV.
        
        homeControlDiv = document.createElement('div');
        homeControl = new HomeControl(map, homeControlDiv);
        homeControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);

    	$(function longPolling(){$.ajax({
    		type:'POST',
    		url:'/context/jerseyws/userinit',
    		data:usersNicknameJSON,
    		//data:str,
    		contentType: 'application/json; charset=UTF-8',
            success: function(data,textStatus){
            	if(data!=null){
            		//alert(data);
            		usersJSON = data;
            		getFriends(data);
            	}
            	//alert("success"+data);
            	
            	if (textStatus == "success") {
                    longPolling();
                }
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
    	
    	$(function longPollingChatMsg(){$.ajax({
    		type:'GET',
    		url:'/context/jerseyws/receivemsg',
            success: function(data,textStatus){
            	if(data!=null){
            		usersJSON = data;
            		//alert(data);
            		parseChatMsg(data);      
            	}
            		
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
        
    	$(function(){$.ajax({
    		type:'GET',
    		url:'/context/jerseyws/markerinit',
    		//data:JSON.stringify(Msg),
    		//data:str,
    		//contentType: 'application/json; charset=UTF-8',
            success: function(data){
            	getData(data);
            	//alert("success"+data);
            },
            error: function(){
            	alert("Error Hell");
            }
    	});});  
          
        /*google.maps.event.addListener(map, 'click', function(event) {
      	    placeMarker(event.latLng,"","","",null);
      	  });*/
        
        google.maps.event.addListener(map,'rightclick',function(event){
        	var menu = document.getElementById("map_canvas");
        	var element = document.getElementById("addMsg");
        	        	        	
            var lat = event.latLng.lat();
            var lng = event.latLng.lng();
            
            var marker = new Object();
            // populate yor box/field with lat, lng
            //alert("Lat=" + lat + "; Lng=" + lng);
            //window.open('Msg.html');
            $( "#myForm" ).dialog({
                open: function() {
                    // On open, hide the original submit button
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
                        	
                        	//alert(json+" "+JSON.stringify(Msg));
                        	/*$.getJSON("/context/jerseyws/enqueue",function(data){
                        		alert("sucess : "+data);
                        	});*/
                        	//$(this).dialog("close");
                        	$(function(){$.ajax({
                        		type:'POST',
                        		url:'/context/jerseyws/enqueue',
                        		data:JSON.stringify(Msg),
                        		//data:str,
                        		contentType: 'application/json; charset=UTF-8',
	                            success: function(data){
	                            	//alert("success"+data);
	                            },
	                            error: function(){
	                            	alert("Error Hell");
	                            }
                        	});});
                        	
                        	placeMarker(event.latLng,type,title,text,null,null);
                        	
                        	$(this).dialog("close");
                        },
                        type: "submit",
                        //form: "myForm" // <-- Make the association
                    },
                    {
                        text: "Close",
	                        click: function() {
	                            $( this ).dialog( "close" );
	                       /*$.ajax({
	                        	url:"http://localhost:8080/context/enqueue",
	                        	type:'GET',
	                        	datatype:'json',
	                            contentType: 'application/json',
	                            mimeType: 'application/json',
	                            
	                            success: function(data){
	                            	alert("data:"+data);
	                            },
	                            error: function(data,status,er){
	                            	alert("error");
	                            }
	                        });*/
                        }
                    }
                ]
            });
            /*$.ajax({
            	url:"http://localhost:8080/context/enqueue",
            	type:'GET',
            	datatype:'json',
                contentType: 'application/json',
                mimeType: 'application/json',
                
                success: function(data){
                	alert("data:"+data);
                },
                error: function(data,status,er){
                	alert("error");
                }
            });*/
            /*$.getJSON("http://localhost:8080/context/enqueue",function(data){
            	alert("data:"+data);
            });*/
        });

        /*google.maps.event.addListener(map, 'center_changed', function() {
          // 3 seconds after the center of the map has changed, pan back to the
          // marker.
          window.setTimeout(function() {
            map.panTo(marker.getPosition());
          }, 3000);
        });*/
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
        function getFriends(receivedData){
        	var data = JSON.parse(receivedData);
        	//$("#friendMenu").empty();
        	//var lastData = JSON.parse(lastReceivedData);
        	
          	  for(var i=0;i<data.length;i++){
          		  var friend = data[i];
          		  //alert(friend.nickName);
          		  
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
        
        function  checkOfflineFriends(receivedData){
        	var data = JSON.parse(receivedData);
        	//$("#friendMenu").empty();
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
        			li.remove();
        			friendsMarkers[lastData[i].nickName].setMap(null);
        			//alert(friendsMarkers[lastData[i].nickName]);
        		}
        	}
        }
}
        
  function setAllMap(map){
	  for(var i=0;i<markers.length;i++){
		  markers[i].setMap(map);
	  }
  }
  
  function clearMarkers(){
	  setAllMap(null);
  }
  
  function showMarkers(){
	  setAllMap(map);
  }
  
  function deleteMarkers(){
	  clearMarkers();
	  markers=[];
  }

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
					  
					  //$("#chatBox"+name).append('<br/><textarea id="text" rows="5" cols="20" ></textarea><br/><button type="submit"></button>');
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
	            	  //var each = copyMsg.shift();
	            	  //var name = each[nickname];
	            	  //var text = each[text];
	            	  
	            	  //li.innerHTML = name+":"+text;
	            	  //$("#chatBox").find("#chattingMsg").append(li);
	            	  //$("#chatBox").append('<ul id='+name+'></ul>');
	            	  
	            	  var li = document.createElement("li");
		        	  
		        	  li.innerHTML = name+":"+text;
		        	  $("#"+name+"chatBox").find("#"+name).append(li);
				  }
				  //chatMsg.push(data[i]);
				  lasttime = time;
			  }
		  }
	  }
  }
  
  function findFriend(nickname){
	  //alert(userNickName);
	  //alert(nickname);
	  if(nickname!=userNickName){
		  if($("#"+nickname+"chatBox").length ==0){
			  var cb = document.createElement('div');
			  cb.id = nickname+"chatBox";
			  //$("#chatBox"+nickname).append('<br/><textarea id="text" rows="5" cols="20" ></textarea><br/><button type="submit"></button>');
			  var textarea = document.createElement('textarea');
			  textarea.id = "text";
			  textarea.rows = 5;
			  textarea.cols = 20;
			  
			  document.body.appendChild(cb);
			  $("#"+nickname+"chatBox").append(textarea);
			  
			  var button = document.createElement('button');
			  button.type = "submit";
			  
			  //$("#chatBox"+name).append('<br/><textarea id="text" rows="5" cols="20" ></textarea><br/><button type="submit"></button>');
			  $("#"+nickname+"chatBox").append(button);
		  }
		  
	      $( "#"+nickname+"chatBox" ).dialog({
	          open: function() {
	              // On open, hide the original submit button
	              $( this ).find( "[type=submit]" ).hide();
	              $(".ui-dialog-titlebar-close").hide();
	              
	              var copyMsg = chatMsg;
	              
	              /*
	              for(var i=0;i<copyMsg.length;i++){
	              */
	              if($("#"+nickname+"chatBox").find("#"+nickname).length ==0){
	            	  var ul = document.createElement('ul');
	            	  ul.id=nickname;
	            	  //var each = copyMsg.shift();
	            	  //var name = each[nickname];
	            	  //var text = each[text];
	            	  
	            	  //li.innerHTML = name+":"+text;
	            	  //$("#chatBox").find("#chattingMsg").append(li);
	            	  $("#"+nickname+"chatBox").append(ul);
	            	  //$("#chatBox").append('<ul id='+nickname+'></ul>');
	              }
	              //}     
	          },
	          buttons: [
	              {
	                  text: "Submit your Msg",
	                  click: function(){
	                  	var text = $("#"+nickname+"chatBox").find("#text").val();
	                  	date = new Date();
	                  	time = date.getTime();
	                  	//chatMsg.push({"time":time,"nickname":userNickName,"text":text});
	                  	var li = document.createElement("li");
		            	li.innerHTML = userNickName+":"+text;
		            	$("#"+nickname+"chatBox").find("#"+nickname).append(li);
		            	//lasttime = time;
		            	//$("#chatBox").find("#chattingMsg").append(li);
	                  	
		            	var msgSent = {"time":time,"nickname":nickname,"text":text};
	                  	
	                  	$(function(){$.ajax({
	                  		type:'POST',
	                  		url:'/context/jerseyws/sendmsg',
	                  		data:JSON.stringify(msgSent),
	                  		//data:str,
	                  		contentType: 'application/json; charset=UTF-8',
	                          success: function(data){
	                          	//alert("success"+data);
	                          },
	                          error: function(){
	                          	alert("Error Hell");
	                          }
	                  	});});
	                  	
	                  	//placeMarker(event.latLng,type,title,text,null);
	                  	
	                  	//$(this).dialog("close");
	                  },
	                  type: "submit",
	                  //form: "myForm" // <-- Make the association
	              },
	              {
	                  text: "Close",
	                      click: function() {
	                    	  //$("#chatBox").find("#"+nickname).empty();
	                          $( this ).dialog( "close" );
	                  }
	              }
	          ]
	      });
	      //$("#chatBox").find("#chattingMsg").empty();
  
	  }
  }
  
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
  function getUserLogo(nickname){
  	var data = JSON.parse(usersNicknameJSON);
  	
	  for(var i=0;i<data.length;i++){
		  if(data[i].nickName == nickname){
			  return data[i].logo;
		  }
	  }
  }

function setLogo(){
	window.location.href='http://pure-league-728.appspot.com/setlogo.jsp';
	/*$(function(){$.ajax({
		type:'GET',
		async: false,
		url:'/context/jerseyws/setlogo',
		//data:JSON.stringify(Msg),
		//data:str,
		//contentType: 'application/json; charset=UTF-8',
        success: function(data){
        	if(data!='failure'){
        		window.location.href=data;
        	}
        },
        error: function(){
        	alert("Error Hell");
        }
	});});*/
}  
  
function exit(){
	var confirmExit = confirm("Are you sure to exit the app?");
	
	if(confirmExit==true){
    	$(function(){$.ajax({
    		type:'GET',
    		async: false,
    		url:'/context/jerseyws/loginout',
    		//data:JSON.stringify(Msg),
    		//data:str,
    		//contentType: 'application/json; charset=UTF-8',
            success: function(data){
            	if(data!='failure'){
            		window.location.href=data;
            	}
            },
            error: function(){
            	alert("Error Hell");
            }
    	});});
    	
    	//window.location.href='http://arctic-defender-728.appspot.com/login.jsp';
	}
}

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

google.maps.event.addDomListener(window, 'load', initialize);
//google.maps.event.addDomListener(window, 'onbeforeunload', exit);
//window.onbeforeunload = exit;
