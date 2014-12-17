package jerseytest1.jerseytest1;

public class MapUser {
	public String nickName;
	public String lat;
	public String lng;
	public String logo;
	
	public MapUser(){
		
	}
	
	public MapUser(String lat,String lng, String nickName,String logo){
		this.nickName = nickName;
		this.lat = lat;
		this.lng = lng;
		this.logo = logo;
	}
	
	public String getLat(){
		return lat;
	}
	public String getLng(){
		return lng;
	}
	public String getNickName(){
		return nickName;
	}
	public String getLatLng(){
		return lat+","+lng;
	}
	public String getLogo(){
		return logo;
	}
}