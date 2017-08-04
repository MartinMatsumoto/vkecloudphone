import {
	Component
} from '@angular/core';

import {
	NavController,
	ViewController,
	LoadingController,
	ToastController,
	NavParams
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

import {
	Vkeplay
} from '../../vkeplay/vkeplay';

@Component({
	templateUrl: 'praxis_resolve.html'
})
export class PraxisResolvePage {

	praxis;
	courseId;
	urlHeader:string = Url.http_header;
	vkeResolves = [];
	
	vkeResolveInit:boolean = false;
	
	praxis_resolve:string = "answer_resolve";
	
	constructor(params: NavParams, public navCtrl: NavController, public viewCtrl: ViewController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		this.praxis = params.data.praxis;
		this.courseId = params.data.courseId;
		
	}
	
	showAnswer() {
		var resultString: string = "";
		if(this.praxis && this.praxis.options && this.praxis.options.length > 0) {
	
			for(var index in this.praxis.options) {
				var option = this.praxis.options[index];
				if(option.right) {
					resultString += option.lable;
					resultString += "，";
				}
			}
			
			if(resultString && resultString.length >= 1) {
				resultString = resultString.substring(0, resultString.length - 1);
			}
			return resultString;
		} else {
			resultString = "略";
		}
		return resultString;
	}
	
	showStringResolve(){
		if(this.praxis && this.praxis.resolves && this.praxis.resolves.length > 0){
			
		}
		return "略";
	}
	
	showVkeResolve(){
		if(!this.vkeResolveInit){
			var this_ = this;
			let loading = this.loadingCtrl.create({
				content: "加载中请稍等"
			});
			loading.present();
			this.http.post(Url.find_relation, JSON.stringify({
					masterMetaValue: "praxis_stem",
					masterId: this.praxis.id,
					courseId: this.courseId
			}), {
				headers: Constant.getHeader()
			}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
				function(success: boolean, result) {
					loading.dismiss();
					if(success) {
						this_.vkeResolves = result;
						this_.vkeResolveInit = true;
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
	
	playVke(vkeId:number){
		this.navCtrl.push(Vkeplay, {
			vkeId: vkeId
		});
	}

}