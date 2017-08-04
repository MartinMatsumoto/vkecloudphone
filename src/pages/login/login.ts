import {
	Component
} from '@angular/core';

import {
	NavController,
	LoadingController,
	ToastController
} from 'ionic-angular';

import {
	RegisterPage
} from '../register/register';

import {
	ForgetPwdPage
} from '../forgetpwd/forgetpwd';

import {
	MainPage
} from '../main/main';

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
	SqlHelper
} from '../core/sqlhelper';

import {
	Http,
	Response
} from '@angular/http';

import { File } from 'ionic-native';

@Component({
	templateUrl: 'login.html'
})
export class LoginPage {

	username: string;
	password: string;
	rememberpwd : boolean = false;

	constructor(public navCtrl: NavController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		this.hasSavedPwd();
	}

	loginClick() {
		for(var index in File){
			console.log(index);
			//console.log(File[index]);
		}
		
		var this_ = this;

		let user: User = User.generateByName(this.username, this.password);
		let result = User.authLogin(user);
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
		this.http.post(Url.login_url, JSON.stringify(user), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					Constant.setUser(User.generate(result));
					SqlHelper.insertOrUpdate(Constant.user, SqlHelper.userTableName);
					
					SqlHelper.delete(SqlHelper.savePwdTableName, null);
					
					SqlHelper.insertOrUpdate({
						id : Constant.user.id,
						account : this_.username,
						password : this_.password,
						savepwd : this_.rememberpwd
					}, SqlHelper.savePwdTableName);
					
					if(!this_.rememberpwd){
						this_.password = "";
					}
					
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

	forgetPwd() {
		this.navCtrl.push(ForgetPwdPage);
	}

	regesterAccount() {
		this.navCtrl.push(RegisterPage);
	}
	
	hasSavedPwd(){
		var this_ = this;
		SqlHelper.select(SqlHelper.savePwdTableName, null, null, function(result){
			if(result && result.length > 0) {
				for(var index in result){
					if(<boolean><any>result[index].savepwd) {
						this_.rememberpwd = true;
						this_.username = result[index].account;
						this_.password = result[index].password;
					} else {
						this_.rememberpwd = false;
						this_.username = result[index].account;
					}
				}
			}
		},function(error){
		});
	}

}