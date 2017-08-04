import {
	Component,
	ViewChild
} from '@angular/core';

import {
	NavController,
	LoadingController,
	AlertController,
	Content,
	ToastController,
	NavParams,
	ModalController
} from 'ionic-angular';

import {
	Http,
	Response
} from '@angular/http';

import {
	Url
} from '../../core/urls';

import {
	Constant
} from '../../core/constant';

@Component({
	templateUrl: 'chat.html'
})
export class ChatPage {

	@ViewChild(Content) content: Content;

	isAdmin: boolean;
	targetUserName: string;
	targetUserId: number;
	notices;
	
	currUser = Constant.user;
	urlHeader: string = Url.http_header;
	
	message:string;
	
	letters = [];

	constructor(params: NavParams, public navCtrl: NavController, public modalCtrl: ModalController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		this.isAdmin = params.data.isAdmin;
		this.targetUserName = params.data.targetUserName;
		this.targetUserId = params.data.targetUserId;
		this.notices = params.data.notices;

		this.init();
	}

	init() {
		if(this.isAdmin) {
			this.scrollToBottom();
		} else {
			this.initMessage();
		}
	}

	scrollToBottom() {
		if(this.content) {
			var this_ = this;
			setTimeout(function(){
				this_.content.scrollToBottom();
			},10);
		}
	}
	
	initMessage() {
		var this_ = this;
		
		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		loading.present();
		this.http.post(Url.send_letters_list, JSON.stringify({
			senderMetaValue: "user",
			targetUserId: this.targetUserId
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					if(result.letters) {
						this_.processMessages(result.letters);
					}
				} else {
					this_.toastCtrl.create({
						message: result,
						duration: 2000,
						position: 'middle'
					}).present();
				}
			}));
	}

	processMessages(letters) {
		for(var index in letters) {
			this.letters.push(letters[index]);
		}
		this.letters.reverse();
		this.scrollToBottom();
	}
	
	sendMessage(){
		var this_ = this;

		let result = this.authMessage();
		if(result) {
			this_.toastCtrl.create({
				message: result,
				duration: 2000,
				position: 'middle'
			}).present();
			return;
		}

		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		loading.present();
		this.http.post(Url.send_letter, JSON.stringify({
			content:this.message,
			targetUserId:this.targetUserId
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					this_.toastCtrl.create({
						message: "TA已收到您的消息",
						duration: 1000,
						position: 'middle'
					}).present();
					this_.letters.push({
						id : result.letterId,
						receiverId : this_.targetUserId,
						senderId : this_.currUser.id,
						senderHeaderPath : this_.currUser.iconPath,
						content : this_.message
					});
					this_.message = "";
					this_.scrollToBottom();
				} else {
					this_.toastCtrl.create({
						message: result,
						duration: 2000,
						position: 'middle'
					}).present();
				}
			}));
	}
	
	authMessage(){
		if(!this.message){
			return "您好歹说点什么吧";
		}
		
		return null;
	}
}