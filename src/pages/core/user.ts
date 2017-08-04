import {
	Url
} from './urls';

export class User {

	userName: string;
	password: string;
	id : number;
	realName: string;
	introduction : string;
	iconPath : string;
	email : string;
	gender : string;
	needUpload : boolean = true;
	headerSuffix : string = "jpg";

	constructor(){
	}
	
	static generate(jsonObject) {
		let user : User = new User();
		user.userName = jsonObject.name;
		user.id = jsonObject.id;
		user.realName = jsonObject.realName;
		user.introduction = jsonObject.introduction;
		user.iconPath = jsonObject.iconPath;
		user.gender = jsonObject.gender;
		user.email = jsonObject.email;
		return user;
	}
	
	static generateByName(userName: string, password: string) {
		let user : User = new User();
		user.userName = userName;
		user.password = password;
		return user;
	}
	
	static authLogin(user : User){
		if(!user.userName){
			return "用户姓名不能为空";
		}
		
		if(!user.password){
			return "用户密码不能为空";
		}
		
		return null;
	}
	
	static generateByRegister(userName: string, realName: string, email: string, password: string, iconPath: string) {
		let user:User = new User();
		user.userName = userName;
		user.password = password;
		user.realName = realName;
		user.email = email;
		user.iconPath = iconPath;
		
		return user;
	}
	
	static authRegister(user : User){
		if(!user.userName){
			return "用户姓名不能为空";
		}
		
		if(!user.realName){
			return "用户昵称不能为空";
		}
		
		if(!user.email){
			return "用户邮箱不能为空";
		}
		
		if(!user.password){
			return "用户密码不能为空";
		}
		
		return null;
	}
	
	getRealIconPath(){
		return Url.http_header + this.iconPath;
	}
}