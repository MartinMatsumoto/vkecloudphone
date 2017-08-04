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
	templateUrl: 'settings_password.html'
})
export class SettingsPasswordPage {

	oldPwd: string;
	newPwd: string;
	newPwdAg: string;
	
	pwdMinLength = 6;
	pwdMaxLength = 12;

	constructor(public alertCtrl: AlertController, public viewCtrl: ViewController, public navCtrl: NavController, public modalCtrl: ModalController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
	}

	close() {
		let data = {};
		this.viewCtrl.dismiss(data);
	}

	confirm() {
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
		this.http.post(Url.modify_password, JSON.stringify({
			email: Constant.user.email,
			userString: Constant.user.userName,
			newPassword: this.newPwd
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					this_.toastCtrl.create({
						message: "密码修改成功",
						duration: 2000,
						position: 'middle'
					}).present();
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

	authData() {
		/*if(!this.oldPwd) {
			return "旧密码不能为空";
		}*/
		
		if(!this.newPwd) {
			return "新密码不能为空";
		}

		if(!this.newPwdAg) {
			return "请再次输入密码";
		}
		
		if((this.newPwd.length > this.pwdMaxLength || this.newPwd.length < this.pwdMinLength) || (this.newPwdAg.length > this.pwdMaxLength || this.newPwdAg.length < this.pwdMinLength)){
			return "密码长度必须为6-12个字符,大小写英文字符或数字";
		}

		if(this.newPwd != this.newPwdAg) {
			return "两次密码输入不一致,请检查";
		}

		return null;
	}
	

}