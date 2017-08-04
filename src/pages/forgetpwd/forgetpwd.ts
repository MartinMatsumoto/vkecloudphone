import {
	Component
} from '@angular/core';

import {
	NavController,
	LoadingController,
	ToastController
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

@Component({
	templateUrl: 'forgetpwd.html'
})
export class ForgetPwdPage {

	username;
	email;
	successString = "重置密码邮件已发送到您的邮箱，请注意查收。";

	constructor(public navCtrl: NavController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {

	}

	sendEmail() {
		var this_ = this;

		let result = this.authForgetPwd();
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
		this.http.post(Url.retrieve_password, JSON.stringify({
			userName: this.username,
			email: this.email
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					this_.toastCtrl.create({
						message: this_.successString,
						duration: 2000,
						position: 'middle'
					}).present();
					this_.navCtrl.pop();
				} else {
					this_.toastCtrl.create({
						message: result,
						duration: 2000,
						position: 'middle'
					}).present();
				}
			}));
	}
	
	authForgetPwd(){
		if(!this.username){
			return "用户姓名不能为空";
		}
		
		if(!this.email){
			return "用户邮箱不能为空";
		}
		
		return null;
	}

}