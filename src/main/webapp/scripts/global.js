    var map;  
    var markers=[];
    var msgMarkers=[];
    var alertMarkers=[];
    var reviewMarkers=[];
    var userMarkers= [];
    var latitude;
    var longitude ;
    var city ;
    var country ;
    var country_code;
    var region ;
    var text; 
    var homeLatlng;
    var homeLatlngJSON;
    
    /**
     * The HomeControl adds a control to the map that
     * returns the user to the control's defined home.
     */

    // Define a property to hold the Home state.
    HomeControl.prototype.home_ = null;

    // Define setters and getters for this property.
    HomeControl.prototype.getHome = function() {
      return this.home_;
    };

    HomeControl.prototype.setHome = function(home) {
      this.home_ = home;
    };

    function HomeControl(map, div, home) {

      // Get the control DIV. We'll attach our control UI to this DIV.
      var controlDiv = div;

      // We set up a variable for the 'this' keyword since we're adding event
      // listeners later and 'this' will be out of scope.
      var control = this;

      // Set the home property upon construction.
      control.home_ = home;

      // Set CSS styles for the DIV containing the control. Setting padding to
      // 5 px will offset the control from the edge of the map.
      controlDiv.style.padding = '5px';

      // Set CSS for the control border.
      var goHomeUI = document.createElement('div');
      goHomeUI.title = 'Click to set the map to Your Location';
      controlDiv.appendChild(goHomeUI);

      // Set CSS for the control interior.
      var goHomeText = document.createElement('div');
      goHomeText.innerHTML = '<strong>Client Location</strong>';
      goHomeUI.appendChild(goHomeText);

      
      // Set CSS for the setHome control border.
      var setHomeUI = document.createElement('div');
      setHomeUI.title = 'Click to login out';
      controlDiv.appendChild(setHomeUI);

      // Set CSS for the control interior.
      var setHomeText = document.createElement('div');
      setHomeText.innerHTML = '<strong>Login out</strong>';
      setHomeUI.appendChild(setHomeText);

      // Setup the click event listener for Home:
      // simply set the map to the control's current home property.
      google.maps.event.addDomListener(goHomeUI, 'click', function() {
        var currentHome = control.getHome();
        map.setCenter(currentHome);
      });

      
      // Setup the click event listener for Set Home:
      // Set the control's home to the current Map center.
      google.maps.event.addDomListener(setHomeUI, 'click', function() {
        exit();
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
        alert(text);	
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
        	alert("success"+data);
        },
        error: function(){
        	alert("Error Hell");
        }
	});});
}


function initialize() {
		 geoInit();
		 postUser();
		 
    	  var contentString = '<div id="content">'+
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
          '</div>';
        var infoWindow = new google.maps.InfoWindow({
        	content: contentString
        });
    	//var myLatlng = new google.maps.LatLng(-25.363882,131.044922);		
        var mapOptions = {
          center: //new google.maps.LatLng(-34.397, 150.644),
          homeLatlng,
          zoom: 12,
          //mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);
        placeMarker(homeLatlng,"User","","");
        
        /*var marker = new google.maps.Marker({
            position: map.getCenter(),
            map: map,
            title: 'Click to zoom'
          });*/
          
       

        
        // Create the DIV to hold the control and call the HomeControl()
        // constructor passing in this DIV.
        
        var homeControlDiv = document.createElement('div');
        var homeControl = new HomeControl(map, homeControlDiv, homeLatlng);
        
    	$(function longPolling(){$.ajax({
    		type:'GET',
    		url:'/context/jerseyws/userinit',
    		//data:JSON.stringify(Msg),
    		//data:str,
    		//contentType: 'application/json; charset=UTF-8',
            success: function(data,textStatus){
            	getUser(data);
            	alert("success"+data);
            	
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
        
    	$(function(){$.ajax({
    		type:'GET',
    		url:'/context/jerseyws/markerinit',
    		//data:JSON.stringify(Msg),
    		//data:str,
    		//contentType: 'application/json; charset=UTF-8',
            success: function(data){
            	getData(data);
            	alert("success"+data);
            },
            error: function(){
            	alert("Error Hell");
            }
    	});});
        
        homeControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);  
          
        google.maps.event.addListener(map, 'click', function(event) {
      	    placeMarker(event.latLng,"","","");
      	  });
        
        google.maps.event.addListener(map,'rightclick',function(event){
        	var menu = document.getElementById("map_canvas");
        	var element = document.getElementById("addMsg");
        	        	        	
            var lat = event.latLng.lat();
            var lng = event.latLng.lng();
            
            var marker = new Object();
            // populate yor box/field with lat, lng
            alert("Lat=" + lat + "; Lng=" + lng);
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
                        	
                        	alert(json+" "+JSON.stringify(Msg));
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
	                            	alert("success"+data);
	                            },
	                            error: function(){
	                            	alert("Error Hell");
	                            }
                        	});});
                        	
                        	placeMarker(event.latLng,type,title,text);
                        	
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
        function placeMarker(location,type, title, text) {
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
	        	case "Msg":msgMarkers.push(marker);alert(msgMarkers.length);break;
	        	case "Alert":alertMarkers.push(marker);alert(alertMarkers.length);break;
	        	case "Review":reviewMarkers.push(marker);alert(reviewMarkers.length);break;
	        	case "User":userMarkers.push(marker);alert(userMarkers.length);break;
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
	       	google.maps.event.addListener(marker,'click',function(){
	       		infoWindow.open(map,marker);
	       	});
        }
        
        function getData(receivedData){
        	data = JSON.parse(receivedData);
      	  for(var i=0;i<data.length;i++){
      		  var msg = data[i];
      		  var type = msg.type;
      		  var lat = msg.lat;
      		  var lng = msg.lng;
      		  var title = msg.title;
      		  var text = msg.text;
      		  
      		  var latLng = new google.maps.LatLng(lat,lng);
      		  placeMarker(latLng,type,title,text);
      	  }
        }
        function getUser(data){
        	
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

google.maps.event.addDomListener(window, 'load', initialize);
//google.maps.event.addDomListener(window, 'onbeforeunload', exit);
//window.onbeforeunload = exit;
