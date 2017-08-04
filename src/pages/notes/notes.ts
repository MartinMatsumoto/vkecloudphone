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
	NotesDetailPage
} from './notes_detail/notes_detail';

@Component({
	templateUrl: 'notes.html'
})
export class NotesPage {

	urlHeader:string = Url.http_header;
	infiniteScroll;
	pageSize:number = 10;
	currentPage:number = 1;
	notes = [];

	constructor(params: NavParams, public navCtrl: NavController, public modalCtrl: ModalController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		this.initNotes();
	}
	
	initNotes(){
		if(this.infiniteScroll){
			this.infiniteScroll.enable(true);
		}
		this.notes.splice(0,this.notes.length);
		this.currentPage = 1;
		this.loadNotes(null);
	}
	
	/**
	 * 加载笔记
	 */
	loadNotes(infiniteScroll) {
		var this_ = this;

		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		if(!infiniteScroll) {
			loading.present();
		} else {
			this.infiniteScroll = infiniteScroll;
		}
		this.http.post(Url.list_my_notes, JSON.stringify({
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
					if(result.notes) {
						this_.processNotes(result.notes);
					}
					if(!result.notes || (infiniteScroll && result.notes.length < this_.pageSize)) {
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

	processNotes(notes) {
		for(var index in notes) {
			this.notes.push(notes[index]);
		}
		this.currentPage++;
	}

	showDetail(note) {
		var this_ = this;
		this.navCtrl.push(NotesDetailPage, {
			note: note,
			callBack : function(){
				this_.initNotes();
			}
		});
	}
	
	formatPauseTime(time:number){
		return Constant.formatPauseTime(time);
	}
}