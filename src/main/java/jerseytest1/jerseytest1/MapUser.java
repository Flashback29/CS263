package jerseytest1.jerseytest1;

/**
 * MapUser class is in charge of saving the user's data of the system
 * nickName is their google account nickname
 * lat and lng are the geo location data used to locate in Google Map
 * logo is the user's account logo that could be shown in the map
 * 
 * @author LiuYuan
 *
 */
public class MapUser {
	public String nickName;
	public String lat;
	public String lng;
	public String logo;
	
	/**
	 * constructor for MapUser
	 */
	public MapUser(){
		
	}
	
	/**
	 * constructor for Mapuser
	 * the param sent in are the user's geo data,lat and lng.
	 * user's nickName
	 * user's logo url
	 * 
	 * @param lat
	 * @param lng
	 * @param nickName
	 * @param logo
	 */
	public MapUser(String lat,String lng, String nickName,String logo){
		this.nickName = nickName;
		this.lat = lat;
		this.lng = lng;
		this.logo = logo;
	}
	
	/**
	 * return the lat(String)
	 * @return
	 */
	public String getLat(){
		return lat;
	}
	/**
	 * return the lng(String)
	 * @return
	 */
	public String getLng(){
		return lng;
	}
	/**
	 * return the nickname of the user
	 * @return
	 */
	public String getNickName(){
		return nickName;
	}
	/**
	 * return the combined String of lat,lng
	 * @return
	 */
	public String getLatLng(){
		return lat+","+lng;
	}
	/**
	 * return the logo of the user
	 * @return
	 */
	public String getLogo(){
		return logo;
	}
}