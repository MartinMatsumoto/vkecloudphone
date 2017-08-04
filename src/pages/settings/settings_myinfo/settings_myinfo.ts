import {
	Component
} from '@angular/core';

import {
	NavController,
	ModalController,
	AlertController,
	ViewController,
	LoadingController,
	ToastController
} from 'ionic-angular';

import {
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
	templateUrl: 'settings_myinfo.html'
})
export class SettingsMyinfoPage {

	realName: string;
	gender: string;
	email: string;
	introduction: string;
	
	constructor(public alertCtrl: AlertController, public viewCtrl: ViewController, public navCtrl: NavController, public modalCtrl: ModalController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		this.initData();
	}
	
	initData(){
		this.realName = Constant.user.realName;
		this.gender = Constant.user.gender;
		this.email = Constant.user.email;
		this.introduction = Constant.user.introduction;
	}
	
	confirm(){
		var this_ = this;
		
		let result = this.authData();
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
		this.http.post(Url.modify_user, JSON.stringify({
			id: Constant.user.id,
			iconPath: Constant.user.iconPath,
			gender: this.gender,
			headerSuffix: "jpg",
			realName: this.realName,
			introduction: this.introduction,
			needUpload: false,
			email: this.email
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					this_.toastCtrl.create({
						message: "信息修改成功",
						duration: 2000,
						position: 'middle'
					}).present();
					Constant.user.gender = this_.gender;
					Constant.user.realName = this_.realName;
					Constant.user.introduction = this_.introduction;
					Constant.user.email = this_.email;
					this_.close();
				} else {
					this_.toastCtrl.create({
						message: result,
						duration: 2000,
						position: 'middle'
					}).present();
				}
			}));
	}
	
	authData(){
		if(!this.realName){
			return "用户昵称不能为空";
		}
		
		if(!this.email){
			return "用户邮箱不能为空";
		}
		
		if(!this.gender){
			return "请选择用户性别";
		}
		
		if(!this.introduction){
			return "用户简介不能为空";
		}
		
		return null;
	}

	close() {
		let data = {
		};
		this.viewCtrl.dismiss(data);
	}

}