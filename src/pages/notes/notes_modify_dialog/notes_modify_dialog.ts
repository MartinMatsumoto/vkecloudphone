import {
	Component
} from '@angular/core';

import {
	ViewController,
	NavController,
	LoadingController,
	AlertController,
	NavParams,
	ToastController,
	ModalController
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
	templateUrl: 'notes_modify_dialog.html'
})
export class NotesModifyDialogPage {

	note;
	urlHeader: string = Url.http_header;
	
	contentImg: string;
	imgBase64:string = "";
	content: string;
	hasPic: boolean = false;

	constructor(params: NavParams, public viewCtrl: ViewController, public navCtrl: NavController, public modalCtrl: ModalController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		this.note = params.data.note;
		this.content = this.note.content;
		this.contentImg = this.urlHeader + this.note.imagePath;
		this.hasPic = this.note.imagePath ? true : false;
		
	}

	close() {
		this.viewCtrl.dismiss();
	}
	
	modify(){
		var this_ = this;

		let result = this.authNote();
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
		this.http.post(Url.notes_update, JSON.stringify({
			share: this.note.share,
			noteId: this.note.id,
			details: this.content,
			headerSuffix: "jpg",
			imagePath: this.imgBase64,
			needUpload: true
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					this_.toastCtrl.create({
						message: "修改成功",
						duration: 1000,
						position: 'middle'
					}).present();
					this_.note.content = this_.content;
					if(result.notes){
						this_.note.imagePath = result.notes.imagePath;
					}
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
	
	authNote(){
		if(!this.content){
			return "笔记内容不能为空";
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