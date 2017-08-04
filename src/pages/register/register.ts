import {
	Component
} from '@angular/core';

import {
	NavController,
	LoadingController,
	ToastController
} from 'ionic-angular';

import {
	ImagePicker,
	Crop
} from 'ionic-native';

import {
	Constant
} from '../core/constant';

import {
	Url
} from '../core/urls';

import {
	User
} from '../core/user';

import {
	MainPage
} from '../main/main';

import {
	Http,
	Response
} from '@angular/http';

@Component({
	templateUrl: 'register.html'
})
export class RegisterPage {

	defaultImg = "assets/img/headportrait.png";
	hasHeader : boolean = false;
	
	registerForm = {
		account: '',
		nickname: '',
		email : '',
		password : '',
		iconPathBase64 : '',
		headerPath : this.defaultImg
	};
	
	constructor(public navCtrl: NavController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {

	}

	registerCommit() {
		var this_ = this;

		let user: User = User.generateByRegister(this.registerForm.account, this.registerForm.nickname,this.registerForm.email, this.registerForm.password,this.registerForm.iconPathBase64);
		let result = User.authRegister(user);
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
		this.http.post(Url.register_url, JSON.stringify(user), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					this_.toastCtrl.create({
						message: "注册成功,正在为您跳转",
						duration: 1000,
						position: 'middle'
					}).present();
					Constant.setUser(User.generate(result));
					this_.back();
					this_.navCtrl.push(MainPage);
				} else {
					this_.toastCtrl.create({
						message: result,
						duration: 2000,
						position: 'middle'
					}).present();
				}
			}));
	}

	pickImg() {
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
							this_.registerForm.headerPath = newImage;
							this_.hasHeader = true;
							this_.getBase64Image(newImage, function(base64image){
							     this_.registerForm.iconPathBase64 = base64image;
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
	
	removeHead(){
		this.registerForm.headerPath = this.defaultImg;
		this.hasHeader = false;
		this.registerForm.iconPathBase64 = "";
	}
	
	/**
	 * 返回按钮
	 */
	back(){
		this.navCtrl.pop();
	}
}