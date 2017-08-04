import {
	Component
} from '@angular/core';

import {
	NavController,
	LoadingController,
	NavParams,
	ViewController,
	ToastController
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

import {
	ImagePicker
} from 'ionic-native';

@Component({
	templateUrl: 'question_reply_dialog.html'
})
export class QuestionReplyDialogPage {

	hasPic:boolean = false;
	questionId:number;
	
	content:string;
	imgBase64:string = "";
	contentImg:string;

	constructor(params: NavParams, public viewCtrl: ViewController, public navCtrl: NavController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		this.questionId = params.data.questionId;
	}
	
	close() {
		this.viewCtrl.dismiss();
	}
	
	reply(){
		var this_ = this;

		let result = this.authReply();
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
		this.http.post(Url.question_add_reply, JSON.stringify({
			questionId:this.questionId,
			content:this.content,
			iconPath:this.imgBase64,
			headerSuffix:"jpg"
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					this_.toastCtrl.create({
						message: "感谢您的回复",
						duration: 1000,
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
	
	authReply(){
		if(!this.content){
			return "回复内容不能为空";
		}
		
		return null;
	}
	
	pickImg(){
		var this_ = this;
		ImagePicker.getPictures({
			maximumImagesCount: 1,
			quality: 30
		}).then((results) => {
			for(var i = 0; i < results.length; i++) {
				this_.contentImg = results[i];
				this_.hasPic = true;
				this_.getBase64Image(results[i], function(base64image){
				     this_.imgBase64 = base64image;
				});
			}
		}, (err) => {
			this_.toastCtrl.create({
				message: "获取图片失败,原因:"+err,
				duration: 1000,
				position: 'middle'
			}).present();
		});
	}
	
	getBase64Image(imgUrl, callback) {
		Constant.getBase64Image(imgUrl, callback);
	}
	
	removeHead(){
		this.contentImg = "";
		this.hasPic = false;
		this.imgBase64 = "";
	}
	
}