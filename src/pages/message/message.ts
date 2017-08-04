import {
	Component
} from '@angular/core';

import {
	NavController,
	LoadingController,
	AlertController,
	ToastController,
	ModalController
} from 'ionic-angular';

import {
	Http,
	Response
} from '@angular/http';

import {
	Url
} from '../core/urls';

import {
	Constant
} from '../core/constant';

import {
	ChatPage
} from './chat/chat';

@Component({
	templateUrl: 'message.html'
})
export class MessagePage {

	callBack;
	urlHeader: string = Url.http_header;

	noticeLast;
	adminName: string = "系统管理员";
	notices = [];
	letters = [];

	loading;
	noticeComplete: boolean = false;
	letterComplete: boolean = false;
	
	static callback;

	constructor(public navCtrl: NavController, public modalCtrl: ModalController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		this.loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		this.loading.present();

		this.initNotice();
		this.initMessage();
	}

	showAdmin(notice) {
		this.navCtrl.push(ChatPage, {
			isAdmin: true,
			targetUserName: this.adminName,
			notices: this.notices
		});
	}

	reply(letter) {
		letter.rqty = 0;
		this.navCtrl.push(ChatPage, {
			isAdmin: false,
			targetUserName: letter.realName,
			targetUserId: letter.senderId
		});
	}

	initNotice() {
		var this_ = this;

		this.http.post(Url.notice_list, JSON.stringify({
			pageSize: 10,
			currentPage: 1
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				this_.noticeComplete = true;
				this_.dismissLoading();
				if(success) {
					if(result.notices) {
						this_.processNotices(result.notices);
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

	processNotices(notices) {
		for(var index in notices) {
			this.notices.push(notices[index]);
		}

		if(this.notices && this.notices.length > 0) {
			this.noticeLast = this.notices[0];
		}
	}

	initMessage() {
		var this_ = this;

		this.http.post(Url.message_list, JSON.stringify({

		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				this_.letterComplete = true;
				this_.dismissLoading();
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
	}

	dismissLoading() {
		if(this.noticeComplete && this.letterComplete) {
			this.loading.dismiss();
		}
	}
	
	openFollowMenu(){
		if(MessagePage.callback){
			MessagePage.callback();
		}
	}
	
	static setCallBack(callback){
		MessagePage.callback = callback;
	}
}