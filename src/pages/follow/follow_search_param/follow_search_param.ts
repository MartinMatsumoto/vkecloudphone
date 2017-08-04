import {
	Component
} from '@angular/core';

import {
	NavController,
	ViewController,
	LoadingController,
	ToastController,
	NavParams
} from 'ionic-angular';

import {
	HttpModule,
	Http,
	Response
} from '@angular/http';

import {
	Constant
} from '../../core/constant';

import {
	Url
} from '../../core/urls';

@Component({
	templateUrl: 'follow_search_param.html'
})
export class FollowSearchParamPage {
	
	pageSize:number = 10;
	currentPage:number = 1;
	keyword:string="";
	infiniteScroll;
	follows = [];
	change:boolean = false;
	
	urlHeader: string = Url.http_header;
	
	constructor(params: NavParams, public navCtrl: NavController, public viewCtrl: ViewController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		this.loadFollows(null);
	}

	close() {
		this.viewCtrl.dismiss({
			change : this.change
		});
	}
	
	search(){
		if(this.infiniteScroll){
			this.infiniteScroll.enable(true);
		}
		this.follows.splice(0,this.follows.length);
		this.currentPage = 1;
		this.loadFollows(null);
	}
	
	/**
	 * 加载笔记
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
		this.http.post(Url.search_user, JSON.stringify({
			pageSize: this.pageSize,
			currentPage: this.currentPage,
			keyword: this.keyword
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
					if(result.list){
						this_.processFollows(result.list);
					}
					if(!result.list || (infiniteScroll && result.list.length < this_.pageSize)){
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
	
	/**
	 * 移除关注
	 */
	cancelFollow(follow){
		var this_ = this;
		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		loading.present();
		this.http.post(Url.canel_following, JSON.stringify({
			userId : follow.id
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					follow.following = false;
					this_.change = true;
				} else {
					this_.toastCtrl.create({
						message: result,
						duration: 2000,
						position: 'middle'
					}).present();
				}
			}));
	}
	
	/**
	 * 添加关注
	 */
	addFollow(follow){
		var this_ = this;
		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		loading.present();
		this.http.post(Url.following_user, JSON.stringify({
			userId : follow.id
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					follow.following = true;
					this_.change = true;
				} else {
					this_.toastCtrl.create({
						message: result,
						duration: 2000,
						position: 'middle'
					}).present();
				}
			}));
		
	}

}