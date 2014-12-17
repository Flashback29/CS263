package jerseytest1.jerseytest1;

/**
 * Msg is a class in charge of preserving the markers' data
 * the markers'types of the map are Alert,Msg,Review
 * Alert msg is the warning msg that alert others in the neighborhood of something special
 * Msg is the msg that people leave with others
 * Review is the msg that people comment on something or share some useful things.Such as the discount of a shop.
 * 
 * @author LiuYuan
 *
 */
public class Msg {
	public String type;
	public String title;
	public String text;
	public String lat;
	public String lng;
	
	/**
	 * constructor for Msg
	 */
	public Msg(){
		
	}
	
	/**
	 * constructor for Msg
	 * lat, lng, type, title, text are the params sent in and saved in the class
	 * lat, lng are the geo location data
	 * title is the title of the msg marker
	 * text is the context of the msg marker
	 * 
	 * @param lat
	 * @param lng
	 * @param type
	 * @param title
	 * @param text
	 */
	public Msg(String lat,String lng, String type, String title, String text){
		this.type = type;
		this.title = title;
		this.text = text;
		this.lat = lat;
		this.lng = lng;
	}
	
	/**
	 * return the lat(String)
	 * @return
	 */
	public String getLat(){
		return lat;
	}
	/**
	 * return the lng(Stirng)
	 * @return
	 */
	public String getLng(){
		return lng;
	}
	/**
	 * return the type(String)
	 * @return
	 */
	public String getType(){
		return type;
	}
	/**
	 * return the title(String)
	 * @return
	 */
	public String getTitle(){
		return title;
	}
	/**
	 * return the text(String)
	 * @return
	 */
	public String getText(){
		return text;
	}
	/**
	 * return the combined lat,lng
	 * @return
	 */
	public String getLatLng(){
		return lat+","+lng;
	}
}
