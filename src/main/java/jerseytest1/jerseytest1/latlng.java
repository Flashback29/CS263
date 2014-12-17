package jerseytest1.jerseytest1;

/**
 * latlng is a class in charge of saving the geo location of any items on the map
 * such as the user, marker geo location data
 * lat and lng are the X,Y axes location to locate
 * 
 * @author LiuYuan
 *
 */
public class latlng {
	public String lat;
	public String lng;
	
	/**
	 * constructor for the latlng class
	 */
	public latlng(){
		
	}
	
	/**
	 * constructor for the latlng class
	 * lat, lng parameters are sent in and saved
	 * 
	 * @param lat
	 * @param lng
	 */
	public latlng(String lat,String lng){
		this.lat = lat;
		this.lng = lng;
	}
	
	/**
	 * return the lat data
	 * @return
	 */
	public String getLat(){
		return lat;
	}
	
	/**
	 * return lng data
	 * @return
	 */
	public String getLng(){
		return lng;
	}
}
