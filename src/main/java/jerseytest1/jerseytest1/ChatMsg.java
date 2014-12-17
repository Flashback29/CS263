package jerseytest1.jerseytest1;

/**
 * ChatMsg is a class in charge of saving the chatting msgs between the users
 * the nickname is the one who this will send to 
 * the text is the msg text
 * the time is the time that this msg is sent from a user
 * 
 * @author LiuYuan
 *
 */
public class ChatMsg {
	public String nickname;
	public String text;
	public String time;

	/**
	 * constructor
	 */
	public ChatMsg(){
		
	}
	
	/**
	 * constructor for ChatMsg class
	 * 
	 * @param time
	 * @param nickname
	 * @param text
	 */
	public ChatMsg(String time,String nickname, String text){
		this.nickname = nickname;
		this.text = text;
		this.time = time;
	}
	
	/**
	 * return the nickname(String) of the class
	 * @return
	 */
	public String getNickname(){
		return nickname;
	}

	/**
	 * return text(String) of the class
	 * @return
	 */
	public String getText(){
		return text;
	}
	
	/**
	 * return time(String) of the class
	 * @return
	 */
	public String getTime(){
		return time;
	}

}

