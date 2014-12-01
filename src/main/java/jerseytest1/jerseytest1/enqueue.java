package jerseytest1.jerseytest1;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.logging.Level;

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

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
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

@Path("/jerseyws")
public class enqueue {
	@POST
	//@GET
	//@Produces(MediaType.APPLICATION_JSON)
	@Path("/enqueue/")
	@Consumes(MediaType.APPLICATION_JSON)
	public String msg( /*@PathParam("json")String str*/ String json){
		/*StringBuilder sb = new StringBuilder();
		
		try{
			BufferedReader br = new BufferedReader(new InputStreamReader(json));
			String line = null;
			while((line = br.readLine())!=null){
				sb.append(line);
			}
			
		}catch(Exception e){
			System.out.println("error");
		}*/
		Msg msg = new Msg("29","29","Alert","warning","IV");
		Gson gson = new Gson();
		String str = gson.toJson(msg);
		
		Queue queue = QueueFactory.getDefaultQueue();
		queue.add(withUrl("/context/jerseyws/worker").payload(json).method(TaskOptions.Method.POST));
		
		//Msg msg  = gson.fromJson(json,Msg.class);
		//Msg msg = gson.fromJson(str, Msg.class);
		
		//String str = msg.getText()+msg.getTitle()+msg.getType();
		//System.out.println(msg.getText()+msg.getTitle()+msg.getType());
		//return Response.status(200).entity("hello world").build();
		//return Response.status(200).entity(str).build();
		//return str;
		return json;
	}
	
	
	//@POST
	@GET
	//@Produces(MediaType.APPLICATION_JSON)
	@Path("/markerinit/")
	//@Consumes(MediaType.APPLICATION_JSON)
	public String markerInit( /*@PathParam("json")String str*/ /*String json*/){
		/*StringBuilder sb = new StringBuilder();
		
		try{
			BufferedReader br = new BufferedReader(new InputStreamReader(json));
			String line = null;
			while((line = br.readLine())!=null){
				sb.append(line);
			}
			
		}catch(Exception e){
			System.out.println("error");
		}*/
		Msg msg = new Msg();
		Gson gson = new Gson();
		//String str = gson.toJson(msg);
		
		//Msg msg  = gson.fromJson(json,Msg.class);
		//Msg msg = gson.fromJson(str, Msg.class);
		
		//String str = msg.getText()+msg.getTitle()+msg.getType();
		//System.out.println(msg.getText()+msg.getTitle()+msg.getType());
		//return Response.status(200).entity("hello world").build();
		//return Response.status(200).entity(str).build();
		
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
	
	@POST
	//@GET
	//@Produces(MediaType.APPLICATION_JSON)
	@Path("/userinit/")
	@Consumes(MediaType.APPLICATION_JSON)
	public String userInit( /*@PathParam("json")String str*/ String json){
	    
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
	
	@POST
	//@GET
	//@Produces(MediaType.APPLICATION_JSON)
	@Path("/postuser/")
	@Consumes(MediaType.APPLICATION_JSON)
	public String postUser( /*@PathParam("json")String str*/ String json){
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
	  	
	  	if(json!=null){
		  	if(user!=null){
		  		try{
		  			Entity e = ds.get(key);
					
					Query q = new Query("nickname");
					PreparedQuery pq = ds.prepare(q);
					
					for( Entity result : pq.asIterable() ){
						s = s+ gson.toJson(new MapUser("","",result.getKey().getName()))+",";
					}
					s=s.substring(0, s.length()-1);
					s = s+"]";
					returnjson = s;
		  		}
		  		catch(EntityNotFoundException e)	  		
		  		{
			  		Entity userEntity = new Entity("nickname",user.getNickname());
			  		//userEntity.setProperty("friends", gson.toJson(new MapUser("","",user.getNickname())));
			  		ds.put(userEntity);
		  		}
		  		
		  		MapUser userMemc = new MapUser(latlng.getLat(),latlng.getLng(),user.getNickname());
		  		syncCache.put(user.getNickname(), gson.toJson(userMemc));
		  	}
		  	else{
		  		returnjson = "Please login your Google Account";
		  	}
	  	}
		return returnjson;
	}
	
	
	@GET
	//@Produces(MediaType.APPLICATION_JSON)
	@Path("/loginout/")
	//@Consumes(MediaType.APPLICATION_JSON)
	public String loginOut( /*@PathParam("json")String str*/ /*String json*/){
	    
		MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	    syncCache.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(Level.INFO));
		
	  	UserService userService = UserServiceFactory.getUserService();
	  	User user = userService.getCurrentUser();
	    
	  	Msg msg = new Msg();
		Gson gson = new Gson();	
		
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
	
	@POST
	@Path("/worker/")
	//@Consumes(MediaType.APPLICATION_JSON)
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
     
     //Entity taskData = new Entity("latLng","29,29");
     //taskData.setProperty("type","Alert");
     //taskData.setProperty("title","Halloween parade");
     //taskData.setProperty("text","look out for the parade");
     
     ds.put(taskData);
	}
}
