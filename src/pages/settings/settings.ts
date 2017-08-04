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
	ImagePicker,
	Camera,
	Crop
} from 'ionic-native';

import {
	Constant
} from '../core/constant';

import {
	Url
} from '../core/urls';

import {
	SettingsMyinfoPage
} from './settings_myinfo/settings_myinfo';

import {
	SettingsPasswordPage
} from './settings_password/settings_password';

@Component({
	templateUrl: 'settings.html'
})
export class SettingsPage {
	
	newImage:string;
	urlHeader: string = Url.http_header;
	headerPath:string = this.urlHeader + Constant.user.iconPath;
	
	iconPathBase64:string;
	static globalNavCtrl;

	constructor(public alertCtrl: AlertController, public navCtrl: NavController, public modalCtrl: ModalController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
	}

	modifyMyInfo() {
		this.navCtrl.push(SettingsMyinfoPage);
	}

	modifyPassword() {
		this.navCtrl.push(SettingsPasswordPage);
	}
	
	clearCache(){
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
					this_.toastCtrl.create({
						message: "缓存已清除",
						duration: 2000,
						position: 'middle'
					}).present();
				}
			}]
		});
		alert.present();
	}
	
	quit(){
		SettingsPage.globalNavCtrl.pop();
	}
	
	chooseImg(){
		var this_ = this;
		ImagePicker.getPictures({
			maximumImagesCount: 1,
			quality: 50
		}).then((results) => {
			for(var i = 0; i < results.length; i++) {
				Crop.crop(results[i], {
						quality: 75
					})
					.then(
						newImage => {
							this_.newImage = newImage;
							this_.getBase64Image(newImage, function(base64image){
							     this_.iconPathBase64 = base64image;
							     this_.uploadImg();
							});
						},
						
						error => {
							this_.toastCtrl.create({
								message: "获取图片失败,原因:"+error,
								duration: 1000,
								position: 'middle'
							}).present();
						}
					);
				
			}
		}, (err) => {
			this_.toastCtrl.create({
				message: "获取图片失败,原因:"+err,
				duration: 1000,
				position: 'middle'
			}).present();
		});
	}
	
	public getBase64Image(imgUrl, callback) {
		Constant.getBase64Image(imgUrl, callback);
	}
	
	uploadImg(){
		var this_ = this;

		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		loading.present();
		this.http.post(Url.modify_user, JSON.stringify({
			id: Constant.user.id,
			iconPath: this.iconPathBase64,
			gender: Constant.user.gender,
			headerSuffix: "jpg",
			realName: Constant.user.realName,
			introduction: Constant.user.introduction,
			needUpload: true,
			email: Constant.user.email
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					this_.toastCtrl.create({
						message: "头像修改成功",
						duration: 2000,
						position: 'middle'
					}).present();
					this_.headerPath = this_.newImage;
					Constant.user.iconPath = result.iconPath;
				} else {
					this_.toastCtrl.create({
						message: result,
						duration: 2000,
						position: 'middle'
					}).present();
				}
			}));
	}
	
	capturePhoto(){
		var this_ = this;
		Camera.getPicture({
			quality : 50
		}).then((imageData) => {
			Crop.crop(imageData, {
					quality: 75
				})
				.then(
					newImage => {
						this_.newImage = newImage;
						this_.getBase64Image(newImage, function(base64image){
						     this_.iconPathBase64 = base64image;
						     this_.uploadImg();
						});
					},
					
					error => {
						this_.toastCtrl.create({
							message: "获取图片失败,原因:"+error,
							duration: 1000,
							position: 'middle'
						}).present();
					}
				);
		}, (err) => {
			this_.toastCtrl.create({
				message: "获取图片失败,原因:"+err,
				duration: 1000,
				position: 'middle'
			}).present();
		});
	}
}