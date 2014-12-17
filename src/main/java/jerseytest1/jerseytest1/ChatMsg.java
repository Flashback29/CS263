package jerseytest1.jerseytest1;


public class ChatMsg {
	public String nickname;
	public String text;
	public String time;

	public ChatMsg(){
		
	}
	
	public ChatMsg(String time,String nickname, String text){
		this.nickname = nickname;
		this.text = text;
		this.time = time;
	}
	
	public String getNickname(){
		return nickname;
	}

	public String getText(){
		return text;
	}
	
	public String getTime(){
		return time;
	}

}

