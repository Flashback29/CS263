package jerseytest1.jerseytest1;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Map;
import java.util.logging.Level;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.appengine.api.xmpp.JID;
import com.google.appengine.api.xmpp.Message;
import com.google.appengine.api.xmpp.MessageBuilder;
import com.google.appengine.api.xmpp.SendResponse;
import com.google.appengine.api.xmpp.XMPPService;
import com.google.appengine.api.xmpp.XMPPServiceFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.memcache.ErrorHandlers;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
import com.google.gson.Gson;
import com.google.gson.JsonElement;

import static com.google.appengine.api.taskqueue.TaskOptions.Builder.*;

/**
 * enqueue class is a large class of the RESTful backend JAVA class methods
 * These methods contain the interact with GAE APIs including Datastore, Memcache, Blobstore, Taskqueue
 * Imageservice, User APIs
 * With these APIs we could utilize the Paas(Platform as a service) structure of Web Development
 * 
 * @author LiuYuan
 *
 */

@Path("/jerseyws")
public class enqueue {
	
	/**
	 * msg is a method in charge of using the Taskqueue API to queue the operation
	 * that will store data into the datastore
	 * 
	 * @author LiuYuan
	 *
	 */
	@POST
	@Path("/enqueue/")
	@Consumes(MediaType.APPLICATION_JSON)
	public String msg(String json){
		Queue queue = QueueFactory.getDefaultQueue();
		queue.add(withUrl("/context/jerseyws/worker").payload(json).method(TaskOptions.Method.POST));
		
		return json;
	}
	
	
	/**
	 * markerInit method is in charge of getting all the markers that have been stored in the datastore
	 * back to the frontend via AJAX using JSON as the data format
	 * 
	 * @return JSON(String)
	 */
	@GET
	@Path("/markerinit/")
	public String markerInit(){
		Msg msg = new Msg();
		Gson gson = new Gson();
		
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		
		String s = "[";
		Query q = new Query("latLng");
		PreparedQuery pq = ds.prepare(q);
		
		for( Entity result : pq.asIterable() ){
			msg = new Msg(result.getProperty("lat").toString(),result.getProperty("lng").toString(),result.getProperty("type").toString(),result.getProperty("title").toString(),result.getProperty("text").toString());
			s = s+gson.toJson(msg)+",";
		}
		s=s.substring(0, s.length()-1);
		s = s+"]";
		return s;
	}
	
	/**
	 * userInit is a method in charge of getting all the login users from the memcache
	 * param json sent in is the JSON format data of all the registered users info from the frontend
	 * this json is also got from the backend method
	 * these login users info will be sent back to the frontend via AJAX using JSON data format
	 * 
	 * @param json
	 * @return
	 */
	@POST
	@Path("/userinit/")
	@Consumes(MediaType.APPLICATION_JSON)
	public String userInit(String json){
	    
		MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	    syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
		
	  	UserService userService = UserServiceFactory.getUserService();
	  	User user = userService.getCurrentUser();
	  	
		Gson gson = new Gson();	
	  	
		if(user!=null && json != null){
			String s = "[";
			
			MapUser[] users = gson.fromJson(json, MapUser[].class);
			
			if(users!=null){
				for(int i=0; i< users.length;i++){
					String userObject = (String)syncCache.get(users[i].getNickName());
					if(userObject!=null){
						s = s+userObject+",";
					}
				}

				s=s.substring(0, s.length()-1);
			}
			s = s+"]";
			return s;
	  	}
	  	else{
	  		return null;
	  	}
	}
	
	/**
	 * getUserName method is a method that will return the login user's nickname to the frontend via AJAX
	 * 
	 * @return nickname(String)
	 */
	@GET
	@Path("/getusername/")
	public String getUserName(){
	  	UserService userService = UserServiceFactory.getUserService();
	  	User user = userService.getCurrentUser();
	  	
	  	if(user!=null){
	  		return user.getNickname();
	  	}
	  	else{
	  		return "failure";
	  	}
	  	
		
	}
	
	/**
	 * postUser is a method that is in charge of getting the user's geo location info and user's nickname stored into the memcache
	 * and returns all the registered user info back to the frontend
	 * with these registered user info the frontend could consult whether these registered users have login from the memcache
	 * 
	 * @param json(JSON format of latlng class)
	 * @return registeredUsersInfo(JSON format)
	 */
	@POST
	@Path("/postuser/")
	@Consumes(MediaType.APPLICATION_JSON)
	public String postUser(String json){
	  	UserService userService = UserServiceFactory.getUserService();
	  	User user = userService.getCurrentUser();
	  	
	  	
		MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	    syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
	  	
	  	DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
	    
		Gson gson = new Gson();	
		latlng latlng = gson.fromJson(json,latlng.class);
	  	Key key = KeyFactory.createKey("nickname", user.getNickname());
	  	String s = "[";
	  	String returnjson = "";
	  	String logo = "";
	  	
	  	if(json!=null && latlng!=null){
		  	if(user!=null){
		  		try{
		  			Entity e = ds.get(key);
					
					Query q = new Query("nickname");
					PreparedQuery pq = ds.prepare(q);
					
					for( Entity result : pq.asIterable() ){
						s = s+ gson.toJson(new MapUser("","",result.getKey().getName(),result.getProperty("logo").toString()))+",";
						if(result.getKey().getName().equals(user.getNickname())){
							logo = result.getProperty("logo").toString();
						}
					}
					s=s.substring(0, s.length()-1);
					s = s+"]";
					returnjson = s;
		  		}
		  		catch(EntityNotFoundException e)	  		
		  		{
			  		Entity userEntity = new Entity("nickname",user.getNickname());
			  		userEntity.setProperty("logo", "");
			  		ds.put(userEntity);
					
					Query q = new Query("nickname");
					PreparedQuery pq = ds.prepare(q);
					
					for( Entity result : pq.asIterable() ){
						s = s+ gson.toJson(new MapUser("","",result.getKey().getName(),result.getProperty("logo").toString()))+",";
						if(result.getKey().getName().equals(user.getNickname())){
							logo = result.getProperty("logo").toString();
						}
					}
					s=s.substring(0, s.length()-1);
					s = s+"]";
					returnjson = s;
		  		}
		  		
		  		MapUser userMemc = new MapUser(latlng.getLat(),latlng.getLng(),user.getNickname(),logo);
		  		syncCache.put(user.getNickname(), gson.toJson(userMemc));
		  	}
		  	else{
		  		returnjson = "Please login your Google Account";
		  	}
	  	}
		return returnjson;
	}
	
	/**
	 * loginOut method is a method in charge of returning the log out url to the front end for users to log out
	 * this method will also delete the login info in the memcache
	 * and other users once update info from the memcache will get this log out info of this user
	 * 
	 * @return
	 */
	@GET
	@Path("/loginout/")
	public String loginOut(){
	    
		MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	    syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
		
	  	UserService userService = UserServiceFactory.getUserService();
	  	User user = userService.getCurrentUser();
	    
	  	Msg msg = new Msg();
		Gson gson = new Gson();	
		
		Key key = KeyFactory.createKey("nickname", user.getNickname());
		
	 	String signOutHref = userService.createLogoutURL("/login.jsp");
	  	
		if(user!=null){
			if(syncCache.delete(user.getNickname())){
				return signOutHref;
			}
			else{
				return "failure";
			}
		}
		else{
			return "failure";
		}
	}
	
	/**
	 * Worker method is a method that will store the marker info into the datastore from Taskqueue operations
	 * json is the Msg format JSON data
	 * 
	 * @param json
	 */
	@POST
	@Path("/worker/")
	public void Worker(String json){
	 Gson gson = new Gson();	
	 Msg msg = gson.fromJson(json,Msg.class);
	
     DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
     
     Entity taskData = new Entity("latLng",msg.getLatLng());
     taskData.setProperty("lat",msg.getLat());
     taskData.setProperty("lng",msg.getLng());
     taskData.setProperty("type",msg.getType());
     taskData.setProperty("title",msg.getTitle());
     taskData.setProperty("text",msg.getText());
     
     ds.put(taskData);
	}
	
	/**
	 * sendMsg method is a method in charge of storing the chatting msg info from different users
	 * into the memcache
	 * so the destination users will find the msgs sent to them in the memcache
	 * once succeed this method will return "success"
	 * 
	 * @param json
	 * @return
	 */
	@POST
	@Path("/sendmsg/")
	@Consumes(MediaType.APPLICATION_JSON)
	public String sendMsg(String json){
		UserService userService = UserServiceFactory.getUserService();
	  	User user = userService.getCurrentUser();
		
	  	MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	    syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
	  	
	  	Gson gson = new Gson();
	  	ChatMsg chatmsg = gson.fromJson(json, ChatMsg.class);
	  	ChatMsg msg = new ChatMsg(chatmsg.getTime(),user.getNickname(),chatmsg.getText());
	  	
	  	if(syncCache.get(chatmsg.getNickname()+"Msg")==null){
	  		syncCache.put(chatmsg.getNickname()+"Msg", "["+gson.toJson(msg)+"]");
	  	}
	  	else{
	  		String s = (String)syncCache.get(chatmsg.getNickname()+"Msg");
	  		s=s.substring(0, s.length()-1);
	  		s = s + "," +gson.toJson(msg)+"]";
	  		
	  		syncCache.put(chatmsg.getNickname()+"Msg", s);
	  	}
	  	return "success";
	}
	
	
	/**
	 * receiveMsg method is the opposite method of sendMsg method
	 * this method will get the chat msg sent to the user who sent the GET request from frontend
	 * @return
	 */
	@GET
	@Path("/receivemsg/")
	public String receiveMsg(){
		
		MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	    syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
		
	  	UserService userService = UserServiceFactory.getUserService();
	  	User user = userService.getCurrentUser();
	  	
	  	return (String)syncCache.get(user.getNickname()+"Msg");
	}
	
	/**
	 * uplad method is the method in charge of storing the uploaded pic as the user's logo
	 * and stores the pic's url into that user's datastore
	 * next time the user is retrieving data from the datastore the user will get his logo's url and show his account logo on the User marker
	 * 
	 * @param req
	 * @param res
	 * @throws Exception
	 */
	@POST
	@Path("/upload")
	 public void upload(@Context HttpServletRequest req,@Context HttpServletResponse res)
	     throws Exception {
		 BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
		 UserService userService = UserServiceFactory.getUserService();
	     ImagesService imagesService = ImagesServiceFactory.getImagesService();
	     User userName = userService.getCurrentUser();
	     DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	     
		 Map<String, BlobKey> blobs = blobstoreService.getUploadedBlobs(req);
	     BlobKey blobKey = blobs.get("myFile");
	     
	     String imageUrl = null;
	     imageUrl = imagesService.getServingUrl(blobKey);
	     
	     Key key = KeyFactory.createKey("nickname", userName.getNickname());
	     Entity e = datastore.get(key);
	     
	     e.setProperty("logo", imageUrl);
	     datastore.put(e);

	     if (blobKey == null) {
	         res.sendRedirect("/");
	     } else {
	    	 res.sendRedirect("/map.html");
	     }
	 }
}
