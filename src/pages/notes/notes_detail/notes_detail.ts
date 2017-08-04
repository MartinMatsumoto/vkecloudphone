import {
	Component
} from '@angular/core';

import {
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
	NotesModifyDialogPage
} from '../notes_modify_dialog/notes_modify_dialog';

@Component({
	templateUrl: 'notes_detail.html'
})

export class NotesDetailPage {

	note;
	callBack;
	canModify:boolean = false;
	urlHeader:string = Url.http_header;

	constructor(params: NavParams, public navCtrl: NavController, public modalCtrl: ModalController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController, public alertCtrl: AlertController) {
		this.note = params.data.note;
		this.callBack = params.data.callBack;
		
		this.canModify = Constant.user.id == this.note.creatorId;
	}
	
	delete(){
		var this_ = this;
		let alert = this.alertCtrl.create({
			title: '请确认',
			message: '是否删除笔记？',
			buttons: [{
				text: '取消',
				role: 'cancel',
				handler: () => {
					
				}
			}, {
				text: '确定',
				handler: () => {
					this_.deleteNote();
				}
			}]
		});
		alert.present();
	}
	
	modify(){
		let searchModal = this.modalCtrl.create(NotesModifyDialogPage, { note: this.note });
		
		searchModal.onDidDismiss(data => {
			console.log(data);
		});
		searchModal.present();
	}
	
	deleteNote(){
		var this_ = this;
		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		loading.present();
		this.http.post(Url.notes_delete, JSON.stringify({
			noteId: this.note.id
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					this_.toastCtrl.create({
						message: "删除成功",
						duration: 1000,
						position: 'middle'
					}).present();
					if(this_.callBack){
						this_.callBack();
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

}