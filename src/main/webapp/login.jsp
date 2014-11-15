<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="java.util.List" %>
<%@ page import="com.google.appengine.api.datastore.DatastoreService" %>
<%@ page import="com.google.appengine.api.datastore.DatastoreServiceFactory" %>
<%@ page import="com.google.appengine.api.datastore.Entity" %>
<%@ page import="com.google.appengine.api.datastore.FetchOptions" %>
<%@ page import="com.google.appengine.api.datastore.Key" %>
<%@ page import="com.google.appengine.api.datastore.KeyFactory" %>
<%@ page import="com.google.appengine.api.datastore.Query" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html>
<html>

<head>

  <meta charset="UTF-8">

  <title>Login  - CodePen</title>

  <link rel="stylesheet" href="stylesheet/reset.css">

  <link rel="stylesheet" href="stylesheet/style.css" media="screen" type="text/css" />

</head>

<body>

  <div class="wrap">
	  <div class="avatar">
      <img src="image/GoogleMaps.png">
      
    <%
  	UserService userService = UserServiceFactory.getUserService();
  	User user = userService.getCurrentUser();
 	String signInHref = userService.createLoginURL(request.getRequestURI());
  	String signOutHref = userService.createLogoutURL(request.getRequestURI());
  	
    if (user != null) {
    %>	
    
    	<script type="text/javascript">
    		window.location.href='http://arctic-defender-728.appspot.com/map.html';
    	</script>
    
    <%
        pageContext.setAttribute("user", user);
  	%>
      
		<button id="signInButton" onclick="signIn();">Sign in</button>
		<button id="signOutButton" onclick="signOut();">Sign out</button>
		<p>Hello, ${fn:escapeXml(user.nickname)}!</p>
	<%
	}
	
	else{
	%>
      
		<button id="signInButton" onclick="signIn();">Sign in</button>
		<button id="signOutButton" onclick="signOut();">Sign out</button>
		<p>Hello, Please Sign in!</p>
	<%
	}
	%>
		</div>
  </div>

  <script type="text/javascript" src="scripts/jquery-2.1.1.js"></script>    
  <script type="text/javascript" src="scripts/jquery-2.1.1.min.js"></script>
  <script type="text/javascript" src="scripts/jquery-ui.js"></script>
  <script type="text/javascript" src="scripts/jquery.json-2.4.js"></script>
  <script type="text/javascript" src="scripts/login.js"></script>
  <script type="text/javascript">
    	
  	function signIn(){
  		window.location.href='<%=signInHref%>';	
  	}
  	
  	function signOut(){
  		window.location.href='<%=signOutHref%>';
  	}
  	
  </script>
  
</body>

</html>