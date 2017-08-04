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
	HttpModule,
	Http,
	Response
} from '@angular/http';

import {
	Constant
} from '../../core/constant';

import {
	Url
} from '../../core/urls';

@Component({
	templateUrl: 'course_search_param.html'
})
export class CourseSearchParamPage {

	noselect = "";
	provinceId = 499;
	desciplineId = 69;
	
	provinces;
	cities;
	zones;
	desciplines;
	
	keyword:string="";
	provinceSelect = this.noselect;
	citySelect = this.noselect;
	zoneSelect = this.noselect;
	desciplineSelect = this.noselect;
	
	cityDisabled : boolean = true;
	zoneDisabled : boolean = true;
	
	constructor(params: NavParams, public navCtrl: NavController, public viewCtrl: ViewController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		console.log(params);
		this.loadProvince();
		this.loadDescipline();
	}

	close() {
		this.viewCtrl.dismiss();
	}
	
	search(){
		var regionCode = "";
		if(this.zoneSelect){
			regionCode = this.getCode(this.zoneSelect,this.zones);
		}else if(this.citySelect){
			regionCode = this.getCode(this.citySelect,this.cities);
		}else if(this.provinceSelect){
			regionCode = this.getCode(this.provinceSelect,this.provinces);
		}
		
		
		let data = {
			regionCode : regionCode,
			desciplineSelect : this.desciplineSelect,
			keyword : this.keyword
		};
		this.viewCtrl.dismiss(data);
	}
	
	loadProvince(){
		var this_ = this;
		this.loadMaptree(this.provinceId,function(result){
			this_.provinces = result;
		});
	}
	
	loadCity(provinceId){
		var this_ = this;
		this.loadMaptree(provinceId,function(result){
			this_.cities = result;
		});
	}
	
	loadZone(cityId){
		var this_ = this;
		this.loadMaptree(cityId,function(result){
			this_.zones = result;
		});
	}
	
	loadDescipline(){
		var this_ = this;
		this.loadMaptree(this.desciplineId,function(result){
			this_.desciplines = result;
		});
	}
	
	loadMaptree(parentId,callback){
		var this_ = this;

		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		loading.present();
		this.http.post(Url.get_maptree, JSON.stringify({
			id : parentId
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					if(callback){
						callback(result);
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

	onProvinceSelect(){
		this.zoneSelect = this.noselect;
		this.citySelect = this.noselect;
		this.zoneDisabled = true;
		if(this.provinceSelect == this.noselect){
			this.cityDisabled = true;
			return;
		}
		this.cityDisabled = false;
		this.loadCity(this.provinceSelect);
	}
	
	onCitySelect(){
		this.zoneSelect = this.noselect;
		if(this.citySelect == this.noselect){
			this.zoneDisabled = true;
			return;
		}
		this.zoneDisabled = false;
		this.loadZone(this.citySelect);
	}
	
	onZoneSelect(){
	}
	
	getCode(id, arr) {
		for(var index in arr){
			if(id == arr[index].id){
				return arr[index].code;
			}
		}
	}
	
}