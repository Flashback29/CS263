package jerseytest1.jerseytest1;

public class Msg {
	public String type;
	public String title;
	public String text;
	public String lat;
	public String lng;
	
	public Msg(){
		
	}
	
	public Msg(String lat,String lng, String type, String title, String text){
		this.type = type;
		this.title = title;
		this.text = text;
		this.lat = lat;
		this.lng = lng;
	}
	
	public String getLat(){
		return lat;
	}
	public String getLng(){
		return lng;
	}
	public String getType(){
		return type;
	}
	public String getTitle(){
		return title;
	}
	public String getText(){
		return text;
	}
	public String getLatLng(){
		return lat+","+lng;
	}
}
