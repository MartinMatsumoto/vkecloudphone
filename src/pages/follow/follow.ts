import {
	Component
} from '@angular/core';

import {
	NavController,
	ModalController,
	AlertController,
	LoadingController,
	ToastController
} from 'ionic-angular';

import {
	Http,
	Response
} from '@angular/http';

import {
	Constant
} from '../core/constant';

import {
	Url
} from '../core/urls';

import {
	ChatPage
} from '../message/chat/chat';

import {
	FollowSearchParamPage
} from './follow_search_param/follow_search_param';

@Component({
	templateUrl: 'follow.html'
})

export class FollowPage {
	
	infiniteScroll;
	follows = [];
	urlHeader: string = Url.http_header;
	
	pageSize:number = 10;
	currentPage:number = 1;
	
	constructor(public alertCtrl: AlertController, public navCtrl: NavController, public modalCtrl: ModalController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		this.initFollows();
	}
	
	cancelFollow(follow){
		var this_ = this;
		let alert = this.alertCtrl.create({
			title: '请确认',
			message: '是否取消关注?',
			buttons: [{
				text: '取消',
				role: 'cancel',
				handler: () => {
					
				}
			}, {
				text: '确定',
				handler: () => {
					this_.requestCancel(follow);
				}
			}]
		});
		alert.present();
	}
	
	/**
	 * 初始化我关注的人
	 */
	initFollows() {
		if(this.infiniteScroll){
			this.infiniteScroll.enable(true);
		}
		this.follows.splice(0,this.follows.length);
		this.currentPage = 1;
		this.loadFollows(null);
	}
	
	/**
	 * 加载我关注的人
	 */
	loadFollows(infiniteScroll){
		var this_ = this;

		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		if(!infiniteScroll) {
			loading.present();
		} else {
			this.infiniteScroll = infiniteScroll;
		}
		this.http.post(Url.follow_list, JSON.stringify({
			pageSize: this.pageSize,
			currentPage: this.currentPage
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				if(infiniteScroll){
					infiniteScroll.complete();
				}else{
					loading.dismiss();
				}
				if(success) {
					if(result.follows){
						this_.processFollows(result.follows);
					}
					if(!result.follows || (infiniteScroll && result.follows.length < this_.pageSize)){
						infiniteScroll.enable(false);
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
	
	processFollows(follows){
		for(var index in follows){
			this.follows.push(follows[index]);
		}
		this.currentPage++;
	}
	
	sendMessage(follow){
		this.navCtrl.push(ChatPage, {
			isAdmin: false,
			targetUserName: follow.following.realName,
			targetUserId: follow.following.id
		});
	}
	
	requestCancel(follow){
		var this_ = this;

		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		loading.present();
		this.http.post(Url.canel_following, JSON.stringify({
			userId : follow.following.id
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					this_.toastCtrl.create({
						message: "取消关注成功",
						duration: 2000,
						position: 'middle'
					}).present();
					this_.initFollows();
				} else {
					this_.toastCtrl.create({
						message: result,
						duration: 2000,
						position: 'middle'
					}).present();
				}
			}));
	}
	
	openSearchMenu(){
		var this_ = this;
		let searchModal = this.modalCtrl.create(FollowSearchParamPage, { 
			
		});
		searchModal.onDidDismiss(result => {
			if(result){
				if(result.change){
					//有改变过关注状态
					this_.initFollows();
				}
			}
		});
		searchModal.present();
	}
}