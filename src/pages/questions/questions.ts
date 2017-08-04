import {
	Component
} from '@angular/core';

import {
	NavController,
	ModalController,
	LoadingController,
	NavParams,
	ToastController
} from 'ionic-angular';

import {
	Http,
	Response
} from '@angular/http';

import {
	Constant
} from '../core/constant';

import {
	Url
} from '../core/urls';

import {
	QuestionsDetailPage
} from './questions_detail/questions_detail';

@Component({
	templateUrl: 'questions.html'
})
export class QuestionsPage {

	urlHeader:string = Url.http_header;
	questionInfiniteScroll;
	pageSize:number = 10;
	currentPage:number = 1;
	questions = [];

	constructor(params: NavParams, public navCtrl: NavController, public modalCtrl: ModalController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		this.loadQuestions(null);
	}

	/**
	 * 加载讨论
	 */
	loadQuestions(questionInfiniteScroll) {
		var this_ = this;

		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		if(!questionInfiniteScroll) {
			loading.present();
		} else {
			this.questionInfiniteScroll = questionInfiniteScroll;
		}
		this.http.post(Url.list_my_questions, JSON.stringify({
			pageSize: this.pageSize,
			currentPage: this.currentPage
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				if(questionInfiniteScroll) {
					questionInfiniteScroll.complete();
				} else {
					loading.dismiss();
				}
				if(success) {
					if(result.questions) {
						this_.processQuestions(result.questions);
					}
					if(!result.questions || (questionInfiniteScroll && result.questions.length < this_.pageSize)) {
						questionInfiniteScroll.enable(false);
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

	processQuestions(questions) {
		for(var index in questions) {
			this.questions.push(questions[index]);
		}
		this.currentPage++;
	}

	showDetail(question) {
		this.navCtrl.push(QuestionsDetailPage, {
			question: question
		});
	}
	
	formatPauseTime(time:number){
		return Constant.formatPauseTime(time);
	}
}