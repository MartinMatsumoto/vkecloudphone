import {
	Component
} from '@angular/core';

import {
	Headers
} from '@angular/http';

import {
	User
} from './user';

import {
	ToastController
} from 'ionic-angular';

export class Constant {
	
	static user: User = null;
	static terminalType:number = 3;
	
	private static successCode = 1;
	private static defaultErrorString : string = "解析错误，请退出后重试。";
	
	/** * 发布范围，公开*/
	private static PUBLISH_SCOPE_PUBLIC:number = 1; 
	/*** 发布范围非公开(本校)*/
	private static PUBLISH_SCOPE_SCHOOL:number = 2;
	/*** 发布范围非公开(本班)*/
	private static PUBLISH_SCOPE_CLAZZ:number = 3;
	/*** 发布范围非公开(本市)*/
	private static PUBLISH_SCOPE_CITY:number = 4;
	
	/** * 发布范围，公开*/
	private static PUBLISH_SCOPE_PUBLIC_STRING:string = "公开"; 
	/*** 发布范围非公开(本校)*/
	private static PUBLISH_SCOPE_SCHOOL_STRING:string = "本校";
	/*** 发布范围非公开(本班)*/
	private static PUBLISH_SCOPE_CLAZZ_STRING:string = "本班";
	/*** 发布范围非公开(本市)*/
	private static PUBLISH_SCOPE_CITY_STRING:string = "本市";
	
	static sqlDatabase = {
		name: 'data.db',
		location: 'default'
	}
	
	static setUser(user: User){
		this.user = user;
	}
	
	static getHeader() {
		return new Headers({
			terminalType : this.terminalType,
			operatorId : this.user ? this.user.id : 0
		});
	}
	
	static authHttpResult(jsonObject, callback) {
		console.log(jsonObject);
		if(jsonObject.header.flag == this.successCode) {
			callback(true, jsonObject.content);
		} else {
			callback(false, jsonObject.header.errorDesc);
		}
	}
	
	static getPublishScope(publishScope:number){
		if(Constant.PUBLISH_SCOPE_PUBLIC == publishScope){
			return Constant.PUBLISH_SCOPE_PUBLIC_STRING;
		}else if(Constant.PUBLISH_SCOPE_SCHOOL == publishScope){
			return Constant.PUBLISH_SCOPE_SCHOOL_STRING;
		}else if(Constant.PUBLISH_SCOPE_CLAZZ == publishScope){
			return Constant.PUBLISH_SCOPE_CLAZZ_STRING;
		}else if(Constant.PUBLISH_SCOPE_CITY == publishScope){
			return Constant.PUBLISH_SCOPE_CITY_STRING;
		}
		
		return "";
	}
	
	static getBase64Image(imgUrl, callback) {
		var img = new Image();
		
		img.onload = function() {

			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
			var dataURL = canvas.toDataURL("image/png"),
				dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

			callback(dataURL); // the base64 string

		};

		// set attributes and src 
		img.setAttribute('crossOrigin', 'anonymous'); //
		img.src = imgUrl;

	}
	
	static formatPauseTime(time:number){
		var result = "";
		var hours = Math.floor((time / 1000 / 60 / 60) % 60);
		var minutes = Math.floor((time / 1000 / 60) % 60);
		var seconds = Math.floor((time / 1000) % 60);
		
		if(hours){
			result += hours + " 小时 ";
		}
		
		if(minutes){
			result += minutes + " 分 ";
		}
		
		if(seconds){
			result += seconds + " 秒 ";
		}
		
		if(!hours && !minutes && !seconds){
			result += 0 + " 秒 ";
		}
		return  result;
	}
}
