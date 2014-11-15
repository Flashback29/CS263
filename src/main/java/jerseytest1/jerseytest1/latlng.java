package jerseytest1.jerseytest1;

public class latlng {
	public String lat;
	public String lng;
	
	public latlng(){
		
	}
	
	public latlng(String lat,String lng){
		this.lat = lat;
		this.lng = lng;
	}
	public String getLat(){
		return lat;
	}
	public String getLng(){
		return lng;
	}
}
