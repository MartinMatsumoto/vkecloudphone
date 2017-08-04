import {
	Component
} from '@angular/core';

import {
	NavController,
	ModalController,
	LoadingController,
	ToastController
} from 'ionic-angular';

import {
	HttpModule,
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
	Pagination
} from '../core/pagination';

import {
	CourseSearchParamPage
} from './course_search_param/course_search_param';

import {
	CourseUnbuyDetailPage
} from './course_unbuy_detail/course_unbuy_detail';

@Component({
	templateUrl: 'allcourse.html'
})
export class AllCoursePage {
	
	urlHeader:string = Url.http_header;
	courses = [];
	currentPage:number = 1;
	pageSize:number = 10;
	
	noselect = "";
	keyword:string="";
	regionCode:any = this.noselect;
	desciplineSelect = this.noselect;
	infiniteScroll;

	constructor(public navCtrl: NavController, public modalCtrl: ModalController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		this.loadCourse(null);
	}

	openSearchMenu() {
		var this_ = this;
		let searchModal = this.modalCtrl.create(CourseSearchParamPage, { 
			userId: 8675309
		});
		searchModal.onDidDismiss(result => {
			if(result){
				this_.keyword = result.keyword;
				this_.regionCode = result.regionCode;
				this_.desciplineSelect = result.desciplineSelect;
				this_.courses.splice(0,this_.courses.length);
				this_.currentPage = 1;
				this_.loadCourse(null);
				if(this_.infiniteScroll){
					this_.infiniteScroll.enable(true);
				}
			}
		});
		searchModal.present();
	}

	loadCourse(infiniteScroll) {
		var this_ = this;

		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		if(!infiniteScroll){
			loading.present();
		}
		
		this.http.post(Url.search_course, JSON.stringify({
			ascOrDesc: "desc",
			regionCode: this.regionCode,
			orderBy: "createDate",
			keyword: this.keyword,
			pageSize: this.pageSize,
			currentPage: this.currentPage,
			courseCode: this.desciplineSelect,
			gradeCode: ""
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				if(infiniteScroll){
					infiniteScroll.complete();
				}else{
					loading.dismiss();
				}
				if(success) {
					for(var index in result.coms){
						this_.courses.push(result.coms[index]);
					}
					this_.currentPage++;
					if(!result.coms || (infiniteScroll && result.coms.length < this_.pageSize)){
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
	
	loadmore(infiniteScroll){
		this.infiniteScroll = infiniteScroll;
		this.loadCourse(infiniteScroll);
	}
	
	showPrice(price: number) {
		if(price <= 0) {
			return "免费";
		}
		return price + "元";
	}
	
	getPublishScope(publishScope:number) {
		return Constant.getPublishScope(publishScope);
	}
	
	openCourse(course){
		this.navCtrl.push(CourseUnbuyDetailPage, {
			course: course
		});
	}
}