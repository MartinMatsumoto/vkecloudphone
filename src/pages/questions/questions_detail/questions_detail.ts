import {
	Component
} from '@angular/core';

import {
	NavController,
	LoadingController,
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
	QuestionReplyDialogPage
} from '../question_reply_dialog/question_reply_dialog';

@Component({
	templateUrl: 'questions_detail.html'
})

export class QuestionsDetailPage {

	urlHeader:string = Url.http_header;
	question;
	infiniteScroll;
	pageSize:number = 10;
	currentPage:number = 1;
	
	replies = [];

	constructor(params: NavParams, public navCtrl: NavController, public modalCtrl: ModalController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		this.question = params.data.question;
		this.loadReply(null);
	}
	
	reply(){
		let searchModal = this.modalCtrl.create(QuestionReplyDialogPage, { questionId: this.question.id });
		
		searchModal.onDidDismiss(data => {
			if(this.infiniteScroll){
				this.infiniteScroll.enable(true);
			}
			this.replies.splice(0,this.replies.length);
			this.currentPage = 1;
			this.loadReply(null);
		});
		searchModal.present();
	}
	
	/**
	 * 加载笔记
	 */
	loadReply(infiniteScroll){
		var this_ = this;
		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		if(!infiniteScroll) {
			loading.present();
		} else {
			this.infiniteScroll = infiniteScroll;
		}
		this.http.post(Url.question_reply, JSON.stringify({
			questionId: this.question.id, 
			pageSize: this.pageSize, 
			currentPage: this.currentPage
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				if(infiniteScroll) {
					infiniteScroll.complete();
				} else {
					loading.dismiss();
				}
				if(success) {
					if(result.questionReply){
						this_.processReplies(result.questionReply);
					}
					if(!result.questionReply || (infiniteScroll && result.questionReply.length < this_.pageSize)){
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
	
	processReplies(replies){
		for(var index in replies){
			this.replies.push(replies[index]);
		}
		this.currentPage++;
	}

}