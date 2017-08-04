import {
	Component,
	Renderer,
	ViewChild
} from '@angular/core';

import {
	NavController,
	ModalController,
	NavParams,
	LoadingController,
	ToastController,
	PopoverController
} from 'ionic-angular';

import {
	Constant
} from '../core/constant';

import {
	Url
} from '../core/urls';

import {
	Http,
	Response
} from '@angular/http';

import {
	CourseViewPraxisMenu
} from './course_view_praxis_menu/course_view_praxis_menu';

@Component({
	templateUrl: 'course_view_praxis.html'
})
export class CourseViewPraxis {

	praxis;
	courseId;
	catalogueId;
	httpHeader = Url.http_header;
	@ViewChild('test') content: Renderer;

	optionChoose = [];
	hasOpinion:boolean = true;
	submitDisabled:boolean = false;
	
	chooseOptionText:string = "选择答案";
	gotWrongText:string = "回答错误";
	gotRighText:string = "回答正确";
	intentText:string = this.chooseOptionText;
	
	collectInWrong:string = "加入错题集";
	inWrong:string = "已加入错题集";
	isInWrongText:string = this.inWrong;
	
	normalColor:string = "primary";
	chooseColor:string = "secondary";
	rightColor:string = "green";
	wrongColor:string = "danger";
	opinionColor:string = this.normalColor;
	
	done:boolean = false;
	right:boolean = true;
	isInWrongDisabled:boolean = true;

	constructor(params: NavParams, private http: Http, public navCtrl: NavController, public modalCtrl: ModalController, public popoverCtrl: PopoverController, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		this.praxis = params.data.praxis.contentDetail;
		this.catalogueId = params.data.praxis.catalogueId;
		this.courseId = params.data.courseId;
		this.initData();
	}

	initData() {
		//console.log(this.praxis);
		if(this.praxis.options && this.praxis.options.length > 0) {
			this.hasOpinion = true;
			this.getOptions();
		} else {
			this.hasOpinion = false;
			this.isInWrong();
		}
	}
	
	/**
	 * 获得习题选项,非主观题
	 */
	getOptions(){
		var this_ = this;
		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		loading.present();
		this.http.post(Url.get_praxistem_assessement, JSON.stringify({
			praxisStemId : this.praxis.id
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					this_.processResult(result);
				} else {
					this_.toastCtrl.create({
						message: result,
						duration: 2000,
						position: 'middle'
					}).present();
				}
			}));
	}
	
	/**
	 * 是否加入错题集
	 */
	isInWrong(){
		var this_ = this;
		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		loading.present();
		this.http.post(Url.praxis_stem_in_wrong, JSON.stringify({
			praxisStemId:this.praxis.id,
			courseId:this.courseId
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					if(result.isInAppWrong) {
						this_.isInWrongDisabled = true;
						this_.isInWrongText = this_.inWrong;
					} else {
						this_.isInWrongDisabled = false;
						this_.isInWrongText = this_.collectInWrong;
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
	
	processResult(result){
		if(result && result.selfAssessments && result.selfAssessments[0]) {
			var selfAssessment = result.selfAssessments[0];
			this.processDone(selfAssessment.assessResult,selfAssessment.assessmentoptions);
		} else {
			//未做过
		}
	}
	
	processDone(isRight:boolean,assessmentoptions){
		//做过
		this.submitDisabled = true;
		this.done = true;
		
		if(isRight) {
			//正确
			this.intentText = this.gotRighText;
			this.right = true;
		} else {
			//错误
			this.intentText = this.gotWrongText;
			this.right = false;
		}
		
		var doneOpinions = assessmentoptions;
		for(var index in doneOpinions){
			this.optionChoose.push(doneOpinions[index].questionOption);
		}
	}

	showMenu(myEvent) {
		let popover = this.popoverCtrl.create(CourseViewPraxisMenu,{
			praxis : this.praxis,
			courseId : this.courseId,
			catalogueId : this.catalogueId,
			navCtrl : this.navCtrl
		});
		popover.present({
			ev: myEvent
		});
	}

	getContent() {
		if(this.praxis && this.praxis.contents && this.praxis.contents.length > 0) {
			return this.praxis.contents[0].content;
		}
		return "";
	}

	ngAfterViewInit() {

	}

	chooseOption(option) {
		if(this.containsOptions(option)) {
			this.removeOptions(option);
		} else {
			this.optionChoose.push(option);
		}
	}

	containsOptions(option) {
		for(var index in this.optionChoose) {
			if(this.optionChoose[index].id == option.id) {
				return true;
			}
		}
	}

	removeOptions(option) {
		for(var index in this.optionChoose) {
			if(this.optionChoose[index].id == option.id) {
				this.optionChoose.splice(<number><any>index, 1);
				return;
			}
		}
	}

	getOptionColor(option) {
		if(this.containsOptions(option)){
			if(this.done){
				if(this.right){
					return this.rightColor;
				}else{
					return this.wrongColor;
				}
			}
			return this.chooseColor;
		}else{
			return this.normalColor;
		}
	}
	
	/**
	 * 添加到错题集
	 */
	collectIntoWrong(){
		var this_ = this;
		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		loading.present();
		this.http.post(Url.add_wrong, JSON.stringify({
			stemId: this.praxis.id,
			catalogueId: this.catalogueId
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					this_.isInWrongText = this_.inWrong;
					this_.isInWrongDisabled = true;
				} else {
					this_.toastCtrl.create({
						message: result,
						duration: 2000,
						position: 'middle'
					}).present();
				}
			}));
	}
	
	/**
	 * 做习题
	 */
	doExercise(){
		if(!this.optionChoose || this.optionChoose.length <= 0) {
			this.toastCtrl.create({
				message: "您好歹选一个吧？",
				duration: 2000,
				position: 'middle'
			}).present();
			return;
		}
		var optionSend: string = "";
		for(var index in this.optionChoose) {
			optionSend += this.optionChoose[index].id;
			if( < number > < any > index != this.optionChoose.length - 1) {
				optionSend += ",";
			}
		}
		
		var this_ = this;
		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		loading.present();
		this.http.post(Url.do_exercise, JSON.stringify({
			stemId: this.praxis.id,
			options: optionSend,
			catalogueId: this.catalogueId
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					this_.doExerciseResult(result);
				} else {
					this_.toastCtrl.create({
						message: result,
						duration: 2000,
						position: 'middle'
					}).present();
				}
			}));
	}
	
	/**
	 * 做习题后
	 */
	doExerciseResult(result){
		if(result && result.assessmentTo) {
			this.optionChoose.splice(0,this.optionChoose.length);
			this.processDone(result.assessmentTo.assessResult, result.assessmentTo.assessmentoptions);
		}
	}
}